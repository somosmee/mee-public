import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: 'nowrap'
  },
  input: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(4),
      height: theme.spacing(4)
    },
    fontSize: '2.5rem',
    textAlign: 'center'
  }
}))

export default useStyles
