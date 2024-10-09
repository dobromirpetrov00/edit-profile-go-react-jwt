// main is the entry point of the Go application. It sets up the Fiber web framework, configures CORS, and registers the application routes.
// The server listens for incoming requests on the port specified by the SERVER_PORT environment variable.
// When the server receives an interrupt signal (e.g., Ctrl+C), it gracefully shuts down within 5 seconds, closing any active connections.
package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/database"
	"github.com/dobromirpetrov00/go_react_jwtauth/server/internal/routes"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

func main() {
    // Connect to the database
    database.Connect()

    // Create a new Fiber app instance
    app := fiber.New()

    // Get allowed origins from environment variable
    allowedOriginsEnv := os.Getenv("ALLOWED_ORIGINS")
    allowedOrigins := strings.Split(allowedOriginsEnv, ",")

    // Configure CORS middleware
    app.Use(cors.New(cors.Config{
        AllowCredentials: true,
        AllowOrigins:     allowedOrigins,
    }))

    // Set up application routes
    routes.Setup(app)

    // Start the server in a goroutine
    go func() {
        if err := app.Listen(os.Getenv("SERVER_PORT")); err != nil {
            log.Fatalf("Failed to start server: %v", err)
        }
    }()

    // Create a channel to listen for shutdown signals
    shutdown := make(chan os.Signal, 1)
    signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)
    <-shutdown

    // Create a context with a 5-second timeout for graceful shutdown
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    // Attempt to shut down the server gracefully
    if err := app.ShutdownWithContext(ctx); err != nil {
        log.Fatalf("Server forced to shutdown: %v", err)
    }
    log.Println("Server exited gracefully")
}
