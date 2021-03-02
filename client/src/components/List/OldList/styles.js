import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  cell: {
    height: theme.spacing(5),
    padding: 0,
    fontSize: 14,
    fontWeight: 'bold'
  },
  pagination: {
    border: 0
  },
  spacer: {
    flex: 0
  }
}))

export default useStyles
