import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Warehouse, Book, Boxes } from "lucide-react";
import { useAuth } from '../../hooks/useAuth';
import { SubMenuItem } from '../../types/types';

export const userlocations = ["/userMain", "/createuser", "/edituser", "/user-permissions"]
export const warehouseslocations = ["/warehouseMain", "/createwarehouse", "/editwarehouse", "/locations"]
export const itemslocations = ["/itemMain", "/addItem", "/editItem"]
export const inventorylocations = ["/inventoryMain", "/inventory", "/inventory-in", "/inventory-out"]

export const icons = [
  {
    link: '/userMain',
    icon: <User />,
    relatedPaths: userlocations,
  },
  {
    link: '/warehouseMain',
    icon: <Warehouse />,
    relatedPaths: warehouseslocations,
  },
  {
    link: '/itemMain',
    icon: <Book />,
    relatedPaths: itemslocations,
  },
  {
    link: '/inventoryMain',
    icon: <Boxes />,
    relatedPaths: inventorylocations,
  },
]

const Navbar = () => {
  const { userId, handleLogout } = useAuth();
  const [menus, setMenus] = useState<SubMenuItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (userId) {
      const fetchItems = async () => {
        const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/users/get-access-menus?userId=${userId}&responseType=all`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.length > 0) {
          setMenus(data[0].subMenus);
        }
      };
      fetchItems();
    }
  }, [userId]);

  const isActiveRoute = (path: string, relatedPaths: string[]) => {
    return relatedPaths.includes(path);
  };

  return (
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
            {menus.map((item, idx) => {
              const iconResult = icons.find(icon => icon.link === item.link_mm2);

              const IconComponent = iconResult
                ? React.cloneElement(iconResult.icon, { className: 'w-4' })
                : null;

              // Check if the current route matches the specific group
              const isActive = isActiveRoute(location.pathname, iconResult?.relatedPaths || []);

              return (
                <div key={item.idmm2}>
                  <Link key={item.idmm2} to={item.link_mm2}
                    className={`justify-start hover:opacity-70 text-[.85rem] flex w-full items-center gap-[8px] 
                    ${isActive ? 'bg-active' : ''} ${(idx === 0 || idx === 2 ? '' : '')}`}>
                    <span>{IconComponent}</span>
                    <span className='leading-none'>{item.name_mm2}</span>
                  </Link>
                </div>
              )
            })}
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
  );
};

export default Navbar;
