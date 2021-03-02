import green from '@material-ui/core/colors/green'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  listItem: {
    padding: 0
  },
  delivery: {
    color: green[600]
  }
}))

export default useStyles
