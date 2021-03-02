import React, { useState, useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import Collapse from '@material-ui/core/Collapse'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import { useTheme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import AccountBalanceOutlined from '@material-ui/icons/AccountBalanceOutlined'
import CategoryOutlined from '@material-ui/icons/CategoryOutlined'
import HelpOutline from '@material-ui/icons/HelpOutline'
import NotesOutlined from '@material-ui/icons/NotesOutlined'

import PriceFormat from 'src/components/PriceFormat'
import Search from 'src/components/Search'
import Switch from 'src/components/Switch'
import TextField from 'src/components/TextField'
import Upload from 'src/components/Upload'

import useCompany from 'src/hooks/useCompany'
import useSearch from 'src/hooks/useSearch'

import { FirebaseEvents, Measurements } from 'src/utils/enums'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.internal && !values.gtin) {
    errors.gtin = 'Código de barras em branco'
  }

  if (isNaN(values?.price)) {
    errors.price = 'Preço em branco'
  }

  if (!values.measurement) {
    errors.measurement = 'Medida em branco'
  }

  if (!values.name) {
    errors.name = 'Nome em branco'
  }

  return errors
}

const UpsertProductForm = ({ initialValues, actions, onClose, onSubmit }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))

  const [search, results] = useSearch({ entity: 'product' })
  const {
    getMyCompany: [getMyCompany, { data }]
  } = useCompany()
  const company = data?.myCompany

  const [showMore, setShowMore] = useState(!!initialValues.bundle?.length)
  const [image, setImage] = useState(null)
  const [term, setTerm] = useState('')
  const [bundle, setBundle] = useState(initialValues.bundle ?? [])

  const inputPrice = useRef()

  useEffect(() => {
    inputPrice.current.focus()
  }, [])

  useEffect(() => {
    getMyCompany()
  }, [])

  useEffect(() => {
    search(term)
  }, [term, search])

  /* FORM */
  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues,
    onSubmit,
    validate
  })

  /* FORM FIELDS */
  const ncm = useField('ncm', form)
  const name = useField('name', form)
  const gtin = useField('gtin', form)
  const price = useField('price', form)
  const internal = useField('internal', form)
  const measurement = useField('measurement', form)
  const description = useField('description', form)
  const productionLine = useField('productionLine', form)

  const handleShowMore = () => {
    setShowMore((prevState) => !prevState)
    analytics.logEvent(FirebaseEvents.CREATE_PRODUCT_SHOW_MORE)
  }

  const handleImageChange = (image) => {
    setImage(image)
  }

  const handleSearchChange = (term) => {
    setTerm(term)
  }

  const handleOptionClick = async ({ _id, name, gtin }) => {
    await setBundle((prevBundle) => {
      const found = prevBundle.findIndex((product) => product.product === _id) > -1
      if (found) {
        return prevBundle.map((product) => {
          if (product.product === _id) product.quantity += 1
          return product
        })
      } else {
        return prevBundle.concat({ product: _id, name, gtin, quantity: 1 })
      }
    })
    analytics.logEvent(FirebaseEvents.ADD_PRODUCT_BUNDLE)
    setTerm('')
  }

  const handleBundleDelete = ({ product, gtin }) => () => {
    setBundle((prevBundle) =>
      prevBundle.filter((currentProduct) => currentProduct.product !== product)
    )
    analytics.logEvent(FirebaseEvents.DELETE_PRODUCT_BUNDLE)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // prepare data
    const product = {
      ...values,
      gtin: values.internal ? '' : values.gtin,
      measurement: values.measurement,
      price: parseFloat(values.price),
      bundle
    }

    if (image instanceof File) product.image = image

    if (values.tax && values.tax.icmsTaxPercentage) {
      product.tax = {
        icmsOrigin: values.tax.icmsOrigin,
        icmsTaxPercentage: parseFloat(values.tax.icmsTaxPercentage)
      }
    }

    onSubmit(product)
  }

  const renderMenuItem = (key) => {
    return (
      <MenuItem key={key} value={Measurements[key].type}>
        {Measurements[key].label}
      </MenuItem>
    )
  }

  const renderProductionLineMenuItem = (productionLine) => {
    return (
      <MenuItem key={productionLine._id} value={productionLine._id}>
        {productionLine.name}
      </MenuItem>
    )
  }

  const renderBundle = (product) => (
    <Grid key={product.product} item>
      <Chip
        label={`${product.gtin} - ${product.name} (${product.quantity})`}
        size='small'
        onDelete={handleBundleDelete(product)}
      />
    </Grid>
  )

  const margin = 'none'

  return (
    <Grid
      className={classes.root}
      container
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit}
      spacing={1}
    >
      {!initialValues && (
        <Grid item xs={12}>
          <Switch {...internal} label='Produto Interno' />
        </Grid>
      )}
      <Grid container item spacing={1}>
        <Grid item xs={12} sm='auto'>
          <Upload
            className={classes.upload}
            src={initialValues?.image}
            variant='square'
            accept='image/jpeg, image/jpg, image/png'
            onChange={handleImageChange}
          />
        </Grid>
      </Grid>
      {values.gtin && (
        <Grid container item spacing={upSmall ? 2 : 1}>
          <Grid item xs='auto'>
            <NotesOutlined className={classes.icon} />
          </Grid>
          <Grid item xs>
            <TextField
              required
              {...gtin}
              type='text'
              label='Código de barras'
              margin={margin}
              disabled={!!initialValues}
              fullWidth
            />
          </Grid>
        </Grid>
      )}
      <Grid container item spacing={1}>
        <Grid container item spacing={upSmall ? 2 : 1} xs='auto' sm>
          {!values.gtin ? (
            <Grid item xs='auto' component={Box} mt={2.5}>
              <NotesOutlined className={classes.icon} />
            </Grid>
          ) : (
            <Grid item xs='auto'>
              <Box width={25} />
            </Grid>
          )}
          <Grid item xs>
            <TextField
              {...price}
              required
              inputRef={inputPrice}
              label='Preço'
              placeholder='0,00'
              margin={margin}
              fullWidth
              InputProps={{
                inputComponent: PriceFormat
              }}
            />
          </Grid>
        </Grid>
        <Grid container item spacing={upSmall ? 2 : 1} xs='auto' sm>
          {!upSmall && (
            <Grid item xs='auto'>
              <Box width={25} />
            </Grid>
          )}
          <Grid item xs>
            <TextField
              required
              select
              {...measurement}
              type='text'
              label='Unidade de medida'
              margin={margin}
              fullWidth
            >
              {Object.keys(Measurements).map(renderMenuItem)}
            </TextField>
          </Grid>
        </Grid>
      </Grid>
      <Grid container item spacing={upSmall ? 2 : 1}>
        <Grid item xs='auto'>
          <Box width={25} />
        </Grid>
        <Grid item xs>
          <TextField required {...name} type='text' label='Nome' margin={margin} fullWidth />
        </Grid>
      </Grid>
      <Grid container item spacing={upSmall ? 2 : 1}>
        <Grid item xs='auto'>
          <Box width={25} />
        </Grid>
        <Grid item xs>
          <TextField
            {...description}
            type='text'
            label='Descrição'
            multiline
            margin={margin}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Collapse in={showMore} timeout='auto' unmountOnExit>
          <Grid className={classes.flexEnd} container spacing={upSmall ? 2 : 1}>
            <Grid className={classes.section} item xs={12}>
              <Box display='flex' alignItems='center'>
                <Typography variant='overline' align='center'>
                  Pacote
                </Typography>
                <Tooltip title='Se o seu produto é formado por um pacote customizado por você ou de fábrica e pode ser vendido também separadamente. Selecione os produtos do pacote aqui para que possamos manter seu estoque sempre correto'>
                  <HelpOutline className={classes.helpIcon} />
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs='auto'>
              <CategoryOutlined className={classes.icon} />
            </Grid>
            <Grid item xs sm={6}>
              <Search
                value={term}
                options={results.data}
                placeholder='Pesquisar produto'
                loading={results?.loading}
                onChange={handleSearchChange}
                onOptionClick={handleOptionClick}
                fullWidth
              />
            </Grid>
            {!!bundle.length && (
              <Grid className={classes.bundle} container item spacing={1}>
                {bundle.map(renderBundle)}
              </Grid>
            )}
          </Grid>
          <Grid className={classes.flexEnd} container spacing={upSmall ? 2 : 1}>
            <Grid className={classes.section} item xs={12}>
              <Box display='flex' alignItems='center'>
                <Typography variant='overline' align='center'>
                  Informações Tributárias
                </Typography>
                <Tooltip
                  title={
                    'As informações tributárias são utilizadas pasa emissão correta da nota fiscal'
                  }
                >
                  <HelpOutline className={classes.helpIcon} />
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs='auto'>
              <AccountBalanceOutlined className={classes.icon} />
            </Grid>
            <Grid item xs sm='auto'>
              <TextField {...ncm} type='text' label='NCM' margin={margin} fullWidth />
            </Grid>
          </Grid>
          {!!company?.productionLines?.length && (
            <Grid className={classes.flexEnd} container spacing={upSmall ? 2 : 1}>
              <Grid className={classes.section} item xs={12}>
                <Box display='flex' alignItems='center'>
                  <Typography variant='overline' align='center'>
                    Linhas de produção
                  </Typography>
                  <Tooltip
                    title={`Seu produto pode ser produzido e/ou
                retirado em uma área exclusiva do seu negócio. Ex: Seu produto precisa ser separado e retirado
                no estoque; A refeição deve ser preparada pela cozinha; Sua bebida deve ser retirada
                no bar. Selecionando uma linha de produção, você direciona específicamente que área
                deve ser avisada que existe uma retirada ou produção deste item ao criar um pedido`}
                  >
                    <HelpOutline className={classes.helpIcon} />
                  </Tooltip>
                </Box>
              </Grid>
              <Grid item xs='auto'>
                <AccountBalanceOutlined className={classes.icon} />
              </Grid>
              <Grid item xs sm='6'>
                <TextField
                  select
                  {...productionLine}
                  type='text'
                  label='Linha de produção'
                  margin={margin}
                  fullWidth
                >
                  {company?.productionLines.map(renderProductionLineMenuItem)}
                </TextField>
              </Grid>
            </Grid>
          )}
        </Collapse>
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit, showMore, handleShowMore)}
    </Grid>
  )
}

UpsertProductForm.propTypes = {
  search: PropTypes.shape({
    loading: PropTypes.bool,
    placeholder: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.string,
    onChange: PropTypes.func
  }),
  actions: PropTypes.func,
  onClose: PropTypes.func,
  initialValues: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertProductForm.defaultProps = {
  initialValues: {},
  onChange: () => {},
  onSubmit: () => {}
}

export default UpsertProductForm
