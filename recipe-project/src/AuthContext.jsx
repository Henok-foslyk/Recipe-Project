// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Load from localStorage if available
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  const signIn = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5050/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const user = await response.json();
      setCurrentUser(user);
      console.log("USER LOG: " + user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ currentUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
