import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  tabs: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  card: {
    width: 204
  },
  fullWidth: {
    width: '100%'
  },
  listItemText: {
    paddingRight: theme.spacing(3)
  },
  chips: {
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  },
  divider: {
    margin: theme.spacing(3, 0)
  },
  icon: {
    fontSize: 15,
    marginLeft: theme.spacing(0.75)
  }
}))

export default useStyles
