import React, { useEffect, useState } from "react";
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";
import { Container, Box, Typography } from "@mui/material";

export default function ClerkDiagnosticsPage() {
  const auth = useAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const [token, setToken] = useState<string>("");
  const [rawDump, setRawDump] = useState<any>({});

  useEffect(() => {
    // NUCLEAR OPTION: Dump everything
    const dump = {
      "auth.userId": auth.userId,
      "auth.sessionId": auth.sessionId,
      "auth.isSignedIn": auth.isSignedIn,
      "auth.isLoaded": auth.isLoaded,
      "user?.id": user?.id,
      "clerk.user?.id": clerk.user?.id,
      "clerk.session?.id": clerk.session?.id,
    };

    setRawDump(dump);
    console.log("🔥 FULL DUMP:", dump);

    // Try to get token
    if (clerk.session) {
      clerk.session
        .getToken()
        .then((t) => {
          console.log("✅ GOT TOKEN:", t?.substring(0, 50));
          setToken(t || "NULL");
        })
        .catch((e) => {
          console.error("❌ TOKEN ERROR:", e);
          setToken("ERROR: " + e.message);
        });
    }
  }, [auth, user, clerk]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 900 }}>
        🔥 CLERK RAW DUMP
      </Typography>

      <Box
        sx={{
          bgcolor: "#000",
          color: "#0f0",
          p: 3,
          borderRadius: 2,
          fontFamily: "monospace",
          fontSize: "0.9rem",
        }}
      >
        <pre>{JSON.stringify(rawDump, null, 2)}</pre>

        <Typography sx={{ color: "#ff0", mt: 3, fontWeight: 900 }}>
          TOKEN:
        </Typography>
        <Typography
          sx={{ color: "#fff", wordBreak: "break-all", fontSize: "0.7rem" }}
        >
          {token || "LOADING..."}
        </Typography>

        <Typography sx={{ color: "#ff0", mt: 3, fontWeight: 900 }}>
          USER ID (for backend):
        </Typography>
        <Typography sx={{ color: "#0ff", fontSize: "1.2rem", fontWeight: 900 }}>
          {auth.userId || clerk.user?.id || "NONE"}
        </Typography>
      </Box>
    </Container>
  );
}
