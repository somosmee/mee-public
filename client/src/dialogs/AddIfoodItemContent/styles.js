import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(8)
  },
  paper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  },
  name: {
    textTransform: 'capitalize'
  }
}))

export default useStyles
