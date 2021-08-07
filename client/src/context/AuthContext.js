//  ReactJS components
import React, { useEffect, useState } from "react";

// Local ReactJS components
import app from "../firebase/firebase";
import Loading from "../components/Loading";

export const AuthContext = React.createContext({ currentUser: null });

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  if (pending) {
    return <Loading />;
  } else {
    return (
      <AuthContext.Provider value={{ currentUser: currentUser }}>
        {children}
      </AuthContext.Provider>
    );
  }
};
