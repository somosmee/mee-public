import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: theme.spacing(50)
  },
  paper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
}))

export default useStyles
