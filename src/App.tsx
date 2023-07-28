import { Box, ThemeProvider, createTheme } from "@mui/material";
import ResponsiveAppBar from "./Components/ResponsiveAppBar";
import { useEffect, useState } from "react";
import SearchBar from "./Components/SearchBar";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export const themeColor = "#75FBFA";

const App = () => {
  const { isAuthenticated, user, logout } = useAuth0();
  const [username, setUsername] = useState<string | null>(null);
  const [userInformation, setUserInformation] = useState<any>(null);
  // * try to get a username from the url
  // * if there is a url we can go ahead and get the user information otherwise show a search bar

  const getUserData = async (username: string) => {
    const res = await axios.post(`
      https://us-east-1.aws.data.mongodb-api.com/app/data-tyxwp/endpoint/get_user?username=${username}
    `);
    setUserInformation(res.data.user);
  };

  const updateBackendData = async () => {
    const res = await axios.post(
      `
      https://us-east-1.aws.data.mongodb-api.com/app/data-tyxwp/endpoint/update_user?userId=${user?.sub}
    `,
      {
        profilePicture: user?.picture,
        firstName: user?.given_name,
        lastName: user?.family_name,
      }
    );
    setUserInformation(res.data.user);
  };

  useEffect(() => {
    const username = new URLSearchParams(window.location.search).get(
      "username"
    );
    setUsername(username);
  }, [window.location]);

  useEffect(() => {
    if (isAuthenticated && user) {
      updateBackendData();
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
        {username ? <h1>{username}</h1> : <SearchBar />}
      </Box>
    </ThemeProvider>
  );
};

export default App;
