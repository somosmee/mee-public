import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  value: {
    marginTop: theme.spacing(2)
  },
  valueInput: {
    fontSize: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      fontSize: theme.spacing(4)
    },
    textAlign: 'center'
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  iconProgress: {
    width: theme.spacing(6),
    height: theme.spacing(6)
  },
  fabProgress: {
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1
  }
}))

export default useStyles
