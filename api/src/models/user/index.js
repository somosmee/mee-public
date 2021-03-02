import isEmail from 'validator/lib/isEmail'

import storage from 'src/google/cloud-storage'

import mongoose from 'src/mongoose'

import OnBoarding from 'src/models/user/onboarding'

import { CERTIFICATES_BUCKET_NAME, IMAGES_BUCKET_NAME } from 'src/utils/constants'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => isEmail(value),
        message: '{VALUE} não é um e-mail válido'
      }
    },
    firstLogin: { type: Boolean, default: false },
    name: {
      type: String,
      default: '',
      trim: true
    },
    onboarding: { type: OnBoarding, default: {} },
    referral: String,
    pin: { type: String },
    isNoAction: Boolean,
    newsLetterSubscriber: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

UserSchema.pre('save', async function(next) {
  const user = this

  if (user.isModified('banner') && user._banner) {
    await storage.remove({ bucketName: IMAGES_BUCKET_NAME, name: user._banner, isPublic: true })
  }

  if (user.isModified('certificate') && user._certificate) {
    await storage.remove({ bucketName: CERTIFICATES_BUCKET_NAME, name: user._certificate.name })
  }

  next()
})

UserSchema.pre('save', async function(next) {
  const user = this

  if (user.isModified('picture') && user._picture?.includes(process.env.GOOGLE_STORAGE_URL)) {
    await storage.remove({ bucketName: IMAGES_BUCKET_NAME, name: user._picture, isPublic: true })
  }

  next()
})

UserSchema.statics.createUser = async function(input) {
  const User = this
  const data = {
    ...input,
    firstLogin: true
  }

  const user = await new User(data).save()
  return user
}

UserSchema.statics.findByGoogleUser = function(email, data) {
  const User = this
  const conditions = { email }
  const update = { $set: data }
  const options = { new: true }

  return User.findOneAndUpdate(conditions, update, options)
}

UserSchema.index({ email: 1 }, { unique: true, name: 'email_' })

export default mongoose.model('User', UserSchema)
