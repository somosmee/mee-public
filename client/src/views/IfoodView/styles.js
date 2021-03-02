import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  image: {
    width: 600,
    height: 400
  },
  businessModelPaper: {
    maxWidth: '700px',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '12px',
    paddingRight: '12px'
  },
  deliveryBoyImage: {
    height: '280px',
    width: '280px'
  },
  appBarExtension: {
    display: 'flex',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: '#E6532A',
    marginLeft: '12px',
    marginRight: '12px',
    paddingLeft: '12px',
    paddingRight: '12px'
  },
  appBarContent: {
    maxWidth: '800px'
  },
  line: {
    borderLeft: '6px solid #E6532A',
    height: '100px',
    marginBottom: '10px',
    marginTop: '10px'
  },
  card: {
    maxWidth: '400px'
  }
}))

export default useStyles
