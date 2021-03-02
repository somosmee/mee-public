import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  orderSummary: {
    marginBottom: theme.spacing(4)
  },
  chart: {
    height: 200,
    marginBottom: theme.spacing(2)
  },
  filters: {
    marginBottom: theme.spacing(4)
  },
  placeholder: {
    maxWidth: 400
  },
  media: {
    height: 200
  },
  expenses: {
    color: '#e53935'
  },
  revenue: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: '#1976d2'
  },
  profit: {
    color: '#4caf50'
  },
  credit: {
    color: '#1e88e5'
  },
  debit: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: '#e53935'
  },
  money: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: '#f9a825'
  },
  voucher: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: '#43a047'
  },
  pix: {
    color: '#9C27B0'
  }
}))

export default useStyles
