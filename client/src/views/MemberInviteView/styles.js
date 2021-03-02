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
  }
}))

export default useStyles
