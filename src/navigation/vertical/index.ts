// ** Icon imports
import DashboardOutline from 'mdi-material-ui/ViewDashboardOutline'
import HomeCityOutline from 'mdi-material-ui/HomeCityOutline'
import AccountGroupOutline from 'mdi-material-ui/AccountGroupOutline'
import BriefcaseOutline from 'mdi-material-ui/BriefcaseOutline'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

// import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import BadgeAccountOutline from 'mdi-material-ui/BadgeAccountOutline'

// import CogOutline from 'mdi-material-ui/CogOutline'
import AccountCashOutline from 'mdi-material-ui/AccountCashOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: DashboardOutline,
      path: '/dashboard'
    },
    {
      title: 'Properties',
      icon: HomeCityOutline,
      path: '/properties'
    },
    {
      title: 'Tenants',
      icon: AccountGroupOutline,
      path: '/tenants'
    },
    {
      title: 'Toolkits',
      icon: BriefcaseOutline,
      path: '/toolkits'
    },
    {
      title: 'Products',
      icon: AccountCashOutline,
      path: '/products'
    },
    {
      title: 'Quotation',
      icon: RequestQuoteIcon,
      path: '/quotation'
    },

    // {
    //   title: 'Payments',
    //   icon: CreditCardOutline,
    //   path: '/payments'
    // },
    {
      sectionTitle: 'Account Settings'
    },
    {
      title: 'Profile',
      icon: BadgeAccountOutline,
      path: '/profile'
    }

    // {
    //   title: 'Settings',
    //   icon: CogOutline,
    //   path: '/settings'
    // }
  ]
}

export const AdminNavigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: DashboardOutline,
      path: '/dashboard'
    },
    {
      sectionTitle: 'Account Settings'
    },
    {
      title: 'Profile',
      icon: BadgeAccountOutline,
      path: '/profile'
    }
  ]
}

export default navigation
