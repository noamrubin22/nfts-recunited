import { Button, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import CanvasContainer from "./Diamond/CanvasContainer";
import { Diamond } from "./Diamond/Diamond";

interface MintingBoxInterface {
  metaDataLink: string;
}

const MintingBox: React.FC<MintingBoxInterface> = ({ metaDataLink }) => {
  const [wantNFT, setWantNFT] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const handleSubmit = () => {
    console.log("click");
    // safeMint(walletAddress, metadata)
    console.log(walletAddress, metaDataLink);
    setWantNFT(true);
  };

  return (
    <div className="minting-container">
      <Paper elevation={3}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ padding: "2rem" }}>
            {!wantNFT ? (
              <div>
                <Typography variant="h4">Get your NFT</Typography>
                <Typography variant="body1">
                  You are eligible for a NFT.
                </Typography>
                <Typography variant="body1">
                  You can use it as a certificate to show your test result.
                </Typography>
                <CanvasContainer>
                  <Diamond type={"shiny"} color="white" />
                </CanvasContainer>
                <div>
                  <form
                    onSubmit={() => handleSubmit()}
                    style={{
                      padding: "2rem",
                      alignSelf: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Fill in your wallet address"
                      variant="outlined"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setWalletAddress(event.target.value);
                      }}
                    />
                    <Button
                      size="large"
                      variant="outlined"
                      color="success"
                      type="submit"
                    >
                      I want a NFT
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div>
                <Typography variant="h4">Congrats!</Typography>
                <Typography variant="body1">
                  Wallet address {walletAddress} has received the NFT
                </Typography>
                <CanvasContainer>
                  <Diamond type={"shiny"} color="white" />
                </CanvasContainer>
              </div>
            )}
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default MintingBox;
