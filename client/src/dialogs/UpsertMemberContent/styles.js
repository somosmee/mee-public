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
  }
}))

export default useStyles
