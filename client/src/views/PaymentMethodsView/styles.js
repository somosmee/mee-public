import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  subtitle: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(4)
  },
  bulletPoints: {
    marginLeft: theme.spacing(2)
  },
  card: {
    minWidth: theme.spacing(30)
  },
  moreButton: {
    marginTop: -15,
    marginLeft: -5
  }
}))

export default useStyles
