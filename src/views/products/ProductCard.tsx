import { useState } from 'react'
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { api } from 'src/utils/api'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import errorHandler from 'src/utils/errorHandler'

type ProductCardTypes = {
  title: string
  subTitle?: string
  isCreditCheck: boolean
  image: string
  price: number
  propertyId: string
  disabled?: boolean
  productId: string
  isOneTimePayment?: boolean
}

const style = {
  buyButton: {
    width: '100%',
    padding: '0.4rem',
    fontWeight: 500,
    textTransform: 'capitalize',
    fontSize: '1.1rem',
    backgroundColor: '#0070F3'
  }
}

export default function ProductCard({
  title,
  subTitle,
  isCreditCheck,
  image,
  price,
  propertyId,
  disabled,
  productId,
  isOneTimePayment
}: ProductCardTypes) {
  const [items, setItems] = useState(1)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const createPaymentSession = (productId: string) => {
    setLoading(true)
    api
      .post('/payment/create_product_session', { quantity: items, productId, propertyId })
      .then(res => {
        setLoading(false)
        router.replace(res.data.url)
      })
      .catch(err => {
        setLoading(false)
        toast.error(errorHandler(err))
      })
  }

  const createProductSession = (productId: string) => {
    setLoading(true)
    api
      .post('/create-product-session', { productId, propertyId })
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
    <Card
      sx={{
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        mb: 4,
        maxWidth: '100%',
        position: 'relative'
      }}
    >
      {disabled && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'gray',
            opacity: '0.7',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            color: 'white',
            zIndex: 10,
            fontWeight: 'bold',
            p: 4,
            textAlign: 'center'
          }}
        >
          Included with your current package
        </Box>
      )}
      <Box>
        <CardMedia
          component='img'
          alt='green iguana'
          height='160'
          image={image}
          sx={{ backgroundSize: 'cover', maxWidth: '70%', padding: '2rem', margin: 'auto', objectFit: 'contain' }}
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='div' textAlign={'center'}>
            {title}
          </Typography>
          {subTitle && (
            <Typography variant='body2' color='text.secondary' textAlign={'center'}>
              {subTitle}
            </Typography>
          )}
        </CardContent>
      </Box>
      <CardActions sx={{ display: 'flex', flexDirection: 'column' }}>
        {isCreditCheck && (
          <Box sx={{ my: 4 }}>
            <Button
              size='small'
              variant='outlined'
              disabled={items <= 1}
              onClick={() => {
                setItems(s => s - 1)
              }}
            >
              -
            </Button>
            <span style={{ padding: '0 1rem' }}>{items}</span>
            <Button
              size='small'
              variant='outlined'
              disabled={items > 4}
              onClick={() => {
                setItems(s => s + 1)
              }}
            >
              +
            </Button>
          </Box>
        )}
        <Box sx={{ mb: 4, color: '#0070F3', fontWeight: 800 }}> £ {items * price}</Box>

        <Box sx={{ width: '100%' }}>
          <Button
            variant='contained'
            size='small'
            fullWidth
            sx={style.buyButton}
            onClick={() => {
              if (!disabled) {
                if (isOneTimePayment) {
                  createPaymentSession(productId)
                } else {
                  createProductSession(productId)
                }
              }
            }}
            disabled={loading || !!disabled}
          >
            {loading ? 'Loading' : 'Buy Now'}
          </Button>
        </Box>
      </CardActions>
    </Card>
  )
}
