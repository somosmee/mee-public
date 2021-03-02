import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  spacer: {
    flex: '1 1 auto'
  },
  button: {
    margin: theme.spacing(1)
  },
  total: {
    padding: theme.spacing(2)
  },
  section: {
    margin: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2)
  }
}))

export default useStyles
