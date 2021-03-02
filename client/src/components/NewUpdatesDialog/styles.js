import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  message: {
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    color: theme.palette.common.white
  }
}))

export default useStyles
