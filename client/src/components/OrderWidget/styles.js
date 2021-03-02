import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  gtin: {
    marginBottom: theme.spacing(5)
  },
  input: {
    fontSize: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      fontSize: theme.spacing(4),
      minWidth: theme.spacing(45)
    }
  },
  paymentWidget: {
    alignItems: 'inherit'
  },
  list: {
    display: 'flex',
    flexDirection: 'column'
  },
  cell: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
    fontSize: 14,
    fontWeight: 'bold'
  }
}))

export default useStyles
