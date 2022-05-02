export interface Listing {
  id: string
  title: string
  image: string
  address: string
  price: string
  numOfGuests: number
  numOfBeds: number
  numOfBaths: number
  rating: number
}

export interface ListingsData {
  listings: Listing[]
}

export interface DeleteListingData {
  deleteListing: Listing
}

export interface DeleteListingVariables {
  id: string
}
