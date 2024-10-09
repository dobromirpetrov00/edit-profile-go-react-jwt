package controllers

import (
	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/database"
	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/models"
	"github.com/gofiber/fiber/v3"
	"golang.org/x/crypto/bcrypt"
)

// Register creates a new user account. It expects a request body with the following fields:
// - name: the user's name
// - email: the user's email address
// - password: the user's password
//
// If the email is already registered, it returns a 400 Bad Request error with a message.
// If the password fails to hash, it returns a 500 Internal Server Error with a message.
// Otherwise, it creates a new user in the database and returns a 201 Created response with the user's details (excluding the password).
func Register(c fiber.Ctx) error {
	var data map[string]string

	// Parse the request body into a data map
	if err := c.Bind().Body(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	// Validate required fields: name, email, and password
	if data["name"] == "" || data["email"] == "" || data["password"] == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Name, email, and password are required",
		})
	}

	// Check if the email is already registered in the database
	var existingUser models.User
	if err := database.DB.Where("email = ?", data["email"]).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Email is already in use",
		})
	}

	// Hash the password using bcrypt for secure storage
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to hash password",
		})
	}

	// Create a new user instance with the provided data
	user := models.User{
		Name:     data["name"],
		Email:    data["email"],
		Password: hashedPassword,
	}

	// Save the new user to the database
	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to create user",
		})
	}

	// Return a success response with the created user's details (excluding password)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "User created successfully",
		"user": fiber.Map{
			"id":    user.Id,
			"name":  user.Name,
			"email": user.Email,
		},
	})
}