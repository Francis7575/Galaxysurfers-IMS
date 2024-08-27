import { useEffect } from 'react';
import { Login, Home, Layout, AddUser, CreateUser, EditUser, UserPermissions } from './components'
import { useAuth } from './hooks/useAuth'
import { Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />

        <Route element={<Layout />} >
          <Route path="/home" element={<Home />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/edituser" element={<EditUser />} />
          <Route path="/user-permissions" element={<UserPermissions />} />
        </Route>
      </Routes>
    </>
  )
}

export default App