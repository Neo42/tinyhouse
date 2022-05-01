import {ObjectId} from 'mongodb'
import {IResolvers} from '@graphql-tools/utils'
import {Database, Listing} from 'lib/types'

export const listingResolvers: IResolvers = {
  Query: {
    listings: async (
      _root: null,
      _args: null,
      {db}: {db: Database},
    ): Promise<Listing[]> => await db.listings.find({}).toArray(),
  },

  Mutation: {
    deleteListing: async (
      _root: null,
      {id}: {id: string},
      {db}: {db: Database},
    ): Promise<Listing> => {
      const deleteResult = await db.listings.findOneAndDelete({
        _id: new ObjectId(id),
      })

      if (!deleteResult.value) {
        throw new Error('Failed to delete listing.')
      }

      return deleteResult.value
    },
  },

  Listing: {
    id: (listing: Listing): string => listing._id.toString(),
  },
}
