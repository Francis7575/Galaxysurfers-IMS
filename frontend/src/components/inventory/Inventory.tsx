import Heading from '../common/Heading';
import Filters from './Filters';
import InventoryData from './InventoryData';

const InventoryMenu = () => {
  return (
    <>
      <Heading
        showBackBtn={false}
        title="Inventory" />
      <div className='930:flex 930:gap-[30px] 930:pb-[39px]'>
        <Filters />
        <InventoryData />
      </div>
    </>
  )
}

export default InventoryMenu