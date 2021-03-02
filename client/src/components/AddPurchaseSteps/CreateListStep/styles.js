import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    marginTop: 10
  },
  content: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  paper: {
    marginBottom: theme.spacing(1)
  },
  actions: {
    padding: theme.spacing(2)
  },
  actionPaper: {
    zIndex: 1
  }
}))

export default useStyles
