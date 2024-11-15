"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function createOnrampComponent() {
  const [inrAmount, setInrAmount] = useState("");
  const [safeAddress, setSafeAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Convert INR to USDC (1 USD = 84 INR, and USDC is pegged 1:1 with USD)
  const calculateUSDC = (inr: string) => {
    const inrValue = parseFloat(inr) || 0;
    return (inrValue / 84).toFixed(2);
  };

  // Calculate fees (using 4.99% as example)
  const calculateFees = (usdc: string) => {
    const usdcValue = parseFloat(usdc) || 0;
    return (usdcValue * 0.0499).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
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
                onChange={(e: any) => setSafeAddress(e.target.value)}
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
