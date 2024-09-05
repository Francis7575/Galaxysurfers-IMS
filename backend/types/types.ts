// usersController.ts
export type CheckLoggedInResponse = {
  loggedIn: boolean;
  userId?: string;
  username?: string;
};

export type GetMenuAccessQuery = {
  userId?: number;
  responseType?: "all" | "allowed";
};

export type UserRequestBody = {
  name_user: string;
  username: string;
  pass_user: string;
  mail_user: string;
};

export type SubMenuAccess = {
  idmm2: number;
  idmm_mm2: number;
  name_mm2: string;
  link_mm2: string;
  order_mm2: number;
  access_menu: number;
}

export type HierarchicalMenuAccess = {
  idmm: number;
  name_mm: string;
  link_mm: string;
  order_mm: number;
  fa_mm: string;
  type_mm: number;
  subMenus: SubMenuAccess[];
}



// itemsController.ts
export type ItemBody = {
  code_item: string;
  name_item: string;
  description_item: string;
  type_item: string;
  idunit_item: number;
  batch_ctrl_item: boolean;
  expiration_ctrl_item: boolean;
  imgurl_item?: string;
};

export type ItemParams = {
  iditem: string;
};



// inventoryController.ts
export type StockRequestBody = {
  product: string;
  quantity: string | number;
  warehouse: string;
  location: string;
  batch?: string;
  expire_date?: string | null;
};



// warehouseController.ts
export interface WarehouseRequestBody {
  code_warehouse: string;
  name_warehouse: string;
}

export interface SaveLocationsRequestBody {
  figures: Array<{
    name: string;
    color: string;
    position: [number, number];
    size: [number, number];
  }>;
}

export interface DashboardResponse {
  indicators: {
    units: number;
    items: number;
  };
  ocupancy: Array<{
    name_item: string;
    name_warehouse: string;
    quantity: number;
  }>;
}