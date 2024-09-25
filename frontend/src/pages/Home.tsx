import React, { useState, useEffect, ReactNode } from 'react';
import { Tooltip, ResponsiveContainer, Treemap } from 'recharts';

interface CardProps {
	children: ReactNode;
}

interface InventoryData {
	month: string;
	items: number;
}

const Card: React.FC<CardProps> = ({ children }) => (
	<div className="bg-white rounded-md py-6 shadow-md px-8 h-full">{children}</div>
);

const CardHeader: React.FC<CardProps> = ({ children }) => (
	<h2 className="border-b border-gray-200 pb-2 mb-4 text-xl font-semibold text-gray-800">
		{children}
	</h2>
);

const CardContent: React.FC<CardProps> = ({ children }) => (
	<div className="text-gray-700">{children}</div>
);

const CustomTooltip = ({ active, payload }: any) => {
	if (active && payload && payload.length) {
		const { name, size, root } = payload[0].payload;
		// console.log('hi', size)	
		return (
			<div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
				<p className="label"><strong>Warehouse:</strong> {root.name}</p>
				<p className="label"><strong>Item:</strong> {name}</p>
				<p className="label"><strong>Quantity:</strong> {size}</p>
			</div>
		);
	}

	return null;
};

const Home = () => {
	const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
	const [inventoryOcupancy, setInventoryOcupancy] = useState([]);
	const [inventoryIndicators, setInventoryIndicators] = useState({
		units: 0,
		items: 0
	});
console.log(inventoryData)
	useEffect(() => {
		const fetchInventoryData = () => {
			const data: InventoryData[] = [
				{ month: 'Jan', items: 800 },
				{ month: 'Feb', items: 950 },
				{ month: 'Mar', items: 1200 },
				{ month: 'Apr', items: 1100 },
				{ month: 'May', items: 1300 },
				{ month: 'Jun', items: 1400 },
			];
			setInventoryData(data);
		};
		fetchInventoryData();
	}, []);


	useEffect(() => {
		const fetchItems = async () => {
			const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/warehouses/dashboard`);
			const data = await response.json();

			setInventoryIndicators(data.indicators)
			if (data.ocupancy.length > 0) {
				const treemapData = data.ocupancy.reduce((acc: any, item: any) => {
					const warehouse = acc.find((w: any) => w.name === item.name_warehouse);
					const itemData = {
						name: item.name_item,
						size: parseFloat(item.quantity),
					};

					if (warehouse) {
						warehouse.children.push(itemData);	
					} else {
						acc.push({
							name: item.name_warehouse,
							children: [itemData],
						});
					}

					return acc;
				}, []);
				setInventoryOcupancy(treemapData)
			}
		}
		fetchItems();
	}, []);



	return (
		<div className='w-full mx-auto 930:pr-[29px]'>
			<div className='flex flex-col gap-4 930:flex-row'>
				<div className='w-full 930:w-2/3 flex flex-col gap-4'>
					<Card>
						<CardHeader>Inventory details</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={400}>
								<Treemap
									data={inventoryOcupancy}
									dataKey="size"
									aspectRatio={4 / 3}
									stroke="#fff"
									fill="#8884d8"
								>
									<Tooltip content={<CustomTooltip />} />
								</Treemap>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</div>
				<div className='w-full 930:w-1/3 flex flex-col gap-4'>
					<Card>
						<CardHeader>Inventory Resume</CardHeader>
						<div className="text-center">
							<h3 className="text-3xl font-bold text-blue-600">{inventoryIndicators.units}</h3>
							<p className="text-lg text-gray-600">Total Units</p>
						</div>
						<div className="text-center">
							<h3 className="text-3xl font-bold text-purple-600">{inventoryIndicators.items}</h3>
							<p className="text-lg text-gray-600"># of Items</p>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Home;
