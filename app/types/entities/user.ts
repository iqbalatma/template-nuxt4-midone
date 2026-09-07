import type { RoleMaster } from '~/types/entities/role'

/**
 * Mirrors `media.Resource`. `url` and every entry in `conversions` are
 * root-relative paths served by the API host, not this one - prefix them with
 * `apiBase` before putting them in an <img> (see useAuthUser's avatarUrl).
 */
export interface Media {
  id: string
  url: string
  conversions: Record<string, string>
  mime_type: string
  human_size: string
}

/**
 * Mirrors `user.Resource` in the Go API - returned by GET /api/management/users.
 * Note there is no `updated_at`, and `roles` uses the trimmed {id, name} shape.
 */
export default interface User {
  id: string
  first_name: string
  last_name: string | null
  email: string
  phone_number: string | null
  created_at: string
  roles: RoleMaster[]
  /** Null until the user uploads one; the avatar collection is single-file. */
  avatar: Media | null
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

/**
 * Mirrors `user.ProfileResource` - returned by GET /api/me and PATCH /api/me.
 * `permissions` is the flattened, deduplicated list across every role the user
 * holds; it is the only place the frontend learns what the user may do, and it
 * is deliberately absent from the plain `User` shape the list endpoint returns.
 */
export interface Profile extends User {
  permissions: string[]
}
