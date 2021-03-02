import amber from '@material-ui/core/colors/amber'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import { makeStyles } from '@material-ui/core/styles'

import { ChargeStatus } from 'src/utils/enums'

const useStyles = makeStyles((theme) => ({
  root: {},
  [ChargeStatus.pending.type]: {
    color: amber[900],
    borderColor: amber[900]
  },
  [ChargeStatus.success.type]: {
    color: green[700],
    borderColor: green[700]
  },
  [ChargeStatus.failed.type]: {
    color: red[700],
    borderColor: red[700]
  }
}))

export default useStyles
