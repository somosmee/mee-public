import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      width: 640
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  content: {
    padding: theme.spacing(0.5, 2)
  },
  name: {
    textTransform: 'capitalize'
  },
  subitems: {
    paddingLeft: theme.spacing(2)
  }
}))

export default useStyles
