import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  poper: {
    width: 'auto',
    zIndex: theme.zIndex.modal
  },
  icon: {
    minWidth: theme.spacing(5)
  },
  title: {
    textTransform: 'capitalize'
  }
}))

export default useStyles
