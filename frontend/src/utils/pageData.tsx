import { lazy } from "react";
import { IRouterType } from '../types/types';
import { useAuth } from '../hooks/useAuth'

const Login = lazy(() => import("../pages/Login"));
const Layout = lazy(() => import("../components/Layout"));
const Home = lazy(() => import("../pages/Home"));
const UserMain = lazy(() => import("../pages/UserMain"));
const CreateUser = lazy(() => import("../components/user-crud/CreateUser"));
const EditUser = lazy(() => import("../components/user-crud/EditUser"));
const UserPermissions = lazy(() => import("../components/userpermissions/UserPermissions"));
const WarehouseMain = lazy(() => import("../pages/WarehouseMain"));
const CreateWarehouse = lazy(() => import("../components/warehouses-crud/CreateWarehouse"));
const EditWarehouse = lazy(() => import("../components/warehouses-crud/EditWarehouse"));
const ItemMain = lazy(() => import("../pages/ItemMain"));
const AddItem = lazy(() => import("../components/items/AddItem"));
const EditItem = lazy(() => import("../components/items/EditItem"));
const InventoryMain = lazy(() => import("../pages/InventoryMain"));
const Inventory = lazy(() => import("../components/inventory/Inventory"));
const InventoryIn = lazy(() => import("../components/inventory/InventoryIn"));
const InventoryOut = lazy(() => import("../components/inventory/InventoryOut"));
const ThreeJs = lazy(() => import("../components/drags/Threejs"));
const ThreeJsTwo = lazy(() => import("../components/drags/ThreejsTwo"));

const { handleLogin } = useAuth();

export const PAGE_DATA: IRouterType[] = [
  {
    title: "Login",
    path: "/",
    element: <Login onLogin={handleLogin} />,
  },
  {
    title: "Layout",
    element: <Layout />,
    children: [
      {
        title: "Home",
        path: "/home",
        element: <Home />,
      },
      {
        title: 'UserMain',
        path: "/userMain",
        element: <UserMain />
      },
      {
        title: 'CreateUser',
        path: "/createuser",
        element: <CreateUser />
      },
      {
        title: 'EditUser',
        path: "/edituser",
        element: <EditUser />
      },
      {
        title: 'UserPermissions',
        path: "/user-permissions",
        element: <UserPermissions />
      },
      {
        title: 'WarehouseMain',
        path: "/warehouseMain",
        element: <WarehouseMain />
      },
      {
        title: 'CreateWarehouse',
        path: "/createwarehouse",
        element: <CreateWarehouse />
      },
      {
        title: 'EditWarehouse',
        path: "/editwarehouse",
        element: <EditWarehouse />
      },
      {
        title: 'ItemMain',
        path: "/itemMain",
        element: <ItemMain />
      },
      {
        title: 'AddItem',
        path: "/addItem",
        element: <AddItem />
      },
      {
        title: 'EditItem',
        path: "/editItem",
        element: <EditItem />
      },
      {
        title: 'InventoryMain',
        path: "/inventoryMain",
        element: <InventoryMain />
      },
      {
        title: 'Inventory',
        path: "/inventory",
        element: <Inventory />
      },
      {
        title: 'InventoryIn',
        path: "/inventory-in",
        element: <InventoryIn />
      },
      {
        title: 'InventoryOut',
        path: "/inventory-out",
        element: <InventoryOut />
      },
      {
        title: 'ThreeJs',
        path: "/locations",
        element: <ThreeJs />
      },
      {
        title: 'ThreeJsTwo',
        path: "/locations2",
        element: <ThreeJsTwo />
      },
    ],
  },
];
