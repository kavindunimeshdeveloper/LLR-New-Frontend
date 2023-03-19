// ** React Imports
import { forwardRef, ReactElement, Ref, useEffect, useState } from 'react'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline'
import TenantDetails from '../register-step2/TenantDetails'
import { api } from 'src/utils/api'
import { Box } from '@mui/system'
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import toast from 'react-hot-toast'
import errorHandler from 'src/utils/errorHandler'
import { TenantFormData } from 'src/context/types'
import { useRouter } from 'next/router'

// import AddressSection from '../shared/AddressSection'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})
type Props = {
  id?: string
  fetchTenant: () => void
}

const DialogTenantEdit = ({ id, fetchTenant }: Props) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [data, setData] = useState<[] | any[]>([])
  const [loading, setLoading] = useState(false)
  const [isAdding, setAdding] = useState(false)
  const [property, setProperty] = useState('')

  const router = useRouter()

  const checkTenant = async (propertyId: string) => {
    const res = await api.post('/check-tenant-limit', { propertyId })

    return res.data.canAdd
  }

  useEffect(() => {
    setLoading(true)
    api
      .get('/property/all-properties')
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        toast.error(errorHandler(err))
      })
  }, [])

  const addTenant = async (formData: TenantFormData) => {
    setAdding(false)
    const canAdd = await checkTenant(property)
    if (canAdd) {
      saveTenant(formData)
    } else {
      setShowAlert(true)
    }
  }

  const saveTenant = async (formData: TenantFormData) => {
    api
      .post('/tenant', { tenantDetails: formData, propertyId: property })
      .then(() => {
        setAdding(false)
        setShow(false)
        fetchTenant()
        toast.success('Tenant added successfully')
      })
      .catch(err => {
        setAdding(false)
        toast.error(errorHandler(err))
      })
  }

  const closeModal = () => {
    setShow(false)
    setProperty('')
    setShowAlert(false)
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

  const options = data.map(p => ({ value: p.id, label: `${p.address1}, ${p.address2 || ''} ${p.city}` }))

  return (
    <>
      <Button
        size='large'
        color='primary'
        variant='contained'
        onClick={() => {
          setShow(true)
        }}
      >
        <PlusCircleOutline /> {` ${id ? 'Update' : 'Add New'} Tenant`}
      </Button>

      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => {
          closeModal()
        }}
        TransitionComponent={Transition}
        onBackdropClick={() => {
          setShow(false)
          setProperty('')
        }}
      >
        <DialogContent
          sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative', minHeight: '400px' }}
        >
          <IconButton
            size='small'
            onClick={() => {
              closeModal()
            }}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Close />
          </IconButton>

          <Typography variant='h6' sx={{ fontWeight: 600, textAlign: 'start', mb: 6 }}>
            Add Tenant Details
          </Typography>
          <Box sx={{ mb: 6 }}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Select a property</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={property}
                label='Select a property'
                onChange={async e => {
                  const canAdd = await checkTenant(e.target.value)
                  setProperty(e.target.value)
                  if (canAdd) {
                    setShowAlert(false)
                  } else {
                    setShowAlert(true)
                  }
                }}
              >
                {options.map((a: any) => (
                  <MenuItem key={`baths-${Math.random()}`} value={a.value}>
                    {a.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {showAlert && (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto', my: 20 }}>
                <Typography id='transition-modal-title' variant='h6' component='h2' textAlign={'center'} sx={{ mt: 8 }}>
                  {'Tenant Limit exceeded'}
                </Typography>
                <Typography id='transition-modal-description' sx={{ mt: 2 }} textAlign={'center'}>
                  {'Please add one or more credit checks to add tennats'}
                </Typography>

                <Button
                  fullWidth
                  variant='contained'
                  onClick={() => router.push({ pathname: '/products', query: { propertyId: property } })}
                  sx={{ mt: 6 }}
                >
                  Add
                </Button>
              </Box>
            </>
          )}
          {property && !showAlert && (
            <TenantDetails
              isLoading={isAdding}
              isAddorEdit
              handleOnSubmit={formData => {
                addTenant(formData)
              }}
              handleGoBack={() => {
                closeModal()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DialogTenantEdit
