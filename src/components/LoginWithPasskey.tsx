import FingerprintIcon from "@mui/icons-material/Fingerprint";
import {
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PasskeyArgType } from "@safe-global/protocol-kit";
import {
  loadPasskeysFromLocalStorage,
  loadPasskeysFromDB,
} from "../lib/passkeys";
import { useState } from "react";

type props = {
  handleCreatePasskey: (
    username: string,
    email: string,
    password: string
  ) => void;
  handleSelectPasskey: (passkey: PasskeyArgType) => {};
};

function LoginWithPasskey({ handleCreatePasskey, handleSelectPasskey }: props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [existingEmail, setExistingEmail] = useState("");
  return (
    <Paper
      sx={{
        margin: "32px auto 0",
      }}
    >
      <Stack padding={4}>
        <Typography textAlign={"center"} variant="h1" color={"primary"}>
          Use Safe Account via Passkeys
        </Typography>

        <Typography
          textAlign={"center"}
          marginBottom={8}
          marginTop={8}
          variant="h4"
        >
          Create a new Safe using passkeys
        </Typography>

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          onClick={() => handleCreatePasskey(username, email, password)}
          startIcon={<FingerprintIcon />}
          variant="outlined"
          sx={{ marginBottom: "24px" }}
        >
          Create a new passkey
        </Button>

        <Divider sx={{ marginTop: "32px" }}>
          <Typography variant="caption" color="GrayText">
            OR
          </Typography>
        </Divider>

        <Typography
          textAlign={"center"}
          marginBottom={8}
          marginTop={8}
          variant="h4"
        >
          Connect existing Safe using an existing passkey
        </Typography>
        {/* 
        <Button
          startIcon={<FingerprintIcon />}
          variant="contained"
          onClick={async () => {
            const passkeys = loadPasskeysFromLocalStorage();
            handleSelectPasskey(passkeys[0]);
          }}
        >
          Use an existing passkey
        </Button> */}
        <TextField
          label="Email for Existing Passkey"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={existingEmail}
          onChange={(e) => setExistingEmail(e.target.value)}
        />

        <Button
          startIcon={<FingerprintIcon />}
          variant="contained"
          onClick={async () => {
            const passkeys = await loadPasskeysFromDB(existingEmail);
            console.log(passkeys, "from button");

            if (passkeys.length > 0) {
              handleSelectPasskey(passkeys[0]);
            } else {
              console.error("No passkeys found for this email.");
            }
          }}
        >
          Use an existing passkey
        </Button>
      </Stack>
    </Paper>
  );
}

export default LoginWithPasskey;
