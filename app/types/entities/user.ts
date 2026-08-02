import type BaseEntity from '~/types/entities/base_entity'

export default interface User extends BaseEntity{
    first_name: string
    last_name: string
    full_name: string
    email: string
    phone_number: string
}

export interface AuthTokens {
    access_token: string
    refresh_token: string
}

export type AuthUser = User & { tokens: AuthTokens }
