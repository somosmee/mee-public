import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  button: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'transparent'
    },
    padding: theme.spacing(2) / 3
  }
})

export default withStyles(styles)
