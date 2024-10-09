/**
 * The `Login` component is responsible for rendering the login form and handling the login process.
 *
 * It uses React hooks to manage the state of the form, including the email, password, redirect flag, loading state, and error message.
 *
 * When the user submits the form, the `submit` function is called, which sends a POST request to the `/api/login` endpoint with the email and password. If the login is successful, the user's name and email are stored in the application state, and the user is redirected to the home page.
 *
 * If there is an error during the login process, the error message is displayed to the user.
 *
 * The component also checks for a success message in the URL query parameters and displays it to the user.
 *
 * @param props - An object containing the following properties:
 *   - `setName`: A function to set the user's name in the application state.
 *   - `setEmail`: A function to set the user's email in the application state.
 *   - `setIsAuthenticated`: A function to set the user's authentication status in the application state.
 */
import { SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import utils from '../../styles/utils.module.css';

const Login = (props: {
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}) => {
    // Set the document title when the component mounts
    useEffect(() => {
        document.title = "Login";
    }, []);

    // State variables for form inputs and component state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redir, setRedir] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Extract success message from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const successMessage = queryParams.get('message');

    /**
     * Validates the email format using a regular expression
     * @param email - The email address to validate
     * @returns True if the email is valid, false otherwise
     */
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /**
     * Handles the form submission
     * @param e - The synthetic event object
     */
    const submit = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();

        // Validate form inputs
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Send login request to the server
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                // Handle different error scenarios
                const content = await response.json();
                switch (response.status) {
                    case 401:
                        setError('Invalid email or password. Please try again.');
                        break;
                    case 500:
                        setError('Internal server error. Please try again later.');
                        break;
                    default:
                        setError(content.message || 'Login failed');
                        break;
                }
                setLoading(false);
                return;
            }

            // Process successful login
            const content = await response.json();
            props.setName(content.name);
            props.setEmail(content.email);
            props.setIsAuthenticated(true);
            setRedir(true);
        } catch (error) {
            setError('Network error. Please check your internet connection.');
        } finally {
            setLoading(false);
        }
    }, [email, password, props]);

    // Redirect to home page after successful login
    useEffect(() => {
        if (redir) {
            navigate("/");
        }
    }, [redir, navigate]);

    return (
        <div className={utils.formContainer}>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={submit}>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                {error && <div className="alert alert-danger" role="alert" aria-live="assertive">{error}</div>}

                <div className={utils.formGroup}>
                    <label htmlFor="floatingInput">Email address</label>
                    <input
                        type="email"
                        className={utils.input}
                        id="floatingInput"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                </div>

                <div className={utils.formGroup}>
                    <label htmlFor="floatingPassword">Password</label>
                    <input
                        type="password"
                        className={utils.input}
                        id="floatingPassword"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                </div>

                <button className={`${utils.btn} ${utils.btnPrimary} w-100 py-2`} type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>
        </div>
    );
}

export default Login;
