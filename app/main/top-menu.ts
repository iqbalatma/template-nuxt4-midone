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
    icon: 'CircleGauge',
    title: 'Dashboard',
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
    icon: 'CircleGauge',
    title: 'Apps',
    sub_menu: [
      {
        icon: 'Users',
        route_name: 'users',
        title: 'Users',
        sub_menu: [
          {
            icon: 'Zap',
            route_name: 'users-layout-1',
            title: 'Layout 1',
          },
          {
            icon: 'Zap',
            route_name: 'users-layout-2',
            title: 'Layout 2',
          },
          {
            icon: 'Zap',
            route_name: 'users-layout-3',
            title: 'Layout 3',
          },
        ],
      },
      {
        icon: 'Trello',
        route_name: 'profile',
        title: 'Profile',
        sub_menu: [
          {
            icon: 'Zap',
            route_name: 'profile-overview-1',
            title: 'Overview 1',
          },
          {
            icon: 'Zap',
            route_name: 'profile-overview-2',
            title: 'Overview 2',
          },
          {
            icon: 'Zap',
            route_name: 'profile-overview-3',
            title: 'Overview 3',
          },
        ],
      },
      {
        icon: 'ShoppingBag',
        route_name: 'ecommerce',
        title: 'E-Commerce',
        sub_menu: [
          {
            icon: 'Zap',
            route_name: 'categories',
            title: 'Categories',
          },
          {
            icon: 'Zap',
            route_name: 'add-product',
            title: 'Add Product',
          },
          {
            icon: 'Zap',
            route_name: 'product-list',
            title: 'Product List',
          },
          {
            icon: 'Zap',
            route_name: 'product-grid',
            title: 'Product Grid',
          },
          {
            icon: 'Zap',
            route_name: 'transaction-list',
            title: 'Transaction List',
          },
          {
            icon: 'Zap',
            route_name: 'transaction-detail',
            title: 'Transaction Detail',
          },
          {
            icon: 'Zap',
            route_name: 'seller-list',
            title: 'Seller List',
          },
          {
            icon: 'Zap',
            route_name: 'seller-detail',
            title: 'Seller Detail',
          },
          {
            icon: 'Zap',
            route_name: 'reviews',
            title: 'Reviews',
          },
        ],
      },
      {
        icon: 'Inbox',
        route_name: 'inbox',
        title: 'Inbox',
      },
      {
        icon: 'Folder',
        route_name: 'file-manager',
        title: 'File Manager',
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
      },
      {
        icon: 'FileText',
        route_name: 'post',
        title: 'Post',
      },
      {
        icon: 'Calendar',
        route_name: 'calendar',
        title: 'Calendar',
      },
      {
        icon: 'Edit',
        route_name: 'crud',
        title: 'Crud',
        sub_menu: [
          {
            icon: 'Zap',
            route_name: 'crud-data-list',
            title: 'Data List',
          },
          {
            icon: 'Zap',
            route_name: 'crud-form',
            title: 'Form',
          },
        ],
      },
    ],
  },
  {
    icon: 'Layout',
    title: 'Pages',
    sub_menu: [
      {
        icon: 'CircleGauge',
        route_name: 'wizards',
        title: 'Wizards',
        sub_menu: [
          {
            icon: 'Zap',
            route_name: 'wizard-layout-1',
            title: 'Layout 1',
          },
          {
            icon: 'Zap',
            route_name: 'wizard-layout-2',
            title: 'Layout 2',
          },
          {
            icon: 'Zap',
            route_name: 'wizard-layout-3',
            title: 'Layout 3',
          },
        ],
      },
      {
        icon: 'CircleGauge',
        route_name: 'blog',
        title: 'Blog',
        sub_menu: [
          {
            icon: 'Zap',
            route_name: 'blog-layout-1',
            title: 'Layout 1',
          },
          {
            icon: 'Zap',
            route_name: 'blog-layout-2',
            title: 'Layout 2',
          },
          {
            icon: 'Zap',
            route_name: 'blog-layout-3',
            title: 'Layout 3',
          },
        ],
      },
      {
        icon: 'CircleGauge',
        route_name: 'pricing',
        title: 'Pricing',
        sub_menu: [
          {
            icon: 'Zap',
            route_name: 'pricing-layout-1',
            title: 'Layout 1',
          },
          {
            icon: 'Zap',
            route_name: 'pricing-layout-2',
            title: 'Layout 2',
          },
        ],
      },
      {
        icon: 'CircleGauge',
        route_name: 'invoice',
        title: 'Invoice',
        sub_menu: [
          {
            icon: 'Zap',
            route_name: 'invoice-layout-1',
            title: 'Layout 1',
          },
          {
            icon: 'Zap',
            route_name: 'invoice-layout-2',
            title: 'Layout 2',
          },
        ],
      },
      {
        icon: 'CircleGauge',
        route_name: 'faq',
        title: 'FAQ',
        sub_menu: [
          {
            icon: 'Zap',
            route_name: 'faq-layout-1',
            title: 'Layout 1',
          },
          {
            icon: 'Zap',
            route_name: 'faq-layout-2',
            title: 'Layout 2',
          },
          {
            icon: 'Zap',
            route_name: 'faq-layout-3',
            title: 'Layout 3',
          },
        ],
      },
      {
        icon: 'CircleGauge',
        route_name: 'login',
        title: 'Login',
      },
      {
        icon: 'CircleGauge',
        route_name: 'register',
        title: 'Register',
      },
      {
        icon: 'CircleGauge',
        route_name: 'error-page',
        title: 'Error Page',
      },
      {
        icon: 'CircleGauge',
        route_name: 'update-profile',
        title: 'Update profile',
      },
      {
        icon: 'CircleGauge',
        route_name: 'change-password',
        title: 'Change Password',
      },
    ],
  },
  {
    icon: 'Package',
    title: 'Docs',
    sub_menu: [
      {
        icon: 'Box',
        title: 'Base',
        sub_menu: [
          {
            icon: 'Circle',
            route_name: 'docs/slot',
            title: 'Slot',
          },
          {
            icon: 'Circle',
            route_name: 'docs/box',
            title: 'Box',
          },
          {
            icon: 'Circle',
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
            icon: 'Circle',
            route_name: 'docs/breadcrumb',
            title: 'Breadcrumb',
          },
          {
            icon: 'Circle',
            route_name: 'docs/menu',
            title: 'Menu',
          },
          {
            icon: 'Circle',
            route_name: 'docs/pagination',
            title: 'Pagination',
          },
          {
            icon: 'Circle',
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
            icon: 'Circle',
            route_name: 'docs/button',
            title: 'Button',
          },
          {
            icon: 'Circle',
            route_name: 'docs/checkbox',
            title: 'Checkbox',
          },
          {
            icon: 'Circle',
            route_name: 'docs/combobox',
            title: 'Combobox',
          },
          {
            icon: 'Circle',
            route_name: 'docs/datepicker',
            title: 'Datepicker',
          },
          {
            icon: 'Circle',
            route_name: 'docs/field',
            title: 'Field',
          },
          {
            icon: 'Circle',
            route_name: 'docs/input',
            title: 'Input',
          },
          {
            icon: 'Circle',
            route_name: 'docs/native-select',
            title: 'Native Select',
          },
          {
            icon: 'Circle',
            route_name: 'docs/radio-group',
            title: 'Radio Group',
          },
          {
            icon: 'Circle',
            route_name: 'docs/select',
            title: 'Select',
          },
          {
            icon: 'Circle',
            route_name: 'docs/slider',
            title: 'Slider',
          },
          {
            icon: 'Circle',
            route_name: 'docs/switch',
            title: 'Switch',
          },
          {
            icon: 'Circle',
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
            icon: 'Circle',
            route_name: 'docs/accordion',
            title: 'Accordion',
          },
          {
            icon: 'Circle',
            route_name: 'docs/avatar',
            title: 'Avatar',
          },
          {
            icon: 'Circle',
            route_name: 'docs/badge',
            title: 'Badge',
          },
          {
            icon: 'Circle',
            route_name: 'docs/carousel',
            title: 'Carousel',
          },
          {
            icon: 'Circle',
            route_name: 'docs/table',
            title: 'Table',
          },
          {
            icon: 'Circle',
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
            icon: 'Circle',
            route_name: 'docs/alert',
            title: 'Alert',
          },
          {
            icon: 'Circle',
            route_name: 'docs/progress-circular',
            title: 'Progress Circular',
          },
          {
            icon: 'Circle',
            route_name: 'docs/progress-linear',
            title: 'Progress Linear',
          },
          {
            icon: 'Circle',
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
            icon: 'Circle',
            route_name: 'docs/dialog',
            title: 'Dialog',
          },
          {
            icon: 'Circle',
            route_name: 'docs/popover',
            title: 'Popover',
          },
          {
            icon: 'Circle',
            route_name: 'docs/sheet',
            title: 'Sheet',
          },
          {
            icon: 'Circle',
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
            icon: 'Circle',
            route_name: 'docs/chart',
            title: 'Chart',
          },
          {
            icon: 'Circle',
            route_name: 'docs/map',
            title: 'Map',
          },
        ],
      },
    ],
  },
]

export default mainMenu
