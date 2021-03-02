import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(8)
  },
  paper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
}))

export default useStyles
