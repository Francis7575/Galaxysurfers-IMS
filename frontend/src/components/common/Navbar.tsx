import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Warehouse, Book, Boxes } from "lucide-react";
import { useAuth } from '../../hooks/useAuth';
import OpenMenu from '/assets/open-menu.svg';
import CloseMenu from '/assets/close-menu.svg';
import { SubMenuItem } from '../../types/types';

export const userLocations = ["/userMain", "/createuser", "/edituser", "/user-permissions"]
export const warehousesLocations = ["/warehouseMain", "/createwarehouse", "/editwarehouse", "/locations"]
export const itemsLocations = ["/itemMain", "/addItem", "/editItem"]
export const inventoryLocations = ["/inventoryMain", "/inventory", "/inventory-in", "/inventory-out"]

const icons = [
  { link: '/userMain', icon: <User />, relatedPaths: userLocations },
  { link: '/warehouseMain', icon: <Warehouse />, relatedPaths: warehousesLocations },
  { link: '/itemMain', icon: <Book />, relatedPaths: itemsLocations },
  { link: '/inventoryMain', icon: <Boxes />, relatedPaths: inventoryLocations },
];

const Navbar = () => {
  const { userId, handleLogout } = useAuth();
  const [menus, setMenus] = useState<SubMenuItem[]>([]);
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpened(prev => !prev);
  const closeMenu = () => setIsMenuOpened(false);

  useEffect(() => {
    console.log("User ID in Navbar:", userId);
    if (userId) {
      const fetchItems = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/users/get-access-menus?userId=${userId}&responseType=allowed`);
          const data = await response.json();
          console.log("Fetched menu data:", data);  // Check this log in production
          if (data.length > 0) {
            setMenus(data[0].subMenus);
            console.log("Updated menus state:", menus);
          }
        } catch (error) {
          console.error("Failed to fetch menu data:", error);  // Log any error
        }
      };
      fetchItems();
    }
  }, [userId]);

  useEffect(() => {
    console.log("Updated menus state:", menus);
  }, [menus]);

  const isActiveRoute = (path: string, relatedPaths: string[]) => {
    return relatedPaths.includes(path);
  };

  const getIconComponent = (item: SubMenuItem) => {
    const iconConfig = icons.find(icon => icon.link === item.link_mm2);
    return iconConfig ? React.cloneElement(iconConfig.icon, { className: 'w-4' }) : null;
  };

  const renderMenuItems = () => {
    console.log('Menus:', menus);
    return menus.map((item) => {
      const iconComponent = getIconComponent(item);
      const isActive = isActiveRoute(location.pathname, icons.find(icon => icon.link === item.link_mm2)?.relatedPaths || []);
      return (
        <Link key={item.idmm2} to={item.link_mm2} onClick={closeMenu} className={`flex items-center gap-2 ${isActive ? 'bg-active' : ''}`}>
          {iconComponent}
          <span>{item.name_mm2}</span>
        </Link>
      );
    });
  }
  return (
    <>
      {/* {desktop navbar} */}
      <nav className="bg-lightblue hidden w-full 930:block max-w-[225px] lg:max-w-[250px] xl:max-w-[272px] min-h-screen">
        <div className="flex flex-col items-center">
          <div className="mb-8 pt-8 w-full max-w-[130px]">
            <h2 className='text-[.75rem] text-gray font-medium uppercase mb-4'>General</h2>
            <div className='flex flex-col gap-[1rem]'>
              <Link
                to="/home"
                className={`hover:opacity-70 flex items-center gap-[8px] justify-start ${location.pathname === '/home' ? 'bg-active' : ''}
                }`}
              >
                <LayoutDashboard className='w-4' />
                <p className='text-[.85rem]'>Dashboard</p>
              </Link>
              {renderMenuItems()}
              <h2 className='text-[.75rem] text-gray font-medium uppercase mb-4'>Support</h2>
              <button onClick={handleLogout}
                className='flex items-center gap-[8px] hover:opacity-50'>
                <LogOut className='w-4' />
                <span className='text-[.85rem]'>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* {mobile navbar} */}
      <div className='930:hidden font-manrope border-b border-lightgray flex justify-between items-center px-[12px] md:px-[55px] py-[19px] md:py-[27px] lg:px-0 lg:pl-[71px]'>
        <nav className='z-20'>
          <div className={`pt-[2rem] pl-[30px] fixed min-h-screen right-0 top-0 z-10 bottom-0 w-[75%] bg-lightblue transition-transform duration-300 ease-in-out 930:transform-none
					${isMenuOpened ? 'translate-x-0' : 'translate-x-full 930:hidden'}`}>
            <h2 className='mb-[1.5rem] text-[.75rem] text-gray font-medium uppercase'>General</h2>
            <div className='flex flex-col gap-3 max-w-[150px]'>
              <Link onClick={closeMenu}
                to="/home" className={`flex items-center gap-[8px] justify-center 
              ${location.pathname === '/home' ? 'bg-active' : ''}`}>
                <LayoutDashboard className='w-4' />
                <span>Dashboard</span>
              </Link>
              {renderMenuItems()}
            </div>
            <h2 className='text-[.75rem] text-gray font-medium uppercase my-4'>Support</h2>
            <button onClick={handleLogout}
              className='flex items-center gap-[8px] pl-4'>
              <LogOut className='w-4' />
              <span>Log Out</span>
            </button>
          </div>
          <button onClick={toggleMenu}>
            <img src={isMenuOpened ? CloseMenu : OpenMenu} alt="Menu Icon" className={`transition-all z-50 relative ${isMenuOpened ? 'w-[1.2rem] ' : 'w-[2rem] '}`} />
          </button>
        </nav>
        {isMenuOpened && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={toggleMenu}></div>
        )}
      </div>
    </>
  );
};

export default Navbar;
