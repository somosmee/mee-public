import React, { useContext, useEffect } from 'react'

import classNames from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import Skeleton from '@material-ui/lab/Skeleton'
import Timeline from '@material-ui/lab/Timeline'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'

import HelpOutline from '@material-ui/icons/HelpOutline'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'

import Button from 'src/components/Button'
import Link from 'src/components/Link'
import Main from 'src/components/Main'
import Page from 'src/components/Page'

import AppBarContext from 'src/contexts/AppBarContext'

import { Reasons, ICMSOrigin, InventoryAction, FirebaseEvents } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const ProductView = ({ product, inventoryMovements, handleBack, handleLoadMore }) => {
  const classes = useStyles()

  const [, setAppBar] = useContext(AppBarContext)

  useEffect(() => {
    const title = 'Produto'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  const renderTimelineItem = (movement, index, movements) => {
    const inventoryAction = movement.quantity > 0 ? InventoryAction.input : InventoryAction.output

    const date = moment(movement.createdAt).format('DD/MM/YY LT')

    return (
      <TimelineItem key={index}>
        <TimelineOppositeContent>
          <Typography color='textSecondary' variant='body2'>
            {date}
          </Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot
            color={inventoryAction.type === InventoryAction.input.type ? 'primary' : 'secondary'}
            variant='outlined'
          />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          {`${inventoryAction.name} ${Math.abs(movement.quantity)} itens | ${
            Reasons[movement.reason].name
          }`}
        </TimelineContent>
      </TimelineItem>
    )
  }

  const ICMS =
    product?.data?.product?.tax &&
    Object.keys(ICMSOrigin).reduce((acc, key) => {
      if (ICMSOrigin[key].value === product.data.product.tax.icmsOrigin) {
        acc.name = ICMSOrigin[key].name
        acc.description = ICMSOrigin[key].description
      }
      return acc
    }, {})

  const hasInventoryMovements = !!inventoryMovements?.data?.inventoryMovements?.movements.length

  return (
    <Page className={classes.root}>
      <Main>
        <Box marginBottom={2}>
          <Link startIcon={<KeyboardArrowLeft />} onClick={handleBack}>
            Voltar
          </Link>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              {!product.loading ? (
                <CardMedia
                  className={classNames(classes.media, classes.grey)}
                  image={product?.data?.product?.image}
                  title={product?.data?.product?.name}
                />
              ) : (
                <Skeleton className={classes.media} variant='rect' animation='wave' />
              )}
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm>
                    <Box marginBottom={1}>
                      {!product.loading ? (
                        <>
                          <Typography variant='body2' color='textSecondary'>
                            {product?.data?.product?.gtin}
                          </Typography>
                          <Typography className={classes.name} variant='h5'>
                            {product?.data?.product?.name}
                          </Typography>
                          <Typography color='textSecondary'>
                            {numeral(product?.data?.product?.price).format('$ 0.00')}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Skeleton
                            variant='rect'
                            width={105}
                            height={16}
                            animation='wave'
                            style={{ marginBottom: 4 }}
                          />
                          <Skeleton
                            variant='rect'
                            height={28}
                            animation='wave'
                            style={{ marginBottom: 4 }}
                          />
                          <Skeleton
                            variant='rect'
                            width={55}
                            height={20}
                            animation='wave'
                            style={{ marginBottom: 4 }}
                          />
                        </>
                      )}
                    </Box>
                    {product?.data?.product?.description && (
                      <Box mb={2}>
                        <Typography variant='body2'>{product.data.product.description}</Typography>
                      </Box>
                    )}
                    {!product.loading && (
                      <Box mb={product?.data?.product?.ncm ? 1 : 0}>
                        <Typography variant='body2'>Estoque</Typography>
                        <Typography variant='body2' color='textSecondary'>
                          {product?.data?.product?.balance}
                          {' unidades'}
                        </Typography>
                      </Box>
                    )}
                    {product?.data?.product?.ncm && (
                      <Box>
                        <Typography variant='body2'>NCM</Typography>
                        <Typography variant='body2' color='textSecondary'>
                          {product?.data?.product.ncm}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  {product?.data?.product?.tax && (
                    <Grid item xs={12} sm>
                      <Typography variant='overline'>Impostos</Typography>
                      <Typography variant='body2'>
                        <Box display='flex' alignItems='center'>
                          ICMS
                          <Tooltip title={ICMS.description}>
                            <HelpOutline className={classes.icon} />
                          </Tooltip>
                        </Box>
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        {product?.data?.product.tax.icmsTaxPercentage}%
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Movimentações no estoque' />
              <CardContent>
                <Timeline className={classes.timeline} align='alternate'>
                  {!inventoryMovements.loading ? (
                    hasInventoryMovements ? (
                      inventoryMovements.data.inventoryMovements.movements.map(renderTimelineItem)
                    ) : (
                      <Typography color='textSecondary' align='center'>
                        Não existem movimentações no estoque
                      </Typography>
                    )
                  ) : (
                    <>
                      <TimelineItem>
                        <TimelineOppositeContent>
                          <Skeleton variant='rect' width={100} height={20} animation='wave' />
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color='primary' variant='outlined' />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Skeleton variant='rect' width={100} height={20} animation='wave' />
                        </TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineOppositeContent>
                          <Skeleton variant='rect' width={100} height={20} animation='wave' />
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color='secondary' variant='outlined' />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Skeleton variant='rect' width={100} height={20} animation='wave' />
                        </TimelineContent>
                      </TimelineItem>
                    </>
                  )}
                </Timeline>
              </CardContent>
              {hasInventoryMovements &&
                inventoryMovements.data.inventoryMovements.movements.length <
                  inventoryMovements.data.inventoryMovements.pagination.totalItems && (
                <CardActions className={classes.acitons}>
                  <Button
                    size='small'
                    loading={inventoryMovements.loading}
                    onClick={handleLoadMore}
                  >
                      Carregar Mais
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        </Grid>
      </Main>
    </Page>
  )
}

ProductView.propTypes = {
  product: PropTypes.object,
  inventoryMovements: PropTypes.object,
  handleBack: PropTypes.func,
  handleLoadMore: PropTypes.func
}

ProductView.defaultProps = {
  handleBack: () => {},
  handleLoadMore: () => {}
}

export default ProductView
