import Heading from '../common/Heading';
import Filters from './Filters';
import InventoryData from './InventoryData';
import { useNavigate } from 'react-router-dom';

const InventoryMenu = () => {
  const navigate = useNavigate();

  const navToInventoryMain = () => {
    navigate('/inventoryMain');
  }

  return (
    <>
      <a onClick={navToInventoryMain} className='w-full'> <Heading title="Inventory" /></a>
      <div className='930:flex 930:items-stretch 930:gap-[30px] 930:pb-[39px] 930:mt-[40px]'>
        <Filters />
        <InventoryData />
      </div>
    </>
  )
}

export default InventoryMenu