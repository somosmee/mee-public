import red from '@material-ui/core/colors/red'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(8),
    minWidth: '200px'
  },
  paper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  icon: {
    height: theme.spacing(25),
    width: theme.spacing(25),
    color: '#e0e0e0'
  },
  file: {
    width: '100%',
    height: theme.spacing(12.5),
    marginBottom: theme.spacing(2)
  },
  fields: {
    marginLeft: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing(1)
    }
  },
  error: {
    color: red[500]
  }
}))

export default useStyles
