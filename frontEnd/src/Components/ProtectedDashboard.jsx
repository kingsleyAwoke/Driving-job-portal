// ProtectedDashboard.jsx
import withAuth from './withAuth'; // Path to your HOC
import UserDashboard from './UserDashboard'; // Path to your Dashboard component

export default withAuth(UserDashboard);