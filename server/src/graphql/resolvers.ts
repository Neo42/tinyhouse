import {IResolvers} from '@graphql-tools/utils'
import {listings} from '../listings'

export const resolvers: IResolvers = {
  Query: {
    listings: () => listings,
  },

  Mutation: {
    deleteListing: (_root: undefined, {id}: {id: string}) => {
      for (let index = 0; index < listings.length; index++) {
        if (listings[index].id === id) {
          return listings.splice(index, 1)[0]
        }
      }
      throw new Error('Failed to delete listing.')
    },
  },
}
