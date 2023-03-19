import { Box, Button, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { api } from 'src/utils/api'
import { STAGE } from 'src/utils/constants'
import errorHandler from 'src/utils/errorHandler'
import Services from '../../../views/landing/Services'

type Sercvices = { service: string; items: string[] }[]
type Props = {
  id: string
  title: string
  recommended?: boolean
  price: number
  services: Sercvices
  image: string
}

const Row = styled('div')(({ }) => ({
  padding: '0.5rem 0',
  width: '100%',
  textAlign: 'center'
}))

const Title = styled('div')(({ }) => ({
  color: '#FED900',
  fontWeight: 800,
  fontSize: '1.5rem',
  marginTop: '1rem',
  textTransform: 'uppercase'
}))

const PriceWrapper = styled('div')(({ }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  flexWrap: 'wrap',
  fontWeight: 800,
  fontSize: '2.5rem',
  color: 'white',
  width: '100%',
  lineHeight: '2rem'
}))

const SmallFont = styled('div')(({ }) => ({
  fontSize: '1rem',
  lineHeight: '1.5rem'
}))

const ServicesWrapper = styled('div')(({ }) => ({
  display: 'flex',
  flexDirection: 'column',
  color: 'primary.color',
  width: '100%',
  marginTop: '1rem',
  fontSize: '0.9rem'
}))

const style = {
  buyButton: {
    width: '100%',
    padding: '0.4rem',
    fontWeight: 800,
    textTransform: 'capitalize',
    fontSize: '1.2rem',
    backgroundColor: '#0070F3'
  },
  highlight: {
    position: 'absolute',
    width: '50%',
    height: '1.8rem',
    background: '#FED900',
    transform: 'translateY(-100%)',
    borderRadius: '0.2rem',
    textAlign: 'center',
    color: '#0A3360',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  intervalLabel: { width: '100%', color: 'white', fontSize: '0.75rem' }
}

// Component start

const PricingCard = ({ title, recommended, price, services, image, id }: Props) => {
  const CardWrapper = styled('div')(({ }) => ({
    zIndex: '50',
    position: 'relative',
    padding: '15px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: '10px',
    height: '40rem',
    maxHeight: '40rem',

    //backgroundSize: '160%',
    //backgroundImage: `url(${image})`,
    //backgroundColor: '#0A3360',
    //backdropFilter: 'blur( 3px )',
    //border: '1px solid rgba( 255, 255, 255, 0.18 )',
    background: 'rgba(0,0,0,0)'
  }))

  const Background = styled('div')(({ }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    inset: '0',
    borderRadius: '10px',
    backgroundSize: '160%',
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50%',
    backgroundColor: 'rgba( 255, 255, 255, 0.25 )',
    boxShadow: '0 4px 32px 0 rgba( 31, 38, 135, 0.37 )',
    opacity: 0.85,
    backdropFilter: 'blur( 3px )',
    zIndex: '-1',
    overflow: 'hidden',
    maskImage: 'linear-gradient(180deg, rgba(0, 0, 0, 1) 85%, rgba(0,0,0,0) 99%)',
    border: recommended ? '2px solid rgba(254,217,0,0.8)' : '2px solid rgba( 255, 255, 255, 0.3 )'
  }))

  const auth = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const handleSelect = () => {
    setLoading(true)
    api
      .post('/payment/create_session', { productId: id })
      .then(res => {
        setLoading(false)
        router.replace(res.data.url)
      })
      .catch(err => {
        setLoading(false)
        toast.error(errorHandler(err))
      })
  }

  return (
    <CardWrapper>
      <Background />
      {recommended && <Box sx={style.highlight}> Most Popular </Box>}
      <Row>
        <Title>{title}</Title>
      </Row>
      <Row>
        <PriceWrapper>
          <SmallFont>£</SmallFont>
          <div>{price / 100}</div>
          <SmallFont>/</SmallFont>
        </PriceWrapper>
        <div style={style.intervalLabel}>PER ANNUM</div>
      </Row>

      <Button
        variant='contained'
        sx={style.buyButton}
        onClick={() => {
          if (!loading) {
            if (auth.user?.stage === STAGE.REGISTERED) {
              router.push(`/register/payment?toolkit=${id}`)
            } else if (auth.user?.stage === STAGE.COMPLETE) {
              // redirect to checkout page
              handleSelect()
            } else {
              router.push(`/register/?toolkit=${id}`)
            }
          }
        }}
      >
        {loading ? <CircularProgress color='secondary' size={30} /> : 'Buy'}
      </Button>

      <ServicesWrapper>
        <Services services={services} />
      </ServicesWrapper>
    </CardWrapper>
  )
}

export default PricingCard
