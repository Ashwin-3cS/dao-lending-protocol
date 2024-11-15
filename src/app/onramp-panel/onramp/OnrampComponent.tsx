// "use client";

// import { useState } from "react";
// import { Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function CreateOnrampComponent() {
//   const [inrAmount, setInrAmount] = useState("");
//   const [safeAddress, setSafeAddress] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Convert INR to USDC (1 USD = 84 INR, and USDC is pegged 1:1 with USD)
//   const calculateUSDC = (inr: string) => {
//     const inrValue = parseFloat(inr) || 0;
//     return (inrValue / 84).toFixed(2);
//   };

//   // Calculate fees (using 4.99% as example)
//   const calculateFees = (usdc: string) => {
//     const usdcValue = parseFloat(usdc) || 0;
//     return (usdcValue * 0.0499).toFixed(2);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     // Simulate transaction delay
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     setIsLoading(false);
//   };

//   const usdcAmount = calculateUSDC(inrAmount);
//   const fees = calculateFees(usdcAmount);
//   const total = (parseFloat(usdcAmount) + parseFloat(fees)).toFixed(2);

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-primary rounded-full" />
//           <div>
//             <div className="font-bold">ZebraSafe.gg</div>
//             <div className="text-sm text-muted-foreground">
//               Buy crypto with credit, debit, or bank account
//             </div>
//           </div>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-4">
//             <div>
//               <Label>Pay</Label>
//               <div className="mt-1.5">
//                 <Input
//                   type="number"
//                   value={inrAmount}
//                   onChange={(e) => setInrAmount(e.target.value)}
//                   placeholder="Enter amount in INR"
//                   className="text-2xl"
//                 />
//               </div>
//               <div className="mt-2 flex gap-2">
//                 {[5000, 10000, 20000].map((amount) => (
//                   <Button
//                     key={amount}
//                     type="button"
//                     variant="outline"
//                     onClick={() => setInrAmount(amount.toString())}
//                     className="flex-1"
//                   >
//                     ₹{amount}
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <Label>Safe Address</Label>
//               <Input
//                 type="text"
//                 value={safeAddress}
//                 onChange={(e: any) => setSafeAddress(e.target.value)}
//                 placeholder="Enter safe address"
//                 className="mt-1.5"
//               />
//             </div>

//             <div>
//               <Label>Receive</Label>
//               <div className="mt-1.5 text-2xl font-bold">
//                 {usdcAmount} USDC
//                 <div className="text-sm font-normal text-muted-foreground">
//                   1 USDC = $1
//                 </div>
//               </div>
//             </div>

//             <div className="pt-4 border-t">
//               <div className="flex justify-between text-sm">
//                 <span>Fees</span>
//                 <span>${fees}</span>
//               </div>
//               <div className="flex justify-between font-bold mt-2">
//                 <span>Total</span>
//                 <span>${total}</span>
//               </div>
//             </div>
//           </div>

//           <Button
//             type="submit"
//             className="w-full bg-primary"
//             disabled={!inrAmount || !safeAddress || isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               "Continue"
//             )}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ethers } from "ethers";

// Add your deployed vault contract address
const VAULT_CONTRACT_ADDRESS = "0x5defC08b92DbCd0700796A59c0A4aa3074724889";

// Minimal ABI for the vault contract
const VAULT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "safe_Address",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "usdcAmount",
        type: "uint256",
      },
    ],
    name: "transferToRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default function CreateOnrampComponent() {
  const [inrAmount, setInrAmount] = useState("");
  const [safeAddress, setSafeAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [txStatus, setTxStatus] = useState("");

  // Convert INR to USDC (1 USD = 84 INR, and USDC is pegged 1:1 with USD)
  const calculateUSDC = (inr: string) => {
    const inrValue = parseFloat(inr) || 0;
    return (inrValue / 84).toFixed(2);
  };

  // Calculate fees (4.99%)
  const calculateFees = (usdc: string) => {
    const usdcValue = parseFloat(usdc) || 0;
    return (usdcValue * 0.0499).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs before proceeding
    if (!inrAmount || !safeAddress) {
      setError("Please fill in all fields");
      return;
    }

    // Validate safe address format
    if (!ethers.isAddress(safeAddress)) {
      setError("Invalid Safe address format");
      return;
    }

    setIsLoading(true);
    setError("");
    console.log("Form submitted");

    try {
      console.log(process.env.PIMI, "process.env.PIMICO_API_KEY");

      const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
      console.log(rpcUrl, "rpcUrl");
      console.log(privateKey, "privateKey");

      if (!rpcUrl || !privateKey) {
        throw new Error(
          "Missing configuration. Please check your environment variables."
        );
      }

      // Setup provider and signer
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const signer = new ethers.Wallet(privateKey, provider);

      // Check signer balance
      try {
        const balance = await provider.getBalance(signer.address);
        console.log("Signer balance:", ethers.formatEther(balance));
      } catch (err) {
        console.error("Error checking balance:", err);
      }

      // Create contract instance
      const vaultContract = new ethers.Contract(
        VAULT_CONTRACT_ADDRESS,
        VAULT_ABI,
        signer
      );

      // Calculate USDC amount
      const usdcAmount = ethers.parseUnits(calculateUSDC(inrAmount), 6);
      console.log("USDC Amount:", usdcAmount.toString());
      console.log("Safe Address:", safeAddress);
      console.log("Contract address:", VAULT_CONTRACT_ADDRESS);
      console.log("Contract ABI:", VAULT_ABI);

      console.log("Initiating transaction...");

      // Call contract function
      const tx = await vaultContract.transferToRecipient(
        safeAddress,
        usdcAmount
      );
      setTxHash(tx.hash);
      setTxStatus("Transaction Pending");
      console.log("Transaction sent:", tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      setTxStatus("Transaction Confirmed");

      // Reset form
      setInrAmount("");
      setSafeAddress("");
      alert("Transaction successful! USDC has been transferred to your Safe.");
    } catch (err: any) {
      console.error("Transaction failed:", err);
      setError(err.message || "Transaction failed. Please try again.");
      setTxStatus("Transaction Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const usdcAmount = calculateUSDC(inrAmount);
  const fees = calculateFees(usdcAmount);
  const total = (parseFloat(usdcAmount) + parseFloat(fees)).toFixed(2);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full" />
          <div>
            <div className="font-bold">ZebraSafe.gg</div>
            <div className="text-sm text-muted-foreground">
              Buy crypto with credit, debit, or bank account
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Pay</Label>
              <div className="mt-1.5">
                <Input
                  type="number"
                  value={inrAmount}
                  onChange={(e) => setInrAmount(e.target.value)}
                  placeholder="Enter amount in INR"
                  className="text-2xl"
                />
              </div>
              <div className="mt-2 flex gap-2">
                {[5000, 10000, 20000].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    onClick={() => setInrAmount(amount.toString())}
                    className="flex-1"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Safe Address</Label>
              <Input
                type="text"
                value={safeAddress}
                onChange={(e) => setSafeAddress(e.target.value)}
                placeholder="Enter safe address"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Receive</Label>
              <div className="mt-1.5 text-2xl font-bold">
                {usdcAmount} USDC
                <div className="text-sm font-normal text-muted-foreground">
                  1 USDC = $1
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Fees</span>
                <span>${fees}</span>
              </div>
              <div className="flex justify-between font-bold mt-2">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {txHash && (
            <div className="mt-4 text-sm">
              <p>Transaction Hash: {txHash}</p>
              <p>Status: {txStatus}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary"
            disabled={!inrAmount || !safeAddress || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
