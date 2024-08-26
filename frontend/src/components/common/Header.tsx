import OpenMenu from '/assets/open-menu.svg';
import CloseMenu from '/assets/close-menu.svg';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Warehouse, Book, Boxes } from "lucide-react";

interface SubMenuItem {
  idmm2: number;
  idmm_mm2: number;
  name_mm2: string;
  link_mm2: string;
  order_mm2: number;
  access_menu: number;
}

const Header = () => {
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
  const [menus, setMenus] = useState<SubMenuItem[]>([]);

  const handleToggleMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  const icons = [
    {
      link: '/adduser',
      icon: <User />
    },
    {
      link: '/addwarehouse',
      icon: <Warehouse />
    },
    {
      link: '/additem',
      icon: <Book />
    },
    {
      link: '/inventoryMain',
      icon: <Boxes />
    },
  ]

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/get-access-menus?responseType=allowed`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.length > 0) {
        setMenus(data[0].subMenus);
      }
    }
    fetchItems();
  }, []);

  return (
    <header className='font-manrope border-b border-lightgray flex justify-between items-center px-[12px] md:px-[55px] py-[19px] md:py-[27px] lg:px-0 lg:pl-[71px]'>
      <p className='text-[1.5rem] 930:hidden'>
        Galaxy<span className='text-blue font-medium'>Surfers</span>
      </p>
      <p className='text-[1.5rem] font-medium leading-[150%] hidden 930:block'>
        Galaxy<span className='text-second-blue'>Surfers</span> Inventory Management
      </p>
      <nav className='930:hidden z-20'>
        <div className={`pt-[2rem] pl-[30px] fixed min-h-screen right-0 top-0 z-10 bottom-0 w-[75%] bg-white transition-transform duration-300 ease-in-out 930:transform-none
					${isMenuOpened ? 'translate-x-0' : 'translate-x-full 930:hidden'}`}>
          <h2 className='mb-[1.5rem] text-[.75rem] text-gray font-medium uppercase'>General</h2>
          <div className='flex flex-col gap-3'>
            <Link to="/home" className='flex items-center gap-[8px] pl-4'>
              <LayoutDashboard className='w-4' />
              <span>Dashboard</span>
            </Link>
            {menus.map((item) => {
              const iconResult = icons.find(icon => icon.link == item.link_mm2)?.icon

              const IconComponent = iconResult
                ? React.cloneElement(iconResult, { className: 'w-4' })
                : null;

              return (
                <div key={item.idmm2}>
                  <div className="pl-4 cursor-pointer flex flex-col gap-4">
                    <Link key={item.idmm2} to={item.link_mm2} className="flex items-center gap-[8px]">
                      {IconComponent}
                      <span>{item.name_mm2}</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
          <h2 className='text-[.75rem] text-gray font-medium uppercase my-4'>Support</h2>
          <Link to="/" className='flex items-center gap-[8px] pl-4'>
            <LogOut className='w-4' />
            <span>Log Out</span>
          </Link>
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
