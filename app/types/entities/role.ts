import type BaseEntity from '~/types/entities/base_entity'

export default interface Role extends BaseEntity{
  name: string
  is_mutable: boolean
}
