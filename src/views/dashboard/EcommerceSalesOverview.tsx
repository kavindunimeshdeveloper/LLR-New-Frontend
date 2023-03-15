// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import HomeIcon from 'mdi-material-ui/HomeOutline'
import TenantsIcon from 'mdi-material-ui/AccountGroupOutline'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import ChevronUp from 'mdi-material-ui/ChevronUp'

// import TrendingUp from 'mdi-material-ui/TrendingUp'
// import AccountOutline from 'mdi-material-ui/AccountOutline'
// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

interface SaleDataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

const salesData: SaleDataType[] = [
  {
    stats: '12',
    color: 'primary',
    title: 'Total Properties',
    icon: <HomeIcon />
  },
  {
    color: 'info',
    stats: '15',
    icon: <TenantsIcon />,
    title: 'Total Tenants'
  },
  {
    icon: <Poll />,
    stats: '£28.5k',
    color: 'warning',
    title: 'Total Profit'
  }
]

const renderStats = () => {
  return salesData.map((sale: SaleDataType, index: number) => (
    <Grid item xs={12} sm={4} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar skin='light' variant='rounded' color={sale.color} sx={{ mr: 4 }}>
          {sale.icon}
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h3' sx={{ fontWeight: 600 }}>
            {sale.stats}
          </Typography>
          <Typography variant='subtitle1'>{sale.title}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const EcommerceSalesOverview = () => {
  return (
    <Card>
      <CardHeader
        sx={{ pb: 3.25 }}
        title='Sales Overview'
        titleTypographyProps={{ variant: 'h6' }}
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='caption' sx={{ mr: 1.5 }}>
              Total 42.5k Sales
            </Typography>
            <Typography variant='subtitle2' sx={{ color: 'success.main' }}>
              +18%
            </Typography>
            <ChevronUp fontSize='small' sx={{ color: 'success.main' }} />
          </Box>
        }
      />
      <CardContent>
        <Grid container spacing={6}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EcommerceSalesOverview