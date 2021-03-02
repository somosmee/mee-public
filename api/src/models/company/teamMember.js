import mongoose from 'src/mongoose'

import { Roles, MemberInviteStatus } from 'src/utils/enums'

const { ObjectId } = mongoose.Types

const TeamMember = new mongoose.Schema({
  user: {
    type: ObjectId,
    index: true,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: Object.values(Roles),
    required: true,
    default: Roles.BUSINESS_ADMIN
  },
  status: {
    type: String,
    enum: Object.values(MemberInviteStatus),
    default: MemberInviteStatus.SUCCESS,
    required: true
  },
  inviteToken: String
})

export { TeamMember as default }
