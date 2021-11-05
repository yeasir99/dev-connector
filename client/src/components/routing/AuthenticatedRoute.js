import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const AuthenticatedRoute = ({
  component: Component,
  auth: { isAuthenticated },
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    ></Route>
  )
}
const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(AuthenticatedRoute)
