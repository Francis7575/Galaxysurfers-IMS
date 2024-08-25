export type LoginForm = {
  username?: string
  password?: string
}

export type LoginProps = {
  onLogin: (data: LoginForm) => void
}
