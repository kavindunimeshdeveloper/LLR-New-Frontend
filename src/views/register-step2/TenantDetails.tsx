import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import AddressSection from '../shared/AddressSection'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from 'src/@core/components/Input/Input'
import { Button, Checkbox, CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { TenantFormData } from 'src/context/types'
import tenantStateToApi, { propertyWithTeantStateToApi } from 'src/utils/handleTenantState'
import { api } from 'src/utils/api'
import { getItem, removeItem, setItem } from 'src/utils/localStorageHelper'
import toast from 'react-hot-toast'
import errorHandler from 'src/utils/errorHandler'
import NameTitile from 'src/@core/components/nameTitle/NameTitile'
import { useAuth } from 'src/hooks/useAuth'
import { STAGE } from 'src/utils/constants'
import { useRouter } from 'next/router'
import { tenantSchema } from './schema'
import DatePicker from 'src/@core/components/datePicker'

const defaultValues = {
  title: 'Mr',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: null,
  isGuarantorRequired: true,
  isCreditCheck: true,
  addresses: [{ address1: '', address2: '', city: '', postCode: '', currentAddress: true }],
  guarantorDetails: {
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: { address1: '', address2: '', city: '', postCode: '' }
  }
}

type TenantDetailsProps = {
  initialCreate?: boolean
  handleGoBack?: () => void
  handleOnSubmit?: (arg0: any) => void
  isAddorEdit?: boolean
  isLoading?: boolean
}

const TenantDetails = ({ initialCreate, handleGoBack, handleOnSubmit, isAddorEdit, isLoading }: TenantDetailsProps) => {
  const [isGuarantorRequired, setGuarantorRequired] = useState<boolean>(defaultValues.isGuarantorRequired)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(tenantSchema)
  })
  const [loading, setLoading] = useState(false)

  const { fields, remove, insert } = useFieldArray({
    control,
    name: 'addresses'
  })
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const tenant = getItem('tenant')
    if (tenant) {
      const tenantData = JSON.parse(tenant)
      setValue('title', tenantData.title)
      setValue('firstName', tenantData.firstName)
      setValue('lastName', tenantData.lastName)
      setValue('email', tenantData.email)
      setValue('phone', tenantData.phone)
      setValue('birthDate', tenantData.birthDate)
      setValue('isGuarantorRequired', tenantData.isGuarantorRequired)
      setValue('addresses', tenantData.addresses)
      setValue('guarantorDetails', tenantData.guarantorDetails)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = (data: TenantFormData) => {
    setLoading(true)
    if (isAddorEdit) {
      handleOnSubmit && handleOnSubmit(tenantStateToApi(data))
    } else if (user?.stage === STAGE.COMPLETE) {
      const propertyData = getItem('property')
      if (propertyData) {
        const req = propertyWithTeantStateToApi(JSON.parse(propertyData), data)
        api
          .post('/property/property_create', req)
          .then(() => {
            removeItem('property')
            removeItem('tenant')
            window.location.replace('/properties')
          })
          .catch(err => {
            setLoading(false)
            toast.error(errorHandler(err))
          })
      } else {
        router.reload()
      }
    } else {
      api
        .post('/tenant/add-tenant', tenantStateToApi(data))
        .then(() => {
          removeItem('property')
          removeItem('landlord')
          removeItem('tenant')
          window.location.replace('/dashboard')
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
              Tenant Details
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
          <Grid item sm={6} xs={12}>
            <DatePicker
              name={'birthDate'}
              label={'Birth Date'}
              error={errors.birthDate?.message}
              control={control}
              required
            />
          </Grid>
        </Grid>

        <Grid container spacing={6} sx={{ my: 6 }} alignItems='start'>
          <Grid item xs={12}>
            <Typography variant='h6' sx={{ fontWeight: 600, textAlign: 'start' }}>
              Current Address
            </Typography>
          </Grid>
          {fields.map((field, index) => (
            <React.Fragment key={String(Math.random())}>
              {index > 0 && (
                <>
                  {index === 1 && (
                    <Grid item xs={12}>
                      <Typography variant='h6' sx={{ fontWeight: 600, textAlign: 'start' }}>
                        Previous Addresses
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} justifyContent='flex-end'>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button color='error' variant='outlined' onClick={() => remove(index)} sx={{ mt: 12 }}>
                        Remove
                      </Button>
                    </Box>
                  </Grid>
                </>
              )}
              <AddressSection
                errors={errors.addresses && errors.addresses[index]}
                control={control}
                keyValue={`addresses.${index}`}
                setValue={setValue}
                isTenant
              />
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant='outlined'
              onClick={() =>
                insert(fields.length, { address1: '', address2: '', city: '', postCode: '', currentAddress: false })
              }
            >
              Add previous address for last two years
            </Button>
          </Grid>
        </Grid>

        <Grid item container spacing={6} alignItems='start'>
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 600, textAlign: 'start' }}>
              Guarantor
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Controller
              name={'isGuarantorRequired'}
              control={control}
              render={({ field: { value, onChange } }) => (
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={value ? 'required' : 'notrequired'}
                  onChange={e => {
                    onChange(e.target.value === 'required')
                    setGuarantorRequired(e.target.value === 'required')
                  }}
                >
                  <FormControlLabel value={'required'} control={<Radio />} label='Required' sx={{ pr: 4 }} />
                  <FormControlLabel value={'notrequired'} control={<Radio />} label='Not Required' />
                </RadioGroup>
              )}
            />
          </Grid>
          {isGuarantorRequired && (
            <>
              <Grid item xs={12}>
                <Typography variant='h6' sx={{ fontWeight: 600, textAlign: 'start' }}>
                  Guarantor Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <NameTitile control={control} name={'guarantorDetails.title'} />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Input
                  name={'guarantorDetails.firstName'}
                  label={'First Name'}
                  error={errors.guarantorDetails?.firstName?.message}
                  control={control}
                  required
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Input
                  name={'guarantorDetails.lastName'}
                  label={'Last Name'}
                  error={errors.guarantorDetails?.lastName?.message}
                  control={control}
                  required
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Input
                  name={'guarantorDetails.phone'}
                  label={'Contact Number'}
                  error={errors.guarantorDetails?.phone?.message}
                  control={control}
                  required
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Input
                  name={'guarantorDetails.email'}
                  label={'Email'}
                  error={errors.guarantorDetails?.email?.message}
                  control={control}
                  required
                />
              </Grid>
            </>
          )}
        </Grid>

        {isGuarantorRequired && (
          <Grid item container spacing={6} alignItems='start' sx={{ mt: 4 }}>
            <Grid item xs={12}>
              <Typography variant='h6' sx={{ fontWeight: 600, textAlign: 'start' }}>
                Guarantor Address
              </Typography>
            </Grid>

            <AddressSection
              errors={errors.guarantorDetails?.address}
              control={control}
              keyValue={'guarantorDetails.address'}
              setValue={setValue}
            />
          </Grid>
        )}
        <Grid item container spacing={6} justifyContent='flex-start'>
          <Grid item xs={12}>
            <FormControl sx={{ my: 0, width: '100%' }} error={Boolean(errors.isCreditCheck)}>
              <Controller
                name='isCreditCheck'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => {
                  return (
                    <FormControlLabel
                      sx={{
                        ...(null ? { color: 'error.main' } : null),
                        '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }
                      }}
                      control={
                        <Checkbox checked={value} onChange={onChange} sx={!value ? { color: 'error.main' } : null} />
                      }
                      label={<Box sx={{ color: !value ? 'error.main' : null }}>{'Tenant credit check'}</Box>}
                    />
                  )
                }}
              />
            </FormControl>
          </Grid>
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
            <Button
              component='button'
              size='large'
              variant='outlined'
              onClick={() => {
                const [title, firstName, lastName, email, phone, isGuarantorRequired, addresses, guarantorDetails] =
                  getValues([
                    'title',
                    'firstName',
                    'lastName',
                    'email',
                    'phone',
                    'isGuarantorRequired',
                    'addresses',
                    'guarantorDetails'
                  ])

                setItem(
                  'tenant',
                  JSON.stringify({
                    title,
                    firstName,
                    lastName,
                    email,
                    phone,
                    isGuarantorRequired,
                    addresses,
                    guarantorDetails
                  })
                )
                handleGoBack && handleGoBack()
              }}
            >
              Back
            </Button>
          </Grid>
          <Grid item>
            <Button
              type={loading ? 'button' : 'submit'}
              size='large'
              color='primary'
              variant='contained'
              disabled={loading}
            >
              {loading ? 'Loading...' : user?.stage === STAGE.COMPLETE ? 'Finish' : 'Proceed to dashboard'}
            </Button>
          </Grid>
        </Grid>
      )}
      {!initialCreate && (
        <Grid
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          sx={{ py: 6, textAlign: 'center' }}
        >
          <Grid item>
            <Button
              variant='outlined'
              color='error'
              onClick={() => {
                handleGoBack && handleGoBack()
              }}
            >
              Discard
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              type={isLoading ? 'button' : 'submit'}
              color='primary'
              sx={{ mr: { xs: 2, md: 4 } }}
            >
              {isLoading ? <CircularProgress /> : 'Submit'}
            </Button>
          </Grid>
        </Grid>
      )}
    </form>
  )
}

export default TenantDetails
