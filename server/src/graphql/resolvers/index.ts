import merge from 'lodash.merge'
import {ViewerResolvers} from './Viewer'
import {UserResolvers} from './User'

export const resolvers = merge(ViewerResolvers, UserResolvers)
