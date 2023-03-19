import { Box, CircularProgress, Step, StepLabel, Stepper, Typography } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from 'src/utils/api'
import errorHandler from 'src/utils/errorHandler'
import PropertyDetails from 'src/views/register-step2/PropertyDetails'
import TenantDetails from 'src/views/register-step2/TenantDetails'

const steps = ['Property', 'Tenant']

type ActiveSubType = {
  name: string
  amount: number
  currency: string
}

function PropertyAdd() {
  const [activeStep, setActiveStep] = useState(0)
  const [activePackage, setPackage] = useState<ActiveSubType | null>(null)
  const [initialLoading, setInitialLoading] = useState(false)

  useEffect(() => {
    setInitialLoading(true)
    api
      .get<ActiveSubType>('/subscription/active-package')
      .then(res => {
        setPackage(res.data)
        setInitialLoading(false)
      })
      .catch(err => {
        toast.error(errorHandler(err))
      })
  }, [])

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant='h4' mb={4}>
          Active package {activePackage?.name}
        </Typography>
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
          <PropertyDetails
            handleOnSubmit={() => setActiveStep(1)}
            handleGoBack={() => setActiveStep(0)}
            initialCreate
          />
        ) : (
          <TenantDetails initialCreate handleGoBack={() => setActiveStep(0)} />
        )}
      </Box>
    </div>
  )
}

export default PropertyAdd
