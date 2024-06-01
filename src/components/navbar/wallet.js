import { useState,useEffect } from "react";
import { ethers } from "ethers";
import Button from '@mui/material/Button';
function Wallet() {
  //   const networks = {
  //       Sepolia: {
  //         chainId: `0x${Number(11155111).toString(16)}`,
  //         chainName: "Sepolia test network",
  //         nativeCurrency: {
  //           name: "SepoliaETH",
  //           symbol: "SepoliaETH",
  //           decimals: 18,
  //         },
  //         rpcUrls: ["https://sepolia.infura.io/v3/"],
  //         blockExplorerUrls: ["https://sepolia.etherscan.io"],
  //       },
  //     };
  const [address, setAddress] = useState("");
  useEffect(()=>{
    connectWallet()
  },[])
  const connectWallet = async () => {
    // eslint-disable-next-line valid-typeof
    if (typeof window !== undefined) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      //   const network=await provider.getNetwork()
      //   if(network!=='sepolia')
      //   {
      //     await window.ethereum.request({
      //         method:"wallet_addEthereumChain",
      //         params:[
      //             {
      //                 ...networks["Sepolia"]
      //             }
      //         ]
      //     })
      //   }
      const account = await provider.getSigner();
      const Address = await account.getAddress();   
      setAddress(Address);
    }
  };
  return (
    <Button variant="contained" >{address}</Button>

  );
}

export default Wallet;
