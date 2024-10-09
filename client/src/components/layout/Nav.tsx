/**
 * The `Nav` component represents the navigation bar of the application.
 * It displays different menu items based on whether the user is authenticated or not.
 * If the user is not authenticated, it shows links to the login and register pages.
 * If the user is authenticated and on the edit profile page, it shows a logout link.
 * The component also handles the logout functionality, including displaying a loading state and any errors that may occur.
 *
 * @param props - An object containing the following properties:
 * - `name`: The name of the authenticated user.
 * - `setName`: A function to update the user's name.
 * - `isAuthenticated`: A boolean indicating whether the user is authenticated.
 * - `setIsAuthenticated`: A function to update the authentication state of the user.
 */
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import styles from '../../styles/Nav.module.css';
import '../../styles/index.css';
import utils from '../../styles/utils.module.css';

const Nav = (props: {
    name: string;
    setName: (name: string) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}) => {
    // Get the current location
    const location = useLocation();
    // Check if the current page is the edit profile page
    const isEditProfilePage = location.pathname === '/edit-profile';
    // State for managing loading status
    const [loading, setLoading] = useState(false);
    // State for managing error messages
    const [error, setError] = useState<string | null>(null);

    /**
     * Handles the logout process
     * Sends a POST request to the logout API endpoint
     * Updates the authentication state and user name on successful logout
     * Manages loading state and error handling
     */
    const logout = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Logout failed. Please try again.');
            }

            // Reset user data on successful logout
            props.setName('');
            props.setIsAuthenticated(false);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Renders the appropriate menu items based on authentication status and current page
     * @returns JSX for the menu items
     */
    const renderMenu = () => {
        if (!props.isAuthenticated) {
            // Menu items for unauthenticated users
            return (
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                    <li className="nav-item">
                        <Link to="/login" className={`${styles.navLink} nav-link active`}>Log in</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/register" className={`${styles.navLink} nav-link active`}>Register</Link>
                    </li>
                </ul>
            );
        } else if (isEditProfilePage) {
            // Menu items for authenticated users on the edit profile page
            return (
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                    <li className="nav-item">
                        <Link
                            to="/"
                            className={`${styles.navLink} nav-link active ${loading ? styles.loading : ''}`}
                            onClick={logout}
                        >
                            {loading ? 'Logging out...' : 'Log out'}
                        </Link>
                    </li>
                {error && <div className={utils.alertDanger}>{error}</div>}
            </ul>
            )
        }
    };

    // Render the navigation bar
    return (
        <nav className={`${styles.navbar} navbar navbar-expand-md mb-4`}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Home</Link>
                <div>
                    {renderMenu()}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
