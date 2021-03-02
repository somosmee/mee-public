import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  gridItem: {
    padding: theme.spacing(0)
  },
  cardActions: {
    padding: theme.spacing(0, 0, 0, 6),
    justifyContent: 'inherit',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0),
      justifyContent: 'center'
    }
  }
}))

export default useStyles
