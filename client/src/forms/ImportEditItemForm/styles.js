import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  content: {
    padding: theme.spacing(3)
  },
  grid: {
    padding: theme.spacing(2, 0)
  }
})

export default withStyles(styles)
