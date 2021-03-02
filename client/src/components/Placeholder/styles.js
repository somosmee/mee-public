import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  icon: {
    width: theme.spacing(25),
    height: theme.spacing(25),
    color: '#e0e0e0'
  },
  message: {
    marginTop: theme.spacing(1)
  }
}))

export default useStyles
