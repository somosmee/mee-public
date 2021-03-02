import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import RootRef from '@material-ui/core/RootRef'
import Typography from '@material-ui/core/Typography'

import AddAPhoto from '@material-ui/icons/AddAPhoto'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'

import useStyles from './styles'

const Upload = ({ className, avatar, accept, onChange, children, src, ...props }) => {
  const classes = useStyles()

  const [files, setFiles] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }))
    )
    onChange(acceptedFiles[0])
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept, maxFiles: 1 })
  const { ref, ...rootProps } = getRootProps()

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    },
    [files]
  )

  const renderFile = (file) => (
    <Typography key={file.path} variant='caption' color='textSecondary'>
      {file.path} - {file.size} bytes
    </Typography>
  )

  return (
    <RootRef rootRef={ref}>
      <Box
        className={classNames(classes.root, className, { [classes.avatar]: avatar })}
        {...rootProps}
      >
        <input {...getInputProps()} />
        {avatar && <Avatar className={classes.avatar} src={files[0]?.preview ?? src} {...props} />}
        {avatar ? (
          <AddAPhoto className={classes.icon} color='inherit' />
        ) : (
          <Box className={classes.box}>
            <FolderOpenIcon color='inherit' fontSize='large' />
            <Typography color='textSecondary'>Arraste e solte seu arquivo aqui</Typography>
          </Box>
        )}
      </Box>
      {!avatar && <div>{files.map(renderFile)}</div>}
    </RootRef>
  )
}

Upload.propTypes = {
  className: PropTypes.string,
  avatar: PropTypes.bool,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  src: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
}

Upload.defaultProps = {
  avatar: true,
  onChange: () => {}
}

export default Upload
