import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {Affix, Layout, Spin} from 'antd'
import * as apollo from '@apollo/client'
import * as Sections from 'sections'
import {Viewer} from 'lib/types'
import {LOG_IN, LogIn as LogInData, LogInVariables} from 'lib/graphql/mutations'
import {AppHeaderSkeleton, ErrorBanner} from 'lib/components'
import 'styles/index.css'

const client = new apollo.ApolloClient({
  uri: '/api',
  cache: new apollo.InMemoryCache(),
})

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
}

const App = () => {
  const [viewer, setViewer] = React.useState<Viewer>(initialViewer)
  const [logInCallback, {error}] = apollo.useMutation<
    LogInData,
    LogInVariables
  >(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn)
      }
    },
  })

  const logIn = React.useCallback(logInCallback, [logInCallback])

  React.useEffect(() => {
    logIn()
  }, [logIn])

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching TinyHouse" />
        </div>
      </Layout>
    )
  }

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null

  return (
    <BrowserRouter>
      <Layout id="app">
        {logInErrorBannerElement}
        <Affix offsetTop={0} className="app__affix-header">
          <Sections.AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Routes>
          <Route path="/" element={<Sections.Home />} />
          <Route path="/host" element={<Sections.Host />} />
          <Route path="/listing/:id" element={<Sections.Listing />} />
          <Route path="/listings" element={<Sections.Listings />} />
          <Route path="/listings/:location" element={<Sections.Listings />} />
          <Route
            path="/login"
            element={<Sections.Login setViewer={setViewer} />}
          />
          <Route path="/user/:id" element={<Sections.User />} />
          <Route path="*" element={<Sections.NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <apollo.ApolloProvider client={client}>
      <App />
    </apollo.ApolloProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
