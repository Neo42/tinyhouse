import React from 'react'
import {Navigate} from 'react-router-dom'
import {useApolloClient, useMutation} from '@apollo/client'
import {Card, Layout, Spin, Typography} from 'antd'
import {ErrorBanner} from 'lib/components'
import {
  AUTH_URL,
  LOG_IN,
  LogInVariables,
  AuthUrl as AuthUrlData,
  LogIn as LogInData,
} from 'lib/graphql'
import {Viewer} from 'lib/types'
import {displayErrorMessage, displaySuccessNotification} from 'lib/utils'
import googleLogo from './assets/google_logo.jpeg'

interface Props {
  setViewer: (viewer: Viewer) => void
}

const {Content} = Layout
const {Text, Title} = Typography

export const Login = ({setViewer}: Props) => {
  const client = useApolloClient()
  const [
    logInCallback,
    {data: LogInData, loading: logInLoading, error: logInError},
  ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (
        data &&
        data.logIn &&
        data.logIn.token &&
        !sessionStorage.getItem('token')
      ) {
        setViewer(data.logIn)
        sessionStorage.setItem('token', data.logIn.token)
        displaySuccessNotification("You've successfully logged in!")
      }
    },
  })

  const logIn = React.useCallback(logInCallback, [logInCallback])

  React.useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code')

    if (code) {
      logIn({
        variables: {
          input: {code},
        },
      })
    }
  }, [logIn])

  const handleAuthorize = async () => {
    try {
      const {data} = await client.query<AuthUrlData>({
        query: AUTH_URL,
      })

      window.location.href = data.authUrl
    } catch (error) {
      displayErrorMessage(
        "Sorry! We weren't able to log you in. Please try again later!",
      )
    }
  }

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    )
  }

  if (LogInData && LogInData.logIn) {
    const {id: viewerId} = LogInData.logIn
    return <Navigate to={`/user/${viewerId}`} />
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later!" />
  ) : null

  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="waving hand">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <button
          type="button"
          className="log-in-card__google-button"
          onClick={handleAuthorize}>
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google account.
        </Text>
      </Card>
    </Content>
  )
}
