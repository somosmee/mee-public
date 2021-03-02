import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: 150
  },
  input: {
    display: 'flex',
    padding: 0
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  singleValue: {
    fontSize: 14
  },
  placeholder: {
    position: 'absolute',
    fontSize: 14
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  }
})

export default withStyles(styles)
