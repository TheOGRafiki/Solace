import {
  Typography,
  Avatar,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  TextField,
  Divider,
  LinearProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";

import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

interface AccountDialogProps {
  open: boolean;
  handleClose: () => void;
}

const AccountDialog = ({ open, handleClose }: AccountDialogProps) => {
  const { user, logout, isLoading, error } = useAuth0();
  const [imageHover, setImageHover] = useState(false);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        backgroundColor: "black",
        textAlign: "center",
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center", // Vertically center the child elements
        }}
      >
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
          }}
        >
          Account
        </Typography>

        <IconButton
          color="secondary"
          onClick={handleClose}
          sx={{ position: "absolute", right: 10, top: 10 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "1rem", // Responsive padding using rem unit
          maxHeight: "70vh", // Responsive height using vh unit
          overflowY: "auto", // Enable vertical scrollbar when content overflows
          scrollbarWidth: "thin", // Set the width of the scrollbar
          scrollbarColor: "rgba(255, 255, 255, 0.2) transparent", // Set the color of the scrollbar thumb and track
          "&::-webkit-scrollbar": {
            width: "0.7rem", // Responsive width of the scrollbar for WebKit browsers (Chrome, Safari)
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "1rem", // Responsive rounded corners for the scrollbar thumb
            backgroundColor: "rgba(255, 255, 255, 0.4)", // Color of the scrollbar thumb
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.6)", // Hover color of the scrollbar thumb
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent", // Color of the scrollbar track
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Welcome, {user?.name}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <IconButton>
              <Avatar
                alt={user?.name}
                src={user?.picture}
                sx={{
                  width: 100,
                  height: 100,
                  margin: "auto",
                  filter: imageHover ? "brightness(0.5)" : "brightness(1)",
                }}
                onMouseEnter={() => setImageHover(true)}
                onMouseLeave={() => setImageHover(false)}
              />
            </IconButton>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">{user?.name}</Typography>
            <Typography variant="body1">{user?.email}</Typography>
            {/* Implement options to edit name and profile picture */}
          </Grid>
          {/* Implement change password functionality */}
          <Divider
            sx={{
              m: 1,
              width: "100%",
            }}
          />
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              label="New Password"
              type="password"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              label="Confirm Password"
              type="password"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="text" color="primary">
              Change Password
            </Button>
          </Grid>
          <Divider
            sx={{
              m: 1,
              width: "100%",
            }}
          />
          {/* Implement option to resend verification email if required */}
          <Grid item xs={12}>
            <Button variant="text" color="primary">
              Resend Verification Email
            </Button>
          </Grid>
          {/* Implement option to logout */}
          <Grid item xs={12}>
            <Button variant="text" color="warning" onClick={() => logout()}>
              Logout
            </Button>
          </Grid>
          {/* Implement option to delete account with proper confirmation steps */}
          <Grid item xs={12}>
            <Button variant="text" color="error">
              Delete Account
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;
