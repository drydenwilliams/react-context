import React, { FunctionComponent, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
  Switch,
  withRouter,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from '../../theme'
import GlobalStyle from '../../theme/global-styles'
import Billing from '../../views/billing'
import Checkout from '../../views/checkout'
import Products from '../../views/products'
import './App.css'

const Loading = () => <div>Loading...</div>

const NoMatch = () => <div>404 No match found</div>

const HomepageView = () => (
  <div>You cant use this app without customer context</div>
)

const fakeAuth = {
  isAuthenticated: false,
  authenticate(this: any, cb: () => void) {
    this.isAuthenticated = true
    setTimeout(cb, 200)
  },
  signout(this: any, cb: () => void) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  },
}

const AuthButton = withRouter(({ history }) => {
  if (!fakeAuth.isAuthenticated) {
    return null
  }

  return (
    <button
      onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}
    >
      Sign out
    </button>
  )
})

const PrivateRoute: React.SFC<RouteProps> = ({ component, ...rest }) => {
  if (rest.location) {
    const params = new URLSearchParams(rest.location.search)
    if (params.get('token')) {
      fakeAuth.authenticate(() => console.log('logged in'))
    }
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        fakeAuth.isAuthenticated ? (
          React.createElement(component! as React.SFC<any>, props)
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}

type Props = RouteComponentProps<{}, {}, { from: { pathname: string } }>

class Login extends React.Component<Props, { redirectToReferrer: boolean }> {
  state = {
    redirectToReferrer: false,
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return <Redirect to={from} />
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

const App: FunctionComponent = () => {
  return (
    <React.StrictMode>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Suspense fallback={<Loading />}>
          <Router>
            <header>
              site header
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/products">Products</Link>
                  </li>
                  <li>
                    <Link to="/billing">Billing</Link>
                  </li>
                  <li>
                    <Link to="/checkout">Checkout</Link>
                  </li>
                  <li>
                    <Link to="/products?token=sdfsdfsdf">
                      Products with token
                    </Link>
                  </li>
                </ul>
                <AuthButton />
              </nav>
            </header>

            <main>
              <Switch>
                <Route exact path="/" component={HomepageView} />
                <Route path="/login" component={Login} />
                <PrivateRoute path="/products" component={Products} />
                <PrivateRoute path="/billing" component={Billing} />
                <PrivateRoute path="/checkout" component={Checkout} />
                <Route path="*" component={NoMatch} />
              </Switch>
            </main>
            <footer>site footer</footer>
          </Router>
        </Suspense>
      </ThemeProvider>
    </React.StrictMode>
  )
}

export default App
