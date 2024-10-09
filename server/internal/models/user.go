package models

import (
	"golang.org/x/crypto/bcrypt"
)

// User represents a user of the application.
type User struct {
	Id       uint   `json:"id"`       // Unique identifier for the user
	Name     string `json:"name"`     // User's name
	Email    string `json:"email" gorm:"unique"` // User's email address (unique in the database)
	Password []byte `json:"-"`        // Hashed password (not exposed in JSON)
}

// HashPassword hashes the given plaintext password using bcrypt and returns the hashed password.
// It returns an error if the hashing operation fails.
func (u *User) HashPassword(plainPassword string) ([]byte, error) {
	// Generate a hashed password using bcrypt with the default cost
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	return hashedPassword, nil
}

// CheckPassword compares the given plaintext password with the user's hashed password.
// It returns true if the passwords match, and false otherwise.
func (u *User) CheckPassword(plainPassword string) bool {
	// Compare the stored hashed password with the provided plain password
	err := bcrypt.CompareHashAndPassword(u.Password, []byte(plainPassword))
	return err == nil // If there's no error, the passwords match
}
