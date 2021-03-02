import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 12,
    lineHeight: 1.1,
    color: 'black'
  },
  subtotal: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  },
  deliveryFee: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  },
  discount: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  },
  total: {
    fontWeight: 'bold',
    lineHeight: 'inherit',
    color: 'inherit'
  }
}))

export default useStyles
