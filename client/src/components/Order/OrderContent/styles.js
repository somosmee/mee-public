import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import { makeStyles } from '@material-ui/core/styles'

import { OrderStatus, Origins } from 'src/utils/enums'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0.5, 2)
  },
  details: {
    display: 'flex'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  paymentMethod: {
    color: '#388e3c',
    borderColor: '#1b5e20'
  },
  prepaid: {
    marginLeft: 10
  },
  paymentType: {
    marginLeft: 0
  },
  [Origins.ifood.value]: {
    color: red[700],
    borderColor: red[700]
  },
  [OrderStatus.open.type]: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main
  },
  [OrderStatus.partially_paid.type]: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main
  },
  [OrderStatus.closed.type]: {
    color: green[700],
    borderColor: green[700]
  },
  [OrderStatus.canceled.type]: {
    color: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main
  },
  divider: {}
}))

export default useStyles
