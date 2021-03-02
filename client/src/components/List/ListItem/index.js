import React from 'react'

import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import ListItemMaterial from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import Spacer from 'src/components/Spacer'

import useStyles from './styles'

const ListItem = ({
  avatar,
  open,
  image,
  title,
  adornmentTitle,
  subtitle,
  description,
  information,
  renderActions,
  renderCollapse,
  onCollapseToggle,
  onClick
}) => {
  const classes = useStyles()

  return (
    <>
      <ListItemMaterial
        alignItems='flex-start'
        button={onClick}
        dense
        disableGutters
        onClick={onClick}
      >
        {avatar && (
          <ListItemAvatar className={classes.itemAvatar}>
            <Avatar className={classes.avatar} alt={title} src={image}>
              {!image && title?.charAt(0).toUpperCase()}
            </Avatar>
          </ListItemAvatar>
        )}
        <ListItemText
          primary={
            <>
              <Box display='flex'>
                <Typography className={classes.title} noWrap>
                  {title}
                </Typography>
                <Typography className={classes.adornmentTitle} align='right'>
                  {adornmentTitle}
                </Typography>
              </Box>
              {subtitle && (
                <Typography variant='caption' color='textSecondary'>
                  {subtitle}
                </Typography>
              )}
            </>
          }
          secondary={
            <>
              <Typography variant='body2' gutterBottom noWrap>
                {description}
              </Typography>
              <Box display='flex'>
                {information && (
                  <Typography className={classes.information} variant='caption' color='secondary'>
                    {information?.toUpperCase()}
                  </Typography>
                )}
                <Spacer />
                {renderActions() && <Box display='flex'>{renderActions()}</Box>}
              </Box>
            </>
          }
          disableTypography
        />
      </ListItemMaterial>
      {renderCollapse() && (
        <>
          <Button
            onClick={onCollapseToggle}
            startIcon={open ? <ExpandLess /> : <ExpandMore />}
            size='small'
            fullWidth
          />
          <Box display='flex'>{renderCollapse()}</Box>
        </>
      )}
      <Divider variant='inset' component='li' light />
    </>
  )
}

ListItem.propTypes = {
  avatar: PropTypes.bool,
  open: PropTypes.bool,
  image: PropTypes.string,
  title: PropTypes.string,
  adornmentTitle: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  information: PropTypes.string,
  renderActions: PropTypes.func,
  renderCollapse: PropTypes.func,
  onCollapseToggle: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool])
}

ListItem.defaultProps = {
  avatar: false,
  open: false,
  renderActions: () => false,
  renderCollapse: () => false,
  onCollapseToggle: () => false,
  onClick: () => false
}

export default ListItem
