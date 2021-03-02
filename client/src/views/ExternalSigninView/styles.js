import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      background: 'url(images/background.jpg)',
      backgroundSize: 'cover'
    }
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.2)'
  },
  box: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(3),
    borderRadius: 0,
    background: '#fff',
    textAlign: 'center',
    zIndex: theme.zIndex.drawer,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(55),
      height: 'auto',
      borderRadius: theme.spacing(1)
    }
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  button: {
    width: '100%'
  }
}))

export default useStyles
