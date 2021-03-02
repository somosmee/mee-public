import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4)
    }
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}))

export default useStyles
