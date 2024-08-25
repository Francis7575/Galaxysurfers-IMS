import { Login, Home } from './components'
import { useAuth } from './hooks/useAuth'
import { Routes, Route } from "react-router-dom";

const App = () => {
  const { handleLogin, loading } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/home" element={ <Home /> } />

    </Routes>
  )
}

export default App