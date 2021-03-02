import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'

import {
  PRIMARY_MAIN,
  PRIMARY_LIGHT,
  PRIMARY_DARK,
  PRIMARY_CONTRAST_TEXT,
  SECONDARY_MAIN,
  SECONDARY_LIGHT,
  SECONDARY_DARK,
  SECONDARY_CONTRAST_TEXT
} from 'src/utils/constants'
import { Environments } from 'src/utils/enums'

const theme = (prefersDarkMode) => {
  const transitions = {}

  if (process.env.NODE_ENV === Environments.TEST) {
    transitions.transitions = { create: () => 'none' }
  }

  return responsiveFontSizes(
    createMuiTheme({
      ...transitions,
      // props: {
      //   // Name of the component ⚛️
      //   MuiButtonBase: {
      //     // The properties to apply
      //     disableRipple: true // No more ripple, on the whole application 💣!
      //   }
      // },
      overrides: {
        MuiButton: {
          root: {
            textTransform: 'none'
          }
        }
      },
      palette: {
        type: 'light',
        primary: {
          main: PRIMARY_MAIN,
          light: PRIMARY_LIGHT,
          dark: PRIMARY_DARK,
          contrastText: PRIMARY_CONTRAST_TEXT
        },
        secondary: {
          main: SECONDARY_MAIN,
          light: SECONDARY_LIGHT,
          dark: SECONDARY_DARK,
          contrastText: SECONDARY_CONTRAST_TEXT
        }
      }
    }),
    [prefersDarkMode]
  )
}

export { theme as default }
