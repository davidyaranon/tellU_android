import React from "react";

type Props = {
  children: React.ReactNode;
}

/* Tabs and Dark mode Context */
export type ContextType = {
  showTabs: boolean;
  setShowTabs: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  sensitivityToggled: boolean;
  schoolName: string;
  mapTilerId: string;
  setMapTilerId: React.Dispatch<React.SetStateAction<string>>;
  setSchoolName: React.Dispatch<React.SetStateAction<string>>;
  setSensitivityToggled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Context = React.createContext<ContextType | null>(null);
export const ContextProvider = ({ children }: Props) => {
  const [showTabs, setShowTabs] = React.useState<boolean>(false);
  const [darkMode, setDarkMode] = React.useState<boolean>(false);
  const [schoolName, setSchoolName] = React.useState<string>('');
  const [mapTilerId, setMapTilerId] = React.useState<string>('streets');
  const [sensitivityToggled, setSensitivityToggled] = React.useState<boolean>(false);

  const memoizedContextValue = React.useMemo(() => ({
    showTabs, setShowTabs, darkMode, setDarkMode, schoolName, setSchoolName, mapTilerId, setMapTilerId, sensitivityToggled, setSensitivityToggled
  }), [showTabs, setShowTabs, darkMode, setDarkMode, schoolName, setSchoolName, mapTilerId, setMapTilerId, sensitivityToggled, setSensitivityToggled]);

  return (
    <Context.Provider value={memoizedContextValue}> {children} </Context.Provider>
  )
};

export const useAppContext = () => {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error("App context is not available");
  }
  return context;
}


// /* User Info Context */
// export type UserContextType = {
//   schoolName : string | null;
//   setSchoolName : React.Dispatch<React.SetStateAction<string | null>>;
// }

// export const UserContext = React.createContext<UserContextType | null>(null);
// export const UserContextProvider = ({ children } : Props) => {
//   const [schoolName, setSchoolName] = React.useState<string | null>(null);

//   const memoizedUserContextValue = React.useMemo(() => ({
//     schoolName, setSchoolName
//   }), [schoolName, setSchoolName]);

//   return (
//     <UserContext.Provider value={memoizedUserContextValue}> { children } </UserContext.Provider>
//   )
// }

// export const useUserContext = () => {
//   const context = React.useContext(UserContext);
//   if(!context) {
//     throw new Error("User context error");
//   }
//   return context;
// }
