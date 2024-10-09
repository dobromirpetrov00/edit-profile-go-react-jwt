package controllers

import (
	"strconv"
	"time"

	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/database"
	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/models"
	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/utils"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

// Login is an HTTP handler function that handles user login requests.
// It expects a JSON request body with "email" and "password" fields.
// If the email and password are valid, it generates a JWT token and sets it as a cookie in the response.
// The token is valid for 24 hours. The function returns a JSON response with a "success" message, the user's name, and email.
func Login(c fiber.Ctx) error {
	// Declare a map to store the request body data
	var data map[string]string

	// Bind the request body to the data map
	if err := c.Bind().Body(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	// Check if email and password are provided
	if data["email"] == "" || data["password"] == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Email and password are required",
		})
	}

	// Declare a User model to store the retrieved user data
	var user models.User
	// Query the database for the user with the provided email
	if err := database.DB.Where("email = ?", data["email"]).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "User not found",
		})
	}

	// Check if the provided password is correct
	if !user.CheckPassword(data["password"]) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Incorrect password",
		})
	}

	// Set the token expiration time to 24 hours from now
	expirationTime := time.Now().Add(24 * time.Hour).Unix()

	// Create a new JWT token with claims
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  strconv.Itoa(int(user.Id)),
		"exp": expirationTime,
	})

	// Get the secret key for signing the token
	secretKey, err := utils.GetSecretKey()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not retrieve secret key",
		})
	}

	// Sign the token with the secret key
	token, err := claims.SignedString([]byte(secretKey))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to generate token",
		})
	}

	// Create a cookie to store the JWT token
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   false,
		SameSite: "Lax",
	}

	// Set the cookie in the response
	c.Cookie(&cookie)

	// Return a JSON response with success message, user name, and email
	return c.JSON(fiber.Map{
		"message": "success",
		"name":    user.Name,
		"email":   user.Email,
	})
}
