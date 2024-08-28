import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../index'
import { WarehouseType } from '../../types/typesBackend';
import { toast } from 'react-toastify';
import DeleteModal from '../common/DeleteModal';

const AddWarehouse = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouseList] = useState<WarehouseType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setselectedWarehouse] = useState<WarehouseType | null>(null);

  const tableHeading = ["#", "Code", "Name", ""]

  const navToNewWarehouse = () => {
    navigate('/createwarehouse');
  }

  const navToEditWarehouse = (warehouse: WarehouseType) => {
    navigate('/editwarehouse', { state: warehouse });
  };

  const navToLocations = (warehouse: WarehouseType) => {
    navigate('/locations', { state: warehouse });
  };

  const handleOpenModal = (user: WarehouseType) => {
    setselectedWarehouse(user);
    setIsModalOpen(true);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setselectedWarehouse(null);
  };

  const deleteWarehouse = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/warehouses/warehouse-cancel/${selectedWarehouse!.idwarehouse}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const newUsersList = warehouses.filter(item => item.idwarehouse !== selectedWarehouse!.idwarehouse);
      setWarehouseList(newUsersList);
      toast.success('Warehouse Deleted!');
    } else {
      toast.error('Something went wrong!');
    }
    setIsModalOpen(false);
    setselectedWarehouse(null);
  }

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/warehouses/warehouses-list`);
      const data = await response.json();

      setWarehouseList(data);
    }
    fetchItems();
  }, []);

  return (
    <div className="font-manrope flex-1 w-full">
      <Heading title="Warehouse Configuration" />
      <div className="flex justify-center 930:justify-start 930:pl-[29px] mt-[27px] mb-[17px] md:mb-[40px] 930:mt-[29px] 930:mb-[21px]">
        <button className="bg-lightblue hover:opacity-70 py-[10px] max-w-[222px] w-full font-medium text-dark-color" onClick={navToNewWarehouse}>
          + Add new Warehouse
        </button>
      </div>
      <div className="overflow-x-auto px-[20px] 930:px-[29px]">
        <table className="w-full max-w-[700px] mx-auto 930:mx-0">
          <thead>
            <tr className="text-[.85rem]">
              {tableHeading.map((heading, index) => (
                <th key={index} className="border border-second-lightblue text-grayish-gray py-[10px] px-[20px]">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-lightblue ">
            {warehouses.map((item) => (
              <tr key={item.idwarehouse} className="text-[.85rem]">
                <td className="p-[10px] text-center">{item.idwarehouse}</td>
                <td className="p-[10px] text-center">{item.code_warehouse}</td>
                <td className="p-[10px] text-center">{item.name_warehouse}</td>
                <td className="flex items-center justify-center py-[10px] gap-2">
                  <button onClick={() => navToEditWarehouse(item)} className="hover:opacity-70">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 18 17" fill="none">
                      <rect x="0.5" width="17" height="17" rx="5" fill="#406D42" />
                      <path d="M4.10599 14C3.93667 13.9997 3.77527 13.9283 3.66115 13.8032C3.54492 13.6791 3.48717 13.5113 3.5024 13.3419L3.65028 11.7154L10.4817 4.88449L12.6166 7.01938L5.78699 13.8497L4.16092 13.9976C4.14221 13.9994 4.1235 14 4.10599 14ZM13.0428 6.59252L10.9085 4.45764L12.1887 3.17707C12.3019 3.0637 12.4555 3 12.6157 3C12.7759 3 12.9295 3.0637 13.0428 3.17707L14.323 4.45764C14.4363 4.57088 14.5 4.72455 14.5 4.8848C14.5 5.04504 14.4363 5.19871 14.323 5.31195L13.0434 6.59192L13.0428 6.59252Z" fill="white" />
                    </svg>
                  </button>
                  <button onClick={() => { handleOpenModal(item) }} className="hover:opacity-70">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 18 17" fill="none">
                      <rect x="0.5" width="17" height="17" rx="5" fill="#FF6F6F" />
                      <path d="M12.0556 14H5.94444C5.26943 14 4.72222 13.5075 4.72222 12.9V5.75H3.5V4.65H5.94444V4.1C5.94444 3.49249 6.49165 3 7.16667 3H10.8333C11.5083 3 12.0556 3.49249 12.0556 4.1V4.65H14.5V5.75H13.2778V12.9C13.2778 13.5075 12.7306 14 12.0556 14ZM5.94444 5.75V12.9H12.0556V5.75H5.94444ZM7.16667 4.1V4.65H10.8333V4.1H7.16667ZM10.8333 11.8H9.61111V6.85H10.8333V11.8ZM8.38889 11.8H7.16667V6.85H8.38889V11.8Z" fill="white" />
                    </svg>
                  </button>
                  <button onClick={() => { navToLocations(item) }} className="hover:opacity-70">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 18 17" fill="none">
                      <rect x="0.5" width="17" height="17" rx="5" fill="#66a2e3" />
                      <path d="M9 2C6.23858 2 4 4.23858 4 7C4 10.5 9 15 9 15C9 15 14 10.5 14 7C14 4.23858 11.7614 2 9 2ZM9 8C7.89543 8 7 7.10457 7 6C7 4.89543 7.89543 4 9 4C10.1046 4 11 4.89543 11 6C11 7.10457 10.1046 8 9 8Z" fill="white" />

                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <DeleteModal
          setIsModalOpen={setIsModalOpen}
          itemName={selectedWarehouse!.name_warehouse}
          cancelDelete={cancelDelete}
          deleteUser={deleteWarehouse}
        />
      )}
    </div >
  )
}

export default AddWarehouse