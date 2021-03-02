import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  content: {
    overflow: 'visible'
  },
  totalContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  total: {
    marginTop: theme.spacing(1)
  }
}))

export default useStyles
