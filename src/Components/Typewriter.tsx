import { Box, Fade, Grow, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  delay: number;
  mainFontSize: string;
  subText: string;
  subTextDelay: number;
  subFontSize: string;
}

const Typewriter = ({
  text,
  delay,
  mainFontSize,
  subText,
  subTextDelay,
  subFontSize
}: TypewriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [displaySubText, setDisplaySubText] = useState("");
  const [currentSubIndex, setCurrentSubIndex] = useState(0);

  const [mainTextTyped, setMainTextTyped] = useState(false);

  useEffect(() => {
    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        setMainTextTyped(true);
      }
    };

    const typingInterval = setInterval(typeNextCharacter, delay);

    return () => clearInterval(typingInterval);
  }, [text, delay, currentIndex]);

  useEffect(() => {
    if (mainTextTyped) {
      const typeNextSubCharacter = () => {
        if (currentSubIndex < subText.length) {
          setDisplaySubText((prevText) => prevText + subText[currentSubIndex]);
          setCurrentSubIndex((prevIndex) => prevIndex + 1);
        }
      };

      if (subText && subTextDelay) {
        const subTextInterval = setInterval(typeNextSubCharacter, subTextDelay);

        return () => clearInterval(subTextInterval);
      }
    }
  }, [subText, subTextDelay, currentSubIndex, mainTextTyped]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
        width: "100%",
        color: "white",
        // * Linear gradient from 75FBFA to black
      }}
    >
      <Box sx={{ display: "flex" }}>
        {displayText.split("").map((char, index) => (
          <Grow in={true} timeout={delay * index} key={index}>
            <Typography
              key={index}
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                fontWeight: 700,
                letterSpacing: ".1rem",
                textDecoration: "none",
                fontSize:mainFontSize
              }}
            >
              {char}
            </Typography>
          </Grow>
        ))}
      </Box>
      <Box sx={{ display: "flex" }}>
        {subText && (
          <Fade in={mainTextTyped} timeout={subTextDelay * subText.length}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: ".1rem",
                textDecoration: "none",
                fontSize: subFontSize,
                marginTop: "16px", // Add some space between text and subtext
              }}
              color={"primary"}
            >
              {displaySubText}
            </Typography>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default Typewriter;
