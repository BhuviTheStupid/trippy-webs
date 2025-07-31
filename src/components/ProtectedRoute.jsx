// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setAuthenticated(true);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading) return null; // or loading spinner

  return authenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
