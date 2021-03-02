import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  paper: {
    marginBottom: theme.spacing(1)
  },
  listItemIcon: {
    minWidth: theme.spacing(5)
  },
  cardActions: {
    [theme.breakpoints.down('md')]: {
      display: 'inherit'
    },
    paddingLeft: theme.spacing(6)
  },
  button: {
    margin: theme.spacing(1, 0),
    textAlign: 'left'
  }
}))

export default useStyles
