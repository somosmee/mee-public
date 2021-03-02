const styles = (theme) => ({
  row: {
    height: theme.spacing(7)
  },
  cell: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
    border: 0
  },
  listItemText: {
    textTransform: 'capitalize'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
})

export default styles
