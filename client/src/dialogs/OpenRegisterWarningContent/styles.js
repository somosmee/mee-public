import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(8)
  },
  title: {
    textAlign: 'center'
  },
  bulletPoints: {
    marginLeft: theme.spacing(2)
  }
}))

export default useStyles
