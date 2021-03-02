import { makeStyles } from '@material-ui/core/styles'

import { DRAWER_WIDTH } from 'src/utils/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    '@media print': {
      display: 'none'
    }
  },
  paper: {
    backgroundColor: '#3C037C'
  },
  drawerOpen: {
    [theme.breakpoints.up('md')]: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    }
  },
  drawerClose: {
    [theme.breakpoints.up('md')]: {
      overflowX: 'hidden',
      width: theme.spacing(7),
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    width: theme.spacing(9)
  },
  list: {
    display: 'flex',
    ...theme.mixins.toolbar
  },
  listItem: {
    color: theme.palette.grey[300]
  },
  listItemIcon: {
    color: 'inherit'
  },
  listItemIconRoot: {
    color: 'inherit'
  },
  listItemText: {
    color: theme.palette.primary.contrastText,
    fontWeight: '500'
  },
  listItemTextPrimary: {
    color: 'inherit'
  },
  listItemTextSecondary: {
    color: 'inherit'
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)'
  }
}))

export default useStyles
