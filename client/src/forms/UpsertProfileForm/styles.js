import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  images: {
    position: 'relative',
    marginBottom: theme.spacing(7)
  },
  banner: {
    width: '100%',
    height: theme.spacing(20)
  },
  picture: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: '-50px',
    width: theme.spacing(13),
    height: theme.spacing(13)
  }
}))

export default useStyles
