export type UserType = "CLIENTE" | "TATUADOR";

export interface RegisterData {
  email: string,
  password: string
  name: string
  phone: string
  avatar: string
  userType: UserType
}