import { makeStyles } from '@material-ui/core/styles'

import { DRAWER_WIDTH, DRAWER_WIDTH_CLOSED } from 'src/utils/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  rootOpen: {
    [theme.breakpoints.up('md')]: {
      marginLeft: DRAWER_WIDTH,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    }
  },
  rootClose: {
    [theme.breakpoints.up('md')]: {
      marginLeft: DRAWER_WIDTH_CLOSED,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    }
  },
  progress: {
    margin: theme.spacing(1)
  }
}))

export default useStyles
