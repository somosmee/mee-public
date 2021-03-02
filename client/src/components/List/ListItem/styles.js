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
  },
  title: {
    textTransform: 'capitalize',
    flex: 1
  },
  adornmentTitle: {
    marginLeft: theme.spacing(1)
  }
}))

export default useStyles
