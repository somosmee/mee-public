import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  row: {
    height: theme.spacing(7),
    '&:hover': {
      cursor: 'pointer'
    },
    '& > *': {
      borderBottom: 'unset'
    }
  },
  cell: {
    padding: 0,
    border: 0
  },
  listItem: {
    paddingLeft: theme.spacing(1)
  },
  listItemIcon: {
    display: 'none',
    margin: 0
  },
  listItemIconHover: {
    '&:hover $listItemIcon': {
      display: 'flex'
    }
  },
  listItemAvatar: {},
  avatar: {
    color: theme.palette.common.white
  },
  listItemAvatarHover: {
    '&:hover $listItemAvatar': {
      display: 'none'
    }
  },
  listItemTextPrimary: {},
  listItemTextSecondary: {
    fontSize: 11
  },
  show: {
    display: 'flex'
  },
  hide: {
    display: 'none'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}))

export default useStyles
