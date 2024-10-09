package routes

import (
	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/controllers"
	"github.com/gofiber/fiber/v3"
)

// Setup configures the Fiber app with the necessary routes for the application.
// The routes include:
// - POST /api/register: Handles user registration
// - POST /api/login: Handles user login
// - POST /api/logout: Handles user logout
// - GET /api/user: Retrieves the currently authenticated user
// - PUT /api/user: Updates the currently authenticated user
func Setup(app *fiber.App) {
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Post("/api/logout", controllers.Logout)

	app.Get("/api/user", controllers.GetUser)
	app.Put("/api/user", controllers.UpdateUser)
}
