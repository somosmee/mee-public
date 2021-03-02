import { makeStyles } from '@material-ui/core/styles'

import { DRAWER_WIDTH, DRAWER_WIDTH_CLOSED } from 'src/utils/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    left: theme.spacing(0),
    right: theme.spacing(0),
    bottom: theme.spacing(0),
    zIndex: theme.zIndex.appBar,
    borderTop: '1px solid',
    borderColor: theme.palette.divider,
    '@media print': {
      display: 'none'
    }
  },
  rootOpen: {
    [theme.breakpoints.up('md')]: {
      marginLeft: DRAWER_WIDTH,
      transition: theme.transitions.create(['margin'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    }
  },
  rootClose: {
    [theme.breakpoints.up('md')]: {
      marginLeft: DRAWER_WIDTH_CLOSED,
      transition: theme.transitions.create(['margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    }
  }
}))

export default useStyles
