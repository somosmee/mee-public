import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  valueInput: {
    fontSize: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      fontSize: theme.spacing(4)
    },
    textAlign: 'center'
  }
}))

export default useStyles
