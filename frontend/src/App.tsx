import { useEffect } from 'react';
import {
  Login, Home, Layout, UserMain, CreateUser, EditUser, UserPermissions, WarehouseMain, CreateWarehouse, EditWarehouse,
  Threejs, ItemMain, AddItem, EditItem, InventoryMain, InventoryMenu, ThreejsTwo
} from './components'
import { useAuth } from './hooks/useAuth'
import { Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { handleLogin, loggedIn, loading } = useAuth();
  const navigate = useNavigate();

  // Redirects to the login page if the user is not logged in and loading is complete.
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

          <Route path="/userMain" element={<UserMain />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/edituser" element={<EditUser />} />
          <Route path="/user-permissions" element={<UserPermissions />} />

          <Route path="/warehouseMain" element={<WarehouseMain />} />
          <Route path="/createwarehouse" element={<CreateWarehouse />} />
          <Route path="/editwarehouse" element={<EditWarehouse />} />

          <Route path="/itemMain" element={<ItemMain />} />
          <Route path="/addItem" element={<AddItem />} />
          <Route path="/editItem" element={<EditItem />} />

          <Route path="/inventoryMain" element={<InventoryMain />} />
          <Route path="/inventoryMenu" element={<InventoryMenu />} />

          <Route path="/locations" element={<Threejs />} />
          <Route path="/locations2" element={<ThreejsTwo />} />
        </Route>
      </Routes>
    </>
  )
}

export default App