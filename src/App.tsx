import { useAuth0 } from "@auth0/auth0-react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import ProfileCard from "./Components/ProfileCard";
import ResponsiveAppBar from "./Components/ResponsiveAppBar";
import { useUserContext } from "./Components/UserContext";

import "react-toastify/dist/ReactToastify.css";
import Typewriter from "./Components/Typewriter";

export const themeColor = "#75FBFA";

const App = () => {
  const { isAuthenticated, user } = useAuth0();
  const { userInformation, setUserInformation } = useUserContext(); // Use the UserContext
  const isMobile = window.innerWidth < 600;

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
        toast.error("Error getting user data");
      }
    }
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
          background: "linear-gradient(75deg, #75FBFA 0%, #000000 100%)",
        }}
      >
        {userInformation ? (
          <ProfileCard />
        ) : (
          <Typewriter
            text="SOLACE"
            delay={350}
            mainFontSize={isMobile ? "3rem" : "5rem"}
            subText="Inspired by LinkTree ©"
            subTextDelay={100}
            subFontSize={isMobile ? "1rem" : "1.5rem"}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default App;
