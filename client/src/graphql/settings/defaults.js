import { SETTINGS_OPTIONS_KEY } from 'src/graphql/settings/constants'

import { load } from 'src/utils/localStorage'

const defaults = {
  options: load(SETTINGS_OPTIONS_KEY) || {
    dark: false,
    salesType: 'orders',
    performace: false,
    __typename: 'SettingsOptions'
  },
  __typename: 'Settings'
}

export { defaults as default }
