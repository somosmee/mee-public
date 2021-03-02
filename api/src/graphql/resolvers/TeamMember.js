import { User } from 'src/models'

const TeamMember = {
  user(parent) {
    return User.findById(parent.user)
  }
}

export { TeamMember as default }
