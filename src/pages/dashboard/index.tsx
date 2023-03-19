// ** React Imports
// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icon Imports
import HomeIcon from 'mdi-material-ui/HomeOutline'
import TenantsIcon from 'mdi-material-ui/AccountGroupOutline'

// ** Next Imports
import { GetStaticProps } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
// ** Custom Component Import
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Demo Imports
import DashboardBanner from 'src/views/pages/dashboard/DashboardBanner'

// ** Demo Components Imports
// import EcommerceSalesOverview from 'src/views/dashboard/EcommerceSalesOverview'
// import CrmTotalGrowth from 'src/views/dashboard/CrmTotalGrowth'
// import CrmTotalProfit from 'src/views/dashboard/CrmTotalProfit'
import { StatsDataType } from '../../@core/components/dashboard-stats/types'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { STAGE } from 'src/utils/constants'
import { useRouter } from 'next/router'
import { api } from 'src/utils/api'
import toast from 'react-hot-toast'
import errorHandler from 'src/utils/errorHandler'
import { Box } from '@mui/system'
import { CircularProgress } from '@mui/material'
import TenantConfirm from './tenant-confirm'

type CountType = {
  property: number
  allTenants: number
  availableTenants: number
}

const Dashboard = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CountType>({ allTenants: 0, availableTenants: 0, property: 0 })

  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log(auth)
    if (auth.user?.stage !== STAGE.COMPLETE) {
      router.replace('/')
    }
    const getData = async () => {
      try {
        const [property, tenantCount] = await Promise.all([api.get('/property/property'), api.get('/tenant/tenant-count')])
        console.log(property)
        console.log(tenantCount)

        setLoading(false)
        setData({
          allTenants: tenantCount.data.allTenants,
          availableTenants: tenantCount.data.availableTenants,
          property: property.data.length
        })
      } catch (error) {
        setLoading(false)
        toast.error(errorHandler(error))
      }
    }
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    )

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DashboardBanner />
      </Grid>
      {/* <Grid item xs={12}>
        <EcommerceSalesOverview />
      </Grid> */}

      {auth.user?.isAdmin ? (
        <Grid item container spacing={6} className='match-height' sx={{ mt: 10, mx: 4, background: 'white' }}>
          <TenantConfirm />
        </Grid>
      ) : (
        <Grid item container spacing={6} className='match-height'>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardStatisticsVertical
              stats={data.property.toString()}
              color='primary'
              trendNumber='+10%'
              icon={<HomeIcon />}
              title='Properties'
              chipText='This month'
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardStatisticsVertical
              stats={(data.allTenants - data.availableTenants).toString()}
              color='success'
              trendNumber='+15%'
              icon={<TenantsIcon />}
              title='Tenants'
              chipText='This month'
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CardStatisticsVertical
              stats={data.availableTenants.toString()}
              color='info'
              trendNumber='+15%'
              icon={<TenantsIcon />}
              title='Available Tenants'
              chipText='This month'
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={4} lg={3}>
          <CrmTotalProfit />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <CrmTotalGrowth />
        </Grid> */}
        </Grid>
      )}
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/pages/dashboard/stats')
  const apiData: StatsDataType = res.data

  return {
    props: {
      apiData
    }
  }
}

export default Dashboard
