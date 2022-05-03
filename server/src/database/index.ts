import {MongoClient} from 'mongodb'
import {Booking, Database, Listing, User} from 'lib/types'

// DON'T CREATE A TEST USER UNTIL WHILE YOU ARE CONNECTING TO THE DATABASE
// OTHERWISE THE AUTH WILL FAIL
const username = process.env.DB_USER
const password = process.env.DB_USER_PASSWORD
const cluster = process.env.DB_CLUSTER
const url = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/test?retryWrites=true&w=majority`

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url)
  const db = client.db('main')

  return {
    bookings: db.collection<Booking>('bookings'),
    listings: db.collection<Listing>('listings'),
    users: db.collection<User>('users'),
  }
}
