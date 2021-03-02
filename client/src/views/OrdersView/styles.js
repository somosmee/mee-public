import { makeStyles } from '@material-ui/core/styles'

import { DRAWER_WIDTH } from 'src/utils/constants'

const useStyles = makeStyles((theme) => ({
  root: {},
  tabs: {
    marginTop: theme.spacing(-2),
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(-3),
      marginLeft: theme.spacing(-3),
      marginRight: theme.spacing(-3)
    }
  },
  tabsShift: {
    marginLeft: DRAWER_WIDTH,
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  paper: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      maxHeight: theme.spacing(70)
    }
  },
  actionPaper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
}))

export default useStyles
