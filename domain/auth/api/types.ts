
export interface LoginRequest {
    documentNumber: string // CPF ou outro documento
    password: string
  }
  
  export interface AuthResponse {
    token: string
    userId: string
    email: string
    firstName: string
    lastName: string
    globalRoles: string[]
    companies: UserCompanyDto[]
  }
  
  export interface UserCompanyDto {
    companyId: string
    companyName: string
    roles: string[]
  }