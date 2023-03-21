import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar, Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Input from 'src/@core/components/Input/Input'
import { Profile, ProfileResponse } from 'src/context/types'
import { useAuth } from 'src/hooks/useAuth'
import { api } from 'src/utils/api'
import { STAGE } from 'src/utils/constants'
import errorHandler from 'src/utils/errorHandler'
import ChangePassword from 'src/views/profile/ChangePassword'
import * as yup from 'yup'

type UpdateUserType = {
  firstName: string
  email: string
  phone?: string
  profile: File | null
}

const defaultValues = {
  firstName: '',
  email: '',
  phone: '',
  profile: ''
}

const UserView = () => {
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState('/images/avatars/1.png')

  const auth = useAuth()

  const schema = yup.object().shape({
    firstName: yup.string().min(3).required(),
    email: yup.string().email().required(),
    phone: yup.string().nullable(),
    profile: yup.mixed().nullable()
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: UpdateUserType) => {
    const formData = new FormData()
    formData.append('firstName', data.firstName)
    formData.append('email', data.email)

    if (data.phone) {
      formData.append('phone', data.phone)
    }
    if (file) {
      formData.append('profile', file)
    }
    setSubmitting(true)
    api
      .post<Profile>('/user/user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        const { data } = res
        const updatedUser = {
          email: data.email,
          id: data.userId,
          stage: STAGE.COMPLETE,
          name: data.firstName,
          imageUrl: data.imageUrl,
          isAdmin: !!auth.user?.isAdmin
        }

        auth.setUser(updatedUser)
        toast.success('Profile updated successfully')
        setFile(null)
        setFileUrl(s => data.imageUrl || s)
        setSubmitting(false)
      })
      .catch(err => {
        toast.error(errorHandler(err))
        setSubmitting(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    api
      .get<ProfileResponse>('/user/profile')
      .then(res => {
        setLoading(false)
        const { firstName, email, phone, imageUrl } = res.data.me
        setValue('firstName', firstName)
        setValue('email', email)
        setValue('phone', phone || '')
        if (imageUrl) {
          setFileUrl(imageUrl)
        }
      })
      .catch(err => {
        toast.error(errorHandler(err))
        setLoading(false)
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
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography variant='h6' sx={{ fontWeight: 600, textAlign: 'start' }}>
                Profile
              </Typography>
            </Grid>
            <Grid item sm={2} xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                alt='Profile'
                src={file ? URL.createObjectURL(file) : fileUrl}
                sx={{ width: '5rem', height: '5rem', my: 6 }}
              />
            </Grid>
            <Grid item sm={10} xs={9} sx={{ display: 'flex', position: 'relative', py: 2, alignItems: 'center' }}>
              <Box>
                <Button variant='outlined' component='label'>
                  Upload
                  <Controller
                    name={'profile'}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        hidden
                        accept='image/*'
                        multiple={false}
                        type='file'
                        onChange={e => {
                          onChange(e)
                          if (e.target.files) {
                            setFile(e.target.files[0])
                          }
                        }}
                        value={value}
                      />
                    )}
                  />
                </Button>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Input
                name={'firstName'}
                label={'Name'}
                error={errors.firstName?.message}
                control={control}
                required
                autoFocus
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Input name={'phone'} label={'Contact Number'} error={errors.phone?.message} control={control} required />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Input name={'email'} label={'Email'} error={errors.email?.message} control={control} required />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' size='large' variant='contained'>
                {isSubmitting ? 'Loading...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
      <ChangePassword />
    </Box>
  )
}

export default UserView
