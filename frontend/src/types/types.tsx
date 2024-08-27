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