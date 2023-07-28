import { Box, ThemeProvider, createTheme } from "@mui/material";
import ResponsiveAppBar from "./Components/ResponsiveAppBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "./Components/UserContext";
import ProfileCard from "./Components/ProfileCard";

export const themeColor = "#75FBFA";

const App = () => {
  const { isAuthenticated, user } = useAuth0();
  const [username, setUsername] = useState<string | null>(null);
  const { userInformation, setUserInformation } = useUserContext(); // Use the UserContext
  // * try to get a username from the url
  // * if there is a url we can go ahead and get the user information otherwise show a search bar

  const getUserData = async (username: string) => {
    const res = await axios.post(`
      https://us-east-1.aws.data.mongodb-api.com/app/data-tyxwp/endpoint/get_user?username=${username}
    `);
    setUserInformation(res.data);
  };

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

    const response = await axios.post(
      `https://us-east-1.aws.data.mongodb-api.com/app/data-tyxwp/endpoint/update_user?id=${user?.sub}`,
      body
    );

    console.log("User data updated:", response.data);
  } catch (error) {
    console.error("Error updating user data:", error);
    // Handle the error appropriately (e.g., show an error message to the user)
  }
};


  useEffect(() => {
    const username = window.location.href.split("/")[window.location.href.split("/").length - 1].replace("@", "")
    setUsername(username);
  }, [window.location]);

  useEffect(() => {
    if (isAuthenticated && user) {
      syncAuth0ToMongo();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (username) {
      getUserData(username);
    }
  }, [username]);

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

  return (
    <ThemeProvider theme={theme}>
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
        {userInformation && <ProfileCard />}
      </Box>
    </ThemeProvider>
  );
};

export default App;
