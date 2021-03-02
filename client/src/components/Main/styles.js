import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3)
    }
  },
  background: {
    backgroundColor: theme.palette.background.default
  },
  title: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(7)
    }
  },
  loading: {
    top: theme.mixins.toolbar.minHeight
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 1
  },
  bottomNavigation: {
    [theme.breakpoints.down('md')]: {
      bottom: theme.spacing(10)
    }
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  snackbar: {
    bottom: theme.spacing(10),
    [theme.breakpoints.up('md')]: {
      bottom: theme.spacing(2)
    }
  },
  bottom: {
    bottom: theme.spacing(18)
  }
}))

export default useStyles
