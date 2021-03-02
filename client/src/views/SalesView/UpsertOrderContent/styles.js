import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  search: {
    padding: theme.spacing(0, 3)
  },
  content: {
    [theme.breakpoints.up('sm')]: {
      minWidth: '471px',
      minHeight: '350px'
    },
    backgroundColor: theme.palette.background.default
  },
  total: {
    marginTop: theme.spacing(1)
  }
}))

export default useStyles
