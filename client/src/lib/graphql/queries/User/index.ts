import {gql} from '@apollo/client'

export const USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      name
      avatar
      contact
      hasWallet
      income
    }
  }
`

export * from './__generated__/User'
