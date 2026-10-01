import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  RegisterForm,
  LoginForm,
  ForgotPasswordForm,
  ResetPasswordForm,
} from "../features/auth";
import { QuizCard } from "../features/quizzes";
import { CourseDashboard, StudyReader } from "../features/courses";
import { NavigationHeader } from "../components/NavigationHeader";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import {
  MenuBook as CourseIcon,
  AssignmentTurnedIn as QuizIcon,
  Leaderboard as BoardIcon,
} from "@mui/icons-material";

// Define a permanent width for our sidebar frame
const SIDEBAR_WIDTH = 240;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation Links Blueprint Array
  const navItems = [
    { text: "My Courses", icon: <CourseIcon />, path: "/dashboard" },
    { text: "Practice Quiz", icon: <QuizIcon />, path: "/quiz" },
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Banner remains sticky */}
      <NavigationHeader />

      <Box sx={{ display: "flex", flexGrow: 1, width: "100vw" }}>
        {/* Responsive Desktop Sidebar (Hidden automatically on smaller mobile frames) */}
        <Drawer
          variant="permanent"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            display: { xs: "none", sm: "block" }, // Disappears cleanly on phones to avoid breaking grid
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
              bgcolor: "white",
              position: "fixed",
              height: `calc(100vh - 64px)`, // Avoid overlapping our beautiful top bar
              top: 64,
            },
          }}
        >
          <List sx={{ px: 2, py: 3 }}>
            {navItems.map((item) => {
              const isSelected = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      // Automatically turns Electric Indigo if active path matches!
                      bgcolor: isSelected ? "primary.light" : "transparent",
                      color: isSelected ? "primary.main" : "text.primary",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isSelected ? "primary.main" : "action.active",
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isSelected ? "bold" : "medium",
                        fontSize: "0.9rem",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Drawer>

        {/* Dynamic Inner Main Content Box Workspace */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            boxSizing: "border-box",
            // Pushes content over by 240px ONLY on desktop screens so cards aren't trapped under the sidebar
            ml: { sm: `${SIDEBAR_WIDTH}px` },
            width: { sm: `calc(100vw - ${SIDEBAR_WIDTH}px)` },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export const router = createBrowserRouter([
  // Public Gatekeeper Paths
  { path: "/", index: true, element: <Navigate to="/register" replace /> },
  { path: "/register", element: <RegisterForm /> },
  { path: "/login", element: <LoginForm /> },
  { path: "/forgot-password", element: <ForgotPasswordForm /> },
  { path: "/reset-password", element: <ResetPasswordForm /> },

  // Secure App Shell Workspace Paths
  {
    element: <AppLayout />,
    children: [
      { path: "/dashboard", element: <CourseDashboard /> },
      { path: "/course/:courseId/study", element: <StudyReader /> },
      { path: "/quiz", element: <QuizCard /> },
    ],
  },
]);
