/**
 * The `Register` component is responsible for rendering the registration form for the application.
 * It handles user input, form validation, and the registration process by making a POST request to the server.
 * If the registration is successful, the user is redirected to the login page with a success message.
 * If there are any errors during the registration process, they are displayed to the user.
 */
import { SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import utils from '../../styles/utils.module.css';

const Register = () => {
    // Set the document title when the component mounts
    useEffect(() => {
        document.title = "Register";
    }, []);

    // State variables for form inputs, redirection, loading state, and error messages
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redir, setRedir] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Function to validate email format
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Form submission handler
    const submit = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();

        // Validate form inputs
        if (!name || !email || !password) {
            setError('All fields are required');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Send registration request to the server
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            // Handle different response statuses
            if (!response.ok) {
                const content = await response.json();
                switch (response.status) {
                    case 400:
                        setError(content.message || 'Registration failed. Please check your input.');
                        break;
                    case 500:
                        setError('Internal server error. Please try again later.');
                        break;
                    default:
                        setError('Registration failed. Please try again.');
                        break;
                }
                setLoading(false);
                return;
            }

            // Set redirection flag if registration is successful
            setRedir(true);
        } catch (error) {
            setError('Network error. Please check your internet connection.');
        } finally {
            setLoading(false);
        }
    }, [name, email, password]);

    // Effect to handle redirection after successful registration
    useEffect(() => {
        if (redir) {
            navigate("/login?message=Registration successful! Please log in.");
        }
    }, [redir, navigate]);

    return (
        <div className={utils.formContainer}>
            <form onSubmit={submit}>
                <h1 className="h3 mb-3 fw-normal">Please register</h1>

                {/* Display error message if there's an error */}
                {error && <div className="alert alert-danger" role="alert" aria-live="assertive">{error}</div>}

                {/* Name input field */}
                <div className={utils.formGroup}>
                    <label htmlFor="floatingName">Name</label>
                    <input 
                        type="text" 
                        className={utils.input}
                        id="floatingName" 
                        required 
                        onChange={e => setName(e.target.value)} 
                        value={name}
                    />
                </div>

                {/* Email input field */}
                <div className={utils.formGroup}>
                    <label htmlFor="floatingInput">Email address</label>
                    <input 
                        type="email" 
                        className={utils.input}
                        id="floatingInput" 
                        required 
                        onChange={e => setEmail(e.target.value)} 
                        value={email}
                    />
                </div>

                {/* Password input field */}
                <div className={utils.formGroup}>
                    <label htmlFor="floatingPassword">Password</label>
                    <input 
                        type="password" 
                        className={utils.input}
                        id="floatingPassword" 
                        required 
                        onChange={e => setPassword(e.target.value)} 
                        value={password}
                    />
                </div>

                {/* Submit button */}
                <button className={`${utils.btn} ${utils.btnPrimary} w-100 py-2`} type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default Register;
