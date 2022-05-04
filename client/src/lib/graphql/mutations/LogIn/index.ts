import {gql} from '@apollo/client'

export * from './__generated__/LogIn'

export const LOG_IN = gql`
  mutation LogIn($input: LogInInput) {
    logIn(input: $input) {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`
