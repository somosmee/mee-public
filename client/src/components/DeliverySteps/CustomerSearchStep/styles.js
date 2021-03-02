import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    minHeight: theme.spacing(50),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(8)
  },
  customerPaper: {
    marginBottom: theme.spacing(1)
  }
}))

export default useStyles
