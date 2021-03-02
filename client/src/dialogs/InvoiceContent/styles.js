import { makeStyles } from '@material-ui/core/styles'

import { InvoiceStatus } from 'src/utils/enums'

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '400px'
  },
  [InvoiceStatus.PENDING]: {
    color: 'orange',
    borderColor: 'orange'
  },
  [InvoiceStatus.SUCCESS]: {
    color: 'green',
    borderColor: 'green'
  },
  [InvoiceStatus.ERROR]: {
    color: 'red',
    borderColor: 'red'
  }
}))

export default useStyles
