import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  valueInput: {
    fontSize: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      fontSize: theme.spacing(4)
    },
    textAlign: 'center'
  },
  helpIcon: {
    fontSize: 15,
    marginLeft: theme.spacing(0.75)
  }
}))

export default useStyles
