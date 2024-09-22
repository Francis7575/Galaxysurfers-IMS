import { Outlet } from "react-router-dom";
import { Header, Navbar } from './index';
import useWindowWidth from "../hooks/useWindowWidth";

const Layout = () => {
	const windowWidth = useWindowWidth();
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
