import LoginIcon from "@mui/icons-material/Login";
import { useAuth0 } from "@auth0/auth0-react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import AccountDialog from "./AccountDialog";

const settings = ["Profile", "Account", "Logout"];

const ResponsiveAppBar = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const [open, setOpen] = useState(false);

  const { user, logout, isAuthenticated, loginWithRedirect } = useAuth0();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserButtons = (setting: string) => {
    switch (setting) {
      case "Profile":
        window.location.href = `/?username=${user?.nickname}`;
        break;
      case "Account":
        setOpen(true);
        break;
      case "Logout":
        logout();
        break;
      default:
        console.log("Error");
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        // * white to grey diagonal gradient
        background:
          "linear-gradient(45deg, #393939 0%, #393939 50%, #393939 100%)",
      }}
    >
      <AccountDialog open={open} handleClose={() => setOpen(false)} />
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "space-between",
            justifyContent: "space-between", // Adjust the spacing between items
            alignItems: "center", // Center items vertically
          }}
        >
          {/* Should go to home page when clicked */}
          <Avatar
            variant="square"
            alt="Solace Logo"
            src="src/assets/Transparent_Solace.png"
            sx={{ width: 50, height: 50, "&:hover": { cursor: "pointer" } }}
            onClick={() => {
              window.location.href = "/";
            }}
          />
          {/* <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".3rem",
              textDecoration: "none",
            }}
            color={"primary"}
          >
            SOLACE
          </Typography> */}
          {isAuthenticated ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Picture" src={user?.picture} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Button onClick={() => handleUserButtons(setting)}>
                      {setting}
                    </Button>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                loginWithRedirect();
              }}
              endIcon={<LoginIcon />}
              sx={{
                fontWeight: 1200,
              }}
            >
              Log in
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
