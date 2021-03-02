import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  itemAvatar: {
    '& > *': {
      marginRight: theme.spacing(1)
    }
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  }
}))

export default useStyles
