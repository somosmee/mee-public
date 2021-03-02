import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  search: {
    margin: theme.spacing(0, 2),
    flex: 1
  },
  button: {
    marginLeft: 'auto'
  }
}))

export default useStyles
