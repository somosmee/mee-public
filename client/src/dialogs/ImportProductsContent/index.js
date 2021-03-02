import React, { useState } from 'react'

import Joi from '@hapi/joi'
import csvtojson from 'csvtojson'
import PropTypes from 'prop-types'
import readXlsxFile from 'read-excel-file'

import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

import GetAppIcon from '@material-ui/icons/GetApp'
import PublishIcon from '@material-ui/icons/Publish'

import Button from 'src/components/Button'
import Upload from 'src/components/Upload'

import useStyles from './styles'

const schema = {
  gtin: {
    prop: 'gtin',
    type: String,
    required: false
  },
  nome: {
    prop: 'nome',
    type: String,
    required: true
  },
  descricao: {
    prop: 'descricao',
    type: String,
    required: false
  },
  preco: {
    prop: 'preco',
    type: Number,
    required: true
  },
  unidade: {
    prop: 'unidade',
    type: String,
    required: true,
    oneOf: ['unidade', 'quilograma']
  },
  quantidade: {
    prop: 'quantidade',
    type: Number,
    required: false
  }
}

const schemaCSV = Joi.object({
  gtin: Joi.string().allow(null, ''),
  nome: Joi.string().required(),
  descricao: Joi.string().allow(null, ''),
  preco: Joi.number().required(),
  unidade: Joi.string()
    .valid('unidade', 'quilograma')
    .required(),
  quantidade: Joi.number()
})

const transformJoiMessage = (error, row) => {
  const column = error.match('"' + '(.*)' + '"')[1]

  if (error.includes('is not allowed to be empty')) {
    return { error: 'required', column, row }
  }

  if (error.includes('must be one of [unidade, quilograma]')) {
    return { error: 'invalid', column, row }
  }

  if (error.includes('must be a number')) {
    return { error: 'invalid', column, row }
  }
}

const NewPurchaseContent = ({ loading, onSubmit }) => {
  const classes = useStyles()

  const [data, setData] = useState(null)
  const [errors, setErrors] = useState(null)

  const handleUploadFile = async (file) => {
    if (file?.type === 'text/csv') {
      const csv = csvtojson()
      const reader = new FileReader()

      reader.onload = async (e) => {
        // Use reader.result

        let data = await csv.fromString(reader.result)

        data = data.map((item) => {
          if (item.gtin === '') delete item.gtin
          if (item.descricao === '') delete item.descricao
          if (item.quantidade === '') delete item.quantidade

          return {
            ...item,
            preco: item.preco ? parseFloat(item.preco.replace(',', '.')) : null,
            quantidade: item.quantidade ? parseFloat(item.quantidade.replace(',', '.')) : undefined
          }
        })

        const errors = []

        data.forEach((item, index) => {
          const result = schemaCSV.validate(item, { allowUnknown: true })
          if (result.error) {
            errors.push(
              result.error.details.map((item) => transformJoiMessage(item.message, index))[0]
            )
          }
        })

        if (errors.length === 0) {
          setData(data)
          setErrors(null)
        } else {
          setData(null)
          setErrors(errors)
        }
      }

      reader.readAsText(file)
    } else {
      const data = await readXlsxFile(file, { schema })

      setData(data.rows)
      setErrors(data.errors)
    }
  }

  const handleSubmit = () => {
    onSubmit(data.map((item) => (item.gtin ? { ...item, gtin: item.gtin.toString() } : item)))
  }

  return (
    <DialogContent className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} container justify='center'>
          <PublishIcon className={classes.icon} />
        </Grid>
        <Grid item xs={12}>
          <Typography align='center' variant='body1'>
            Cadastre vários produtos de uma só vez importando dados de uma <b>planilha</b> ou de um{' '}
            <b>arquivo CSV</b>.
          </Typography>
          <Typography className={classes.fields} variant='body1'>
            <b>Campos:</b>
            <ul>
              <li>
                <b>gtin</b> - código de barras (opcional)
              </li>
              <li>
                <b>nome</b> - nome do produto (obrigatório)
              </li>
              <li>
                <b>descricao</b> - descrição do produto (opcional)
              </li>
              <li>
                <b>preco</b> - preço do produto (obrigatório)
              </li>
              <li>
                <b>unidade</b> - unidade de medida (obrigatório)
                <ul>
                  <li>
                    valores aceitos: <b>unidade</b>, <b>quilograma</b>
                  </li>
                </ul>
              </li>
              <li>
                <b>quantidade</b> - quantidade no estoque (opcional)
              </li>
            </ul>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.subtitle} align='center' variant='body1'>
            Baixe nossos exemplos de como deve ser o arquivo em cada formato:
          </Typography>
          <Grid item container justify='center' xs={12}>
            <Button
              color='primary'
              size='small'
              target='_blank'
              rel={'noopener noreferrer'}
              href='https://www.somosmee.com/exemplo_planilha.xlsx'
              component={Link}
              className={classes.button}
              startIcon={<GetAppIcon />}
            >
              exemplo_planilha.xlsx
            </Button>
            <Button
              color='primary'
              size='small'
              target='_blank'
              rel={'noopener noreferrer'}
              href='https://www.somosmee.com/exemplo_csv.csv'
              component={Link}
              className={classes.button}
              startIcon={<GetAppIcon />}
            >
              exemplo_csv.csv
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Upload
            className={classes.file}
            variant='square'
            avatar={false}
            accept='text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            onChange={handleUploadFile}
          />
        </Grid>
        {errors?.length > 0 && (
          <Grid item xs={12}>
            <Typography className={classes.error} variant='h6'>
              <b>Erros:</b>
            </Typography>
            <Typography className={classes.error} variant='body1'>
              {errors.map((error, index) => (
                <p key={index}>
                  Linha: {error.row} - campo <b>{error.column}</b>{' '}
                  {error.error === 'required' && 'é obrigatório'}
                  {error.error === 'invalid' && 'está invalido'}
                </p>
              ))}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            size='large'
            loading={loading}
            disabled={!data || errors?.length > 0 || loading}
            className={classes.button}
            startIcon={<PublishIcon />}
            onClick={handleSubmit}
          >
            IMPORTAR
          </Button>
        </Grid>
      </Grid>
    </DialogContent>
  )
}

NewPurchaseContent.propTypes = {
  loading: PropTypes.bool,
  onSubmit: PropTypes.func
}

NewPurchaseContent.defaultProps = {
  onSubmit: () => {}
}

export default NewPurchaseContent
