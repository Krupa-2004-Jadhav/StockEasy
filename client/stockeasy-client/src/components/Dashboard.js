import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/trade">
        <button>Go to Trade Screen</button>
      </Link>
    </div>
  );
}

export default Dashboard;
