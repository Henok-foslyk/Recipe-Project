// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Load from localStorage if available
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });
  const hasFetchedRef = useRef(false);

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
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    hasFetchedRef.current = false;
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser?.id || hasFetchedRef.current) return;

      try {
        const res = await axios.get(`http://localhost:5050/users/redundant/${currentUser.id}`);
        setCurrentUser(res.data);
        hasFetchedRef.current = true; // block future fetches
      } catch (err) {
        console.error('Failed to fetch full user data:', err);
      }
    };

    fetchUser();
  }, [currentUser?.id]);

  return (
    <AuthContext.Provider value={{ currentUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
