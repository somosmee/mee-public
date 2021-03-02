import { makeStyles } from '@material-ui/core/styles'

import { Origins } from 'src/utils/enums'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(0.5)
  },
  nfe: {
    marginLeft: 0,
    marginRight: 0
  },
  [Origins.mee.value]: {
    color: '#3d0f7a',
    borderColor: '#3d0f7a'
  },
  [Origins.ifood.value]: {
    color: 'red',
    borderColor: 'red'
  },
  icon: {
    marginRight: theme.spacing(1)
  }
}))

export default useStyles
