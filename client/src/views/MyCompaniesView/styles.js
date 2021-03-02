import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4)
  },
  cardButton: {
    [theme.breakpoints.up('md')]: {
      height: theme.spacing(20),
      paddingTop: theme.spacing(4)
    },
    width: theme.spacing(30),
    textAlign: 'center'
  },
  card: {
    minWidth: theme.spacing(30),
    minHeight: theme.spacing(20)
  }
}))

export default useStyles
