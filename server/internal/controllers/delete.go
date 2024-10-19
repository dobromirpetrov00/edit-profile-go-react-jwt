package controllers

import (
	"fmt"
	"time"

	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/database"
	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/models"
	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/utils"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

// DeleteUser handles the deletion of a user profile.
func DeleteUser(c fiber.Ctx) error {
	// Retrieve the JWT token from the cookies
	tokenString := c.Cookies("jwt")
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized. Token not found.",
		})
	}

	// Get the secret key
	secretKey, err := utils.GetSecretKey()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get secret key",
		})
	}

	// Define the JWT claims structure
	claims := jwt.MapClaims{}

	// Parse the JWT token and validate it
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil || !token.Valid {
		fmt.Println("Token Parsing Error:", err) // Debug
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized. Invalid token.",
		})
	}

	// Ensure token uses correct signing method
	if token.Method != jwt.SigningMethodHS256 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized. Invalid token algorithm.",
		})
	}

	// Check if the token is expired
	if exp, ok := claims["exp"].(float64); ok {
		if int64(exp) < time.Now().Unix() {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized. Token has expired.",
			})
		}
	}

	// Extract user ID from the JWT claims
	userID, ok := claims["id"].(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized. User ID not found.",
		})
	}

	// Perform the deletion operation in the database
	err = deleteUserFromDatabase(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete user profile",
		})
	}

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

	// Return a success response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User profile deleted successfully",
	})
}


// deleteUserFromDatabase deletes a user from the database using the provided userID.
func deleteUserFromDatabase(userID string) error {
	// Create a user instance to be deleted
	var user models.User

	// Find the user by ID and delete
	if err := database.DB.Where("id = ?", userID).Delete(&user).Error; err != nil {
		return err
	}

	return nil
}
