import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Use the backend URL from the environment variable
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
        } catch (error) {
          console.error("Error fetching user:", error);
          localStorage.removeItem("token");
        }
      }
    };

    fetchUser();
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
