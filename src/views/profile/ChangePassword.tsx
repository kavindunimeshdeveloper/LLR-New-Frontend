import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Grid, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Input from 'src/@core/components/Input/Input'
import { api } from 'src/utils/api'
import errorHandler from 'src/utils/errorHandler'
import * as yup from 'yup'

type ChangePasswordType = {
  password: string
  newPassword: string
  confirmPassword: string
}

const defaultValues = {
  password: '',
  newPassword: '',
  confirmPassword: ''
}

const ChangePassword = () => {
  const schema = yup.object().shape({
    password: yup.string().required(),
    newPassword: yup.string().min(6).required(),
    confirmPassword: yup.string().min(6).required()
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: ChangePasswordType) => {
    api
      .post('/user/password-change', data)
      .then(() => toast.success('Password changed successfully'))
      .catch(err => toast.error(errorHandler(err)))
  }

  return (
    <Box sx={{ mt: 20 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography variant='h6' sx={{ fontWeight: 600, textAlign: 'start' }}>
                Change password
              </Typography>
            </Grid>

            <Grid item sm={6} xs={12}>
              <Input
                name={'password'}
                label={'Current Password'}
                type={'password'}
                error={errors.password?.message}
                control={control}
                required
              />
            </Grid>
            <Grid item sm={6} xs={12}></Grid>
            <Grid item sm={6} xs={12}>
              <Input
                name={'newPassword'}
                label={'New Password'}
                type={'password'}
                error={errors.newPassword?.message}
                control={control}
                required
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Input
                name={'confirmPassword'}
                label={'Confirm Password'}
                type={'password'}
                error={errors.confirmPassword?.message}
                control={control}
                required
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Button type='submit' size='large' variant='contained' color='warning'>
                {isSubmitting ? 'Loading...' : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Box>
  )
}

export default ChangePassword
