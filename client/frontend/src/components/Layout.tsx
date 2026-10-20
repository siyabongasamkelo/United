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
import { useClerk } from "@clerk/clerk-react";
import { useUser } from "../features/users/context/UserContext"; // 🎯 Grab your real DB context

// 📝 Complete master list of your routes with strict role-clearance arrays attached
const navItems = [
  {
    label: "Academy",
    path: "/academy",
    roles: ["PORTER", "SUPERVISOR", "AREA_MANAGER", "SYSTEM_ADMIN"],
  },
  // {
  //   label: "Floor Fix Log",
  //   path: "/fix-report",
  //   roles: ["PORTER", "SUPERVISOR", "SYSTEM_ADMIN"],
  // },
  // {
  // label: "Roster Log",
  // path: "/shift-log",
  // roles: ["PORTER", "SUPERVISOR", "SYSTEM_ADMIN"],
  // },
  {
    label: "Attendance",
    path: "/attendance",
    roles: ["PORTER", "SUPERVISOR", "SYSTEM_ADMIN"],
  },
  {
    label: "Store Sweeps",
    path: "/store-visits",
    roles: ["PORTER", "SUPERVISOR", "SYSTEM_ADMIN"],
  },
  {
    label: "Quiz Test",
    path: "/quiz-test",
    roles: ["PORTER", "SUPERVISOR", "SYSTEM_ADMIN"],
  },
  {
    label: "Supervisor Hub",
    path: "/branch-operations",
    roles: ["SUPERVISOR", "SYSTEM_ADMIN"],
  },
  {
    label: "District Matrix",
    path: "/area-operations",
    roles: ["AREA_MANAGER", "SYSTEM_ADMIN"],
  },
  {
    label: "Fleet Audits",
    path: "/fleet-audit",
    roles: ["SUPERVISOR", "AREA_MANAGER", "SYSTEM_ADMIN"],
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const clerk = useClerk();
  const { currentUser } = useUser(); // 🔑 Consume your database profile state node
  const navigate = useNavigate();

  // Determine user authority roles dynamically
  const userRole = currentUser?.role || "PORTER";
  const isOperatorLoggedIn = !!clerk.session && !!clerk.user?.id;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

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

  // Mobile Drawer Menu layout structure
  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250, pt: 2 }}>
      <Typography
        variant="h6"
        sx={{ my: 2, px: 2, fontWeight: "800", color: "#1e1b4b" }}
      >
        UTS PORTAL
      </Typography>
      <List>
        {/* 🚀 MOBILE SILENT FILTER: Loops menu items and matches roles implicitly */}
        {isOperatorLoggedIn &&
          navItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => (
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

            {/* 🚀 DESKTOP SILENT FILTER: Completely hides links from view if unauthorized */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1 }}>
                {isOperatorLoggedIn &&
                  navItems
                    .filter((item) => item.roles.includes(userRole))
                    .map((item) => (
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

            {/* Actions / Trigger nodes */}
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
                {/* Micro User Label stamp to help verify profiles during test phases */}
                {currentUser && (
                  <Typography
                    variant="caption"
                    sx={{ color: "#94a3b8", fontWeight: "700" }}
                  >
                    {currentUser.fullName} ({currentUser.role})
                  </Typography>
                )}

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
