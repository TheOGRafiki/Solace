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
  TextField,
  Grid,
  Divider,
  Grow,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { Edit, Save, Cancel, Add } from "@mui/icons-material";
import { Link as LinkType, useUserContext } from "./UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import axios from "axios";

const ProfileCard = () => {
  // * These are context values
  const { userInformation, setUserInformation } = useUserContext();
  const { isAuthenticated, user } = useAuth0();
  const { name, profile_picture, username, bio, links } = userInformation!;

  const [showEditIcons, setShowEditIcons] = useState(false); // * This is used to toggle preview and edit mode i.e to hide the edit icons
  const [editMode, setEditMode] = useState(false); // * This is used to render the edit button at the bottom of the card
  const [editLinkIndex, setEditLinkIndex] = useState<number | null>(null); // *  Index of the link being edited

  // * These states are used to store the edited values
  const [localLinks, setLocalLinks] = useState<LinkType[]>(links);

  // * Loading state
  const [loading, setLoading] = useState<boolean>(false);

  const handleSaveLink = async (message: string) => {
    // Update the link information in the links array
    setLoading(true);

    try {
      await axios.post(
        `https://us-east-1.aws.data.mongodb-api.com/app/data-tyxwp/endpoint/update_user_links?id=${user?.sub}`,
        {
          links: localLinks,
        }
      );
      toast.success(message);

      // * Update the user information
      const res = await axios.post(`
      https://us-east-1.aws.data.mongodb-api.com/app/data-tyxwp/endpoint/get_user?username=${username}
    `);

      setUserInformation(res.data);

      // Reset edit mode and edited states
      setEditLinkIndex(null);
    } catch (err) {
      toast.error("Error updating link");
    }

    setLoading(false);
  };

  useEffect(() => {
    // Check if the user in the params is the same as the logged in user
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");

    if (username === user?.nickname && isAuthenticated) {
      toast.info("You are viewing your own profile, you can edit it!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });

      setShowEditIcons(true);
      setEditMode(true);
    }
  }, [window.location.pathname, user]);

  return (
    <Card
      sx={{
        maxWidth: 300,
        margin: "auto",
        marginTop: 2,
      }}
    >
      {loading && <LinearProgress />}
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
        <Box>
          <Typography variant="body2" gutterBottom>
            {bio}
          </Typography>
          {localLinks &&
            localLinks.map((link, index) => (
              <div key={index}>
                {editLinkIndex === index ? (
                  <Grid
                    container
                    spacing={1}
                    alignItems="flex-end"
                    mt={1}
                    mb={1}
                  >
                    <Divider sx={{ width: "100%" }} />
                    <Grid item xs={12}>
                      <TextField
                        label="Title"
                        value={localLinks[index].title}
                        onChange={(e) => {
                          const newLinks = [...localLinks];
                          newLinks[index].title = e.target.value;
                          setLocalLinks(newLinks);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="URL"
                        value={localLinks[index].url}
                        onChange={(e) => {
                          const newLinks = [...localLinks];
                          newLinks[index].url = e.target.value;
                          setLocalLinks(newLinks);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        value={localLinks[index].description}
                        onChange={(e) => {
                          const newLinks = [...localLinks];
                          newLinks[index].description = e.target.value;
                          setLocalLinks(newLinks);
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        onClick={() => setEditLinkIndex(null)}
                        endIcon={<Cancel />}
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        onClick={() => {
                          const newLinks = [...localLinks];
                          newLinks.splice(index, 1);
                          console.log(newLinks);
                          setLocalLinks(newLinks);
                          setEditLinkIndex(null);
                          handleSaveLink("Link deleted successfully");
                        }}
                        endIcon={<Cancel />}
                        disabled={localLinks.length === 1}
                      >
                        Delete
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        onClick={() => handleSaveLink("Link updated successfully")}
                        endIcon={<Save />}
                        disabled={
                          localLinks[index].title === "" ||
                          localLinks[index].url === "" ||
                          localLinks[index].description === ""
                        }
                      >
                        Save
                      </Button>
                    </Grid>
                    <Divider sx={{ width: "100%" }} />
                  </Grid>
                ) : (
                  <Grow in={true} timeout={700 + index * 300}>
                    <div>
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
                        <Tooltip title={link.description || ""}>
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
                        </Tooltip>
                      </Link>
                      {showEditIcons && (
                        <IconButton
                          aria-label={`Edit Link ${index + 1}`}
                          onClick={() => setEditLinkIndex(index)}
                        >
                          <Edit />
                        </IconButton>
                      )}
                    </div>
                  </Grow>
                )}
              </div>
            ))}
        </Box>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: "center",
        }}
      >
        {isAuthenticated && editMode && (
          <Grid
            container
            mt={1}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Grid item xs={12}>
              <Button
                variant="text"
                onClick={() => {
                  const newLink = {
                    title: "New Link # " + (localLinks.length + 1).toString(),
                    url: "www.example.com",
                    description: "This is a new link",
                  };
                  const newLinks = [...localLinks, newLink];
                  setLocalLinks(newLinks);
                  setEditLinkIndex(localLinks.length + 1);

                  handleSaveLink("Link added successfully");
                }}
                endIcon={<Add />}
              >
                Add Link
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="text"
                onClick={() => setShowEditIcons(!showEditIcons)}
              >
                {showEditIcons ? "Preview" : "Edit"}
              </Button>
            </Grid>
          </Grid>
        )}
      </CardActions>
    </Card>
  );
};

export default ProfileCard;
