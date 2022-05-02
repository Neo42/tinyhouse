import {gql, useMutation, useQuery} from '@apollo/client'
import {Listings as ListingsData} from './__generated__/Listings'
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from './__generated__/DeleteListing'

const LISTINGS = gql`
  # query naming is required for codegen
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`

interface Props {
  title: string
}

export const Listings = ({title}: Props) => {
  const {data, loading, error, refetch} = useQuery<ListingsData>(LISTINGS)

  const [
    deleteListing,
    {loading: deleteListingLoading, error: deleteListingError},
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING)

  const handleDeleteListing = async (id: string) => {
    await deleteListing({variables: {id}})
    refetch()
  }

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (error) {
    return <h2>Uh oh! Somethings went wrong - Please try again later...</h2>
  }

  const deleteListingLoadingMessage = deleteListingLoading ? (
    <h4>Deletion in progress...</h4>
  ) : null

  const deleteListingErrorMessage = deleteListingError ? (
    <h4>Uh oh! Somethings went wrong - Please try again later...</h4>
  ) : null

  const listings = data?.listings

  return (
    <div>
      <h2>{title}</h2>
      {listings ? (
        <ul>
          {listings.map(({id, title}) => (
            <li key={id}>
              {title}
              <button type="button" onClick={() => handleDeleteListing(id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </div>
  )
}
