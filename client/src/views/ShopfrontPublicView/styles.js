import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '90vh'
  },
  content: {
    minHeight: '100%'
  },
  divider: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5)
  },
  dividerCart: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  avatar: {
    width: '100%',
    height: theme.spacing(20),
    [theme.breakpoints.up('sm')]: {
      height: theme.spacing(50)
    }
  }
}))

export default useStyles
