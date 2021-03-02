import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  upload: {
    width: '100%',
    height: theme.spacing(20),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(10),
      height: theme.spacing(10)
    }
  },
  icon: {
    color: theme.palette.text.hint
  },
  flexEnd: {
    alignItems: 'flex-end'
  },
  bundle: {
    marginTop: theme.spacing(1)
  },
  section: {
    marginTop: theme.spacing(2)
  },
  helpIcon: {
    fontSize: 15,
    marginLeft: theme.spacing(0.75)
  }
}))

export default useStyles
