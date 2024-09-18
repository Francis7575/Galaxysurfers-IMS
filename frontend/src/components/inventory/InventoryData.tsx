import { useState, useEffect } from 'react';
import { InventoryType } from '../../types/typesBackend';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../common/DeleteModal';
import { toast } from 'react-toastify';

interface InventoryDataProps {
	activeFilter: string | null;
}

const InventoryData = ({ activeFilter }: InventoryDataProps) => {
	const navigate = useNavigate();
	const [inventory, setInventory] = useState<InventoryType[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [filteredInventory, setFilteredInventory] = useState<InventoryType[]>([]);
	const [selectedInventory, setSelectedInventory] = useState<InventoryType | null>(null);

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/inventory/get-inventory`);
				const data = await response.json();
				setInventory(data);
				setFilteredInventory(data);
				console.log(data)
			} catch (err) {
				console.error(err)
			}
		}

		fetchItems();
	}, []);

	const handleDelete = async (idinventory: number) => {
		console.log(idinventory)
		try {
			const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/inventory/delete-inventory/${idinventory}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			console.log(response)
			if (response.ok) {
				toast.success('Inventory Deleted!');
				setFilteredInventory(filteredInventory.filter(item => item.idinventory !== idinventory));
				setInventory(inventory.filter(item => item.idinventory !== idinventory));
			} else {
				toast.error('Failed to delete the item');
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleOpenModal = (inventory: InventoryType) => {
		setSelectedInventory(inventory);
		setIsModalOpen(true);
	};

	const cancelDelete = () => {
		setIsModalOpen(false);
		setSelectedInventory(null);
	};

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
				const expirationDate = new Date(item.expirationdate_bc);
				const formattedExpirationDate = expirationDate.toLocaleDateString();
				const currentDate = new Date();
				const timeDiff = expirationDate.getTime() - currentDate.getTime();
				const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Difference in days

				// Check if the expiration date is within 15 days
				const isNearExpiration = daysDiff <= 15 && daysDiff >= 0;

				console.log(isNearExpiration, daysDiff, currentDate)
				return (
					<div key={item.idinventory} className={`border py-[8px] px-5 930:px-8 rounded-[8px] hover:bg-lightblue cursor-pointer relative
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
								<p className='pt-3 ml-7 930:ml-0'>
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
						<button onClick={() => handleOpenModal(item)}
							title="Delete user" className='hover:opacity-70 absolute top-1 right-2'>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 17" fill="none">
								<rect x="0.5" width="17" height="17" rx="5" fill="#FF6F6F" />
								<path d="M12.0556 14H5.94444C5.26943 14 4.72222 13.5075 4.72222 12.9V5.75H3.5V4.65H5.94444V4.1C5.94444 3.49249 6.49165 3 7.16667 3H10.8333C11.5083 3 12.0556 3.49249 12.0556 4.1V4.65H14.5V5.75H13.2778V12.9C13.2778 13.5075 12.7306 14 12.0556 14ZM5.94444 5.75V12.9H12.0556V5.75H5.94444ZM7.16667 4.1V4.65H10.8333V4.1H7.16667ZM10.8333 11.8H9.61111V6.85H10.8333V11.8ZM8.38889 11.8H7.16667V6.85H8.38889V11.8Z" fill="white" />
							</svg>
						</button>
					</div>
				)
			})}
			{filteredInventory.length === 0 && (
				<p className="text-start text-red 930:text-[1.2rem] mt-1">No items found for the selected warehouse.</p>
			)}
			{isModalOpen && (
				<DeleteModal
					idInventory={selectedInventory!.idinventory}
					setIsModalOpen={setIsModalOpen}
					itemName={selectedInventory!.lot_bc || `${selectedInventory!.name_item} at ${selectedInventory!.name_loc}`}
					cancelDelete={cancelDelete}
					deleteInventory={() => handleDelete(selectedInventory!.idinventory)}
				/>
			)}
		</section>
	);
}

export default InventoryData