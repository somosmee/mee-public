import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  gridItem: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  icon: {
    marginRight: theme.spacing(2),
    color: '#777879'
  }
}))

export default useStyles
