import { lazy } from "react";
import { IRouterType } from "../types/types";
import { createBrowserRouter } from "react-router-dom";

const Login = lazy(() => import("../pages/Login"));
const Layout = lazy(() => import("../components/Layout"));
const MainLayout = lazy(() => import("../components/MainLayout"));
const Home = lazy(() => import("@/pages/home/Home"));
const CreateUser = lazy(() => import("../pages/user/components/CreateUser"));
const EditUser = lazy(() => import("@/pages/user/components/EditUser"));
const UserPermissions = lazy(
  () => import("../pages/user/components/UserPermissions")
);
const WarehouseMain = lazy(() => import("@/pages/warehouse/WarehouseMain"));
const CreateWarehouse = lazy(
  () => import("@/pages/warehouse/components/CreateWarehouse")
);
const EditWarehouse = lazy(
  () => import("@/pages/warehouse/components/EditWarehouse")
);
const ItemMain = lazy(() => import("../pages/item/ItemMain"));
const AddItem = lazy(() => import("@/pages/item/components/AddItem"));
const EditItem = lazy(() => import("@/pages/item/components/EditItem"));
const InventoryMain = lazy(() => import("../pages/InventoryMain"));
const Inventory = lazy(() => import("../pages/inventory/Inventory"));
const InventoryIn = lazy(() => import("@/pages/inventory/InventoryIn"));
const InventoryOut = lazy(() => import("@/pages/inventory/InventoryOut"));
const ThreeJs = lazy(() => import("../pages/warehouse/components/Threejs"));
const ThreeJsTwo = lazy(() => import("../pages/warehouse/components/ThreejsTwo"));

const routes: IRouterType[] = [
  {
    title: "Login",
    path: "/",
    element: <Login />,
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
        title: "MainLayout",
        path: "/user",
        element: <MainLayout />,
        children: [
          {
            title: "CreateUser",
            path: "create",
            element: <CreateUser />,
          },
          {
            title: "EditUser",
            path: "edit",
            element: <EditUser />,
          },
          {
            title: "UserPermissions",
            path: "permissions",
            element: <UserPermissions />,
          },
        ],
      },
      {
        title: "MainLayout",
        path: "/warehouse",
        element: <MainLayout />,
        children: [
          {
            title: "CreateWarehouse",
            path: "create",
            element: <CreateWarehouse />,
          },
          {
            title: "EditWarehouse",
            path: "edit",
            element: <EditWarehouse />,
          },
        ],
      },
      {
        title: "MainLayout",
        path: "/item",
        element: <MainLayout />,
        children: [
          {
            title: "AddItem",
            path: "add",
            element: <AddItem />,
          },
          {
            title: "EditItem",
            path: "edit",
            element: <EditItem />,
          },
        ],
      },
      {
        title: "InventoryMain",
        path: "/inventoryMain",
        element: <InventoryMain />,
      },
      {
        title: "Inventory",
        path: "/inventory",
        element: <Inventory />,
      },
      {
        title: "InventoryIn",
        path: "/inventory-in",
        element: <InventoryIn />,
      },
      {
        title: "InventoryOut",
        path: "/inventory-out",
        element: <InventoryOut />,
      },
      {
        title: "ThreeJs",
        path: "/locations",
        element: <ThreeJs />,
      },
      {
        title: "ThreeJsTwo",
        path: "/locations2",
        element: <ThreeJsTwo />,
      },
    ],
  },
];

export const PAGE_DATA: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(routes);
