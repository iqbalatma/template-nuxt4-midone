import type { RoleMaster } from '~/types/entities/role'

/**
 * Mirrors `user.Resource` in the Go API - returned by GET /api/auth/me and
 * GET /api/management/users. Note there is no `updated_at`, and `roles` uses
 * the trimmed {id, name} shape.
 */
export default interface User {
  id: string
  first_name: string
  last_name: string | null
  email: string
  phone_number: string | null
  created_at: string
  roles: RoleMaster[]
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

/**
 * Mirrors `auth.Resource` - returned by POST /api/auth/authenticate and
 * /api/auth/refresh. Differs from `User`: it carries `full_name` but omits
 * `created_at` and `roles`.
 */
export interface AuthProfile {
  id: string
  first_name: string
  last_name: string | null
  full_name: string
  email: string
  phone_number: string | null
}

export type AuthUser = AuthProfile & { tokens: AuthTokens }