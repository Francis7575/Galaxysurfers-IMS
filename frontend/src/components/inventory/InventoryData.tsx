import { useState, useEffect } from 'react';
import { InventoryType } from '../../types/typesBackend';
import { useNavigate } from 'react-router-dom';

const InventoryData = () => {
	const navigate = useNavigate();
	const [inventory, setInventory] = useState<InventoryType[]>([]);

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/inventory/get-inventory`);
				const data = await response.json();

				setInventory(data);
				console.log(data)
			} catch (err) {
				console.error(err)
			}
		}

		fetchItems();
	}, []);

	const check3d = (idloc: number, idwarehouse: number, warehouse: string) => {

		navigate('/locations2', { state: { idloc, idwarehouse, warehouse } });
	}

	return (
		<section className='mt-[27px] 930:mt-[38px] pb-8 px-[23px] 930:px-0 930:flex-1 930:pr-[24px]'>
			{inventory.map((item, index) => {
				console.log(inventory)
				const expirationDate = new Date(item.expirationdate_bc);
				const formattedExpirationDate = expirationDate.toLocaleDateString();
				const currentDate = new Date();
				const timeDiff = expirationDate.getTime() - currentDate.getTime();
				const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Difference in days

				// Check if the expiration date is within 15 days
				const isNearExpiration = daysDiff <= 15 && daysDiff >= 0;

				console.log(isNearExpiration, daysDiff, currentDate)
				return (
					<div key={item.idinventory} className={`border py-[8px] pl-[9px] pr-[41px] rounded-[8px] ${index != 0 ? 'mt-3' : ''} ${isNearExpiration ? 'border-red' : 'border-second-lightgray'}`}>
						<a onClick={() => check3d(item.idloc, item.idwarehouse_in, item.name_warehouse)}><div className='flex justify-between'>
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
									<span className="absolute text-third-lightgray font-medium text-center">
										Item Image
									</span>

									<img src={item.imgurl_item} alt="Uploaded Item" className=" absolute w-full h-full object-cover" />
								</label>
								<div className='ml-[30px]'>
									<p>{item.name_item}</p>
									<p className='opacity-60'>{parseFloat(item.quantity_in).toFixed(2)}</p>
								</div>
							</div>
							<p className='pt-3'>{item.lot_bc}<br></br>{item.name_warehouse}<br></br>{item.name_loc}<br></br>{item.batch_ctrl_item == 1 ? formattedExpirationDate : ''}</p>
						</div></a>
					</div>
				)
			})}
		</section>
	);
}

export default InventoryData