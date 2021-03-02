import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    minWidth: 0,
    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
}))

export default useStyles
