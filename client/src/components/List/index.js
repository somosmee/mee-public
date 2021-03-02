import React, { useState } from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import ListMaterial from '@material-ui/core/List'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Pagination from '@material-ui/lab/Pagination'

import Inbox from '@material-ui/icons/Inbox'

import ListFilters from 'src/components/List/ListFilters'
import OldList from 'src/components/List/OldList'
import propTypes from 'src/components/List/OldList/propTypes'
import Placeholder from 'src/components/Placeholder'
import Search from 'src/components/Search'

import ListItem from './ListItem'
import ListSkeleton from './ListSkeleton'
import useStyles from './styles'

const List = ({
  id,
  actionButton,
  filters,
  loading,
  avatar,
  multiple,
  labels,
  items,
  pagination,
  search,
  renderActions,
  renderCollapse,
  getItemImage,
  getItemTitle,
  getItemAdornmentTitle,
  getItemSubtitle,
  getItemDescription,
  getItemInformation,
  getItemDisabled,
  onPageChange,
  onRowsPerPageChange,
  onFilterChange,
  onClick
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const [open, setOpen] = useState(false)

  const handleSearchChange = (value) => {
    search && search.onChange(value)
  }

  const handleCollapseToggle = () => {
    setOpen((prevState) => !prevState)
  }

  const handleClick = (item, index) => (event) => {
    onClick(item, index)
  }

  const renderItem = (item, index) => (
    <ListItem
      key={item._id}
      avatar={avatar}
      open={open}
      image={getItemImage(item)}
      title={getItemTitle(item)}
      adornmentTitle={getItemAdornmentTitle(item)}
      subtitle={getItemSubtitle(item)}
      description={getItemDescription(item)}
      information={getItemInformation(item)}
      onCollapseToggle={handleCollapseToggle}
      onClick={handleClick(item, index)}
      renderActions={() => renderActions?.(item, index, getItemDisabled(item))}
      renderCollapse={() => renderCollapse?.(item, index, getItemDisabled(item), open)}
    />
  )

  const hasItems = !!items.length || !!search?.items?.length
  const hasFilter =
    filters?.start ||
    filters?.end ||
    filters?.status?.length > 0 ||
    filters?.payments?.length > 0 ||
    filters?.origin?.length > 0
  const searchValue = search?.value?.trim()
  const hasResults = !!search?.items.length

  if (!hasFilter && !hasItems && !hasResults) return <></>

  return loading ? (
    <ListSkeleton search={!!search} />
  ) : (
    <Card elevation={3}>
      <CardContent>
        {(hasFilter || hasItems) && (
          <Grid container spacing={2}>
            {search && (
              <Grid item xs={12} sm>
                <Search
                  value={search.value}
                  placeholder={search.placeholder}
                  loading={search.loading}
                  onChange={handleSearchChange}
                  filter
                />
              </Grid>
            )}
            {filters && (
              <Grid item sm>
                <ListFilters initialValues={filters} onFilterChange={onFilterChange} />
              </Grid>
            )}
            {actionButton && (
              <Grid item container justify={upMedium ? 'flex-end' : 'center'} xs={12} sm>
                <Button
                  variant='outlined'
                  startIcon={actionButton.icon}
                  onClick={actionButton.onClick}
                  color='primary'
                >
                  {actionButton.label}
                </Button>
              </Grid>
            )}
          </Grid>
        )}
        {((searchValue && !search?.loading && !hasResults) ||
          (hasFilter && !loading && !hasItems)) && (
          <Grid container>
            <Placeholder icon={<Inbox />} message={'Nenhum resultado encontrado'} />
          </Grid>
        )}
        {hasItems &&
          (upMedium ? (
            <OldList
              id={id}
              open={open}
              labels={labels}
              avatar={avatar}
              items={!searchValue ? items : search.items}
              filtered={searchValue}
              pagination={pagination}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
              getItemDisabled={(item) => !!item.deletedAt}
              renderActions={renderActions}
              renderCollapse={renderCollapse}
              onCollapseToggle={handleCollapseToggle}
              onClick={handleClick}
            />
          ) : (
            <>
              <ListMaterial id={id} className={classes.root}>
                {!searchValue ? items.map(renderItem) : search.items.map(renderItem)}
              </ListMaterial>
              {!searchValue && pagination && (
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page + 1}
                  onChange={(event, value) => onPageChange(value - 1)}
                  size='small'
                />
              )}
            </>
          ))}
      </CardContent>
    </Card>
  )
}

List.propTypes = {
  id: PropTypes.string,
  actionButton: PropTypes.object,
  filters: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  avatar: PropTypes.bool,
  multiple: PropTypes.bool,
  labels: PropTypes.arrayOf(
    PropTypes.oneOfType([propTypes.label, PropTypes.arrayOf(propTypes.label)])
  ).isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  pagination: PropTypes.shape({
    offsset: PropTypes.number,
    page: PropTypes.number,
    totalItems: PropTypes.number,
    totalPages: PropTypes.number
  }),
  search: PropTypes.shape({
    loading: PropTypes.bool,
    placeholder: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.string,
    onChange: PropTypes.func
  }),
  getItemImage: PropTypes.func,
  getItemTitle: PropTypes.func,
  getItemAdornmentTitle: PropTypes.func,
  getItemSubtitle: PropTypes.func,
  getItemDescription: PropTypes.func,
  getItemInformation: PropTypes.func,
  getItemDisabled: PropTypes.func,
  renderActions: PropTypes.func,
  renderCollapse: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onFilterChange: PropTypes.func,
  onClick: PropTypes.func
}

List.defaultProps = {
  loading: false,
  avatar: false,
  multiple: false,
  items: [],
  getItemImage: () => '',
  getItemTitle: () => '',
  getItemAdornmentTitle: () => '',
  getItemSubtitle: () => '',
  getItemDescription: () => '',
  getItemInformation: () => '',
  getItemDisabled: () => false,
  renderActions: () => false,
  renderCollapse: () => false,
  onPageChange: () => {},
  onRowsPerPageChange: () => {},
  onClick: () => false,
  onFilterChange: () => {}
}

export default List
