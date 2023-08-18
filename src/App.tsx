import { useAuth0 } from "@auth0/auth0-react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import ProfileCard from "./Components/ProfileCard";
import ResponsiveAppBar from "./Components/ResponsiveAppBar";
import { useUserContext } from "./Components/UserContext";

  import "react-toastify/dist/ReactToastify.css";


export const themeColor = "#75FBFA";

const App = () => {
  const { isAuthenticated, user } = useAuth0();
  const [searchText, setSearchText] = useState(""); // The text in the search bar
  const [searchLoading, setSearchLoading] = useState(false); // Whether the search bar is loading or not

  const [searchError, setSearchError] = useState(false); // The error message for the search bar
  const { userInformation, setUserInformation } = useUserContext(); // Use the UserContext

  const syncAuth0ToMongo = async () => {
    try {
      // Wait 1 second to make sure the user information is set
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const body = {
        name: user?.given_name + " " + user?.family_name,
        email: user?.email,
        profile_picture: user?.picture,
        username: user?.nickname,
      };

      await axios.post(
        `https://us-east-1.aws.data.mongodb-api.com/app/data-tyxwp/endpoint/update_user?id=${user?.sub}`,
        body
      );
    } catch (error) {
      console.error("Error updating user data:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  const getUserData = async (username: string, tryCounter: number) => {
    setSearchLoading(true);
    try {
      const res = await axios.post(`
      https://us-east-1.aws.data.mongodb-api.com/app/data-tyxwp/endpoint/get_user?username=${username}
    `);

      setUserInformation(res.data);
    } catch (error) {
      await syncAuth0ToMongo();
      if (tryCounter < 3) {
        getUserData(username, tryCounter + 1);
      } else {
        setSearchError(true);
        toast.error("Error getting user data");
      }
    }
    setSearchLoading(false);
  };

  // Check if any user is in the url path
  useEffect(() => {
    // Use URL Search Params to get the username from the url
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");

    // If there is a username in the url, get the user data
    if (username) {
      getUserData(username, 0);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      syncAuth0ToMongo();
    }
  }, [isAuthenticated, user]);

  const theme = createTheme({
    typography: {
      fontFamily: "Raleway, sans-serif",
    },
    palette: {
      mode: "dark",
      background: {
        default: "#393939",
      },
      primary: {
        main: themeColor,
      },
      secondary: {
        main: "#00ff00",
      },
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setSearchError(false);
    }, 3000);
  }, [searchError]);

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <ResponsiveAppBar />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          backgroundColor: "black",
        }}
      >
        {userInformation ? (
          <ProfileCard />
        ) : (
          <Grid
            container
            sx={{
              justifyContent: "center", // Center the content horizontally
              alignItems: "center",
              width: "100%",
            }}
          >
            <Grid item xs={8} md={6} lg={7}>
              <TextField
                label="Search"
                variant="standard"
                fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* If the search bar is loading, show a loading icon, otherwise show the search icon */}
              {searchLoading ? (
                <CircularProgress />
              ) : (
                <IconButton
                  sx={{
                    display: "flex", // Display as flex container
                    justifyContent: "center", // Center the content horizontally
                    borderRadius: "1rem",
                  }}
                  onClick={() => {
                    // Handle the search action here
                    window.location.href = `/?username=${searchText}`;
                  }}
                  disabled={searchText === ""}
                >
                  <SearchIcon sx={{ color: searchError ? "red" : "white" }} />
                </IconButton>
              )}
            </Grid>
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default App;
