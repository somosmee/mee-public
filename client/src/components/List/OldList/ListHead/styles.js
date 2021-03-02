import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  row: {
    height: theme.spacing(7)
  },
  cell: {
    padding: 0,
    fontSize: 14,
    fontWeight: 'bold'
  },
  padding: {
    padding: theme.spacing(0.5, 2, 0.5, 1)
  },
  cardHeader: {
    padding: theme.spacing(1)
  },
  button: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  transparent: {
    color: 'transparent'
  }
}))

export default useStyles
