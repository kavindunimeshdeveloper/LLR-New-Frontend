// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Image from 'next/image'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useRouter } from 'next/router'
import { api } from 'src/utils/api'
import toast from 'react-hot-toast'
import errorHandler from 'src/utils/errorHandler'
import { Button, CircularProgress, Typography } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import { STAGE } from 'src/utils/constants'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  }
}))

const PaymentSuccessPage = () => {
  const [loading, setLoading] = useState(true)
  const [apiRes, setApiRes] = useState<any>(null)
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    const { session_id } = router.query
    if (typeof session_id === 'string') {
      api
        .post('/payment/complete_session', { session_id })
        .then(res => {
          setLoading(false)
          setApiRes(res)
        })
        .catch(err => {
          setLoading(false)
          toast.error(errorHandler(err))
        })

      if (auth.user?.stage === STAGE.PAYMENT) {
        const user = auth.user
        auth.setUser({ ...user, stage: STAGE.LANDLORD })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query])

  let redirectUrl = `/register-step2?stage=${STAGE.LANDLORD}`
  if (auth.user?.stage === STAGE.COMPLETE) {
    redirectUrl = '/property-add'
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

  return (
    <Box
      className='content-right'
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWdith: '300px'
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
        <BoxWrapper mx={{ minWidth: '300px' }}>
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
          {apiRes && (
            <>
              <Typography id='transition-modal-title' variant='h6' component='h2' textAlign={'center'} sx={{ mt: 8 }}>
                Confirmed!
              </Typography>
              <Typography id='transition-modal-description' sx={{ mt: 2 }} textAlign={'center'}>
                You have successfully subscribed
              </Typography>
              <Button fullWidth variant='contained' sx={{ my: 7 }} onClick={() => router.replace(redirectUrl)}>
                Continue
              </Button>
            </>
          )}
        </BoxWrapper>
      </Box>
    </Box>
  )
}

PaymentSuccessPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default PaymentSuccessPage
