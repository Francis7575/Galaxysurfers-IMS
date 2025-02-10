import { useEffect, useState } from 'react';
import Heading from '../../components/common/Heading';
import Filters from './Filter';
import InventoryData from './InventoryData';
import { WarehouseType } from '../../types/typesBackend';
import { Link } from 'react-router-dom';

const InventoryMenu = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/warehouses/warehouses-list`);
        const data = await response.json();
        setWarehouses(data);
        if (!response.ok) {
          throw new Error('Response is not ok');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchWarehouses();
  }, []);

  const handleFilterChange = (filterName: string) => {
    setActiveFilter((prevFilter) => (prevFilter === filterName ? null : filterName));
  };

  return (
    <>
      <Link to="../inventoryMain" className='w-full'> <Heading title="Inventory" /></Link>
      <h2 className='text-red mt-[25px] pl-[40px] text-[1.3rem] font-bold 930:mb-6'>Filter By Warehouses</h2>
      <div className='930:flex 930:items-start 930:gap-[30px] 930:pb-[39px] '>
        <Filters warehouses={warehouses} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
        <InventoryData activeFilter={activeFilter} />
      </div>
    </>
  )
}

export default InventoryMenu