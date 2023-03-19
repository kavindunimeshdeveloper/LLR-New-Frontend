import { Button, FormControl, InputLabel, MenuItem, Select, Typography, Grid, Box, Toolbar } from '@mui/material'
import { TypographyProps } from '@mui/material/Typography'
import React, { ReactNode, SyntheticEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { styled } from '@mui/material/styles'
import { BoxProps } from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { api } from 'src/utils/api'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import errorHandler from 'src/utils/errorHandler'
import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const steps = ['User Info', 'Payment Info']

const Payment = () => {
  const [productList, setProductList] = useState<[any] | []>([])
  const [value, handleChange] = useState<string>(process.env.NEXT_PUBLIC_PACKAGE_2 || '')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const toolkit = router.query?.toolkit
    if (toolkit && typeof toolkit === 'string') {
      handleChange(toolkit)
    }
  }, [router])

  useEffect(() => {
    setLoading(true)
    api
      .get('/toolkit/list')
      .then(res => {
        setProductList(res.data)
        setLoading(false)
      })
      .catch(err => {
        toast.error(errorHandler(err))
        setLoading(false)
      })
  }, [])

  const onSubmitPayment = (e: SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    api
      .post('/payment/create_session', { productId: getProdId() })
      .then(res => {
        setLoading(false)
        router.replace(res.data.url)
      })
      .catch(err => {
        setLoading(false)
        toast.error(errorHandler(err))
      })
  }

  const getProdId = () => {
    const prod = productList.find(p => p.stripeProductId === value)
    if (!prod) return null

    return prod.stripeProductId
  }

  const getPrice = () => {
    const prod = productList.find(p => p.stripeProductId === value)
    if (!prod) return 0

    return prod.price.amount / 100
  }

  return (
    <div>
      <Toolbar />
      <Box
        className='content-right'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4
              }}
            >
              <Image alt='logo' src='/images/logos/LLRlogo.svg' width={200} height={60} />
            </Box>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <TypographyStyled variant='h5'>Sign up</TypographyStyled>
              <Typography variant='body2'>Create an account to join our platform</Typography>
            </Box>
            <Box sx={{ my: 6, textAlign: 'center' }}>
              <Stepper activeStep={1}>
                {steps.map(label => {
                  const stepProps: { completed?: boolean } = {}
                  const labelProps: { optional?: ReactNode } = {}

                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            </Box>

            <form noValidate autoComplete='off' onSubmit={onSubmitPayment}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id='form-layouts-separator-select-label'>Toolkit</InputLabel>
                <Select
                  label='Toolkit'
                  defaultValue='Kilimanjaro'
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                  value={value}
                  onChange={e => handleChange(e.target.value as string)}
                >
                  <MenuItem value={process.env.NEXT_PUBLIC_PACKAGE_1 || ''}>Kilimanjaro</MenuItem>
                  <MenuItem value={process.env.NEXT_PUBLIC_PACKAGE_2 || ''}>K2</MenuItem>
                  <MenuItem value={process.env.NEXT_PUBLIC_PACKAGE_3 || ''}>Everest</MenuItem>
                </Select>
                <Grid sx={{ my: 6.5 }} container justifyContent='end' alignItems='center'>
                  <Typography variant='subtitle1' component='span' sx={{ pr: 10 }}>
                    Amount:
                  </Typography>
                  <Typography variant='h6' component='span'>
                    {getPrice()} GBP
                  </Typography>
                </Grid>
              </FormControl>
              <Button fullWidth size='large' type={loading ? 'button' : 'submit'} variant='contained' sx={{ mb: 7 }}>
                {loading ? 'loading...' : 'Proceed Payment'}
              </Button>
            </form>
          </BoxWrapper>
        </Box>
      </Box>
    </div>
  )
}
Payment.getLayout = (page: ReactNode) => <BlankLayoutWithAppBar>{page}</BlankLayoutWithAppBar>

Payment.guestGuard = false

export default Payment
