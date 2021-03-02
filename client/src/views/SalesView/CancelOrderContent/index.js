import React from 'react'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import CancelOrderForm from 'src/forms/CancelOrderForm'

import { Origins } from 'src/utils/enums'

import useStyles from './styles'

const CancelOrderContent = ({ origin, onCancelOrder, onDialogClose }) => {
  const classes = useStyles()

  return (
    <>
      <DialogContent className={classes.content}>
        {origin === Origins.mee.value && (
          <Box>
            <Typography variant='body1' gutterBottom>
              Tem certeza que deseja cancelar esse pedido ? Essa ação é irreversível.
            </Typography>
          </Box>
        )}
        {origin === Origins.ifood.value && (
          <CancelOrderForm
            onClose={onDialogClose}
            actions={(submitting, pristine, invalid, values) => (
              <Paper className={classes.actionPaper}>
                <DialogActions>
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={submitting || pristine || invalid}
                    onClick={() => onCancelOrder(values)}
                  >
                    Solicitar Cancelamento
                  </Button>
                </DialogActions>
              </Paper>
            )}
          />
        )}
      </DialogContent>
      {origin === Origins.mee.value && (
        <DialogActions>
          <Button variant='contained' color='primary' onClick={onCancelOrder}>
            Cancelar pedido
          </Button>
        </DialogActions>
      )}
    </>
  )
}

CancelOrderContent.propTypes = {
  origin: PropTypes.bool,
  onCancelOrder: PropTypes.func,
  onDialogClose: PropTypes.func
}

CancelOrderContent.defaultProps = {
  origin: null,
  onCancelOrder: () => {},
  onDialogClose: () => {}
}

export default CancelOrderContent
