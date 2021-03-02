import { serial as test } from 'ava'
import moment from 'moment'
import sinon from 'sinon'

import { sendEmails } from 'src/cronjobs/jobs'

import { User } from 'src/models'

import mail from 'src/services/mail'

import { userGenerator } from 'src/test/utils/generators'

test.before(async (t) => {
  await User.deleteMany({})
})

test.afterEach(async (t) => {
  await User.deleteMany({})
})

test('should send emails no_active D1', async (t) => {
  const stubMail = sinon.stub(mail, 'send').resolves()

  const createdAt = moment().subtract(1, 'day')

  const { user } = await userGenerator({ createdAt, isNoAction: true })

  await sendEmails()

  t.is(
    stubMail.withArgs(
      {
        to: user.email,
        subject: 'O que você achou da Mee?'
      },
      'nps.html'
    ).calledOnce,
    true
  )

  t.is(stubMail.callCount, 1)

  stubMail.restore()
})

test('should send emails no_active D2', async (t) => {
  const stubMail = sinon.stub(mail, 'send').resolves()

  const createdAt = moment().subtract(2, 'day')

  const { user } = await userGenerator({ createdAt, isNoAction: true })

  await sendEmails()

  t.is(
    stubMail.withArgs(
      {
        to: user.email,
        subject: 'Leve seu negócio a um novo patamar!'
      },
      'benefits.html'
    ).calledOnce,
    true
  )

  t.is(stubMail.callCount, 1)

  stubMail.restore()
})

test('should classify no_active D3+ as newsletter', async (t) => {
  const createdAt = moment().subtract(3, 'day')

  const { user } = await userGenerator({ createdAt, isNoAction: true })

  await sendEmails()

  const userReloaded = await User.findOne({ _id: user._id })

  t.is(userReloaded.newsLetterSubscriber, true)
})

/* ACTION */

test('should send emails uncompleted onboarding D1', async (t) => {
  const stubMail = sinon.stub(mail, 'send').resolves()

  const createdAt = moment().subtract(1, 'day')

  const { user } = await userGenerator({ createdAt, isNoAction: false })

  await sendEmails()

  t.is(
    stubMail.withArgs(
      {
        to: user.email,
        subject: 'Complete os primeiros passos para ter mais controle do seu negócio.'
      },
      'complete-first-steps.html'
    ).calledOnce,
    true
  )

  t.is(stubMail.callCount, 1)

  stubMail.restore()
})

test('should send emails uncompleted onboarding D2', async (t) => {
  const stubMail = sinon.stub(mail, 'send').resolves()

  const createdAt = moment().subtract(2, 'day')

  const { user } = await userGenerator({ createdAt, isNoAction: false })

  await sendEmails()

  t.is(
    stubMail.withArgs(
      {
        to: user.email,
        subject: 'Leve seu negócio a um novo patamar!'
      },
      'benefits.html'
    ).calledOnce,
    true
  )

  t.is(stubMail.callCount, 1)

  stubMail.restore()
})

test('should send emails uncompleted onboarding D3', async (t) => {
  const stubMail = sinon.stub(mail, 'send').resolves()

  const createdAt = moment().subtract(3, 'day')

  const { user } = await userGenerator({ createdAt, isNoAction: false })

  await sendEmails()

  t.is(
    stubMail.withArgs(
      {
        to: user.email,
        subject: 'O que você achou da Mee?'
      },
      'nps.html'
    ).calledOnce,
    true
  )

  t.is(stubMail.callCount, 1)

  stubMail.restore()
})

test('should classify D4 as newsletter', async (t) => {
  const createdAt = moment().subtract(4, 'day')

  const { user } = await userGenerator({ createdAt, isNoAction: false })

  await sendEmails()

  const userReloaded = await User.findOne({ _id: user._id })

  t.is(userReloaded.newsLetterSubscriber, true)
})
