import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  TokenSale,
  TokenSale__factory,
  MyToken,
  MyToken__factory,
  MyNFT,
  MyNFT__factory,
} from "../typechain-types";

const TEST_TOKEN_RATIO = 1;
const TEST_TOKEN_PRICE = ethers.utils.parseEther("0.02");
const TEST_TOKEN_MINT = ethers.utils.parseEther("1");
const TEST_NFT_ID = 42;

describe("NFT Shop", async () => {
  let tokenSaleContract: TokenSale;
  let tokenContract: MyToken;
  let nftContract: MyNFT;
  let deployer: SignerWithAddress;
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;

  beforeEach(async () => {
    [deployer, account1, account2] = await ethers.getSigners();

    const tokenContractFactory = new MyToken__factory(deployer);
    tokenContract = await tokenContractFactory.deploy();
    await tokenContract.deployTransaction.wait();

    const nftContractFactory = new MyNFT__factory(deployer);
    nftContract = await nftContractFactory.deploy();
    await nftContract.deployTransaction.wait();

    const tokenSaleContractFactory = new TokenSale__factory(deployer);
    // tokenSaleContract = await tokenSaleContractFactory.deploy(
    //   TEST_TOKEN_RATIO,
    //   TEST_TOKEN_PRICE,
    //   tokenContract.address,
    //   nftContract.address
    // );
    await tokenSaleContract.deployTransaction.wait();

    const minterRole = await tokenContract.MINTER_ROLE();
    const giveTokenMintRoleTx = await tokenContract.grantRole(
      minterRole,
      tokenSaleContract.address
    );
    const giveNftMintRoleTx = await nftContract.grantRole(
      minterRole,
      tokenSaleContract.address
    );

    await giveTokenMintRoleTx.wait();
  });

  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      expect(await tokenSaleContract.ratio()).to.eq(TEST_TOKEN_RATIO);
    });

    it("uses a valid ERC20 as payment token", async () => {
      const tokenAddress = await tokenSaleContract.tokenAddress();
      const tokenContractFactory = new MyToken__factory(deployer);
      const tokenUsedInContract = tokenContractFactory.attach(tokenAddress);
      await expect(tokenUsedInContract.totalSupply()).to.not.be.reverted;
      await expect(tokenUsedInContract.balanceOf(account1.address)).to.not.be
        .reverted;
      await expect(
        tokenUsedInContract.transfer(account1.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });

  describe("When a user purchase an ERC20 from the Token contract", async () => {
    let tokenBalanceBeforeMint: BigNumber;
    let ethBalanceBeforeMint: BigNumber;
    let mintTxGasCost: BigNumber;
    beforeEach(async () => {
      tokenBalanceBeforeMint = await tokenContract.balanceOf(account1.address);
      ethBalanceBeforeMint = await account1.getBalance();
      const buyTokensTx = await tokenSaleContract
        .connect(account1)
        .buyTokens({ value: TEST_TOKEN_MINT });
      const buyTokenTxReceipt = await buyTokensTx.wait();
      mintTxGasCost = buyTokenTxReceipt.gasUsed.mul(
        buyTokenTxReceipt.effectiveGasPrice
      );
    });

    it("charges the correct amount of ETH", async () => {
      const ethBalanceAfterMint = await account1.getBalance();
      const expected = TEST_TOKEN_MINT.add(mintTxGasCost);
      const diff = ethBalanceBeforeMint.sub(ethBalanceAfterMint);
      const error = diff.sub(expected);
      expect(error).to.eq(0);
    });

    it("gives the correct amount of tokens", async () => {
      const tokenBalanceAfterMint = await tokenContract.balanceOf(
        account1.address
      );
      expect(tokenBalanceAfterMint.sub(tokenBalanceBeforeMint)).to.eq(
        TEST_TOKEN_MINT.mul(TEST_TOKEN_RATIO)
      );
    });

    describe("When a user burns an ERC20 at the Shop contract", async () => {
      let tokenBalanceBeforeBurn: BigNumber;
      let burnAmount: BigNumber;
      let ethBalanceBeforeBurn: BigNumber;
      let allowTxGasCost: BigNumber;
      let burnTxGasCost: BigNumber;

      beforeEach(async () => {
        ethBalanceBeforeBurn = await account1.getBalance();
        tokenBalanceBeforeBurn = await tokenContract.balanceOf(
          account1.address
        );
        burnAmount = tokenBalanceBeforeBurn.div(2);
        const allowTx = await tokenContract
          .connect(account1)
          .approve(tokenSaleContract.address, burnAmount);
        const allowTxReceipt = await allowTx.wait();
        allowTxGasCost = allowTxReceipt.gasUsed.mul(
          allowTxReceipt.effectiveGasPrice
        );
        const burnTx = await tokenSaleContract
          .connect(account1)
          .burnTokens(burnAmount);
        const burnTxReceipt = await burnTx.wait();
        burnTxGasCost = burnTxReceipt.gasUsed.mul(
          burnTxReceipt.effectiveGasPrice
        );
      });

      it("gives the correct amount of ETH", async () => {
        const ethBalanceAfterBurn = await account1.getBalance();
        const diff = ethBalanceAfterBurn.sub(ethBalanceBeforeBurn);
        const costs = allowTxGasCost.add(burnTxGasCost);
        expect(diff).to.eq(burnAmount.div(TEST_TOKEN_RATIO).sub(costs));
      });

      it("burns the correct amount of tokens", async () => {
        const tokenBalanceAfterBurn = await tokenContract.balanceOf(
          account1.address
        );
        const diff = tokenBalanceBeforeBurn.sub(tokenBalanceAfterBurn);
        expect(diff).to.eq(burnAmount);
      });
    });

    describe("When a user purchases an NFT from the Shop contract", async () => {
      let tokenBalanceBeforeBuyNft: BigNumber;

      beforeEach(async () => {
        tokenBalanceBeforeBuyNft = await tokenContract.balanceOf(
          account1.address
        );
        const allowTx = await tokenContract
          .connect(account1)
          .approve(tokenSaleContract.address, TEST_TOKEN_PRICE);
        await allowTx.wait();

        // const buyTx = await tokenSaleContract
        //   .connect(account1)
        //   .buyNFT(TEST_NFT_ID);
        // await buyTx.wait();
      });
      it("charges the correct amount of ERC20 tokens", async () => {
        const tokenBalanceAfterBuyNft = await tokenContract.balanceOf(
          account1.address
        );
        const diff = tokenBalanceBeforeBuyNft.sub(tokenBalanceAfterBuyNft);
        expect(diff).to.eq(TEST_TOKEN_PRICE);
      });

      it("gives the correct nft", async () => {
        const nftOwner = await nftContract.ownerOf(TEST_NFT_ID);
        expect(nftOwner).to.eq(account1.address);
      });

      //   it("updates the owner pool account correctly", async () => {
      //     const withdrawableAmount = await tokenSaleContract.withdrawableAmount();
      //     expect(withdrawableAmount).to.eq(TEST_TOKEN_PRICE.div(2));
      //   });
    });

    describe("When a user burns their NFT at the Shop contract", async () => {
      let tokenBalanceBeforeBurnNft: BigNumber;

      beforeEach(async () => {
        tokenBalanceBeforeBurnNft = await tokenContract.balanceOf(
          account1.address
        );
        const allowTx = await tokenContract
          .connect(account1)
          .approve(tokenSaleContract.address, TEST_TOKEN_PRICE);
        await allowTx.wait();
        //     const buyTx = await tokenSaleContract
        //       .connect(account1)
        //       .buyNFT(TEST_NFT_ID);
        //     await buyTx.wait();
        //     const allowBurnTx = await nftContract
        //       .connect(account1)
        //       .approve(tokenSaleContract.address, TEST_NFT_ID);
        //     await allowBurnTx.wait();
        //     const burnTx = await tokenSaleContract
        //       .connect(account1)
        //       .burnNFT(TEST_NFT_ID);
        //     await burnTx.wait();
      });
      it("gives the correct amount of ERC20 tokens", async () => {
        const tokenBalanceAfterBurnNft = await tokenContract.balanceOf(
          account1.address
        );
        const diff = tokenBalanceBeforeBurnNft.sub(tokenBalanceAfterBurnNft);
        console.log(tokenBalanceBeforeBurnNft);
        console.log(tokenBalanceAfterBurnNft);

        expect(diff).to.eq(TEST_TOKEN_PRICE.div(2));
      });
      it("updates the public pool correctly", async () => {
        throw new Error("Not implemented");
      });
    });
  });

  // describe("When the owner withdraw from the Shop contract", async () => {
  //   it("recovers the right amount of ERC20 tokens", async () => {
  //     throw new Error("Not implemented");
  //   });

  //   it("updates the owner pool account correctly", async () => {
  //     throw new Error("Not implemented");
  //   });
  // });
});
