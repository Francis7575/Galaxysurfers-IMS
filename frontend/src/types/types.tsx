export type LoginForm = {
  username?: string
  password?: string
}

export type LoginProps = {
  onLogin: (data: LoginForm) => void
}

export type Checkbox = {
  name: string;
  label: string;
  id: string
};

export type CreateUserData = {
  user: string
  email: string
  name: string
  password: string
  confirmPassword: string
}

export type CreateUserErrors = {
  user?: string
  email?: string
  name?: string
  password?: string
  confirmPassword?: string
}

export type EditUserData = CreateUserData
export type EditUserErrors = CreateUserErrors

export type EditWarehouseData = {
  code: string;
  name: string;
}

export type EditWarehouseErrors = {
  code?: string;
  name?: string;
  capacity?: number;
}

export type CreateWarehouseData = EditWarehouseData

export type CreateWarehouseErrors = {
  address?: string;
  zipcode?: string;
  city?: string;
  code?: string
  name?: string
  capacity?: number
}

export type NewItem = {
  productCode: string;
  itemName: string;
  itemUnit: string;
  itemDescription: string;
  itemBatch: string;
  Expiration: string;
  itemUrl: string;
}


