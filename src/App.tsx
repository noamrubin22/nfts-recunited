import "./App.css";
import "./scss/modules/app.module.scss";
import MintingBox from "./components/MintingBox";
import IPFS from "./components/IPFS";
import { useState } from "react";

function App() {
  const [metaDataLink, setMetaDataLink] = useState<string>("");
  return (
    <div
      className="p-4"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <img src="/recunited_logo_full.webp" alt="Recunited logo" width="400vw" />
      <IPFS setMetaDataLink={setMetaDataLink} />
      <MintingBox metaDataLink={metaDataLink} />
    </div>
  );
}

export default App;
