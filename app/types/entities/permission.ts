import type BaseEntity from '~/types/entities/base_entity'

export default interface Permission extends BaseEntity {
  name: string
  description: string | null
  group: string
}