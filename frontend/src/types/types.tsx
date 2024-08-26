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