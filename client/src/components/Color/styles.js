import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  shape: {
    backgroundColor: theme.palette.primary.main,
    width: 20,
    height: 20
  },
  shapeCircle: {
    borderRadius: '50%'
  }
}))

export default useStyles
