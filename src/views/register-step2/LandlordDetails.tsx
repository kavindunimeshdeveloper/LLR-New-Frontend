import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import AddressSection from '../shared/AddressSection'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import Input from 'src/@core/components/Input/Input'
import { Button, Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { LandlordFormData } from 'src/context/types'
import landlordStateToApi, { landloardApitoState } from 'src/utils/handleLandloardState'
import { api } from 'src/utils/api'
import toast from 'react-hot-toast'
import errorHandler from 'src/utils/errorHandler'
import { getItem, setItem } from 'src/utils/localStorageHelper'
import NameTitile from 'src/@core/components/nameTitle/NameTitile'
import { landlordSchema } from './schema'
import { useAuth } from 'src/hooks/useAuth'
import { STAGE } from 'src/utils/constants'

const defaultValues = {
  title: 'Mr',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  ownership: false,
  registeredAddress: { address1: '', address2: '', city: '', postCode: '' },
  tradingAddress: { address1: '', address2: '', city: '', postCode: '' }
}

type LandlordDetailsProps = {
  handleOnSubmit: () => void
  initialCreate?: boolean
  goBack?: () => void
}

const LandlordDetails = ({ handleOnSubmit, initialCreate = false }: LandlordDetailsProps) => {
  const [isPrivate, setPrivate] = useState<boolean>(false)
  const [sameAddress, setSameAddres] = useState<string>('different')
  const [loading, setLoading] = useState(false)

  const auth = useAuth()

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(landlordSchema)
  })

  const updateFormData = (landlordData: LandlordFormData) => {
    setValue('title', landlordData.title || 'Mr')
    setValue('firstName', landlordData.firstName)
    setValue('lastName', landlordData.lastName)
    setValue('email', landlordData.email)
    setValue('phone', landlordData.phone)
    setValue('tradingAddress', landlordData.tradingAddress)
    setValue('registeredAddress', landlordData.registeredAddress)
    setValue('ownership', landlordData.ownership)
  }

  useEffect(() => {
    const landlord = getItem('landlord')
    const landlordData = landlord && JSON.parse(landlord)
    if (landlordData) {
      setPrivate(landlordData.ownership)
      updateFormData(landlordData)
    } else if (initialCreate) {
      api.get('/landlord/landlord').then(res => {
        console.log(res)
        if (res.data) {
          updateFormData(landloardApitoState(res.data))
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = (data: LandlordFormData) => {
    setLoading(true)
    api
      .post('/landlord/landlord-register', landlordStateToApi(data))
      .then(() => {
        setItem('landlord', JSON.stringify(data))
        if (auth.user) {
          auth.setUser({ ...auth.user, stage: STAGE.PROPERTY })
        }
        handleOnSubmit()
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        toast.error(errorHandler(err))
      })
  }

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant='h6' sx={{ fontWeight: 600, textAlign: 'start' }}>
              Landlord Details
            </Typography>
          </Grid>
          <Grid item xs={12} sm={10}>
            <NameTitile control={control} name={'title'} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Input
              name={'firstName'}
              label={'First Name'}
              error={errors.firstName?.message}
              control={control}
              required
              autoFocus
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Input name={'lastName'} label={'Last Name'} error={errors.lastName?.message} control={control} required />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Input name={'phone'} label={'Contact Number'} error={errors.phone?.message} control={control} required />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Input name={'email'} label={'Email'} error={errors.email?.message} control={control} required />
          </Grid>
        </Grid>

        <Grid container direction='row' justifyContent='space-between' alignItems='center' spacing={6} sx={{ my: 6 }}>
          <Grid item xs={12} sm={2}>
            <Typography variant='subtitle1' sx={{ fontWeight: 600, textAlign: 'start' }}>
              Ownership
            </Typography>
          </Grid>
          <Grid item xs={12} sm={10} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Controller
              name={'ownership'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      aria-labelledby='demo-row-radio-buttons-group-label'
                      name='row-radio-buttons-group'
                      checked={value}
                      value={value}
                      onChange={e => {
                        setPrivate(s => !s)
                        onChange(e)
                      }}
                    ></Checkbox>
                  }
                  label='Private(Ltd)'
                />
              )}
            />
          </Grid>

          <Grid item container spacing={6} alignItems='start'>
            <Grid item xs={12}>
              <Typography variant='h6' sx={{ fontWeight: 600, textAlign: 'start' }}>
                Registered Address
              </Typography>
            </Grid>
            <AddressSection
              errors={errors.registeredAddress}
              control={control}
              keyValue={'registeredAddress'}
              setValue={setValue}
            />
          </Grid>

          {isPrivate && (
            <>
              <Grid item xs={12} sm={2}>
                <Typography variant='subtitle1' sx={{ fontWeight: 600, textAlign: 'start' }}>
                  Trading Address
                </Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={sameAddress}
                  onChange={e => {
                    setSameAddres(e.target.value)
                    if (e.target.value === 'same') {
                      setValue('tradingAddress', getValues('registeredAddress'))
                    }
                  }}
                >
                  <FormControlLabel value={'same'} control={<Radio />} label='Same' />
                  <FormControlLabel value={'different'} control={<Radio />} label='Different' />
                </RadioGroup>
              </Grid>
            </>
          )}
          {isPrivate && sameAddress === 'different' && (
            <Grid item container spacing={6} alignItems='start'>
              <Grid item xs={12}>
                <Typography variant='h6' sx={{ fontWeight: 600, textAlign: 'start' }}>
                  Trading Address
                </Typography>
              </Grid>
              <AddressSection
                errors={errors.tradingAddress}
                control={control}
                keyValue={'tradingAddress'}
                setValue={setValue}
              />
            </Grid>
          )}
        </Grid>

        {initialCreate && (
          <Grid
            container
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            sx={{ py: 6, textAlign: 'center' }}
          >
            <Grid item>
              <Button component='button' size='large' variant='outlined' disabled>
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
      </Box>
    </form>
  )
}

export default LandlordDetails
