import { Outlet } from "react-router-dom";
import { useEffect, useState } from 'react';

import { Header, Navbar } from './index';

const Layout = () => {
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		window.addEventListener('resize', handleResize);
		// Cleanup the event listener on unmount
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const isMobile = windowWidth <= 930;

	return (
		<>
			<Header />
			<div className='930:flex'>
				{isMobile ? null : <Navbar />}
				<div className='flex-grow'>
					<Outlet />
				</div>
			</div>
		</>
	);
};

export default Layout;
