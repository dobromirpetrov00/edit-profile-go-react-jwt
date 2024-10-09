package utils

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Claims represents the custom claims structure for JWT tokens
type Claims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

// GenerateToken generates a JWT token with the provided user ID.
// The token is signed using the JWT_SECRET_KEY environment variable and
// has an expiration time of 24 hours.
func GenerateToken(userID uint) (string, error) {
	// Create custom claims with user ID and expiration time
	claims := Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // Token expiration time
		},
	}

	// Create a new token with the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Get the secret key from environment variables
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		return "", errors.New("JWT secret key not set in environment variables")
	}

	// Sign the token with the secret key
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", errors.New("failed to sign the token: " + err.Error())
	}

	return tokenString, nil
}

// ValidateToken validates the provided JWT token and returns the claims
// contained in the token. If the token is invalid, an error is returned.
func ValidateToken(tokenString string) (*Claims, error) {
	// Initialize claims struct
	claims := &Claims{}

	// Get the secret key from environment variables
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		return nil, errors.New("JWT secret key not set in environment variables")
	}

	// Parse and validate the token
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	// Check if the token is valid
	if err != nil || !token.Valid {
		return nil, errors.New("invalid token: " + err.Error())
	}

	return claims, nil
}
