import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="font-manrope border-b border-lightgray flex justify-between items-center px-[12px] md:px-[25px] py-[19px] lg:px-[40px]">
      <Link to="/home" className="text-[1.2rem] lg:text-[1.4rem] font-medium leading-[150%] hover:opacity-60">
        Galaxy<span className="text-second-blue ">Surfers</span> IMS
      </Link>
      <div>
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
