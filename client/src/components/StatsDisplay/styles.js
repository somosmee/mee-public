import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center'
  },
  retentionPercentage: {
    fontSize: theme.spacing(8),
    textAlign: 'center'
  },
  retentionPercentageSmall: {
    fontSize: theme.spacing(4),
    textAlign: 'center'
  },
  retentionPercentageMedium: {
    fontSize: theme.spacing(6),
    textAlign: 'center'
  },
  retentionPercentageLarge: {
    fontSize: theme.spacing(8),
    textAlign: 'center'
  },
  retentionPercentageDiff: {
    fontSize: theme.spacing(3),
    marginLeft: theme.spacing(1),
    marginRight: 0
  },
  retentionPercentageDiffRedLarge: {
    fontSize: theme.spacing(3),
    marginLeft: theme.spacing(1),
    marginRight: 0,
    color: '#e53935'
  },
  retentionPercentageDiffRedMedium: {
    fontSize: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: 0,
    color: '#e53935'
  },
  retentionPercentageDiffRedSmall: {
    fontSize: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: 0,
    color: '#e53935'
  },
  retentionPercentageDiffGreenLarge: {
    fontSize: theme.spacing(3),
    marginLeft: theme.spacing(1),
    marginRight: 0,
    color: '#4caf50'
  },
  retentionPercentageDiffGreenMedium: {
    fontSize: theme.spacing(2.5),
    marginLeft: theme.spacing(1),
    marginRight: 0,
    color: '#4caf50'
  },
  retentionPercentageDiffGreenSmall: {
    fontSize: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: 0,
    color: '#4caf50'
  },
  diffDates: {
    textAlign: 'center'
  }
}))

export default useStyles
