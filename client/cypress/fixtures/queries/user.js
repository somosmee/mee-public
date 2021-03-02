export const SEND_PIN = `
  mutation sendPin($input: SendPinInput!) {
    sendPin(input: $input) {
      sent
    }
  }
`

export const SIGNIN = `
  mutation signin($input: SigninInput!) {
    signin(input: $input) {
      signup
      token
    }
  }
`
