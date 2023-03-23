/* eslint-disable no-restricted-globals */
import { Button, Link, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CanvasContainer from "./Diamond/CanvasContainer";
import { Diamond } from "./Diamond/Diamond";

interface MintingBoxInterface {
  metaDataLink: string;
}

const MintingBox: React.FC<MintingBoxInterface> = ({ metaDataLink }) => {
  const [wantNFT, setWantNFT] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(walletAddress.length);
    if (walletAddress.length <= 0) return;
    // safeMint(walletAddress, metadata)
    console.log(walletAddress, metaDataLink);
    setWantNFT(true);
  };

  useEffect(() => {
    console.log(walletAddress);
  }, [walletAddress]);

  return (
    <div className="minting-container p-20">
      <h2 className="text-center text-2xl text-white lg:text-left py-5">
        You are eligible for a NFT
      </h2>
      <p className="text-md md:text-md text-justify font-light text-stone-400 md:leading-snug">
        You are eligible for a NFT, which you can use as a proof for your test
        results.
      </p>
      <CanvasContainer>
        <Diamond type={"shiny"} color="white" />
      </CanvasContainer>
      {!wantNFT ? (
        <div>
          <form
            style={{
              padding: "2rem",
              alignSelf: "center",
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={handleSubmit}
          >
            <input
              className="w-full rounded-full py-2.5 text-sm font-medium leading-5 border-1 border text-black text-center border-white/20"
              placeholder="Fill in your wallet address"
              type="text"
              id="walletAddress"
              name="walletAddress"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setWalletAddress(event.target.value);
              }}
            />
            <button
              className="w-full rounded-full py-2.5 text-sm my-3 font-medium leading-5 text-white border-1 border border-white/20"
              id="headlessui-tabs-tab-:r0:"
              role="tab"
              type="submit"
              aria-selected="true"
              aria-controls="headlessui-tabs-panel-:r1:"
            >
              I want to claim my NFT
            </button>
          </form>
          <p className="text-md md:text-md text-justify font-light text-stone-400 md:leading-snug">
            Don't have a wallet <Link href="">yet</Link>?
          </p>
        </div>
      ) : (
        <div className="py-10">
          <h1>
            Congrats! You minted your Recunited NFT. You should be able to find
            your NFT in your wallet now.
          </h1>
          <p className="text-md md:text-md text-justify font-light text-stone-400 md:leading-snug">
            Feel free to share it LinkedIn as a certificate or use it to receive
            special benefits.
          </p>
        </div>
      )}
    </div>
  );
};

export default MintingBox;
