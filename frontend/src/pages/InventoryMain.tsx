import { useNavigate } from 'react-router-dom';
import { Heading } from '../components'

const InventoryMain = () => {
  const navigate = useNavigate();

  const navToInventory = () => {
    navigate('/inventory');
  }

  const navToInventoryIn = () => {
    navigate('/inventory-in');
  }

  const navToInventoryOut = () => {
    navigate('/inventory-out');
  }
  return (
    <>
      <div className='flex'>
        <div className="font-manrope flex-1 w-full px-4 md:px-0">
          <Heading
            showBackBtn={false}
            title="Inventory" />
          <div className="flex justify-center 930:justify-start 930:pl-[29px] mt-[27px] mb-[17px] md:mb-[40px] 930:mt-[29px] 930:mb-[21px]">
            <button className="hover:opacity-70 bg-second-lightblue py-[10px] max-w-[222px] w-full font-medium text-dark-color mr-3" onClick={navToInventory}>
              Inventory
            </button>
            <button className="hover:opacity-70 bg-second-lightblue py-[10px] max-w-[222px] w-full font-medium text-dark-color mr-3" onClick={navToInventoryIn}>
              In
            </button>
            <button className="hover:opacity-70 bg-second-lightblue py-[10px] max-w-[222px] w-full font-medium text-dark-color" onClick={navToInventoryOut}>
              Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default InventoryMain