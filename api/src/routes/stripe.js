import stripe from 'src/stripe'

export default (app) => {
  app.post('/stripe/notify', async (req, res) => {
    try {
      await stripe.processEvent(req.body)
      return res.status(200).send()
    } catch (e) {
      console.log('[/api/stripe/notify] ERROR:', e)
      return res.status(400).send({ message: 'Failed!', error: e.message })
    }
  })
}
