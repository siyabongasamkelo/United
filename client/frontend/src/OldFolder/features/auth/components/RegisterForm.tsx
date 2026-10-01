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
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../api/register";

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  // 1. Core Input States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2. Performance & UI States
  const [isLoading, setIsLoading] = useState(false);

  // 3. Airtight Validation Error States (Replaces Yup!)
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 4. Custom Validation Engine (0kb Bundle Cost)
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { username: "", email: "", password: "" };

    // Username Validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      valid = false;
    }

    // Email Validation (Standard Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email address is required";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Password Validation
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // 5. Native Submission Handler with API & Toast Integration
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Prevent submission if form rules are broken
    if (!validateForm()) return;

    if (!consent) {
      toast.warn("Please accept the data processing terms.");
      return;
    }

    setIsLoading(true);

    try {
      // Hit our lightweight feature API utility
      const response = await registerUser({ username, email, password });

      toast.success(response.message || "Account created successfully!");

      // Save session token if returned, then route to the dashboard instantly
      if (response.token) {
        localStorage.setItem("adept_token", response.token);
      }

      navigate("/dashboard");
    } catch (error: any) {
      // Pop a clean, native toast notification detailing the specific backend block
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
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
              error={Boolean(errors.username)}
              helperText={errors.username}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color={errors.username ? "error" : "action"} />
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
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailIcon color={errors.email ? "error" : "action"} />
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
              error={Boolean(errors.password)}
              helperText={errors.password}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color={errors.password ? "error" : "action"} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={isLoading}
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
                  disabled={isLoading}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  I consent to Adept securely capturing and processing my data.
                </Typography>
              }
              sx={{ mt: 2, mb: 1, alignItems: "flex-start" }}
            />

            {/* Main Action Button with Adaptive Loading Spinner */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!consent || isLoading}
              sx={{
                mt: 3,
                mb: 3,
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Existing Account Redirect Link */}
            <Box display="flex" justifyContent="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
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
