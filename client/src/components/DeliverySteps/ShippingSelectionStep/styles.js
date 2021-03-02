import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    minHeight: theme.spacing(50),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(8)
  },
  addressPaper: {
    marginBottom: theme.spacing(1)
  },
  paper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  listItemIcon: {
    minWidth: theme.spacing(5)
  },
  addressActions: {
    [theme.breakpoints.down('xs')]: {
      display: 'inherit'
    }
  },
  paddingLeft: {
    paddingLeft: theme.spacing(6)
  },
  button: {
    margin: theme.spacing(1, 0),
    textAlign: 'left'
  }
}))

export default useStyles
