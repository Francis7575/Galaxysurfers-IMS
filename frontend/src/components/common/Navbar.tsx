import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  console.log('User', userId)
  //const [userIdAux, setUserId] = useState(userId);
  const [menus, setMenus] = useState<SubMenuItem[]>([]);

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
    <nav className="bg-lightblue hidden 930:block max-w-[225px] lg:max-w-[250px] xl:max-w-[292px] min-h-screen">
      <div className="flex flex-col px-[2.7rem] lg:px-[3.7rem] xl:px-[4.8rem]">
        <div className="mb-8 pt-8">
          <h2 className='text-[.75rem] text-gray font-medium uppercase mb-4'>General</h2>
          <div className='flex flex-col gap-[1rem]'>
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
                  <div className="flex items-center gap-[8px] pl-4 cursor-pointer">
                    <Link key={item.idmm2} to={item.link_mm2} className="flex items-center gap-[8px]">
                      {IconComponent}
                      <span>{item.name_mm2}</span>
                    </Link>
                  </div>
                </div>
              )
            })}
            <h2 className='text-[.75rem] text-gray font-medium uppercase mb-4'>Support</h2>
            <button onClick={handleLogout}
              className='flex items-center gap-[8px] pl-4'>
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
