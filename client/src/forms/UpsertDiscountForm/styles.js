import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  upload: {},
  formControl: {
    minWidth: 150
  },
  middleDivider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  sectionDetails: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  collapseContent: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))

export default useStyles
