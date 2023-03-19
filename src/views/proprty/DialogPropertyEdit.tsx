// ** React Imports
import { Button } from '@mui/material'
import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { api } from 'src/utils/api'
import errorHandler from 'src/utils/errorHandler'

const DialogPropertyEdit = () => {
  // ** States
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const checkPropertyAvailable = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/property/check-property-add')
      if (data.hasSubscription) {
        setLoading(false)
        router.push('/property-add')
      } else {
        setLoading(false)
        router.push('/toolkits')
      }
    } catch (err) {
      toast.error(errorHandler(err))
    }
  }

  return (
    <>
      <Button
        size='large'
        color='primary'
        variant='contained'
        onClick={() => {
          checkPropertyAvailable()
        }}
        disabled={loading}
      >
        <PlusCircleOutline /> {`Add New Property`}
      </Button>
    </>
  )
}

export default DialogPropertyEdit
