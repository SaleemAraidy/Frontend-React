import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { UserData } from "../../model/user.model";
import { signal } from "@preact/signals-core";
import { signedInUser } from "../../App";
import "./LoggedinNavbar.css";
import { useSignals } from "@preact/signals-react/runtime";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function MenuAppBar() {
  const navigate = useNavigate();
  useSignals();
  const [auth, setAuth] = React.useState(true); // Assume user is authenticated
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [user, setUser] = React.useState<UserData | null>(null);

  React.useEffect(() => {
    if (signedInUser.value) {
      setUser(signedInUser.value);
    }
  }, [signedInUser.value]);

  console.log("User: ", user);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLoginClick(): void {
    window.location.href = "/login";
  }

  function handleSavedJobsClick(): void {
    //window.location.href = "/saved-jobs";
    navigate("saved-jobs");
  }

  function handleLogout(): void {
    Cookies.remove("access_token");
    signedInUser.value = null;
    setUser(null);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: "#0A66C2" }}>
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {user ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  src={user.picture || undefined} // Show picture if available
                  sx={{
                    bgcolor: !user.picture ? "primary.main" : undefined,
                  }}
                >
                  {!user.picture && user?.givenName[0]} {/* Initial */}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                style={{
                  marginTop: "38px",
                }}
              >
                {/* User Info Card */}
                <Box
                  sx={{
                    padding: 2,
                    textAlign: "center",
                    width: 200,
                  }}
                >
                  <Avatar
                    src={user.picture || undefined}
                    sx={{
                      width: 56,
                      height: 56,
                      margin: "0 auto",
                      bgcolor: !user.picture ? "primary.main" : undefined,
                    }}
                  >
                    {!user.picture && user.givenName[0]}
                  </Avatar>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {user.givenName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {user.email}
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Button
                    fullWidth
                    variant="text"
                    color="primary"
                    onClick={handleSavedJobsClick}
                  >
                    Saved Jobs
                  </Button>
                  <Button
                    fullWidth
                    variant="text"
                    color="primary"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </Box>
              </Menu>
            </div>
          ) : (
            <Button onClick={handleLoginClick} color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
