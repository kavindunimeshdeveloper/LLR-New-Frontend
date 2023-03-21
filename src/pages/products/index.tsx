import Grid from '@mui/material/Grid'

// ** Custom Component Import
import { useEffect, useState } from 'react'
import { api } from 'src/utils/api'
import toast from 'react-hot-toast'
import errorHandler from 'src/utils/errorHandler'
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import ProductCard from 'src/views/products/ProductCard'
import { toolkitMockData } from 'src/utils/toolkitMockData'
import { useRouter } from 'next/router'

const Products = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<[any] | []>([])
  const [rentGuaranteeData, setRentGuarantee] = useState<any>(null)
  const [creditCheckData, setCreditCheck] = useState<any>(null)
  const [landlordData, setLandlord] = useState<any>(null)
  const [property, setProperty] = useState('')

  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [rentGuarantee, creditCheck, landlord, prop] = await Promise.all([
        api.get('/product/guarantee_product'),
        api.get('/product/credit_product'),
        api.get('/product/landlord_product'),
        api.get('/property/all-properties')
      ])

      setLoading(false)
      setData(prop.data)
      setRentGuarantee(rentGuarantee.data)
      setCreditCheck(creditCheck.data)
      setLandlord(landlord.data)
      console.log(creditCheckData)
    } catch (error) {
      setLoading(false)
      toast.error(errorHandler(error))
    }
  }

  useEffect(() => {
    const propertyId = router.query.property
    setProperty(propertyId ? `${propertyId}` : '')
  }, [router.query])

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

  const options = data.map(p => ({
    value: p.id,
    label: `${p.address1}, ${p.address2 || ''} ${p.city} - (${p.subscription.stripeProduct.name})`,
    includeLandlordEmergency: p.includeLandlordEmergency,
    includeRentGuarantee: p.includeRentGuarantee
  }))

  const insurance = toolkitMockData.toolkit2[toolkitMockData.toolkit2.length - 1].items

  const selectedProp = options.find(op => op.value === property) || null

  return (
    <Box sx={{ background: 'white', px: 6, py: 6, borderRadius: '1rem' }}>
      <Typography variant='h4' sx={{ my: 6 }}>
        Products
      </Typography>
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
      {property && (
        <Grid container spacing={6} direction='row' justifyContent='center' alignItems='stretch'>
          <Grid container item xs={12} md={4} justifyContent='center'>
            <ProductCard
              title={creditCheckData.name}
              subTitle='Add more tenants to your property'
              isCreditCheck={true}
              image={creditCheckData.image}
              price={creditCheckData.price.amount / 100}
              propertyId={property}
              productId={creditCheckData.stripeProductId}
              isOneTimePayment
            />
          </Grid>
          <Grid container item xs={12} sm={4} justifyContent='center'>
            <ProductCard
              title={landlordData.name}
              subTitle={insurance.join(`, `)}
              isCreditCheck={false}
              image={landlordData.image}
              price={landlordData.price.amount / 100}
              propertyId={property}
              disabled={selectedProp?.includeLandlordEmergency}
              productId={landlordData.stripeProductId}
            />
          </Grid>

          <Grid container item xs={12} sm={4} justifyContent='center'>
            <ProductCard
              title={rentGuaranteeData.name}
              subTitle='Rent Gurantee up to £2500.00 PCM'
              isCreditCheck={false}
              image={rentGuaranteeData.image}
              price={rentGuaranteeData.price.amount / 100}
              propertyId={property}
              disabled={selectedProp?.includeRentGuarantee}
              productId={rentGuaranteeData.stripeProductId}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default Products
