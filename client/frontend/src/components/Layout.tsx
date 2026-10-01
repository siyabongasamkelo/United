import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

// Define the navigation items explicitly so they are easy to update
const navItems = [
  { label: "Academy", path: "/academy" },
  { label: "fleet-audit", path: "/fleet-audit" },
  { label: "shift log", path: "/shift-log" },
  { label: "Fix Report", path: "/fix-report" },
  { label: "Pace Setter", path: "/pace-setter" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  // Automatically switches to mobile mode if screen width is below 'md' (900px)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Mobile Drawer Menu content
  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250, pt: 2 }}>
      <Typography
        variant="h6"
        sx={{ my: 2, px: 2, fontWeight: "800", color: "#1e1b4b" }}
      >
        UTS PORTAL
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: "600", color: "#334155" }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem
          disablePadding
          sx={{ mt: 2, borderTop: "1px solid #e2e8f0", pt: 2 }}
        >
          <ListItemButton>
            <ListItemText
              primary="Learn More"
              primaryTypographyProps={{ fontWeight: "600" }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary="Login"
              primaryTypographyProps={{ fontWeight: "800", color: "#4f46e5" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      {/* ❶ GLOBAL NAVBAR */}
      <AppBar
        position="sticky"
        elevation={1}
        sx={{ bgcolor: "#1e1b4b", color: "white" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Left: Brand Name */}
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                fontWeight: "900",
                letterSpacing: 1,
                color: "#f59e0b",
                cursor: "pointer",
              }}
            >
              ADEPT
            </Typography>

            {/* Middle: Desktop Navigation Links */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    component={RouterLink} // 💡 Crucial change: tells MUI to behave like a React router node
                    to={item.path} // 💡 Passes path data safely
                    sx={{
                      color: "rgba(255, 255, 255, 0.85)",
                      fontWeight: "600",
                      textTransform: "none",
                      px: 2,
                      fontSize: "0.9rem",
                      "&:hover": {
                        color: "#ffffff",
                        bgcolor: "rgba(255,255,255,0.08)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right: Desktop Action Buttons OR Mobile Hamburger */}
            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Button
                  variant="text"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    textTransform: "none",
                    fontWeight: "600",
                    "&:hover": { color: "#ffffff" },
                  }}
                >
                  Learn More
                </Button>
                <Button
                  component={RouterLink}
                  to="/login" // 💡 Points straight to your new auth route
                  variant="contained"
                  sx={{
                    bgcolor: "#4f46e5",
                    fontWeight: "700",
                    textTransform: "none",
                    px: 3,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#4338ca" },
                  }}
                >
                  Login
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* ❷ MOBILE SLIDEOUT DRAWER */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better mobile performance
      >
        {drawerContent}
      </Drawer>

      {/* ❸ MAIN CONTENT CONTAINER */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* ❹ GLOBAL FOOTER */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          bgcolor: "#0f172a",
          color: "rgba(255,255,255,0.6)",
          textAlign: "center",
          borderTop: "1px solid #1e293b",
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: "500" }}>
          &copy; {new Date().getFullYear()} UTS Onboarding Portal powered by
          Adept. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
