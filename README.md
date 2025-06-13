# Echo Boilerplate with RBAC

A comprehensive authentication and role-based access control (RBAC) boilerplate built with Go (Echo framework) backend and React (TypeScript + shadcn/ui) frontend. This project provides a solid foundation for building web applications with modern authentication features and granular permissions system.

## 🚀 Features

### Backend (Go + Echo)
- **User Authentication**: Sign up, sign in, sign out with JWT tokens
- **Two-Factor Authentication (2FA)**: TOTP-based 2FA with backup codes
- **Role-Based Access Control (RBAC)**: Comprehensive permissions system
- **Role Management**: Create, update, delete roles with granular permissions
- **User Role Assignment**: Assign multiple roles to users
- **Permission Middleware**: Route-level permission enforcement
- **Password Reset**: Secure password reset via email
- **Email Integration**: Welcome emails, password reset, 2FA codes using Resend
- **Database**: PostgreSQL with GORM ORM and automatic migrations
- **Validation**: Request validation using go-playground/validator
- **Logging**: Structured logging with Zap
- **Testing**: Comprehensive unit tests

### Frontend (React + TypeScript)
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Authentication Pages**: Clean login/signup forms with 2FA support
- **Role Management Interface**: Complete RBAC administration
- **Permissions Matrix**: Visual permission management
- **User Role Assignment**: Drag-and-drop role management
- **Dashboard**: User profile and security management
- **Responsive Design**: Mobile-friendly interface
- **Form Validation**: Client-side validation with error handling
- **State Management**: React hooks and context
- **Testing**: Component tests with Vitest and React Testing Library
- **Type Safety**: Full TypeScript support

### RBAC System
- **Default Roles**: Super Admin, Admin, Team, User
- **Granular Permissions**: Resource-based permissions (user:read, role:write, etc.)
- **Permission Categories**: User, Role, Report, Settings, System management
- **Middleware Protection**: Route-level access control
- **Dynamic Role Creation**: Create custom roles with specific permissions
- **Permission Inheritance**: System admin privileges override all permissions

## 📁 Project Structure

```
.
├── main.go                    # Application entry point
├── makefile                   # Comprehensive build and dev commands
├── go.mod                     # Go module dependencies
├── .env.example              # Environment variables template
├── .gitignore                # Comprehensive gitignore
├── docker-compose.dev.yml    # Development environment
├── scripts/
│   └── init-db.sql           # Database initialization
├── internal/                  # Private application code
│   ├── api/                   # HTTP handlers and routes
│   │   ├── api.go            # API setup with RBAC
│   │   ├── roles.go          # Role management endpoints
│   │   └── routes.go         # Protected routes with permissions
│   ├── common/                # Shared utilities
│   │   ├── authentication_context/
│   │   ├── environment/
│   │   ├── logger/
│   │   ├── passwords/
│   │   └── validator/
│   ├── db/                    # Database connection and migration
│   ├── models/                # Database models with role relationships
│   └── services/              # Business logic services
│       ├── authentication/    # Auth service with role loading
│       ├── email/            # Email service with Resend
│       ├── permissions/      # RBAC service and middleware
│       │   ├── permissions.go # Core RBAC functionality
│       │   ├── middleware.go  # Permission middleware
│       │   └── service.go     # Database operations
│       └── users/            # User management service
├── spa/                      # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   └── roles/        # Role management components
│   │   ├── pages/           # Page components
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── RoleManagement.tsx # RBAC admin interface
│   │   │   └── routing/     # Route configuration
│   │   ├── api/             # API client with RBAC endpoints
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   └── test/            # Test files
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🛠️ Quick Start

### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL 13+
- Docker (optional)
- Make (for using Makefile commands)

### 1. Clone and Setup
```bash
git clone https://github.com/feezyhendrix/echoboilerplate.git
cd echoboilerplate

# Copy and configure environment
cp .env.example .env
# Edit .env with your database and API keys

# Check environment setup
make env-check
```

### 2. Development with Docker (Recommended)
```bash
# Start full development environment
make dev

# Or build and start fresh
make dev-build

# View logs
make dev-logs

# Stop environment
make dev-down
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### 3. Local Development (Without Docker)
```bash
# Install dependencies
make deps

# Start database only
make dev-db

# Run server locally (in new terminal)
make dev-server

# Run SPA locally (in new terminal)  
make dev-spa
```

## 🔧 Makefile Commands

### Development
```bash
make help              # Show all available commands
make dev               # Run full development environment
make dev-build         # Build and run development environment
make dev-server        # Run server locally
make dev-spa           # Run SPA development server
make dev-db            # Start only database
make dev-logs          # Show development logs
make dev-clean         # Clean development environment
```

### Building
```bash
make build             # Build both server and SPA
make build-server      # Build server binary
make build-spa         # Build SPA for production
make build-docker      # Build Docker images
```

### Testing & Quality
```bash
make test              # Run all tests
make test-server       # Run server tests
make test-spa          # Run SPA tests
make test-coverage     # Generate coverage report
make lint              # Run all linters
make fmt               # Format all code
make check             # Run format, lint, and tests
```

### Database
```bash
make db-migrate        # Run database migrations
make db-seed           # Seed database with initial data
make db-reset          # Reset database completely
make db-backup         # Create database backup
make db-console        # Connect to database console
```

### Utilities
```bash
make clean             # Clean build artifacts
make deps              # Install all dependencies
make deps-update       # Update dependencies
make version           # Show version information
make env-check         # Check environment configuration
make security-check    # Run security checks
```

## 🔐 RBAC System

