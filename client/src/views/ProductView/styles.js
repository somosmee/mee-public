import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  card: {},
  timeline: {
    margin: 0
  },
  acitons: {
    display: 'flex',
    justifyContent: 'center'
  },
  media: {
    height: 400
  },
  grey: {
    backgroundColor: theme.palette.grey[300]
  },
  name: { textTransform: 'capitalize' },
  icon: {
    marginLeft: theme.spacing(0.5),
    fontSize: theme.spacing(2)
  }
}))

export default useStyles
