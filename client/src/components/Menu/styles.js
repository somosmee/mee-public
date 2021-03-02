import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  name: {
    flex: 1,
    alignSelf: 'center'
  },
  description: {
    alignSelf: 'center'
  },
  actions: {
    '& > *': {
      marginLeft: theme.spacing(1)
    }
  },
  expansionPanelDetails: {
    padding: 0,
    display: 'flex',
    justifyContent: 'center'
  },
  list: {
    width: '100%'
  },
  listItem: {
    paddingLeft: theme.spacing(3)
  },
  modifierNested: {
    paddingLeft: theme.spacing(4)
  },
  optionNested: {
    paddingLeft: theme.spacing(5)
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    '& > :last-child': {
      marginTop: theme.spacing(1)
    },
    padding: theme.spacing(1, 1, 2, 1)
  }
}))

export default useStyles
