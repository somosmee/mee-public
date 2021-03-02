import moment from 'moment'
import 'moment/locale/pt-br'

moment.locale('pt-br')

/* eslint no-extend-native: ["error", { "exceptions": ["String"] }] */
String.prototype.toDate = function() {
  if (!this) return null

  const isBeforeCurrentWeek = moment(this).isBefore(moment().startOf('week'))

  if (isBeforeCurrentWeek) {
    return moment(this).format('DD/MM/YY [às] LT')
  }

  return moment(this).fromNow()
}
