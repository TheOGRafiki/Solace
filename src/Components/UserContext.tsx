import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  // Define your user properties here
  bio: string;
  name: string;
  email: string;
  links: Link[];
  profile_picture: string;
  username: string;
  // Add other user properties as needed
}

interface Link {
    title: string
    url: string
    description: string
}

interface UserContextValue {
  userInformation: User | null;
  setUserInformation: (user: User | null) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export const useUserContext = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [userInformation, setUserInformation] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ userInformation, setUserInformation }}>
      {children}
    </UserContext.Provider>
  );
};
