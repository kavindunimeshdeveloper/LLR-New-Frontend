// ** React Imports
import { Fragment, MouseEvent, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'

// import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'

// import Stepper from '@mui/material/Stepper'
// import Step from '@mui/material/Step'
// import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'

// ** Configs
// ** Layout Import
// import BlankLayout from 'src/@core/layouts/BlankLayout'
// ** Hooks
// import { useAuth } from 'src/hooks/useAuth'

// import { useSettings } from 'src/@core/hooks/useSettings'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  terms: false
}

interface FormData {
  email: string
  terms: boolean
  username: string
  password: string
}

// const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
//   width: '100%',
//   [theme.breakpoints.up('md')]: {
//     maxWidth: 400
//   },
//   [theme.breakpoints.up('lg')]: {
//     maxWidth: 450
//   }
// }))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

// const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
//   fontWeight: 600,
//   letterSpacing: '0.18px',
//   marginBottom: theme.spacing(1.5),
//   [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
// }))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

export default function AuthInfo() {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hooks
  // const theme = useTheme()
  // const { register } = useAuth()

  // const { settings } = useSettings()
  // const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  // const { skin } = settings
  const schema = yup.object().shape({
    password: yup.string().min(5).required(),
    username: yup.string().min(3).required(),
    email: yup.string().email().required(),
    terms: yup.bool().oneOf([true], 'You must accept the privacy policy & terms')
  })

  const {
    control,

    // setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    console.log(data)

    // const { email, username, password } = data
    // register({ email, username, password }, err => {
    //   if (err.email) {
    //     setError('email', {
    //       type: 'manual',
    //       message: err.email
    //     })
    //   }
    //   if (err.username) {
    //     setError('username', {
    //       type: 'manual',
    //       message: err.username
    //     })
    //   }
    // })
  }

  return (
    <BoxWrapper>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <Controller
            name='username'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                autoFocus
                value={value}
                onBlur={onBlur}
                label='Username'
                onChange={onChange}
                placeholder='johndoe'
                error={Boolean(errors.username)}
              />
            )}
          />
          {errors.username && <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>}
        </FormControl>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                value={value}
                label='Email'
                onBlur={onBlur}
                onChange={onChange}
                error={Boolean(errors.email)}
                placeholder='user@email.com'
              />
            )}
          />
          {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
            Password
          </InputLabel>
          <Controller
            name='password'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange, onBlur } }) => (
              <OutlinedInput
                value={value}
                label='Password'
                onBlur={onBlur}
                onChange={onChange}
                id='auth-login-v2-password'
                error={Boolean(errors.password)}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            )}
          />
          {errors.password && <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>}
        </FormControl>

        <FormControl sx={{ my: 0 }} error={Boolean(errors.terms)}>
          <Controller
            name='terms'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <FormControlLabel
                  sx={{
                    ...(errors.terms ? { color: 'error.main' } : null),
                    '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }
                  }}
                  control={
                    <Checkbox checked={value} onChange={onChange} sx={errors.terms ? { color: 'error.main' } : null} />
                  }
                  label={
                    <Fragment>
                      <Typography variant='body2' component='span' sx={{ color: errors.terms ? 'error.main' : '' }}>
                        I agree to{' '}
                      </Typography>
                      <Link href='/' passHref>
                        <Typography
                          variant='body2'
                          component={MuiLink}
                          sx={{ color: 'primary.main' }}
                          onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                        >
                          privacy policy & terms
                        </Typography>
                      </Link>
                    </Fragment>
                  }
                />
              )
            }}
          />
          {errors.terms && <FormHelperText sx={{ mt: 0, color: 'error.main' }}>{errors.terms.message}</FormHelperText>}
        </FormControl>
        {/*<Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>*/}
        {/*  Sign up*/}
        {/*</Button>*/}
        {/*<Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>*/}
        {/*  <Typography sx={{ mr: 2, color: 'text.secondary' }}>Already have an account?</Typography>*/}
        {/*  <Typography>*/}
        {/*    <Link passHref href='/login'>*/}
        {/*      <Typography component={MuiLink} sx={{ color: 'primary.main' }}>*/}
        {/*        Sign in instead*/}
        {/*      </Typography>*/}
        {/*    </Link>*/}
        {/*  </Typography>*/}
        {/*</Box>*/}
        {/*<Divider sx={{ mt: 5, mb: 7.5, '& .MuiDivider-wrapper': { px: 4 } }}>or</Divider>*/}
        {/*<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>*/}
        {/*  <Link href='/' passHref>*/}
        {/*    <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>*/}
        {/*      <Facebook sx={{ color: '#497ce2' }} />*/}
        {/*    </IconButton>*/}
        {/*  </Link>*/}
        {/*  <Link href='/' passHref>*/}
        {/*    <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>*/}
        {/*      <Twitter sx={{ color: '#1da1f2' }} />*/}
        {/*    </IconButton>*/}
        {/*  </Link>*/}
        {/*  <Link href='/' passHref>*/}
        {/*    <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>*/}
        {/*      <Github*/}
        {/*        sx={{*/}
        {/*          color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300])*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    </IconButton>*/}
        {/*  </Link>*/}
        {/*  <Link href='/' passHref>*/}
        {/*    <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>*/}
        {/*      <Google sx={{ color: '#db4437' }} />*/}
        {/*    </IconButton>*/}
        {/*  </Link>*/}
        {/*</Box>*/}
      </form>
    </BoxWrapper>
  )
}
