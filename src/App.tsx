import "./App.css";
import "./scss/modules/app.module.scss";
import MintingBox from "./components/MintingBox";
import IPFS from "./components/IPFS";
import { useState } from "react";

function App() {
  const [metaDataLink, setMetaDataLink] = useState<string>("");
  return (
    <div>
      <IPFS setMetaDataLink={setMetaDataLink} />
      <MintingBox metaDataLink={metaDataLink} />
    </div>
  );
}

export default App;
