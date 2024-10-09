package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// DB is a global variable that holds the database connection
var DB *gorm.DB

// envLoaded is a flag to track whether the environment variables have been loaded
var envLoaded = false

// LoadEnv loads the environment variables from the .env file.
// If the environment variables have already been loaded, this function does nothing.
func LoadEnv() {
	if !envLoaded {
		err := godotenv.Load()
		if err != nil {
			log.Fatalf("Error loading .env file: %v", err)
		}
		envLoaded = true
	}
}

// getCredentials retrieves the database connection credentials from the environment variables.
// If any of the required environment variables are missing, an error is returned.
func getCredentials() (string, string, string, string, error) {
	LoadEnv()

	// Retrieve database credentials from environment variables
	username := os.Getenv("DB_USERNAME")
	password := os.Getenv("DB_PASSWORD")
	ip := os.Getenv("DB_IP")
	database := os.Getenv("DB_NAME")

	// Check if any required credentials are missing
	if username == "" || password == "" || ip == "" || database == "" {
		return "", "", "", "", fmt.Errorf("missing required database environment variables")
	}

	return username, password, ip, database, nil
}

// Connect establishes a connection to the database using the credentials retrieved from the environment variables.
// If any error occurs during the connection process, the function will log a fatal error.
func Connect() {
	// Get database credentials
	username, password, ip, database, err := getCredentials()
	if err != nil {
		log.Fatalf("Database credentials error: %v", err)
	}

	// Construct the Data Source Name (DSN) string
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", username, password, ip, database)

	// Open a connection to the database
	connection, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Could not connect to the database: %v", err)
	}

	// Assign the connection to the global DB variable
	DB = connection
	log.Println("Successfully connected to the database.")
}
