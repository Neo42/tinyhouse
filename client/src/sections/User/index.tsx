import {useQuery} from '@apollo/client'
import {Col, Layout, Row} from 'antd'
import {USER, User as UserData, UserVariables} from 'lib/graphql'
import {useParams} from 'react-router-dom'
import {UserProfile} from './components'
import {Viewer} from 'lib/types'
import {ErrorBanner, PageSkeleton} from 'lib/components'

const {Content} = Layout

interface Props {
  viewer: Viewer
}

export const User = ({viewer}: Props) => {
  const {id} = useParams()
  const {data, loading, error} = useQuery<UserData, UserVariables>(USER, {
    variables: {id: id ?? ''},
  })

  const user = data?.user ?? null
  const viewerIsUser = viewer.id === id

  const userProfileElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
  ) : null

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    )
  }

  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description="This user may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    )
  }

  return (
    <Content className="user">
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Content>
  )
}
