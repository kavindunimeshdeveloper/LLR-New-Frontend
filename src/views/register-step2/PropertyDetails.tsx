import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import AddressSection from '../shared/AddressSection'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Button } from '@mui/material'
import { PropertyFormData, PropertyResponseType } from 'src/context/types'
import { api } from 'src/utils/api'
import propertyStateToApi from 'src/utils/handlePropertyState'
import { getItem, setItem } from 'src/utils/localStorageHelper'
import errorHandler from 'src/utils/errorHandler'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { propertySchema } from './schema'
import { useAuth } from 'src/hooks/useAuth'
import { STAGE } from 'src/utils/constants'

const defaultValues = {
  address: { address1: '', address2: '', city: '', postCode: '' }
}

type PropertyDetailsProps = {
  handleOnSubmit: () => void
  handleGoBack?: () => void
  initialCreate?: boolean
}

const PropertyDetails = ({ initialCreate = false, handleOnSubmit, handleGoBack }: PropertyDetailsProps) => {
  const [loading, setLoading] = useState(false)

  const { user, setUser } = useAuth()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(propertySchema)
  })

  useEffect(() => {
    const property = getItem('property')
    const propertyData = property && JSON.parse(property)

    if (propertyData) {
      setValue('address', propertyData.address)
    } else if (initialCreate) {
      api.get<PropertyResponseType | null>('/property/property_data').then(res => {
        if (res.data) {
          setValue('address', {
            address1: res.data.address1,
            address2: res.data.address2 || '',
            city: res.data.city,
            postCode: res.data.postCode
          })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = (data: PropertyFormData) => {
    if (user?.stage === STAGE.COMPLETE) {
      setItem('property', JSON.stringify(data))
      handleOnSubmit()
    } else {
      setLoading(true)
      api
        .post('/property/property_add', propertyStateToApi(data))
        .then(() => {
          setItem('property', JSON.stringify(data))
          if (user) {
            setUser({ ...user, stage: STAGE.TENANT })
          }
          handleOnSubmit()
          setLoading(false)
        })
        .catch(err => {
          setLoading(false)
          toast.error(errorHandler(err))
        })
    }
  }

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant='h6' sx={{ fontWeight: 600, textAlign: 'start' }}>
              Property Details
            </Typography>
          </Grid>
        </Grid>

        <Grid item container spacing={6} alignItems='start' sx={{ mt: 4 }}>
          <AddressSection errors={errors.address} control={control} keyValue={'address'} setValue={setValue} />
        </Grid>
      </Box>
      {initialCreate && (
        <Grid
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          sx={{ py: 6, textAlign: 'center' }}
        >
          <Grid item>
            <Button component='button' size='large' variant='outlined' onClick={handleGoBack}>
              Back
            </Button>
          </Grid>
          <Grid item>
            <Button type={loading ? 'button' : 'submit'} size='large' color='primary' variant='contained'>
              {loading ? 'Loading...' : 'Next'}
            </Button>
          </Grid>
        </Grid>
      )}
    </form>
  )
}

export default PropertyDetails
