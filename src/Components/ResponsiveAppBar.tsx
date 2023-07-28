import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";

import { useAuth0 } from "@auth0/auth0-react";
import SolaceLogo from "../assets/solace-logo-big.png";
import { Typography } from "@mui/material";
import { useState } from "react";
import AccountDialog from "./AccountDialog";

const settings = ["Profile", "Account", "Logout"];

const ResponsiveAppBar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

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
        window.location.href = `/@${user?.nickname}`;
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
        backgroundColor: "black",
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
          <Avatar alt="Solace Logo" src={SolaceLogo} sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".3rem",
              // color: themeColor,
              textDecoration: "none",
            }}
          >
            SOLACE
          </Typography>
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
              variant="text"
              color="primary"
              onClick={() => {
                loginWithRedirect();
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
