import amber from '@material-ui/core/colors/amber'
import blue from '@material-ui/core/colors/blue'
import green from '@material-ui/core/colors/green'
import { makeStyles } from '@material-ui/core/styles'

import { DRAWER_WIDTH } from 'src/utils/constants'
import { SnackbarVariants } from 'src/utils/enums'

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      left: DRAWER_WIDTH + theme.spacing(2)
    }
  },
  content: {
    color: theme.palette.common.white
  },
  [SnackbarVariants.success]: {
    backgroundColor: green[600]
  },
  [SnackbarVariants.error]: {
    backgroundColor: theme.palette.error.dark
  },
  [SnackbarVariants.info]: {
    backgroundColor: blue[700]
  },
  [SnackbarVariants.warning]: {
    backgroundColor: amber[700]
  },
  iconVariant: {
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}))

export default useStyles
