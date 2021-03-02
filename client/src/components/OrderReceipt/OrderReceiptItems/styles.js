import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 10,
    lineHeight: 1.1,
    color: 'black'
  },
  gtin: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  },
  name: {
    textTransform: 'uppercase',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  },
  description: {
    textTransform: 'uppercase',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  },
  note: {
    textTransform: 'uppercase',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  },
  quantity: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  },
  price: {
    textTransform: 'uppercase',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  },
  nameModifier: {
    textTransform: 'uppercase',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit',
    paddingLeft: theme.spacing(1)
  }
}))

export default useStyles
