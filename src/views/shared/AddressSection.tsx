import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Input from 'src/@core/components/Input/Input'
import { DeepMap, FieldError } from 'react-hook-form'
import { api } from 'src/utils/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import errorHandler from 'src/utils/errorHandler'
import { Address } from 'src/context/types'

type AddressSectionProps = {
  errors?: DeepMap<
    {
      address1: string
      address2: string
      city: string
      postCode: string
      currentAddress?: string
    },
    FieldError
  >
  control: any
  keyValue: string
  setValue: any
  isTenant?: boolean
}
type AddressOptions = {
  value: string
  data: Address
}
const AddressSection = ({ errors, control, keyValue, setValue, isTenant }: AddressSectionProps) => {

  const [loading, setLoading] = useState(false)
  const [postCode, setPostCode] = useState('')
  const [addresses, setAddresses] = useState<AddressOptions[] | []>([])
  const [selectedAdd, setSelectedAdd] = useState('')
  const [open, setOpen] = useState(false)

  const lookupAddress = async () => {
    setLoading(true)

    try {
      const { data } = await api.post<Address[]>('/lookup-addresses', { postCode })
      setAddresses(data.map(x => ({ value: `${x.address1} ${x.address2} ${x.city} ${x.postCode}`, data: x })))
      setLoading(false)
      handleOpen()
    } catch (error) {
      toast.error(errorHandler(error))
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <Grid container item sm={6} xs={12} spacing={6}>
        <Grid container item xs={12} alignItems='center' spacing={6}>
          <Grid item sm={8} xs={12}>
            <TextField
              fullWidth
              label='Post Code'
              placeholder='Ex: ABC123'
              value={postCode}
              onChange={e => setPostCode(e.target.value)}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <Button variant='contained' fullWidth sx={{ py: 2 }} onClick={() => lookupAddress()}>
              {loading ? 'Loading...' : 'Find'}
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id='bedrooms-select'>Select an address</InputLabel>
            <Select
              fullWidth
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              labelId='address-select'
              label='Select Address'
              value={selectedAdd}
              onChange={e => {
                setSelectedAdd(e.target.value)
                const selectedItem = addresses.find(x => x.value === e.target.value)
                setValue(keyValue, selectedItem?.data)
              }}
            >
              {addresses.map(add => (
                <MenuItem key={`addresses-${Math.random()}`} value={add.value}>
                  {add.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container item sm={6} xs={12} spacing={6}>
        <Grid item xs={12}>
          <Input
            name={`${keyValue}.address1`}
            label={'Address Line 1'}
            error={errors?.address1?.message}
            control={control}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            name={`${keyValue}.address2`}
            label={'Address Line 2'}
            error={errors?.address2?.message}
            control={control}
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            name={`${keyValue}.city`}
            label={'City/ Town'}
            error={errors?.city?.message}
            control={control}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            name={`${keyValue}.postCode`}
            label={'Post Code'}
            error={errors?.postCode?.message}
            control={control}
            required
          />
        </Grid>
        {isTenant && (
          <Grid item xs={12} sx={{ display: 'none' }}>
            <Input
              name={`${keyValue}.currentAddress`}
              label={'currentAddress'}
              error={errors?.currentAddress?.message}
              control={control}
              required
            />
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default AddressSection
