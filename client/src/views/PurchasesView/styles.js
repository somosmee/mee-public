import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  search: {
    '@media print': {
      display: 'none'
    }
  },
  list: {
    '@media print': {
      display: 'none'
    }
  },
  content: {
    display: 'none',
    '@media print': {
      display: 'flex'
    }
  }
}))

export default useStyles
