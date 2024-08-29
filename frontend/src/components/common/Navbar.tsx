import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Warehouse, Book, Boxes } from "lucide-react";
import { useAuth } from '../../hooks/useAuth';

interface SubMenuItem {
  idmm2: number;
  idmm_mm2: number;
  name_mm2: string;
  link_mm2: string;
  order_mm2: number;
  access_menu: number;
}

const Navbar = () => {
  const { userId, handleLogout } = useAuth();
  const [menus, setMenus] = useState<SubMenuItem[]>([]);
  const location = useLocation();

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
    if (userId) {
      const fetchItems = async () => {
        const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/users/get-access-menus?userId=${userId}&responseType=allowed`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        console.log(data)
        if (data.length > 0) {
          setMenus(data[0].subMenus);
        }
      };
      fetchItems();
    }
  }, [userId]);

  return (
    <nav className="bg-lightblue hidden 930:block max-w-[225px] lg:max-w-[250px] xl:max-w-[292px] min-h-screen">
      <div className="flex flex-col px-[2.7rem] lg:px-[3.7rem] xl:px-[4.8rem]">
        <div className="mb-8 pt-8">
          <h2 className='text-[.75rem] text-gray font-medium uppercase mb-4'>General</h2>
          <div className='flex flex-col gap-[1rem]'>
            <Link
              to="/home"
              className={`hover:opacity-70 flex items-center gap-[8px] pl-4 ${location.pathname === '/home' ? 'bg-active' : ''}
                }`}
            >
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
                  <Link key={item.idmm2} to={item.link_mm2} className={`hover:opacity-70 pl-4 text-[.85rem] flex w-full items-center gap-[8px] 
                        ${location.pathname === item.link_mm2 ? 'bg-active' : ''}`}>
                    <span>{IconComponent}</span>
                    <span className="leading-none">{item.name_mm2}</span>
                  </Link>
                </div>
              )
            })}
            <h2 className='text-[.75rem] text-gray font-medium uppercase mb-4'>Support</h2>
            <button onClick={handleLogout}
              className='flex items-center gap-[8px] pl-4 hover:opacity-50'>
              <LogOut className='w-4' />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
