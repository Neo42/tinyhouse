import React from 'react'
import {server} from './server'

interface State<Data> {
  data: Data | null
  loading: boolean
  error: boolean
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

export const useMutation = <Data = any, Variables = any>(query: string) => {
  const reducer = getReducer<Data>()
  const [state, dispatch] = React.useReducer(reducer, {
    data: null,
    loading: false,
    error: false,
  })

  const fetch = async (variables?: Variables) => {
    try {
      dispatch({type: 'FETCH'})
      const {data, errors} = await server.fetch<Data, Variables>({
        query,
        variables,
      })

      if (errors && errors.length) {
        throw new Error(errors[0].message)
      }

      dispatch({type: 'FETCH_SUCCESS', payload: data})
    } catch (error) {
      dispatch({type: 'FETCH_ERROR'})
      throw console.error(error)
    }
  }

  return [fetch, state] as const
}
