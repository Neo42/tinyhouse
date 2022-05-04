import {gql} from '@apollo/client'

export * from './__generated__/LogOut'

export const LOG_OUT = gql`
  mutation LogOut {
    logOut {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`
