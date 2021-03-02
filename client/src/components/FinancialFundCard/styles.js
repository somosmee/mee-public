import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  card: {
    minWidth: theme.spacing(30)
  },
  moreButton: {
    marginTop: -15,
    marginLeft: -5
  }
}))

export default useStyles
