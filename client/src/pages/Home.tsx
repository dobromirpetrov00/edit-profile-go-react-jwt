/**
 * The Home component is the main page of the application. It displays a greeting message and provides links for authenticated users to edit their profile or log out, or prompts unauthenticated users to log in or register.
 *
 * @param name - The name of the authenticated user.
 * @param isAuthenticated - A boolean indicating whether the user is authenticated.
 * @param setName - A function to update the name of the authenticated user.
 * @param setIsAuthenticated - A function to update the authentication status of the user.
 * @returns The rendered Home component.
 */
import styles from '../styles/Home.module.css';
import utils from '../styles/utils.module.css';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Home = ({ name, isAuthenticated, setName, setIsAuthenticated }: {
    name: string;
    isAuthenticated: boolean;
    setName: (name: string) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}) => {
    // State to store the greeting message
  const [greeting, setGreeting] = useState('');

  // Extract success message from URL query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const successMessage = queryParams.get('message');

    useEffect(() => {
        // Set the document title when the component mounts
        document.title = "Homepage";
        // Set the greeting message
        setGreeting(getGreeting());
    }, []);

    /**
     * Determines the appropriate greeting based on the current time of day.
     * @returns {string} The greeting message.
     */
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    /**
     * Handles the logout process.
     * Sends a logout request to the server and updates the local state.
     */
    const logout = async () => {
        // Send logout request to the server
        await fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        // Reset the user's name and authentication status
        setName('');
        setIsAuthenticated(false);
    };

    return (
        <div className={styles.homeContainer}>
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <h1 className={utils.fadeIn}>Welcome!</h1>
            {isAuthenticated ? (
                <>
                    {/* Display personalized greeting for authenticated users */}
                    <h4 className={utils.fadeIn}>{greeting}, {name}!</h4>
                    <div className={`${styles.buttonGroup} ${utils.fadeIn}`}>
                        {/* Link to edit profile page */}
                        <Link to="/edit-profile" className={styles.profileBtn}>
                            <i className="fas fa-user"></i> Edit Profile
                        </Link>
                        {/* Logout button */}
                        <Link to="/" className={styles.logoutBtn} onClick={logout}>
                            <i className="fas fa-sign-out-alt"></i> Log Out
                        </Link>
                    </div>
                </>
            ) : (
                // Display message and links for unauthenticated users
                <div className={utils.fadeIn}>
                    <h4>You are not logged in.</h4>
                    <p>
                        Please <Link to="/login" className="link">log in</Link> or{' '}
                        <Link to="/register" className="link">register</Link>.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
