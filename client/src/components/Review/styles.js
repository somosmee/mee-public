import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  listItem: {
    padding: theme.spacing(1, 0)
  },
  total: {
    fontWeight: '700'
  },
  title: {
    marginTop: theme.spacing(2)
  }
})

export default withStyles(styles)
