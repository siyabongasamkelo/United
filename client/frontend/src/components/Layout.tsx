import { useState } from "react";
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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useClerk } from "@clerk/clerk-react"; // 🎯 Using the raw clerk engine hook directly

// Define the navigation items explicitly so they are easy to update
const navItems = [
  { label: "Academy", path: "/academy" },
  { label: "Fleet Audit", path: "/fleet-audit" },
  // { label: "Shift Log", path: "/shift-log" },
  { label: "Fix Report", path: "/fix-report" },
  { label: "Attendance", path: "/attendance" },
  { label: "Quiz Test", path: "/quiz-test" },
  // { label: "Diagnostics", path: "/diagnostics" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const clerk = useClerk(); // 🔍 Direct access to the low-level session keys
  const navigate = useNavigate();

  // 🛡️ THE BULLETPROOF AUTH CHECK (Proven by our raw dump)
  // If clerk.session exists and we have a valid user ID, the operator is 100% online.
  const isOperatorLoggedIn = !!clerk.session && !!clerk.user?.id;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Safe global logout function handler
  const handleLogout = async () => {
    try {
      await clerk.signOut();
      toast.info("Logged out successfully. See you next shift!", {
        autoClose: 2500,
      });
      navigate("/login");
    } catch (error) {
      console.error("Clerk sign-out exception encounter:", error);
      toast.error("Failed to safely sign out.");
    }
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
        {/* 🌟 Display features list if the operator is authenticated */}
        {isOperatorLoggedIn &&
          navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton component={RouterLink} to={item.path}>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: "600", color: "#334155" }}>
                      {item.label}
                    </Typography>
                  }
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
              primary={
                <Typography sx={{ fontWeight: "600" }}>Learn More</Typography>
              }
            />
          </ListItemButton>
        </ListItem>

        {/* 🔐 MOBILE DYNAMIC AUTH BUTTON */}
        {isOperatorLoggedIn ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: "800", color: "#ef4444" }}>
                    Logout
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/login">
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: "800", color: "#4f46e5" }}>
                    Login
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        )}
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
              onClick={() => navigate("/")}
            >
              ADEPT
            </Typography>

            {/* Middle: Desktop Navigation Links (Only shown when authenticated) */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1 }}>
                {isOperatorLoggedIn &&
                  navItems.map((item) => (
                    <Button
                      key={item.label}
                      component={RouterLink}
                      to={item.path}
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

                {/* 🔐 DESKTOP DYNAMIC AUTH BUTTON */}
                {isOperatorLoggedIn ? (
                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    sx={{
                      bgcolor: "#dc2626",
                      fontWeight: "700",
                      textTransform: "none",
                      px: 3,
                      borderRadius: 2,
                      "&:hover": { bgcolor: "#b91c1c" },
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    component={RouterLink}
                    to="/login"
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
                )}
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
        ModalProps={{ keepMounted: true }}
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
