import { useLocation, useNavigate } from 'react-router-dom';
import { CheckboxList, Heading } from ".."
import BackBtn from '/assets/back-button.svg'
import { UserType } from '../../types/typesBackend';

const UserPermissions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state as UserType; // This updates the menu access permissions for that user.

  const navToUserMain = () => {
    navigate('/userMain');
  }

  return (
    <div className="flex-1">
      <div className='hidden 930:block'>
        <button onClick={navToUserMain} className='w-full'><Heading title="User Configuration" /></button>
      </div>
      <div className="px-[40px] 930:px-0 mb-[27px] 930:mb-[34px]">
        <div className="pt-[25px] 930:text-left border-b border-lightgray pb-[17px]
					930:pl-[29px] 930:py-[30px] 930:w-full 930:border-none 930:pb-0 flex items-center w-full">
          <button className='930:hidden max-w-[18px]'>
            <img src={BackBtn} alt="Back button" />
          </button>
          <div className="flex-grow flex justify-center 930:justify-start text-[1.15rem]">
            <h2 className="font-medium">
              User Permissions
            </h2>
          </div>
        </div>
      </div>
      <CheckboxList user={user} />
    </div>
  )
}

export default UserPermissions