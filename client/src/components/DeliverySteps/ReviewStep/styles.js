import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    minHeight: theme.spacing(50),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(8)
  },
  gridItem: {
    padding: theme.spacing(0)
  },
  actions: {
    padding: theme.spacing(0, 0, 0, 6),
    justifyContent: 'inherit',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0),
      justifyContent: 'center'
    }
  },
  paper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
}))

export default useStyles
