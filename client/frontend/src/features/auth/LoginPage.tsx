import React, { useState } from "react";
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
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOpen,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  // Local structural form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFeedback(null);

    // Quick client-side validation guard
    if (!email || !password) {
      setErrorFeedback(
        "Access Denied: Please fill in all required credential fields.",
      );
      return;
    }

    // Mock Authentication Logic (This payload will connect directly to your backend API route later!)
    const authPayload = { email, password };
    console.log("Authenticating UTS Operator:", authPayload);

    // If successful, fly them straight to the main Academy dashboard layout!
    navigate("/academy");
  };

  return (
    // 💡 Responsive Flex Center Container: Centers the login card on PC, takes full space on mobile
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
              fontWeight="900"
              color="#1e1b4b"
              sx={{ letterSpacing: -0.5 }}
            >
              UTS Operator Login
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="600"
              sx={{ mt: 0.5, display: "block" }}
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
              {/* Email Input Field */}
              <TextField
                label="Company Email Address"
                type="email"
                variant="outlined"
                fullWidth
                required
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              {/* Password Input Field with Interactive Toggle */}
              <TextField
                label="Security Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                required
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: 18 }} />
                        ) : (
                          <Visibility sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Action Submit Button */}
              {/* Action Submit Button */}
              <Button
                type="submit"
                variant="contained"
                endIcon={<ArrowForward />}
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
                Verify & Enter Portal
              </Button>

              {/* 💡 FIXED: Added the clean "Don't have an account?" link line right here */}
              <Box sx={{ textAlign: "center", mt: 1.5 }}>
                <Typography
                  variant="caption"
                  fontWeight="600"
                  color="text.secondary"
                >
                  Don't have an account?{" "}
                  <Typography
                    component="span"
                    variant="caption"
                    fontWeight="700"
                    color="#4f46e5"
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
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
