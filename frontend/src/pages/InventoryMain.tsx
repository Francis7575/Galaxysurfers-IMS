import { Heading } from "../components";
import { Link } from "react-router-dom";

const InventoryMain = () => {
  return (
    <>
      <div className="flex">
        <div className="font-manrope flex-1 w-full px-4 md:px-0">
          <Heading showBackBtn={false} title="Inventory" />
          <div className="flex justify-center 930:justify-start 930:pl-[29px] mt-[27px] mb-[17px] md:mb-[40px] 930:mt-[29px] 930:mb-[21px]">
            <Link
              to="/inventory"
              className="btn-styles relative hover:opacity-80 pl-6 rounded-lg bg-deep-blue text-white py-[10px] max-w-[222px] w-full font-medium  mr-6"
            >
              Inventory
            </Link>
            <Link
              to="/inventory-in"
              className="btn-styles relative hover:opacity-80 pl-6 rounded-lg bg-deep-blue text-white py-[10px] max-w-[222px] w-full font-medium mr-6"
            >
              In
            </Link>
            <Link
              to="/inventory-out"
              className="btn-styles relative hover:opacity-80 pl-6 rounded-lg bg-deep-blue text-white py-[10px] max-w-[222px] w-full font-medium mr-6"
            >
              Out
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryMain;
