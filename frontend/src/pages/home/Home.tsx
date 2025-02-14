import React, { useState, useEffect, ReactNode } from "react";
import { Tooltip, ResponsiveContainer, Treemap } from "recharts";
import { Item, Warehouse } from "@/types/types";

interface CardProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => (
  <div className="bg-white mx-auto w-full max-w-[550px] 930:max-w-none rounded-md py-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.1)] px-8 h-full">
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({ children }) => (
  <h2 className="border-b border-gray-200 text-center pb-2 mb-4 text-xl font-semibold text-gray-800">
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
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p className="label">
          <strong>Warehouse:</strong> {root.name}
        </p>
        <p className="label">
          <strong>Item:</strong> {name}
        </p>
        <p className="label">
          <strong>Quantity:</strong> {size}
        </p>
      </div>
    );
  }
  return null;
};

const Home = () => {
  const [inventoryOcupancy, setInventoryOcupancy] = useState([]);
  const [inventoryIndicators, setInventoryIndicators] = useState({
    units: 0,
    items: 0,
  });

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_BACKEND_URL}/warehouses/dashboard`
      );
      const data = await response.json();
    
      setInventoryIndicators(data.indicators);
      if (data.ocupancy.length > 0) {
        const treemapData = data.ocupancy.reduce(
          (acc: Warehouse[], item: Item) => {
            //   console.log("acc:", acc);
            //   console.log("item:", item);
            const warehouse = acc.find(
              (w: Warehouse) => w.name === item.name_warehouse
            );
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
          },
          []
        );
        setInventoryOcupancy(treemapData);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="w-full mx-auto 930:px-8 mt-8 930:mt-12 pb-8 max-w-[1200px] ">
      <div className="flex flex-col gap-8 930:gap-16 930:flex-row">
        <div className="w-full 930:w-3/5 flex flex-col gap-4 mb-4">
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
        <div className="w-full 930:w-1/3 flex flex-col gap-4">
          <Card>
            <CardHeader>Inventory Resume</CardHeader>
            <div className="flex flex-col gap-10 items-center mt-10">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-purple-600">
                  {inventoryIndicators.units ?? (0).toLocaleString()}
                </h3>
                <p className="text-lg text-gray-600">Total Units</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-purple-600">
                  {inventoryIndicators.items ?? (0).toLocaleString()}
                </h3>
                <p className="text-lg text-gray-600">Item Quantity</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
