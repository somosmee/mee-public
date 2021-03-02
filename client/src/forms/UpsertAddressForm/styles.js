import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  formControlLabel: {
    whiteSpace: 'nowrap',
    fontSize: theme.spacing(1.5)
  },
  actions: {
    padding: theme.spacing(2)
  },
  actionPaper: {
    zIndex: 1
  }
}))

export default useStyles
