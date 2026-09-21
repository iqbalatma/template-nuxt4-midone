import type BaseEntity from '~/types/entities/base_entity'

/**
 * Mirrors `m2mclient.M2MClientResource` in the Go API. The secret is never on
 * this type: only its bcrypt hash is stored, and the plaintext is returned once
 * at creation (or regeneration) as `M2MClientCreated`.
 */
export default interface M2MClient extends BaseEntity {
  client: string
  /** Route scopes this client may call — "*" grants every scope. */
  scope: string[]
  /** Set means revoked. The row stays so past requests remain attributable. */
  revoked_at: string | null
}

/**
 * Mirrors `m2mclient.AllScopes` in the Go API — keep the two in step, the same
 * way enums/Permission.ts mirrors enums/permission.go. A scope offered here but
 * not declared there is refused by the `m2m_scope` validator; one declared
 * there but missing here simply cannot be picked.
 *
 * A template declares only the wildcard. Add yours alongside it:
 *
 *   export const M2M_SCOPES = ['*', 'invoices'] as const
 */
export const M2M_SCOPES = ['*'] as const
