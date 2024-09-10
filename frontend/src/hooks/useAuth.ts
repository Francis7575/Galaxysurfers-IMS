import { useState, useEffect } from "react";
import { LoginForm } from "../types/types";

const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUserCookie = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/users/check-logged-in`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setLoggedIn(data.loggedIn);
          setUsername(data.username);
          setUserId(data.userId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkUserCookie();
  }, []);

  const handleLogin = async (formData: LoginForm) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/users/login`, { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setLoggedIn(data.loggedIn);
        setUsername(data.username);
        setUserId(data.userId);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URLL}/users/logout`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      setUsername("");
      setUserId(0);
      setLoggedIn(false);
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };

  return { loggedIn, handleLogin, handleLogout, userId, username, loading };
};

export { useAuth };
