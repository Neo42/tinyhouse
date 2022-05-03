require('dotenv').config()
import {connectDatabase} from '../src/database'

const clear = async () => {
  try {
    console.log('[clear]: running...')

    const db = await connectDatabase()

    const bookings = await db.bookings.find({}).toArray()
    const listings = await db.listings.find({}).toArray()
    const users = await db.users.find({}).toArray()

    if (bookings.length > 1) {
      await db.bookings.drop()
    }
    if (listings.length > 1) {
      await db.listings.drop()
    }
    if (users.length > 1) {
      await db.users.drop()
    }

    console.log('[clear]: success.')
    process.exit(1)
  } catch {
    throw new Error('Failed to clear database')
  }
}

clear()
