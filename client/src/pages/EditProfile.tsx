/**
 * The `EditProfile` component allows users to update their profile information, including name, email, and password.
 *
 * The component fetches the user's current profile information from the server and displays it in a form. Users can then update the fields and submit the form to save the changes.
 *
 * The component performs input validation, such as ensuring the email is valid, and displays success or error messages accordingly. It also handles the case where no updates are detected.
 *
 * When the form is submitted successfully, the component calls the `onProfileUpdate` callback function provided by the parent component, passing the updated profile data.
 *
 * @param props - An object containing the user's current name, email, and a callback function to update the profile.
 * @returns The `EditProfile` component.
 */
import utils from '../styles/utils.module.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const EditProfile = (props: { name: string; email: string; onProfileUpdate: (updatedProfile: any) => void }) => {
    // Set the document title when the component mounts
    useEffect(() => {
        document.title = "Edit Profile";
    }, []);

    // State variables for form fields and messages
    const [name, setName] = useState(props.name);
    const [email, setEmail] = useState(props.email);
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
     * @param event - The form submission event
     */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Clear previous messages
        setSuccessMessage('');
        setErrorMessage('');

        // Prepare the updated profile object
        const updatedProfile = {
            name,
            email,
            password: password !== '' ? password : undefined,
        };

        // Perform input validation
        if (!name) {
            setErrorMessage('Name cannot be empty.');
            return;
        }
        if (!email) {
            setErrorMessage('Email cannot be empty.');
            return;
        }
        if (name === props.name && email === props.email && password === '') {
            setErrorMessage('No updates detected.');
            return;
        }

        if (!isValidEmail(email)) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        try {
            // Send PUT request to update the profile
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedProfile),
            });

            if (response.ok) {
                const data = await response.json();
                props.onProfileUpdate(data);
                setSuccessMessage('Profile updated successfully!');
            } else if (response.status === 400) {
                const data = await response.json();
                setErrorMessage(data.error || 'Invalid input');
            } else {
                setErrorMessage('Failed to update profile. Please try again later.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('An error occurred while updating the profile. Please try again.');
        }
    };

    return (
        <div className={utils.formContainer}>
            <h1 className={utils.fadeIn}>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                {/* Name input field */}
                <div className={utils.formGroup}>
                    <label className={utils.label}>Name</label>
                    <input
                        type="text"
                        className={utils.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                {/* Email input field */}
                <div className={utils.formGroup}>
                    <label className={utils.label}>Email</label>
                    <input
                        type="email"
                        className={utils.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {/* Password input field (optional) */}
                <div className={utils.formGroup}>
                    <label className={utils.label}>Password (optional)</label>
                    <input
                        type="password"
                        className={utils.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Success message */}
                {successMessage && (
                    <div className={`${utils.alert} ${utils.alertSuccess}`}>{successMessage}</div>
                )}
                {/* Error message */}
                {errorMessage && (
                    <div className={`${utils.alert} ${utils.alertDanger}`}>{errorMessage}</div>
                )}

                {/* Form buttons */}
                <div className={utils.buttonGroup}>
                    <button type="submit" className={`${utils.btn} ${utils.btnPrimary}`}>
                        Save Changes
                    </button>
                    <Link to="/" className={`${utils.btn} ${utils.btnSecondary}`}>
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
