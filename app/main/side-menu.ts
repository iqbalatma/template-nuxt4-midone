import { type Icon } from '@/base/ui/lucide'

export interface Menu {
  icon?: Icon
  title?: string
  route_name?: string
  params?: any
  badge?: number
  sub_menu?: Menu[]
}

const mainMenu: (string | Menu)[] = [
  'MANAGEMENT',
  {
    icon: 'UsersRoundIcon',
    route_name: 'management/users',
    title: 'Users',
  },
  {
    icon: 'UserLockIcon',
    route_name: 'management/roles',
    title: 'Roles',
  },
  {
    icon: 'ShieldIcon',
    route_name: 'management/permissions',
    title: 'Permissions',
  },
  'GENERAL REPORTS',
  {
    icon: 'CircleGauge',
    title: 'Dashboards',
    badge: 4,
    sub_menu: [
      {
        icon: 'PanelBottomClose',
        route_name: 'dashboard-overview-1',
        title: 'Overview 1',
      },
      {
        icon: 'Disc3',
        route_name: 'dashboard-overview-2',
        title: 'Overview 2',
      },
      {
        icon: 'SquareActivity',
        route_name: 'dashboard-overview-3',
        title: 'Overview 3',
      },
      {
        icon: 'Album',
        route_name: 'dashboard-overview-4',
        title: 'Overview 4',
      },
    ],
  },
  {
    icon: 'SquareKanban',
    title: 'E-Commerce',
    badge: 2,
    sub_menu: [
      {
        icon: 'CircleGauge',
        route_name: 'categories',
        title: 'Categories',
      },
      {
        icon: 'CircleGauge',
        route_name: 'add-product',
        title: 'Add Product',
      },
      {
        icon: 'CircleGauge',
        title: 'Products',
        sub_menu: [
          {
            icon: 'CircleGauge',
            route_name: 'product-list',
            title: 'Product List',
          },
          {
            icon: 'CircleGauge',
            route_name: 'product-grid',
            title: 'Product Grid',
          },
        ],
      },
      {
        icon: 'CircleGauge',
        title: 'Transactions',
        sub_menu: [
          {
            icon: 'CircleGauge',
            route_name: 'transaction-list',
            title: 'Transaction List',
          },
          {
            icon: 'CircleGauge',
            route_name: 'transaction-detail',
            title: 'Transaction Detail',
          },
        ],
      },
      {
        icon: 'CircleGauge',
        title: 'Sellers',
        sub_menu: [
          {
            icon: 'CircleGauge',
            route_name: 'seller-list',
            title: 'Seller List',
          },
          {
            icon: 'CircleGauge',
            route_name: 'seller-detail',
            title: 'Seller Detail',
          },
        ],
      },
      {
        icon: 'CircleGauge',
        route_name: 'reviews',
        title: 'Reviews',
      },
    ],
  },
  'APPS',
  {
    icon: 'Inbox',
    route_name: 'inbox',
    title: 'Inbox',
  },
  {
    icon: 'FolderSearch',
    route_name: 'file-manager',
    title: 'File Manager',
    badge: 5,
  },
  {
    icon: 'CreditCard',
    route_name: 'point-of-sale',
    title: 'Point of Sale',
  },
  {
    icon: 'MessageSquare',
    route_name: 'chat',
    title: 'Chat',
    badge: 3,
  },
  {
    icon: 'FileText',
    route_name: 'post',
    title: 'Post',
  },
  'PAGES',
  {
    icon: 'Layout',
    title: 'Crud',
    sub_menu: [
      {
        icon: 'List',
        route_name: 'crud-data-list',
        title: 'Data List',
      },
      {
        icon: 'SquarePen',
        route_name: 'crud-form',
        title: 'Form',
      },
    ],
  },
  {
    icon: 'Users',
    title: 'Users',
    sub_menu: [
      {
        icon: 'UserPlus',
        route_name: 'users-layout-1',
        title: 'Layout 1',
      },
      {
        icon: 'UserMinus',
        route_name: 'users-layout-2',
        title: 'Layout 2',
      },
      {
        icon: 'UserCheck',
        route_name: 'users-layout-3',
        title: 'Layout 3',
      },
    ],
  },
  {
    icon: 'UserCircle',
    title: 'Profile',
    sub_menu: [
      {
        icon: 'User',
        route_name: 'profile-overview-1',
        title: 'Overview 1',
      },
      {
        icon: 'UserRound',
        route_name: 'profile-overview-2',
        title: 'Overview 2',
      },
      {
        icon: 'Contact',
        route_name: 'profile-overview-3',
        title: 'Overview 3',
      },
    ],
  },
  {
    icon: 'Package',
    title: 'Pages',
    sub_menu: [
      {
        icon: 'Wand2',
        title: 'Wizards',
        sub_menu: [
          {
            icon: 'Circle',
            route_name: 'wizard-layout-1',
            title: 'Layout 1',
          },
          {
            icon: 'Circle',
            route_name: 'wizard-layout-2',
            title: 'Layout 2',
          },
          {
            icon: 'Circle',
            route_name: 'wizard-layout-3',
            title: 'Layout 3',
          },
        ],
      },
      {
        icon: 'Notebook',
        title: 'Blog',
        sub_menu: [
          {
            icon: 'Circle',
            route_name: 'blog-layout-1',
            title: 'Layout 1',
          },
          {
            icon: 'Circle',
            route_name: 'blog-layout-2',
            title: 'Layout 2',
          },
          {
            icon: 'Circle',
            route_name: 'blog-layout-3',
            title: 'Layout 3',
          },
        ],
      },
      {
        icon: 'Tag',
        title: 'Pricing',
        sub_menu: [
          {
            icon: 'Circle',
            route_name: 'pricing-layout-1',
            title: 'Layout 1',
          },
          {
            icon: 'Circle',
            route_name: 'pricing-layout-2',
            title: 'Layout 2',
          },
        ],
      },
      {
        icon: 'FileText',
        title: 'Invoice',
        sub_menu: [
          {
            icon: 'Circle',
            route_name: 'invoice-layout-1',
            title: 'Layout 1',
          },
          {
            icon: 'Circle',
            route_name: 'invoice-layout-2',
            title: 'Layout 2',
          },
        ],
      },
      {
        icon: 'HelpCircle',
        title: 'FAQ',
        sub_menu: [
          {
            icon: 'Circle',
            route_name: 'faq-layout-1',
            title: 'Layout 1',
          },
          {
            icon: 'Circle',
            route_name: 'faq-layout-2',
            title: 'Layout 2',
          },
          {
            icon: 'Circle',
            route_name: 'faq-layout-3',
            title: 'Layout 3',
          },
        ],
      },
      {
        icon: 'Lock',
        route_name: 'login',
        title: 'Login',
      },
      {
        icon: 'UserPlus',
        route_name: 'register',
        title: 'Register',
      },
      {
        icon: 'ShieldAlert',
        route_name: 'error-page',
        title: 'Error Page',
      },
      {
        icon: 'Settings',
        route_name: 'update-profile',
        title: 'Update profile',
      },
      {
        icon: 'Key',
        route_name: 'change-password',
        title: 'Change Password',
      },
    ],
  },
  'UI COMPONENTS',
  {
    icon: 'Package',
    title: 'Base',
    sub_menu: [
      {
        icon: 'Square',
        route_name: 'docs/slot',
        title: 'Slot',
      },
      {
        icon: 'BoxSelect',
        route_name: 'docs/box',
        title: 'Box',
      },
      {
        icon: 'Scroll',
        route_name: 'docs/scroll-area',
        title: 'Scroll Area',
      },
    ],
  },
  {
    icon: 'Navigation',
    title: 'Navigation',
    sub_menu: [
      {
        icon: 'Map',
        route_name: 'docs/breadcrumb',
        title: 'Breadcrumb',
      },
      {
        icon: 'Menu',
        route_name: 'docs/menu',
        title: 'Menu',
      },
      {
        icon: 'Ellipsis',
        route_name: 'docs/pagination',
        title: 'Pagination',
      },
      {
        icon: 'Library',
        route_name: 'docs/tabs',
        title: 'Tabs',
      },
    ],
  },
  {
    icon: 'ListChecks',
    title: 'Forms',
    sub_menu: [
      {
        icon: 'SquareCheck',
        route_name: 'docs/button',
        title: 'Button',
      },
      {
        icon: 'CheckSquare',
        route_name: 'docs/checkbox',
        title: 'Checkbox',
      },
      {
        icon: 'ChevronDown',
        route_name: 'docs/combobox',
        title: 'Combobox',
      },
      {
        icon: 'Calendar',
        route_name: 'docs/datepicker',
        title: 'Datepicker',
      },
      {
        icon: 'FormInput',
        route_name: 'docs/field',
        title: 'Field',
      },
      {
        icon: 'Type',
        route_name: 'docs/input',
        title: 'Input',
      },
      {
        icon: 'List',
        route_name: 'docs/native-select',
        title: 'Native Select',
      },
      {
        icon: 'CheckCircle2',
        route_name: 'docs/radio-group',
        title: 'Radio Group',
      },
      {
        icon: 'ListFilter',
        route_name: 'docs/select',
        title: 'Select',
      },
      {
        icon: 'Sliders',
        route_name: 'docs/slider',
        title: 'Slider',
      },
      {
        icon: 'ToggleRight',
        route_name: 'docs/switch',
        title: 'Switch',
      },
      {
        icon: 'AlignLeft',
        route_name: 'docs/textarea',
        title: 'Textarea',
      },
    ],
  },
  {
    icon: 'Monitor',
    title: 'Data Display',
    sub_menu: [
      {
        icon: 'ChevronsDown',
        route_name: 'docs/accordion',
        title: 'Accordion',
      },
      {
        icon: 'UserSquare',
        route_name: 'docs/avatar',
        title: 'Avatar',
      },
      {
        icon: 'BadgeCheck',
        route_name: 'docs/badge',
        title: 'Badge',
      },
      {
        icon: 'Presentation',
        route_name: 'docs/carousel',
        title: 'Carousel',
      },
      {
        icon: 'Table',
        route_name: 'docs/table',
        title: 'Table',
      },
      {
        icon: 'Database',
        route_name: 'docs/data-table',
        title: 'Data Table',
      },
    ],
  },
  {
    icon: 'MessageSquare',
    title: 'Feedback',
    sub_menu: [
      {
        icon: 'AlertCircle',
        route_name: 'docs/alert',
        title: 'Alert',
      },
      {
        icon: 'CircleDot',
        route_name: 'docs/progress-circular',
        title: 'Progress Circular',
      },
      {
        icon: 'Minus',
        route_name: 'docs/progress-linear',
        title: 'Progress Linear',
      },
      {
        icon: 'StickyNote',
        route_name: 'docs/toast',
        title: 'Toast',
      },
    ],
  },
  {
    icon: 'Layers',
    title: 'Overlay',
    sub_menu: [
      {
        icon: 'SquareStack',
        route_name: 'docs/dialog',
        title: 'Dialog',
      },
      {
        icon: 'MessageSquare',
        route_name: 'docs/popover',
        title: 'Popover',
      },
      {
        icon: 'PanelLeft',
        route_name: 'docs/sheet',
        title: 'Sheet',
      },
      {
        icon: 'Info',
        route_name: 'docs/tooltip',
        title: 'Tooltip',
      },
    ],
  },
  {
    icon: 'BarChart3',
    title: 'Visuals',
    sub_menu: [
      {
        icon: 'PieChart',
        route_name: 'docs/chart',
        title: 'Chart',
      },
      {
        icon: 'MapPin',
        route_name: 'docs/map',
        title: 'Map',
      },
    ],
  },
]

export default mainMenu
