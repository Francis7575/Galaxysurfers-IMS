import { Login, Home, Layout } from './components'
import { useAuth } from './hooks/useAuth'
import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  const { handleLogin, loggedIn } = useAuth();
  return (
    <Routes>
      <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />

      <Route element={<Layout />} >
        <Route path="/home" element={loggedIn ? <Home /> : <Navigate to="/" />} />
      </Route>
    </Routes>
  )
}

export default App