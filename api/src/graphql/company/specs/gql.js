export const CREATE_MEMBER = `
  mutation ($input: CreateMemberInput!) {
    createMember(input: $input) {
      members {
        status
        role
        user {
          email
        }
      }
    }
  }
`

export const ACCEPT_INVITE = `
  mutation ($input: AcceptInviteInput!) {
    acceptInvite(input: $input) {
      token
      user {
        email
      }
      company {
        members {
          status
          role
          user {
            email
          }
        }
      }
    }
  }
`

export const DELETE_MEMBER = `
  mutation ($input: DeleteMemberInput!) {
    deleteMember(input: $input) {
      members {
        status
        role
        user {
          email
        }
      }
    }
  }
`
