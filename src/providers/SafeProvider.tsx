// src/providers/Provider.tsx

import React from "react";
import { SafeProvider, createConfig } from "@safe-global/safe-react-hooks";
import { sepolia } from "viem/chains";

interface ProviderProps {
  children: React.ReactNode;
}

// Constants for provider and signer
// const SIGNER_PRIVATE_KEY = process.env.REACT_APP_SIGNER_PRIVATE_KEY as string;
const RPC_URL = "https://sepolia.infura.io/v3/4066181504164da3a9bd66e624cf82ac";
// const SAFE_ADDRESS = process.env.REACT_APP_SAFE_ADDRESS as string;

// Configuration setup
const config = createConfig({
  chain: sepolia,
  provider: RPC_URL,
  signer: SIGNER_PRIVATE_KEY,
  safeAddress: SAFE_ADDRESS,
});

const Provider: React.FC<ProviderProps> = ({ children }) => {
  return <SafeProvider config={config}>{children}</SafeProvider>;
};

export default Provider;
