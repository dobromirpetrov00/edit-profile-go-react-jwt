package controllers

import (
	"time"

	"github.com/gofiber/fiber/v3"
)

// Logout clears the JWT cookie, logging the user out.
func Logout(c fiber.Ctx) error {
	// Create a new cookie to overwrite the existing JWT cookie
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",                         // Empty value to clear the cookie
		Expires:  time.Now().Add(-time.Hour), // Set expiration in the past to invalidate
		HTTPOnly: true,                       // Prevent JavaScript access for security
		Secure:   false,                      // Set to true if using HTTPS
	}

	// Set the cookie in the response, effectively clearing it
	c.Cookie(&cookie)

	// Return a JSON response indicating successful logout
	return c.JSON(fiber.Map{
		"message": "success",
	})
}
