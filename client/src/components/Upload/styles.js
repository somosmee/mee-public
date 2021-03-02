import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: theme.spacing(7),
    height: theme.spacing(7),
    color: theme.palette.common.white
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.common.black,
    width: 'inherit',
    height: 'inherit',
    marginBottom: theme.spacing(1),
    borderRadius: 10,
    border: `1px dashed ${theme.palette.divider}`
  },
  avatar: {
    width: 'inherit',
    height: 'inherit'
  },
  icon: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translateX(-50%)'
  }
}))

export default useStyles
