import { CID, create } from "ipfs-http-client";
import { useEffect, useState } from "react";
import * as metaDataFile from "../data/metadata.json";

interface IPFSInterface {
  setMetaDataLink: (metaDataLink: string) => void;
}

const IPFS: React.FC<IPFSInterface> = ({ setMetaDataLink }) => {
  const [metaData, setMetaData] = useState<{ cid: CID; path: string }[]>([]);

  const projectId = "2NH5NBFIfvujRZfRJ9VAMwkT2fk";
  const projectSecret = "23600c4fbb8b5f5af8f8a16fedf46e24";
  const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

  const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });

  useEffect(() => {
    const uploadMetaData = async () => {
      // read metadata file
      const metadata = metaDataFile;
      // upload metadata file
      const result = await ipfs.add(JSON.stringify(metadata));

      setMetaData([
        {
          cid: result.cid,
          path: result.path,
        },
      ]);
    };

    uploadMetaData();
  }, []);

  useEffect(() => {
    setMetaDataLink(
      "https://recunited.infura-ipfs.io/ipfs/" + metaData[0]?.path
    );
    console.log("https://recunited.infura-ipfs.io/ipfs/" + metaData[0]?.path);
  }, [metaData]);

  return <div></div>;
};

export default IPFS;
