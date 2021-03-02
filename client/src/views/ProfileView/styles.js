import green from '@material-ui/core/colors/green'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  tabs: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  fullWidth: {
    width: '100%'
  },
  success: {
    color: green[700],
    borderColor: green[700],
    marginRight: theme.spacing(1)
  },
  pending: {
    color: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main,
    marginRight: theme.spacing(1)
  }
}))

export default useStyles
