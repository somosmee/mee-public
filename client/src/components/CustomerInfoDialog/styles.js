import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  actions: {
    width: '100%',
    flexDirection: 'column'
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}))

export default useStyles
