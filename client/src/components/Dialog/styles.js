import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  appBar: {
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      height: theme.spacing(15)
    },
    [theme.breakpoints.down('md')]: {
      height: theme.spacing(12)
    }
  },
  toolbar: {
    display: 'block',
    minHeight: theme.spacing(16),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  },
  search: {
    margin: theme.spacing(0, 2),
    flex: 1
  },
  bottom: {
    position: 'fixed',
    margin: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
}))

export default useStyles
