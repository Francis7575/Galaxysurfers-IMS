import { Outlet } from "react-router-dom";
import { Header, Navbar } from './index';

const Layout = () => {

	return (
		<>
			<Header />
			<div className='930:flex'>
				<Navbar />
				<div className='flex-grow'>
					<Outlet />
				</div>
			</div>
		</>
	);
};

export default Layout;
