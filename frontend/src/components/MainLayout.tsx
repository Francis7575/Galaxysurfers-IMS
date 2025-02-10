import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ItemMain from "@/pages/item/ItemMain";
import UserMain from "@/pages/user/UserMain";
import WarehouseMain from "@/pages/warehouse/WarehouseMain";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();
  const isUserRoute = location.pathname.startsWith("/user");
  const isItemRoute = location.pathname.startsWith("/item");
  const isWarehouseRoute = location.pathname.startsWith("/warehouse");

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="min-h-screen">
          {isUserRoute && <UserMain />}
          {isItemRoute && <ItemMain />}
          {isWarehouseRoute && <WarehouseMain />}
        </ResizablePanel>
        <ResizableHandle
          style={{
            backgroundColor: "#CED4DA",
            width: "1px",
          }}
        />
        <ResizablePanel>
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default MainLayout;
