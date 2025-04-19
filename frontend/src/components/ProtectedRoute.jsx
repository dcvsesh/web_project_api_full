import { Navigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({isLoggedIn, children}) => {
const location = useLocation()

if(!isLoggedIn) {
  return <Navigate to="/signin" replace/>;
}

if(isLoggedIn && location.pathname === "/signin") {
  return  <Navigate to="/" replace/>;
}

return children;
}
export default ProtectedRoute