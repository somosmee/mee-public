import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    '&:last-child': {
      paddingBottom: theme.spacing(1)
    }
  },
  name: {
    textTransform: 'capitalize'
  },
  note: {
    fontStyle: 'italic'
  }
}))

export default useStyles
