import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    cursor: 'pointer',
    fontSize: 15,
    marginLeft: theme.spacing(0.75)
  },
  noPackagesText: {
    marginTop: theme.spacing(2)
  },
  refreshButton: {
    padding: 0
  }
}))

export default useStyles
