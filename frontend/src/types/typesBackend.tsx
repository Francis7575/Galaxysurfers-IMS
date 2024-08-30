export type UserType = {
  iduser: number;
  username: string;
  name_user: string;
  mail_user: string;
};

export type WarehouseType = {
  idwarehouse: number;
  code_warehouse: string;
  name_warehouse: string;
  capacitym3_warehouse: number;
  status_warehouse: number;
};

export type ItemType = {
  iditem: number;
  code_item: string;
  name_item: string;
  description_item: string;
  type_item: string;
  idunit_item: string;
  unit: string;
  name_unit: number;
  batch_ctrl_item: number;
  expiration_ctrl_item: number;
  imgurl_item: string;
};