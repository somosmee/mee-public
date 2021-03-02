import React from 'react'
import { useHistory } from 'react-router-dom'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { Paths } from 'src/utils/enums'

import useStyles from './styles'

const OpenRegisterWarningContent = ({ registers }) => {
  const classes = useStyles()
  const history = useHistory()

  const handleClick = () => {
    history.push(Paths.financialStatements.path)
  }

  return (
    <DialogContent className={classes.root}>
      <Grid container direction='row' spacing={3}>
        <Grid item xs={12}>
          <Typography className={classes.title} variant='h6' gutterBottom>
            Você precisa abrir o caixa para registrar novas vendas!
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ul className={classes.bulletPoints}>
            {registers
              .filter((register) => !register.hasOpenedRegister)
              .map((register, index) => (
                <Typography key={index} variant='subtitle1' component='li'>
                  {register.name} ainda não foi aberto hoje!
                </Typography>
              ))}
          </ul>
        </Grid>
        <Grid item container justify='center' direction='column' alignItems='center'>
          <Typography variant='body2' align='center' component='p'>
            Para abrir o caixa selecione a opção {'"Extrato"'} no menu ou
          </Typography>
          <Button onClick={handleClick} color='primary'>
            Clique aqui
          </Button>
        </Grid>
      </Grid>
    </DialogContent>
  )
}

OpenRegisterWarningContent.propTypes = {
  registers: PropTypes.array
}

OpenRegisterWarningContent.defaultProps = {
  registers: []
}

export default OpenRegisterWarningContent
