import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative'
  },
  paper: {
    minHeight: theme.spacing(70)
  },
  appBar: {
    position: 'relative'
  },
  toolbar: {
    display: 'block',
    minHeight: theme.spacing(16),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  },
  icon: {
    padding: 0
  },
  navigation: {
    display: 'flex'
  }
}))

export default useStyles
