import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Item, Warehouse } from "../types/types";

type DashboardContextType = {
  inventoryOcupancy: Warehouse[];
  inventoryIndicators: { units: number; items: number };
  fetchDashboardData: () => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

type DashboardProviderProps = {
  children: ReactNode;
};

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [inventoryOcupancy, setInventoryOcupancy] = useState<Warehouse[]>([]);
  const [inventoryIndicators, setInventoryIndicators] = useState({
    units: 0,
    items: 0,
  });

  const fetchDashboardData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/warehouses/dashboard`
    );
    const data = await response.json();

    setInventoryIndicators(data.indicators);
    if (data.ocupancy.length > 0) {
      const treemapData = data.ocupancy.reduce(
        (acc: Warehouse[], item: Item) => {
          // console.log("acc:", acc);
          // console.log("item:", item);
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

  useEffect(() => {
    fetchDashboardData();
  }, []);


  return (
    <DashboardContext.Provider
      value={{
        inventoryOcupancy,
        inventoryIndicators,
        fetchDashboardData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
