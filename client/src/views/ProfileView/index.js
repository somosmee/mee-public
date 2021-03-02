import React, { useContext, useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import { useMutation } from '@apollo/react-hooks'
import classNames from 'classnames'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Chip from '@material-ui/core/Chip'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import { useTheme } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneAll from '@material-ui/icons/DoneAll'
import MailIcon from '@material-ui/icons/MailOutline'

import Button from 'src/components/Button'
import Dialog from 'src/components/Dialog'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import TabPanel from 'src/components/TabPanel'

import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import UpsertProfileForm from 'src/forms/UpsertProfileForm'

import useCompany from 'src/hooks/useCompany'
import useMe from 'src/hooks/useMe'
import useUserAddress from 'src/hooks/useUserAddress'

import UpsertMemberContent from 'src/dialogs/UpsertMemberContent'

import { FirebaseEvents, MemberRoles } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const ProfileView = () => {
  const classes = useStyles()
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))

  const [openDialog, setOpenDialog] = useState(false)

  const { me } = useMe()

  const {
    getMyCompany: [getMyCompany, { data, loading: loadingMyCompany }],
    updateMyCompany: [updateMyCompany, { loading: loadingUpdate }],
    createMember: [createMember],
    deleteMember: [deleteMember]
  } = useCompany()
  const company = data?.myCompany

  const { UpsertAddressForm, addressProps } = useUserAddress(company?.address)
  const history = useHistory()
  const { hash } = useLocation()
  const [, setAppBar] = useContext(AppBarContext)
  const [tab, setTab] = useState(hash !== '' ? hash : '#store')

  const [openNotification] = useMutation(OPEN_NOTIFICATION)

  useEffect(() => {
    const title = 'Meu Negócio'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    helpscout.showBeacon()
  }, [])

  useEffect(() => {
    getMyCompany()
  }, [])

  useEffect(() => {
    if (!hash) {
      const selectedTab = '#store'
      setTab(selectedTab)
      history.replace(`/profile${selectedTab}`)
    } else {
      setTab(hash)
    }
  }, [hash, history])

  const handleTabChange = (event, newValue) => {
    if (tab !== newValue) {
      setTab(newValue)
      history.push(`/profile${newValue}`)
    }
  }

  const handleSubmit = async (input) => {
    try {
      await updateMyCompany(input)
      const { nationalId, ...rest } = input
      analytics.logEvent(FirebaseEvents.SET_PROFILE, { ...rest, nationalId: nationalId })
      openNotification({
        variables: { input: { variant: 'success', message: 'Perfil atualizado' } }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleCreateMemberSubmit = async (data) => {
    await createMember(data)
    handleCloseDialog()
  }

  const handleDelete = (member) => async () => {
    await deleteMember({ member: member._id })
  }

  return (
    <Page className={classes.root}>
      <Main loading={loadingMyCompany}>
        <div className={classes.tabs}>
          <Tabs value={tab} indicatorColor='primary' textColor='primary' onChange={handleTabChange}>
            <Tab value='#store' label='Loja' />
            <Tab value='#address' label='Endereço' />
            <Tab value='#members' label='Funcionários' />
          </Tabs>
        </div>
        <TabPanel component={Container} maxWidth='sm' disableGutters value={tab} tab={'#store'}>
          {company && (
            <Card>
              <CardContent>
                <UpsertProfileForm
                  user={company}
                  onSubmit={handleSubmit}
                  actions={(submitting) => (
                    <Button
                      type='submit'
                      variant='contained'
                      color='primary'
                      loading={loadingUpdate}
                      disabled={submitting}
                    >
                      Atualizar
                    </Button>
                  )}
                />
              </CardContent>
            </Card>
          )}
        </TabPanel>
        <TabPanel component={Container} maxWidth='sm' disableGutters value={tab} tab={'#address'}>
          {company && (
            <Card className={classNames({ [classes.fullWidth]: !upSmall })}>
              <CardHeader title='Endereço do estabelecimento' />
              <CardContent>
                <UpsertAddressForm {...addressProps} />
              </CardContent>
            </Card>
          )}
        </TabPanel>
        <TabPanel component={Container} maxWidth='sm' disableGutters value={tab} tab={'#members'}>
          {company && (
            <Card className={classNames({ [classes.fullWidth]: !upSmall })}>
              <CardHeader title='Funcionários' />
              <CardActions>
                <Button
                  startIcon={<AddIcon />}
                  size='small'
                  color='primary'
                  onClick={handleOpenDialog}
                >
                  ADICIONAR
                </Button>
              </CardActions>
              <CardContent>
                <List>
                  {company.members.map((member, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Chip
                          classes={{ root: classes[member.status] }}
                          variant='outlined'
                          color='primary'
                          size='small'
                          label={member.status === 'success' ? 'Ativo' : 'Pendente'}
                          icon={member.status === 'success' ? <DoneAll /> : <MailIcon />}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={member.user.name || member.user.email}
                        secondary={
                          member.user.name
                            ? `${MemberRoles[member.role].label} - ${member.user.email}`
                            : MemberRoles[member.role].label
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge='end'
                          aria-label='delete'
                          disabled={me?.email === member.user.email}
                        >
                          <DeleteIcon onClick={handleDelete(member)} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <UpsertMemberContent
              title='Criar funcionário'
              loading={false}
              onClose={handleCloseDialog}
              onSubmit={handleCreateMemberSubmit}
            />
          </Dialog>
        </TabPanel>
      </Main>
    </Page>
  )
}

export default ProfileView
