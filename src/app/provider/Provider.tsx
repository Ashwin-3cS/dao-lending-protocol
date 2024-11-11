// import {
//   SafeProvider,
//   createConfig,
//   useSafe,
//   useSendTransaction,
//   SendTransactionVariables,
//   useConfirmTransaction,
//   ConfirmTransactionVariables,
// } from "@safe-global/safe-react-hooks";
// import { sepolia } from "viem/chains";

// import { PasskeyArgType } from "@safe-global/protocol-kit";

// const Provider = (passkey: PasskeyArgType, safeAddress: any) => {
//   const config = createConfig({
//     chain: sepolia,
//     provider: process.env.NEXT_PUBLIC_RPC_URL,
//     signer: passkey,
//     safeAddress: safeAddress,
//   });

//   return <SafeProvider config={config}></SafeProvider>;
// };

// export default Provider;
