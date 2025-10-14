type UserType = "CLIENTE" | "TATUADOR"

export interface UserProfile {
    id: string
    email: string
    name: string
    phone: string
    userType: UserType
    businessName?: string
    avatar?: string
}