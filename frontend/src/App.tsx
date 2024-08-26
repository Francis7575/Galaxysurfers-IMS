import { useEffect } from 'react';
import { Login, Home, Layout } from './components'
import { useAuth } from './hooks/useAuth'
import { Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const App = () => {
  const { handleLogin, loggedIn, loading } = useAuth();
  const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !loggedIn) {
        navigate("/");
      }
    }, [loggedIn, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Routes>
      <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />

      <Route element={<Layout />} >
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App