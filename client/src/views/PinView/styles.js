import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4)
    },
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'url(images/background.png)',
    backgroundColor: '#3c037c',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 1000
  },
  marginTop: {
    marginTop: theme.spacing(2)
  },
  card: {
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(7)
    }
  },
  purple: {
    color: theme.palette.primary.main
  },
  hello: {
    marginTop: 0,
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(7)
    },
    fontSize: 26
  },
  mee: {
    marginTop: 0,
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      marginBottom: 0
    }
  },
  button: {
    width: '100%'
  },
  white: {
    color: theme.palette.common.white
  },
  icon: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
  email: {
    marginTop: theme.spacing(2)
  }
}))

export default useStyles
