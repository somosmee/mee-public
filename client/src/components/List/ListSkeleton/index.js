import React from 'react'

import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import ListMaterial from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

import Skeleton from '@material-ui/lab/Skeleton'

import useStyles from './styles'

const ListSkeleton = ({ search }) => {
  const classes = useStyles()

  return (
    <>
      {search && <Skeleton height={32} />}
      <ListMaterial className={classes.root}>
        <ListItem alignItems='flex-start' dense disableGutters>
          <ListItemAvatar className={classes.itemAvatar}>
            <Skeleton variant='circle'>
              <Avatar className={classes.avatar} />
            </Skeleton>
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                <Skeleton />
                <Typography variant='caption'>
                  <Skeleton width={130} />
                </Typography>
              </>
            }
            secondary={
              <>
                <Typography variant='body2' gutterBottom>
                  <Skeleton width={200} />
                </Typography>
                <Typography variant='caption'>
                  <Skeleton width={100} />
                </Typography>
              </>
            }
          />
        </ListItem>
        <Divider variant='inset' component='li' light />
        <ListItem alignItems='flex-start' disableGutters>
          <ListItemAvatar className={classes.itemAvatar}>
            <Skeleton variant='circle'>
              <Avatar className={classes.avatar} />
            </Skeleton>
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                <Skeleton />
                <Typography variant='caption'>
                  <Skeleton width={130} />
                </Typography>
              </>
            }
            secondary={
              <>
                <Typography variant='body2'>
                  <Skeleton width={200} />
                </Typography>
                <Typography variant='caption'>
                  <Skeleton width={100} />
                </Typography>
              </>
            }
          />
        </ListItem>
        <Divider variant='inset' component='li' light />
        <ListItem alignItems='flex-start' disableGutters>
          <ListItemAvatar className={classes.itemAvatar}>
            <Skeleton variant='circle'>
              <Avatar className={classes.avatar} />
            </Skeleton>
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                <Skeleton />
                <Typography variant='caption'>
                  <Skeleton width={130} />
                </Typography>
              </>
            }
            secondary={
              <>
                <Typography variant='body2'>
                  <Skeleton width={200} />
                </Typography>
                <Typography variant='caption'>
                  <Skeleton width={100} />
                </Typography>
              </>
            }
          />
        </ListItem>
        <Divider variant='inset' component='li' light />
      </ListMaterial>
    </>
  )
}

ListSkeleton.propTypes = {
  search: PropTypes.bool
}

ListSkeleton.defaultProps = {
  search: false
}

export default ListSkeleton
