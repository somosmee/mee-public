import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Add from '@material-ui/icons/Add'

import Dialog from 'src/components/Dialog'

import AppBarContext from 'src/contexts/AppBarContext'

import useApp from 'src/hooks/useApp'
import useCompany from 'src/hooks/useCompany'

import AddCompanyContent from 'src/dialogs/AddCompanyContent'

import { TOKEN_KEY } from 'src/utils/constants'
import { Paths, FirebaseEvents } from 'src/utils/enums'
import { save } from 'src/utils/localStorage'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const MyCompaniesView = () => {
  const classes = useStyles()

  const history = useHistory()

  const [, setAppBar] = useContext(AppBarContext)
  const [openDialog, setOpenDialog] = useState(false)

  const {
    getMyCompanies: [getMyCompanies, { data }],
    signinCompany: [signinCompany],
    createCompany: [createCompany]
  } = useCompany()

  const {
    updateApp: [updateApp]
  } = useApp()

  const companies = data?.myCompanies

  useEffect(() => {
    getMyCompanies()
  }, [])

  useEffect(() => {
    const title = 'Meu Negócio'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: '' })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  const handleSelectCompany = (company) => async () => {
    const { token } = await signinCompany({ company: company._id })

    save(TOKEN_KEY, token)
    await updateApp({ logged: true, signup: false })

    history.push(Paths.reports.path)
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleCreateCompany = async (input) => {
    await createCompany(input)
    handleCloseDialog()
  }

  return (
    <Grid
      className={classes.root}
      container
      direction='column'
      justify='center'
      alignItems='center'
      spacing={3}
    >
      <Grid item xs>
        <Typography variant='h5' gutterBottom>
          Suas empresas
        </Typography>
      </Grid>
      <Grid container item spacing={3} direction='row' justify='center' alignItems='center'>
        <Grid item>
          <CardActionArea onClick={handleOpenDialog}>
            <Card className={classes.cardButton}>
              <CardContent>
                <Add color='primary' />
                <Typography color='primary'>Adicionar empresa</Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>
        {companies &&
          companies.map((company, index) => (
            <Grid item key={index}>
              <CardActionArea onClick={handleSelectCompany(company)}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant='h6' component='h2'>
                      {company.name || 'Sem nome'}
                    </Typography>
                    <Typography color='textSecondary' variant='subtitle' gutterBottom>
                      {company.nationalId || 'CNPJ nao cadastrado'}
                    </Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
          ))}
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <AddCompanyContent title='Adicionar empresa' onSubmit={handleCreateCompany} />
      </Dialog>
    </Grid>
  )
}

export default MyCompaniesView
