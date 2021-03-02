import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  'root-small': {
    fontSize: 10,
    lineHeight: 1.1,
    color: 'black'
  },
  'root-medium': {
    fontSize: 14,
    lineHeight: 1.5,
    color: 'black'
  },
  'root-large': {
    fontSize: 18,
    lineHeight: 1.5,
    color: 'black'
  },
  title: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  }
}))

export default useStyles
