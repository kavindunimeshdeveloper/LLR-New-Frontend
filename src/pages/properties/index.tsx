import Grid from '@mui/material/Grid'

// ** Custom Component Import
import DialogPropertyEdit from 'src/views/proprty/DialogPropertyEdit'
import PropertyCard from 'src/views/proprty/PropertyCard'
import { useEffect, useState } from 'react'
import { api } from 'src/utils/api'
import toast from 'react-hot-toast'
import errorHandler from 'src/utils/errorHandler'
import { Box, CircularProgress } from '@mui/material'

const Properties = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<null | [any]>(null)
  useEffect(() => {
    setLoading(true)
    api
      .get('/property/all-properties')
      .then(res => {
        setLoading(false)
        setData(res.data)
      })
      .catch(err => {
        setLoading(false)
        toast.error(errorHandler(err))
      })
  }, [])

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
    <Grid container spacing={6} alignItems='stretch' direction='row'>
      <Grid item xs={12} container justifyContent='flex-end'>
        <DialogPropertyEdit />
      </Grid>

      {data?.map((pr: any) => (
        <Grid item xs={12} lg={6} key={Math.random()}>
          <PropertyCard data={pr} />
        </Grid>
      ))}
    </Grid>
  )
}

export default Properties
