import type BaseEntity from '~/types/entities/base_entity'

export default interface User extends BaseEntity{
    first_name: string
    last_name: string
    email: string
    access_token: string
}
