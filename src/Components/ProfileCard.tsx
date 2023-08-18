import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Link,
  Box,
  CardHeader,
  IconButton,
  Button,
  CardActions,
} from "@mui/material";
import {Edit as EditIcon} from "@mui/icons-material";
import { useUserContext } from "./UserContext";
import { useAuth0 } from "@auth0/auth0-react";

const ProfileCard = () => {
  const { userInformation } = useUserContext(); 
  const { isAuthenticated, user } = useAuth0();
  const { name, profile_picture, username, bio, links } = userInformation!;
  const [showEditIcons, setShowEditIcons] = useState(false);

  const handlePreviewButtonClick = () => {
    setShowEditIcons(!showEditIcons);
  };

  useEffect(() => {
    // Check if the user in the params is the same as the logged in user
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    const auth0_username = user?.nickname;
    console.log(username, auth0_username, isAuthenticated);
    if (username === user?.nickname && isAuthenticated) {
      setShowEditIcons(true);
    }
  }, [window.location.pathname])

  return (
    <Card
      sx={{
        maxWidth: 300,
        margin: "auto",
        marginTop: 2,
      }}
    >
      <CardHeader
        title={
          <>
            <Avatar
              alt={name}
              src={profile_picture}
              sx={{
                width: 56,
                height: 56,
                margin: "auto",
              }}
            />
          </>
        }
      />
      <CardContent
        sx={{
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          @{username}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {bio}
          {showEditIcons && isAuthenticated && (
            <IconButton
              aria-label="Edit Bio"
              onClick={() => {
                // Handle the edit action here
                console.log("Edit bio clicked");
              }}
            >
              <EditIcon /> {/* Replace with the edit icon component */}
            </IconButton>
          )}
        </Typography>
        <Box>
          {links.map((link, index) => (
            <div key={index}>
              <Link
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    display: "inline-block",
                    m: 1,
                  }}
                >
                  {link.title}
                </Typography>
              </Link>
              {showEditIcons && (
                <IconButton
                  aria-label={`Edit Link ${index + 1}`}
                  onClick={() => {
                    // Handle the edit action here
                    console.log(`Edit Link ${index + 1} clicked`);
                  }}
                >
                  <EditIcon /> {/* Replace with the edit icon component */}
                </IconButton>
              )}
            </div>
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{
        justifyContent: "center"
      }}> 
        {showEditIcons && (
          <Box display="flex" justifyContent="center" mt={1}>
            <Button variant="outlined" onClick={handlePreviewButtonClick}>
              {showEditIcons ? "Preview" : "Edit"}
            </Button>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default ProfileCard;
