import OpenMenu from '/assets/open-menu.svg';
import CloseMenu from '/assets/close-menu.svg';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from '../../hooks/useAuth';
import { icons } from "./Navbar"
import { SubMenuItem } from '../../types/types';

const Header = () => {
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
  const [menus, setMenus] = useState<SubMenuItem[]>([]);
  const { userId, handleLogout } = useAuth()

  const handleToggleMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  const handleCloseMenu = () => {
    setIsMenuOpened(false);
  }

  const isActiveRoute = (path: string, relatedPaths: string[]) => {
    return relatedPaths.includes(path);
  };

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

  return (
    <header className='font-manrope border-b border-lightgray flex justify-between items-center px-[12px] md:px-[55px] py-[19px] md:py-[27px] lg:px-0 lg:pl-[71px]'>
      <Link to="/"
        className='text-[1.5rem] 930:hidden'>
        Galaxy<span className='text-blue font-medium'>Surfers</span>
      </Link>
      <p className='text-[1.5rem] font-medium leading-[150%] hidden 930:block'>
        Galaxy<span className='text-second-blue'>Surfers</span> Inventory Management
      </p>
      <nav className='930:hidden z-20'>
        <div className={`pt-[2rem] pl-[30px] fixed min-h-screen right-0 top-0 z-10 bottom-0 w-[75%] bg-white transition-transform duration-300 ease-in-out 930:transform-none
					${isMenuOpened ? 'translate-x-0' : 'translate-x-full 930:hidden'}`}>
          <h2 className='mb-[1.5rem] text-[.75rem] text-gray font-medium uppercase'>General</h2>
          <div className='flex flex-col gap-3 max-w-[150px]'>
            <Link onClick={handleCloseMenu}
              to="/home" className={`flex items-center gap-[8px] justify-center 
              ${location.pathname === '/home' ? 'bg-active' : ''}`}>
              <LayoutDashboard className='w-4' />
              <span>Dashboard</span>
            </Link>
            {menus.map((item) => {
              const iconResult = icons.find(icon => icon.link == item.link_mm2)

              const IconComponent = iconResult
                ? React.cloneElement(iconResult.icon, { className: 'w-4' })
                : null;

              const isActive = isActiveRoute(location.pathname, iconResult?.relatedPaths || []);

              return (
                <div key={item.idmm2}>
                  <div className="cursor-pointer flex flex-col gap-4">
                    <Link onClick={handleCloseMenu}
                      key={item.idmm2} to={item.link_mm2} className={`flex justify-center items-center gap-[8px] ${isActive ? 'bg-active' : ''}`}>
                      {IconComponent}
                      <span>{item.name_mm2}</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
          <h2 className='text-[.75rem] text-gray font-medium uppercase my-4'>Support</h2>
          <button onClick={handleLogout}
            className='flex items-center gap-[8px] pl-4'>
            <LogOut className='w-4' />
            <span>Log Out</span>
          </button>
        </div>
        <button onClick={handleToggleMenu}>
          <img src={isMenuOpened ? CloseMenu : OpenMenu} alt="Menu Icon" className={`transition-all z-50 relative ${isMenuOpened ? 'w-[1.2rem] ' : 'w-[2rem] '}`} />
        </button>
      </nav>
      {isMenuOpened && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={handleToggleMenu}></div>
      )}
    </header>
  );
};

export default Header;
