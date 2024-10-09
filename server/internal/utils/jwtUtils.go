package utils

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// LoadEnv loads environment variables from a .env file.
// It returns an error if the .env file could not be loaded.
func LoadEnv() error {
	// Attempt to load the .env file
	err := godotenv.Load()
	if err != nil {
		// Return an error if loading fails
		return fmt.Errorf("could not load .env file: %v", err)
	}
	// Return nil if loading is successful
	return nil
}

// GetSecretKey retrieves the JWT secret key from the environment.
// It returns the secret key as a string, or an error if the JWT_SECRET_KEY environment variable is not set.
func GetSecretKey() (string, error) {
	// Load environment variables
	if err := LoadEnv(); err != nil {
		// Return an empty string and the error if loading fails
		return "", err
	}

	// Retrieve the JWT_SECRET_KEY from environment variables
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		// Return an error if the JWT_SECRET_KEY is not set
		return "", fmt.Errorf("JWT_SECRET_KEY environment variable is not set")
	}

	// Return the secret key if it's successfully retrieved
	return secretKey, nil
}
