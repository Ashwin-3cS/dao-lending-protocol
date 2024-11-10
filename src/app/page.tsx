// "use client";

// import { createPasskey, storePasskeyInLocalStorage } from "@/lib/passkeys";

// export default function Home() {
//   const handleCreatePasskey = async () => {
//     const passkey = await createPasskey();
//     storePasskeyInLocalStorage(passkey);
//     console.log("PassKey Stored : ", passkey);
//   };

//   return (
//     <div>
//       <button onClick={handleCreatePasskey}>Create and Store Passkey</button>
//     </div>
//   );
// }

"use client";

import type { Theme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { PasskeyArgType } from "@safe-global/protocol-kit";
import { useState } from "react";

import LoginWithPasskey from "@/components/LoginWithPasskey";
import SafeAccountDetails from "@/components/SafeAccountDetails";
import SafeThemeProvider from "../components/SafeThemeProvider";
import { createPasskey, storePasskeyInLocalStorage } from "../lib/passkeys";
import axios from "axios";

function Create4337SafeAccount() {
  const [selectedPasskey, setSelectedPasskey] = useState<PasskeyArgType>();
  const [safeAddress, setSafeAddress] = useState<string | undefined>(); // add state for safe address

  // async function handleCreatePasskey() {
  //   const passkey = await createPasskey();

  //   storePasskeyInLocalStorage(passkey);

  //   setSelectedPasskey(passkey);
  // }

  async function handleCreatePasskey(username: string, email: string) {
    const passkey = await createPasskey();
    // storePasskeyInLocalStorage(passkey);
    setSelectedPasskey(passkey);

    // Send user data and passkey to API route using axios
    try {
      await axios.post("/api/user", {
        username,
        email,
        passkey,
      });
    } catch (error) {
      console.error("Error saving passkey:", error);
    }
  }
  async function handleSelectPasskey(passkey: PasskeyArgType) {
    setSelectedPasskey(passkey);
  }

  return (
    <SafeThemeProvider>
      {(safeTheme: Theme) => (
        <ThemeProvider theme={safeTheme}>
          {selectedPasskey ? (
            <SafeAccountDetails
              passkey={selectedPasskey}
              setSafeAddress={setSafeAddress}
              safeAddress={safeAddress}
            />
          ) : (
            <LoginWithPasskey
              handleCreatePasskey={handleCreatePasskey}
              handleSelectPasskey={handleSelectPasskey}
            />
          )}
        </ThemeProvider>
      )}
    </SafeThemeProvider>
  );
}

export default Create4337SafeAccount;
