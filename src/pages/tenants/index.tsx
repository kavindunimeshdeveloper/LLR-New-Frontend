// ** React Imports
// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import DialogTenantEdit from '../../views/tenant/DialogTenantEdit'

// ** Demo Imports
// ** Demo Components Imports
import CardCongratulationsJohn from '../../views/ui/cards/gamification/CardCongratulationsJohn'
import { useEffect, useState } from 'react'
import { TenantResponse } from 'src/context/types'
import { api } from 'src/utils/api'
import toast from 'react-hot-toast'
import errorHandler from 'src/utils/errorHandler'
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const Tenants = () => {
  const [tenants, setTenants] = useState<TenantResponse[] | []>([])
  const [props, setProps] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [property, setProperty] = useState('')

  useEffect(() => {
    getTenants()
  }, [])

  const getTenants = async () => {
    setLoading(true)
    try {
      const [tenants, properties] = await Promise.all([api.get('/tenant/tenant-data'), api.get('/property/all-properties')])
      setLoading(false)
      setTenants(tenants.data)
      setProps(properties.data)
    } catch (error) {
      setLoading(false)
      toast.error(errorHandler(error))
    }
  }

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

  const options = props.map((p: any) => ({
    value: p.id,
    label: `${p.address1}, ${p.address2 || ''} ${p.city} - (${p.subscription.stripeProduct.name})`
  }))

  const filteredTenants = property ? tenants.filter((t: any) => t.propertyId === property) : tenants

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} container justifyContent='flex-end'>
        <DialogTenantEdit fetchTenant={() => getTenants()} />
      </Grid>

      <Grid item xs={12} container>
        <FormControl sx={{ mb: 12, width: '50%' }}>
          <InputLabel id='demo-simple-select-label'>Select a property</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={property}
            label='Select a property'
            onChange={e => {
              setProperty(e.target.value)
            }}
          >
            {options.map((a: any) => (
              <MenuItem key={`baths-${Math.random()}`} value={a.value}>
                {a.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {filteredTenants?.map((tenant: TenantResponse, i: number) => (
        <Grid item xs={12} sm={6} xl={4} key={`tenant-${i}`}>
          <CardCongratulationsJohn data={tenant} />
        </Grid>
      ))}
    </Grid>
  )
}

export default Tenants
