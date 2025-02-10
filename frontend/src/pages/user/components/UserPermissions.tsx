import { Link, useLocation } from "react-router-dom";
import  Heading  from '@/components/common/Heading'
import CheckboxList from "./CheckBoxList";
import BackBtn from "/assets/back-button.svg";
import { UserType } from "../../../types/typesBackend";

const UserPermissions = () => {
  const location = useLocation();
  const user = location.state as UserType; // This updates the menu access permissions for that user.

  return (
    <div className="flex-1">
      <div className="hidden 930:block">
        <Link to="/user" className="w-full">
          <Heading title="User Configuration" />
        </Link>
      </div>
      <div className="px-[40px] 930:px-0 mb-[27px] 930:mb-[34px]">
        <div
          className="pt-[25px] 930:text-left border-b border-lightgray pb-[17px]
					930:pl-[29px] 930:py-[30px] 930:w-full 930:border-none 930:pb-0 flex items-center w-full"
        >
          <Link to="/user" className="930:hidden max-w-[18px]">
            <img src={BackBtn} alt="Back button" />
          </Link>
          <div className="flex-grow flex justify-center 930:justify-start text-[1.15rem]">
            <h2 className="font-medium">User Permissions</h2>
          </div>
        </div>
      </div>
      <CheckboxList user={user} />
    </div>
  );
};

export default UserPermissions;
