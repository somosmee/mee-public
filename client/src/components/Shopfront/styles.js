import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  productsContainer: {
    minHeight: 400,
    maxWidth: 360
  },
  listContainer: {
    width: '100%'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}))

export default useStyles
