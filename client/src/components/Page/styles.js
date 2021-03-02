import { makeStyles } from '@material-ui/core/styles'

import { DRAWER_WIDTH, DRAWER_WIDTH_CLOSED } from 'src/utils/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(24),
    overflowX: 'hidden',
    '@media print': {
      display: 'block',
      margin: '0 !important',
      padding: '0 !important'
    }
  },
  rootOpen: {
    [theme.breakpoints.up('md')]: {
      marginLeft: DRAWER_WIDTH,
      marginBottom: 0,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    }
  },
  rootClose: {
    [theme.breakpoints.up('md')]: {
      marginLeft: DRAWER_WIDTH_CLOSED,
      marginBottom: 0,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    }
  },
  toolbar: {
    ...theme.mixins.toolbar
  }
}))

export default useStyles
