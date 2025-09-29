package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
)

// User represents a user in the system
type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	IsActive bool   `json:"is_active"`
}

// UserService handles user operations
type UserService struct {
	users map[int]*User
}

// NewUserService creates a new user service
func NewUserService() *UserService {
	return &UserService{
		users: make(map[int]*User),
	}
}

// CreateUser adds a new user to the service
func (us *UserService) CreateUser(name, email string) (*User, error) {
	if name == "" || email == "" {
		return nil, fmt.Errorf("name and email are required")
	}

	user := &User{
		ID:       len(us.users) + 1,
		Name:     name,
		Email:    email,
		IsActive: true,
	}

	us.users[user.ID] = user
	return user, nil
}

// GetUser retrieves a user by ID
func (us *UserService) GetUser(id int) (*User, bool) {
	user, exists := us.users[id]
	return user, exists
}

// ListUsers returns all active users
func (us *UserService) ListUsers() []*User {
	var activeUsers []*User
	for _, user := range us.users {
		if user.IsActive {
			activeUsers = append(activeUsers, user)
		}
	}
	return activeUsers
}

// handleUsers handles HTTP requests for user operations
func handleUsers(service *UserService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			// Get user by ID from query parameter
			idStr := r.URL.Query().Get("id")
			if idStr != "" {
				id, err := strconv.Atoi(idStr)
				if err != nil {
					http.Error(w, "Invalid user ID", http.StatusBadRequest)
					return
				}

				user, exists := service.GetUser(id)
				if !exists {
					http.Error(w, "User not found", http.StatusNotFound)
					return
				}

				fmt.Fprintf(w, "User: %+v\n", user)
			} else {
				// List all users
				users := service.ListUsers()
				fmt.Fprintf(w, "Active users: %d\n", len(users))
				for _, user := range users {
					fmt.Fprintf(w, "- %s (%s)\n", user.Name, user.Email)
				}
			}

		case "POST":
			name := r.FormValue("name")
			email := r.FormValue("email")

			user, err := service.CreateUser(name, email)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			fmt.Fprintf(w, "Created user: %+v\n", user)

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}

func main() {
	// Initialize service
	userService := NewUserService()

	// Create some sample users
	users := []struct {
		name  string
		email string
	}{
		{"Alice Johnson", "alice@example.com"},
		{"Bob Smith", "bob@example.com"},
		{"Carol Davis", "carol@example.com"},
	}

	for _, userData := range users {
		user, err := userService.CreateUser(userData.name, userData.email)
		if err != nil {
			log.Printf("Error creating user: %v", err)
			continue
		}
		fmt.Printf("Created user: %s (ID: %d)\n", user.Name, user.ID)
	}

	// Setup HTTP server
	http.HandleFunc("/users", handleUsers(userService))

	server := &http.Server{
		Addr:         ":8080",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	fmt.Println("Starting server on :8080")
	fmt.Println("Try: curl http://localhost:8080/users")
	fmt.Println("Or:  curl -X POST -d 'name=John&email=john@example.com' http://localhost:8080/users")

	if err := server.ListenAndServe(); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
