import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon, // Fixed: changed from LogOut to Logout
  Dashboard as DashboardIcon,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";

export const NavigationHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Menu Anchor Dropdown State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    // Clear out session tokens and kick back to login portal instantly
    localStorage.removeItem("adept_token");
    navigate("/login");
  };

  // Hide the global header completely on public Auth screens
  const authPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  if (authPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* elevation={1} keeps the shadow flat, crisp, and high-performance */}
      <AppBar
        position="sticky"
        color="inherit"
        elevation={1}
        sx={{ bgcolor: "white" }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
          {/* Brand Left Logo Frame */}
          <Box
            onClick={() => navigate("/dashboard")}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Typography
              variant="h5"
              component="div"
              color="primary"
              fontWeight="black"
              letterSpacing={-0.5}
              sx={{ textTransform: "lowercase", fontStyle: "italic" }}
            >
              adept.
            </Typography>
          </Box>

          {/* Action Right Settings Shell */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Context Dashboard quick-link shortcut (hidden if already on it) */}
            {location.pathname !== "/dashboard" && (
              <Button
                variant="text"
                size="small"
                startIcon={<DashboardIcon />}
                onClick={() => navigate("/dashboard")}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                Dashboard
              </Button>
            )}

            {/* Tap-Friendly Interactive Avatar Bubble Component */}
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              aria-controls={isMenuOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isMenuOpen ? "true" : undefined}
              sx={{ p: 0.5 }}
            >
              {/* Using material letters avatar inside instead of pulling external heavy profile images */}
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                }}
              >
                TM
              </Avatar>
            </IconButton>
          </Box>

          {/* Clean Dropdown Context Action Plate */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={isMenuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              elevation: 3,
              sx: {
                borderRadius: 2,
                mt: 1.5,
                minWidth: 160,
                "& .MuiMenuItem-root": { fontSize: "0.9rem", py: 1.2 },
              },
            }}
          >
            <MenuItem onClick={() => navigate("/dashboard")}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              My Courses
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
