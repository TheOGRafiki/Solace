import Avatar from "@mui/material/Avatar";

interface ProfilePictureProps {
    imageUrl: string;
    name: string;
}

const ProfilePicture = ({ name }: ProfilePictureProps) => {
  const theme = {
    palette: {
      primary: {
        main: "#75FBFA",
        contrastText: "#ffffff",
      },
    },
    typography: {
      fontSize: 14,
    },
  };

  const avatarStyle = {
    width: theme.typography.fontSize * 5,
    height: theme.typography.fontSize * 5,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: theme.typography.fontSize * 2.5,
    boxShadow: `0px 0px 8px ${theme.palette.primary.main}`,
  };

  const nameStyle = {
    marginTop: theme.typography.fontSize,
    fontWeight: "bold",
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Avatar style={avatarStyle}>{name[0].toUpperCase()}</Avatar>
      <span style={nameStyle}>{name}</span>
    </div>
  );
};

export default ProfilePicture;
