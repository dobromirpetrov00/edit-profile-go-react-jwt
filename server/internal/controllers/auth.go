package controllers

import (
	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/database"
	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/models"
	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/utils"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

// parseJWT parses the JWT token from the cookie and returns the claims.
// If the token is invalid or the secret key cannot be retrieved, an error is returned.
func parseJWT(c fiber.Ctx) (*jwt.MapClaims, error) {
	// Get the JWT token from the cookie
	cookie := c.Cookies("jwt")

	// Retrieve the secret key
	secretKey, err := utils.GetSecretKey()
	if err != nil {
		return nil, err
	}

	// Parse the token with claims
	token, err := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	// Extract claims from the token
	claims := token.Claims.(*jwt.MapClaims)
	return claims, nil
}

// GetUser retrieves the authenticated user from the database based on the JWT token.
// If the token is invalid or the user is not found, an error is returned.
func GetUser(c fiber.Ctx) error {
	// Parse the JWT token and get claims
	claims, err := parseJWT(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	// Initialize user model
	user := models.User{}
	id := (*claims)["id"].(string)

	// Query the database for the user
	if err := database.DB.Where("id = ?", id).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "user not found",
		})
	}

	// Return the user data as JSON
	return c.JSON(user)
}

// UpdateUser updates the user's profile information, including name, email, and password.
// If the token is invalid, the user is not found, or there is an error updating the user, an error is returned.
func UpdateUser(c fiber.Ctx) error {
	// Bind the request body to a map
	var data map[string]string
	if err := c.Bind().Body(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}

	// Parse the JWT token and get claims
	claims, err := parseJWT(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	// Extract user ID from claims
	userID := (*claims)["id"].(string)

	// Query the database for the user
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// Update user name if provided
	if name, ok := data["name"]; ok {
		user.Name = name
	}
	// Update user email if provided
	if email, ok := data["email"]; ok {
		user.Email = email
	}

	// Update user password if provided
	if password, ok := data["password"]; ok && password != "" {
		hashedPassword, err := user.HashPassword(password)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
		}
		user.Password = hashedPassword
	}

	// Save the updated user to the database
	if err := database.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}

	// Return success message with updated user information
	return c.JSON(fiber.Map{
		"message": "Profile updated successfully",
		"name":    user.Name,
		"email":   user.Email,
	})
}
