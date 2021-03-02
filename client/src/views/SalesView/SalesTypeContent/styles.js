import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  imageCheckout: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: '380px',
      maxHeight: '220px'
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '480px',
      maxHeight: '320px'
    }
  },
  imageOrders: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: '320px',
      maxHeight: '160px'
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '420px',
      maxHeight: '260px'
    }
  },
  mainText: {
    marginBottom: '20px'
  },
  actions: {
    justifyContent: 'center'
  }
}))

export default useStyles
