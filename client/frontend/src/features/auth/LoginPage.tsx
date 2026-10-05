import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOpen,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSignIn, useAuth } from "@clerk/clerk-react"; // 🎯 Imported useAuth to monitor session state
import { toast } from "react-toastify";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth(); // 🔍 Detect hidden background tokens instantly

  // Local structural form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  // 🛡️ THE AUTOMATIC ESCAPE GATEWAYS
  // If Clerk evaluates that you are already authenticated via hidden storage hooks,
  // bypass the login panels cleanly and push straight into your academy dashboard route!
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log(
        "🔄 Background active session detected. Forcing auto-forward...",
      );
      navigate("/academy", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setErrorFeedback(null);
    setIsSubmitting(true);

    // 🛡️ EXTRA PROTECTION: Double-check state to intercept duplicate 400 API requests
    if (isSignedIn) {
      toast.success("Welcome back! Loading your operator portal...", {
        autoClose: 3000,
      });
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/academy");
      }, 3000);
      return;
    }

    // Quick client-side validation guard
    if (!email || !password) {
      setErrorFeedback(
        "Access Denied: Please fill in all required credential fields.",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      console.log(
        "Starting secure authentication transmission directly over Clerk...",
      );

      // ❶ Attempt login authentication request
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      // ❷ Process active session mapping
      if (result.status === "complete") {
        console.log(
          "🔒 Credentials verified. Syncing active session state into browser...",
        );

        // First, fully register the session into Clerk's underlying React context state engine
        await setActive({ session: result.createdSessionId });

        // Display your beautiful custom success toast layout notice
        toast.success("Hey, you've successfully logged in!", {
          autoClose: 3000,
        });

        // ❸ Delay navigation safely for exactly 3 seconds so the operator reads the message toast
        setTimeout(() => {
          setIsSubmitting(false);
          navigate("/academy");
        }, 3000);
      } else {
        console.warn("Additional verification steps required:", result.status);
        setErrorFeedback(`Authentication status incomplete: ${result.status}`);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("Clerk login interaction failure catch block caught:", err);

      // Smoothly parse Clerk's native error stack or fallback to general text
      const displayMessage =
        err.errors?.[0]?.longMessage ||
        err.message ||
        "Invalid email or security password. Please verify your credentials.";

      setErrorFeedback(displayMessage);
      setIsSubmitting(false); // 🌟 Always turn off the spinner immediately on failure!
    }
  };

  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "#f8fafc",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: 4,
          borderColor: "#e2e8f0",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          {/* Header Branding Section */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                p: 1.5,
                borderRadius: 3,
                bgcolor: "#e0f2fe",
                color: "#4f46e5",
                mb: 2,
              }}
            >
              <LockOpen fontSize="medium" />
            </Box>
            <Typography
              variant="h5"
              sx={{ letterSpacing: -0.5, fontWeight: "900", color: "#1e1b4b" }}
            >
              UTS Operator Login
            </Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "block",
                color: "text.secondary",
                fontWeight: "600",
              }}
            >
              Secure Gateway Deployment Terminal
            </Typography>
          </Box>

          {/* Validation Error Readout Banner */}
          {errorFeedback && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                fontSize: "0.8rem",
                fontWeight: "600",
              }}
            >
              {errorFeedback}
            </Alert>
          )}

          {/* Form Action Fields */}
          <Box component="form" onSubmit={handleLoginSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Company Email Address"
                type="email"
                variant="outlined"
                fullWidth
                required
                size="small"
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              <TextField
                label="Security Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                required
                size="small"
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          size="small"
                          disabled={isSubmitting}
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ fontSize: 18 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                endIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <ArrowForward />
                  )
                }
                sx={{
                  bgcolor: "#1e1b4b",
                  fontWeight: "800",
                  textTransform: "none",
                  py: 1.2,
                  borderRadius: 2.5,
                  mt: 1,
                  "&:hover": { bgcolor: "#2e2a72" },
                }}
              >
                {isSubmitting ? "Verifying..." : "Verify & Enter Portal"}
              </Button>

              <Box sx={{ textAlign: "center", mt: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "600", color: "text.secondary" }}
                >
                  Don't have an account?{" "}
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      fontWeight: "800",
                      color: "#4f46e5",
                      cursor: "pointer",
                    }}
                  >
                    Contact Site Admin
                  </Typography>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
