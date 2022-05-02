import React from 'react'
import {server} from './server'

interface State<Data> {
  data: Data | null
  loading: boolean
  error: boolean
}

interface QueryResult<Data> extends State<Data> {
  refetch: () => void
}

type Action<Data> =
  | {type: 'FETCH'}
  | {type: 'FETCH_SUCCESS'; payload: Data}
  | {type: 'FETCH_ERROR'}

const getReducer =
  <Data>() =>
  (state: State<Data>, action: Action<Data>): State<Data> => {
    switch (action.type) {
      case 'FETCH': {
        return {...state, loading: true}
      }
      case 'FETCH_SUCCESS': {
        return {data: action.payload, loading: false, error: false}
      }
      case 'FETCH_ERROR': {
        return {...state, loading: false, error: true}
      }
      default:
        throw new Error('Unhandled action.')
    }
  }

export const useQuery = <Data = any>(query: string): QueryResult<Data> => {
  const reducer = getReducer<Data>()
  const [state, dispatch] = React.useReducer(reducer, {
    data: null,
    loading: false,
    error: false,
  })

  const fetchData = React.useCallback(async () => {
    try {
      dispatch({type: 'FETCH'})

      const {data, errors} = await server.fetch<Data>({query})

      if (errors && errors.length) {
        throw new Error(errors[0].message)
      }

      dispatch({type: 'FETCH_SUCCESS', payload: data})
    } catch (error) {
      dispatch({type: 'FETCH_ERROR'})
      throw console.error(error)
    }
  }, [query])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return {...state, refetch: fetchData}
}
