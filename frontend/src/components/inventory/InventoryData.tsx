import { useState, useEffect } from 'react';
import { InventoryType } from '../../types/typesBackend';
import { useNavigate } from 'react-router-dom';

interface InventoryDataProps {
	activeFilter: string | null;
}

const InventoryData = ({ activeFilter }: InventoryDataProps) => {
	const navigate = useNavigate();
	const [inventory, setInventory] = useState<InventoryType[]>([]);
	const [filteredInventory, setFilteredInventory] = useState<InventoryType[]>([]);

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/inventory/get-inventory`);
				const data = await response.json();
				setInventory(data);
				setFilteredInventory(data.filter(item => !addedItems.includes(item.idinventory))); // Filter out added items
				console.log(data)
			} catch (err) {
				console.error(err)
			}
		}

		fetchItems();
	}, []);

useEffect(() => {
    if (activeFilter) {
      setFilteredInventory(inventory.filter(item => item.name_warehouse === activeFilter));
    } else {
      setFilteredInventory(inventory); // Reset to all items when no filter is active
    }
  }, [activeFilter, inventory]); // Dependency includes inventory to re-filter when data changes

	const check3d = (idloc: number, idwarehouse: number, warehouse: string) => {

		navigate('/locations2', { state: { idloc, idwarehouse, warehouse } });
	}

	return (
		<section className='mt-[27px] 930:mt-0 pb-8 930:pb-0 px-[23px] 930:px-0 930:flex-1 930:pr-[24px]'>
			{filteredInventory.map((item, index) => {
				console.log(filteredInventory)
				const expirationDate = new Date(item.expirationdate_bc);
				const formattedExpirationDate = expirationDate.toLocaleDateString();
				const currentDate = new Date();
				const timeDiff = expirationDate.getTime() - currentDate.getTime();
				const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Difference in days

				// Check if the expiration date is within 15 days
				const isNearExpiration = daysDiff <= 1 && daysDiff >= 0;

				console.log(isNearExpiration, daysDiff, currentDate)
				return (
					<div key={item.idinventory} className={`border py-[8px] px-5 930:px-8 rounded-[8px] hover:bg-lightblue cursor-pointer 
							${index != 0 ? 'mt-3' : ''} ${isNearExpiration ? 'border-red' : 'border-second-lightgray'}`}>
						<a onClick={() => check3d(item.idloc, item.idwarehouse_in, item.name_warehouse)}>
							<div className='flex justify-between'>
								<div className='flex items-center'>
									<label
										htmlFor="file"
										className="max-w-[80px] cursor-pointer h-[72px] relative overflow-hidden rounded-[8px] bg-file flex items-center justify-start"
									>
										<input
											type="file"
											id="file"
											className="opacity-0"
										/>

										<img src={item.imgurl_item} alt="Uploaded Item" className=" absolute w-full h-full object-cover" />
									</label>
									<div className='ml-[30px]'>
										<p>{item.name_item}</p>
										<p className='opacity-60'>{parseFloat(item.quantity_in).toFixed(2)}</p>
									</div>
								</div>
								<p className='pt-3'>
									{item.lot_bc && (
										<span>Batch: <span className='text-red'>{item.lot_bc}</span></span>
									)}
									<br></br>
									<span>Warehouse: <span className='text-red'>{item.name_warehouse}</span></span>
									<br></br>
									<span>Location: <span className='text-red'>{item.name_loc}</span></span>
									<br></br>
									<span>Expiry date: <span className='text-red'>{item.batch_ctrl_item == 1 ? formattedExpirationDate : ''}</span></span></p>
							</div>
						</a>
					</div>
				)
			})}
			{filteredInventory.length === 0 && (
				<p className="text-start text-red 930:text-[1.2rem] mt-1">No items found for the selected warehouse.</p>
			)}
		</section>
	);
}

export default InventoryData