// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'

// ** Layout Import
import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { Container, Toolbar } from '@mui/material'
import LandlordDetails from '../../views/register-step2/LandlordDetails'
import PropertyDetails from '../../views/register-step2/PropertyDetails'
import TenantDetails from '../../views/register-step2/TenantDetails'
import { api } from 'src/utils/api'
import { useRouter } from 'next/router'
import { STAGE } from 'src/utils/constants'

const steps = ['Landlord', 'Property', 'Tenant']

function RegisterStep2() {
  // ** States
  const [activeStep, setActiveStep] = useState(0)
  const router = useRouter()

  useEffect(() => {
    let step = 0
    const stage = router.query.stage
    if (stage === STAGE.PROPERTY) {
      step = 1
    } else if (stage === STAGE.TENANT) {
      step = 2
    }
    setActiveStep(step)
  }, [router.query])

  useEffect(() => {
    api
      .get('/user/profile')
      .then(res => {
        if (res.data.stage === STAGE.COMPLETE) {
          router.push('/dashboard')
        }
      })
      .catch(() => {
        router.push('/')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <Toolbar />
      <Container>
        <Box sx={{ my: 6, textAlign: 'center' }}>
          <Stepper activeStep={activeStep}>
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
        <Box sx={{ py: 6, textAlign: 'center' }}>
          {activeStep === 0 ? (
            <LandlordDetails
              initialCreate
              handleOnSubmit={() => router.replace({ pathname: 'register-step2', query: { stage: STAGE.PROPERTY } })}
            />
          ) : activeStep === 1 ? (
            <PropertyDetails
              handleOnSubmit={() => router.replace({ pathname: 'register-step2', query: { stage: STAGE.TENANT } })}
              handleGoBack={() => router.replace({ pathname: 'register-step2', query: { stage: STAGE.LANDLORD } })}
              initialCreate
            />
          ) : (
            <TenantDetails
              initialCreate
              handleGoBack={() => router.replace({ pathname: 'register-step2', query: { stage: STAGE.PROPERTY } })}
            />
          )}
        </Box>
      </Container>
    </Box>
  )
}

RegisterStep2.getLayout = (page: ReactNode) => <BlankLayoutWithAppBar>{page}</BlankLayoutWithAppBar>

RegisterStep2.authGuard = true
RegisterStep2.guestGuard = false

export default RegisterStep2
