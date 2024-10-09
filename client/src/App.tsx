/**
 * The main React component for the application. It handles routing, fetching user data, and managing user authentication state.
 *
 * @returns The main App component, which renders the navigation and the different pages of the application.
 */
// Import necessary styles and dependencies
import './styles/index.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Import components and pages
import Nav from './components/layout/Nav';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EditProfile from './pages/EditProfile';

function App() {
  // State variables for user information and authentication
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user data from the API
  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const content = await response.json();
        setName(content.name);
        setEmail(content.email);
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        // User is not authenticated
        setIsAuthenticated(false);
        setName('');
        setEmail('');
      } else {
        setError('Failed to fetch user data.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('An error occurred while fetching user data.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle profile updates
  const handleProfileUpdate = (updatedProfile: { name: string; email: string }) => {
    setName(updatedProfile.name);
    setEmail(updatedProfile.email);
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        {/* Navigation component */}
        <Nav name={name} setName={setName} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

        <main className="form-signin w-100 m-auto">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            // Define routes for different pages
            <Routes>
              <Route path='/' element={<Home name={name} setName={setName} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
              <Route path='/login' element={<Login setName={setName} setEmail={setEmail} setIsAuthenticated={setIsAuthenticated} />} />
              <Route path='/register' element={<Register />} />
              <Route path='/edit-profile' element={<EditProfile
                  name={name}
                  email={email}
                  onProfileUpdate={handleProfileUpdate}
                />} />
            </Routes>
          )}
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
