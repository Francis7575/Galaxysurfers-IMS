import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  User,
  Warehouse,
  Book,
  Boxes,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import OpenMenu from "/assets/open-menu.svg";
import CloseMenu from "/assets/close-menu.svg";
import { SubMenuItem } from "../../types/types";
import LoadingIcon from "/assets/icon-loading.gif";

export const userLocations = [
  "/userMain",
  "/createuser",
  "/edituser",
  "/user-permissions",
];
export const warehousesLocations = [
  "/warehouseMain",
  "/createwarehouse",
  "/editwarehouse",
  "/locations",
];
export const itemsLocations = ["/itemMain", "/addItem", "/editItem"];
export const inventoryLocations = [
  "/inventoryMain",
  "/inventory",
  "/inventory-in",
  "/inventory-out",
];

const icons = [
  { link: "/userMain", icon: <User />, relatedPaths: userLocations },
  {
    link: "/warehouseMain",
    icon: <Warehouse />,
    relatedPaths: warehousesLocations,
  },
  { link: "/itemMain", icon: <Book />, relatedPaths: itemsLocations },
  { link: "/inventoryMain", icon: <Boxes />, relatedPaths: inventoryLocations },
];

const Navbar = () => {
  const { userId, handleLogout } = useAuth();
  const [menus, setMenus] = useState<SubMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpened((prev) => !prev);
  const closeMenu = () => setIsMenuOpened(false);

  // This will force the rendering of the fetched menu items before the browser paints
  useEffect(() => {
    if (userId) {
      const fetchItems = async () => {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_REACT_BACKEND_URL
            }/users/get-access-menus?userId=${userId}&responseType=allowed`
          );
          const data = await response.json();
          if (data.length > 0) {
            setMenus(data[0].subMenus);
          }
        } catch (error) {
          console.error("Failed to fetch menu data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchItems();
    }
  }, [userId, menus]);

  const isActiveRoute = (path: string, relatedPaths: string[]) => {
    return relatedPaths.includes(path);
  };

  const getIconComponent = (item: SubMenuItem) => {
    const iconConfig = icons.find((icon) => icon.link === item.link_mm2);
    return iconConfig
      ? React.cloneElement(iconConfig.icon, { className: "w-4" })
      : null;
  };

  const renderMenuItems = () => {
    return menus.map((item) => {
      const iconComponent = getIconComponent(item);
      const isActive = isActiveRoute(
        location.pathname,
        icons.find((icon) => icon.link === item.link_mm2)?.relatedPaths || []
      );
      return (
        <Link
          key={item.idmm2}
          to={item.link_mm2}
          onClick={closeMenu}
          className={`hover:opacity-60 justify-center flex items-center gap-2 ${
            isActive ? "bg-active" : ""
          }`}
        >
          {iconComponent}
          <span className="text-[.85rem]">{item.name_mm2}</span>
        </Link>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="text-[1em] flex flex-col justify-center items-center min-h-screen">
        <p className="mb-10">Loading, please wait...</p>
        <img src={LoadingIcon} alt="Loading..." className="w-[50px]" />
      </div>
    );
  }

  return (
    <div className="font-manrope border-b border-lightgray flex justify-between 930:bg-sixth-lightblue 930:min-h-screen px-[12px] md:px-[55px] py-[19px] 930:pl-0 930:px-0 930:py-0 md:py-[27px] w-full 930:max-w-[270px]">
      <nav className="z-20 930:z-0 fixed top-[25px] right-[15px] 930:static 930:max-w-[270px] 930:w-full ">
        <div
          className={`pt-8 930:pt-12 pl-[30px] 930:pl-0  930:static fixed bg-sixth-lightblue 930:bg-none 930:w-full right-0 top-0 z-10 bottom-0 w-[75%] sm:w-[30%]  transition-transform duration-300 ease-in-out 930:transform-none
					${isMenuOpened ? "translate-x-0" : "translate-x-full"}`}
        >
          <h2 className="mb-[1.5rem] text-[.75rem] text-gray font-medium uppercase 930:pl-12">
            General
          </h2>
          <div className="flex flex-col items-center gap-3 930:gap-5 w-full pr-4 930:pr-0">
            <Link
              onClick={closeMenu}
              to="/home"
              className={`flex items-center gap-[8px] justify-center hover:opacity-60
              ${location.pathname === "/home" ? "bg-active" : ""}`}
            >
              <LayoutDashboard className="w-4" />
              <span className="text-[.85rem] ">Dashboard</span>
            </Link>
            {renderMenuItems()}
          </div>
          <div className="mt-[50px] 930:pl-12">
            <h2 className="text-[.75rem] text-gray font-medium uppercase my-4">
              Support
            </h2>
            <button
              onClick={handleLogout}
              className="flex items-center gap-[8px] pl-4 hover:opacity-60"
            >
              <LogOut className="w-4" />
              <span className="text-[.85rem]">Log Out</span>
            </button>
          </div>
        </div>
        <button onClick={toggleMenu}>
          <img
            src={isMenuOpened ? CloseMenu : OpenMenu}
            alt="Menu Icon"
            className={`transition-all 930:hidden z-50 relative ${
              isMenuOpened ? "w-[1.2rem] " : "w-[2rem] "
            }`}
          />
        </button>
      </nav>
      {isMenuOpened && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
