import { User } from 'src/models'

const RegisterOperation = {
  createdBy(parent) {
    return User.findById(parent.createdBy)
  }
}

export { RegisterOperation as default }
