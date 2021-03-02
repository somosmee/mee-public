/**
 * https://developers.facebook.com/docs/facebook-pixel/reference#standard-events
 */
import ReactPixel from 'react-facebook-pixel'

ReactPixel.init('797016604171224')

export default {
  pageView: () => {
    if (process.env.REACT_APP_MEE_ENV === 'production') {
      ReactPixel.pageView()
    }
  },
  track: (event, data) => {
    if (process.env.REACT_APP_MEE_ENV === 'production') {
      ReactPixel.track(event, data)
    }
  }
}
