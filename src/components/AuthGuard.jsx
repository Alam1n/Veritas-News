// AuthGuard.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://alaminapi.pythonanywhere.com/me", {
      method: "GET",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => {
        if (!data.user) navigate("/login");
        else setLoading(false);
      })
      .catch(() => navigate("/login"));
  }, []);

  if (loading) return <p>Checking session...</p>;
  return children;
}
