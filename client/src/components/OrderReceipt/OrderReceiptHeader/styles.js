import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 12,
    lineHeight: 1.1,
    color: 'black'
  },
  shortId: {
    fontWeight: 'bold',
    lineHeight: 'inherit',
    color: 'inherit'
  },
  origin: {
    fontWeight: 'bold',
    lineHeight: 'inherit',
    color: 'inherit'
  },
  createdAt: {
    fontSize: 'inherit',
    color: 'inherit'
  }
}))

export default useStyles
