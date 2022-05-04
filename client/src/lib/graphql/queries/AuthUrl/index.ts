import {gql} from '@apollo/client'

export * from './__generated__/AuthUrl'

export const AUTH_URL = gql`
  query AuthUrl {
    authUrl
  }
`
