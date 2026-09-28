import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

export const RegisterForm: React.FC = () => {
  // 1. Form States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);

  // State to toggle password eyes (Show/Hide text)
  const [showPassword, setShowPassword] = useState(false);

  // 2. Form Submission Handler
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!consent) {
      alert("Please accept the data processing terms.");
      return;
    }
    // This is where your fast backend connection will hook in later!
    console.log({ username, email, password });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Horizontal centering force
        alignItems: "center", // Vertical centering force
        width: "100vw", // Explicit full viewport width
        height: "100vh", // Explicit full viewport height
        bgcolor: "background.default",
        px: 2,
        boxSizing: "border-box",
      }}
    >
      <Card
        sx={{ maxWidth: 400, width: "100%", borderRadius: 3, boxShadow: 3 }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header Section */}
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            Create an Account
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Join Adept and elevate your skills.
          </Typography>

          {/* Form Structure */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Username Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Email Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Data Consent Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  I consent to Adept securely capturing and processing my data.
                </Typography>
              }
              sx={{ mt: 2, mb: 1, alignItems: "flex-start" }}
            />

            {/* Main Call to Action Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!consent}
              sx={{
                mt: 3,
                mb: 3,
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Create Account
            </Button>

            {/* Existing Account Redirect Link */}
            <Box display="flex" justifyContent="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                {/* component={RouterLink} tells Material UI to behave like a React Router switcher! */}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  fontWeight="medium"
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
