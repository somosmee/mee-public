import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {},
  listItem: {
    height: theme.spacing(9)
  },
  listItemRoot: {
    padding: theme.spacing(0, 1)
  },
  listItemPrimary: {
    textTransform: 'capitalize'
  },
  listItemIcon: {
    minWidth: theme.spacing(5)
  }
}))

export default useStyles
