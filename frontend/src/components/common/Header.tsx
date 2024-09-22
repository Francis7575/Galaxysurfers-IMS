import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';

const Header = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isDesktop = windowWidth >= 930;

  return (
    <header className='font-manrope border-b border-lightgray flex justify-between items-center px-[12px] md:px-[55px] py-[19px] md:py-[27px] lg:px-0 lg:pl-[71px]'>
      <Link to="/"
        className='text-[1.5rem] 930:hidden'>
        Galaxy<span className='text-blue font-medium'>Surfers</span>
      </Link>
      <Link to="/" className='text-[1.5rem] font-medium leading-[150%] hidden 930:block'>
        Galaxy<span className='text-second-blue'>Surfers</span> Inventory Management
      </Link>
      {isDesktop ? null : <Navbar />}
    </header>
  )
}

export default Header