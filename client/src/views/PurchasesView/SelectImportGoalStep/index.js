import React from 'react'
import { useHistory } from 'react-router-dom'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import ImportExportIcon from '@material-ui/icons/ImportExport'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'

import { Paths } from 'src/utils/enums'

import useStyles from './styles'

const SelectImportGoalStep = ({ onSubmit }) => {
  const classes = useStyles()
  const history = useHistory()

  const handleSubmit = (option) => () => {
    onSubmit(option)
  }

  const handleClick = () => {
    history.push(Paths.financialStatements.path)
  }

  return (
    <DialogContent>
      <Grid
        className={classes.root}
        container
        justify='center'
        direction='column'
        alignItems='stretch'
        spacing={3}
      >
        <Grid item>
          <Card>
            <CardActionArea onClick={handleSubmit('expense')}>
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  <TrendingDownIcon /> Despesas
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  Adicionar compra para controle financeiro de despesas. Esse fluxo é mais simples e
                  não fará alterações ao estoque.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardActionArea onClick={handleSubmit('inventory')}>
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  <ImportExportIcon /> Entrada no estoque
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  Adicionar compra para dar entrada no estoque em vários produtos. Nesse fluxo é
                  necessário especificar os produtos e os detalhes de quantidade e preço.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item container justify='center' direction='column' alignItems='center'>
          <Typography variant='body2' align='center' component='p'>
            Quer adicionar despesas sem vincular fornecedores ?
          </Typography>
          <Button onClick={handleClick} color='primary'>
            Clique aqui
          </Button>
        </Grid>
      </Grid>
    </DialogContent>
  )
}

SelectImportGoalStep.propTypes = {
  onSubmit: PropTypes.func
}

SelectImportGoalStep.defaultProps = {
  onSubmit: () => {}
}

export default SelectImportGoalStep