### Default Roles

| Role | ID | Description | Default Permissions |
|------|----|-----------|--------------------|
| **Super Admin** | 4 | Full system access | All permissions including `system:admin` |
| **Admin** | 1 | User and role management | `user:read/write`, `role:read`, `report:read/write`, `settings:read` |
| **Team** | 2 | Collaborative access | `user:read`, `report:read/write` |
| **User** | 3 | Basic access | `report:read` |

### Permission System

**Format**: `resource:action`

**Resources**: `user`, `role`, `report`, `settings`, `system`

**Actions**: `read`, `write`, `delete`, `admin`

**Examples**:
- `user:read` - View user information
- `role:write` - Create and modify roles  
- `system:admin` - Full system administration

### Using RBAC in Code

#### Protect Routes
```go
// Require specific permission
roles.GET("", a.GetRoles, permissions.RequirePermission(permissions.PermissionRoleRead))

// Require any of multiple permissions
userRoutes.GET("/profile", a.GetProfile, permissions.RequireAnyPermission(
    permissions.PermissionUserRead, 
    permissions.PermissionSystemAdmin,
))

// Require role
adminRoutes.GET("/settings", a.GetSettings, permissions.RequireRole(permissions.ROLE_ID_ADMIN))
```

#### Check Permissions in Handlers
```go
func (a *API) GetUsers(c echo.Context) error {
    user := c.Get("user").(*models.User)
    
    if !user.HasPermission(permissions.PermissionUserRead) {
        return echo.NewHTTPError(http.StatusForbidden, "Insufficient permissions")
    }
    
    // Continue with logic...
}
```

#### Frontend Permission Checks
```typescript
// Check user permissions
const hasUserManagement = user.permissions.includes('user:write');

// Conditionally render UI
{hasUserManagement && (
  <Button onClick={handleCreateUser}>Create User</Button>
)}
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/v1/auth/signin
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response includes user with roles:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "userRoles": [
      {
        "role": {
          "id": 1,
          "name": "Admin",
          "permissions": [
            {"name": "user:read", "resource": "user", "action": "read"},
            {"name": "role:read", "resource": "role", "action": "read"}
          ]
        }
      }
    ]
  }
}
```

### RBAC Endpoints

#### GET /api/v1/roles
Get all roles with permissions (requires `role:read`)

#### POST /api/v1/roles  
Create new role (requires `role:write`)
```json
{
  "name": "Manager",
  "description": "Department manager role",
  "isActive": true
}
```

#### POST /api/v1/user-roles/assign
Assign role to user (requires `user:write`)
```json
{
  "userId": 123,
  "roleId": 2
}
```

#### GET /api/v1/permissions
Get all available permissions (requires `role:read`)

## 🎨 Frontend RBAC Components

### Role Management Page (`/roles`)
- **Role Management Tab**: Create, edit, delete roles
- **User Assignment Tab**: Assign roles to users
- **Permissions Matrix Tab**: Visual permission grid

### Key Components
```typescript
// Role management
<RoleManagement />

// User role assignment  
<UserRoleAssignment userId={123} userName="John Doe" />

// Permissions matrix
<PermissionsMatrix />
```

### Permission-Based UI
```typescript
// Hide/show based on permissions
{user.hasPermission('user:write') && (
  <CreateUserButton />
)}

// Different views for different roles
{user.hasRole(ROLE_ID_ADMIN) ? (
  <AdminDashboard />
) : (
  <UserDashboard />
)}
```

## 🧪 Testing

### Run All Tests
```bash
make test
```

### Backend Tests
```bash
make test-server              # Run tests
make test-server-coverage     # Generate coverage report
make test-integration         # Run integration tests
```

### Frontend Tests
```bash
make test-spa                 # Run SPA tests
```

### Test RBAC System
The boilerplate includes comprehensive tests for:
- Permission checking functions
- Middleware enforcement
- Role assignment logic
- API endpoint protection

## 🚀 Deployment

### Production Build
```bash
# Build everything for production
make build

# Build Docker images
make build-docker

# Deploy to staging
make deploy-staging

# Deploy to production  
make deploy-prod
```

### Environment Configuration

**Development**: Copy `.env.example` to `.env`
**Production**: Set environment variables in your deployment platform

**Required Variables:**
- `POSTGRES_*` - Database connection
- `AUTHENTICATION_JWT_SECRET` - JWT signing key (32+ characters)
- `AUTHENTICATION__PASSWORD_RESET_TOKEN_ENCRYPTION_KEY` - Password reset encryption
- `RESEND_API_KEY` or `SENDGRID__API_KEY` - Email service

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt
- **JWT Tokens**: Secure token-based authentication with role information
- **2FA Support**: TOTP with backup codes
- **RBAC**: Granular permission system with middleware enforcement
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Server and client-side validation
- **Secure Headers**: Security middleware
- **Email Verification**: Account verification flow
- **Permission Inheritance**: System admin override capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and add tests
4. Run quality checks: `make check`
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow Go and TypeScript best practices
- Write tests for new features (especially RBAC components)
- Update documentation as needed
- Use conventional commit messages
- Ensure all tests pass: `make test`
- Run security checks: `make security-check`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Echo](https://echo.labstack.com/) - High performance Go web framework
- [GORM](https://gorm.io/) - Go ORM library with excellent relationship support
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Fast build tool
- [Resend](https://resend.com/) - Email API service

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the comprehensive documentation
- Review existing issues for solutions
- Use `make help` to see all available commands

---

**Built with ❤️ for modern web applications with security in mind**