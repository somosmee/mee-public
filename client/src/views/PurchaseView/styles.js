import { makeStyles, lighten } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  toolbar: {
    justifyContent: 'center',
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85)
  },
  button: {
    margin: theme.spacing(1)
  }
}))

export default useStyles
