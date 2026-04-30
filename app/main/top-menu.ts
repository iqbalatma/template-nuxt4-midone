import { type Icon } from '@/base/ui/lucide'

export interface Menu {
  icon?: Icon
  title?: string
  route_name?: string
  params?: any
  badge?: number
  sub_menu?: Menu[]
}

const mainMenu: Array<Menu> = [
  {
    icon: 'MessageSquare',
    route_name: 'chat',
    title: 'Chat',
  },
]

export default mainMenu
