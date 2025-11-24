# Anvil

A modern Rails application built with React, TypeScript, and Inertia.js.

## Tech Stack

### Backend
- **Rails**: 8.1.1
- **Database**: PostgreSQL (with UUID primary keys)
- **Authentication**: Devise
- **Authorization**: Pundit
- **Admin Panel**: Avo (for admin users)
- **Error Tracking**: Sentry
- **Internationalization**: i18n (English & Indonesian)
- **Job Queue**: Solid Queue
- **Cache**: Solid Cache
- **WebSockets**: Solid Cable

### Frontend
- **React**: 19.2.0 with TypeScript
- **Full-Stack Framework**: Inertia.js
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Asset Pipeline**: Vite
- **Package Manager**: Bun 1.3.2

### Deployment
- **Kamal**: For containerized deployment

## Features

- ✅ User authentication (login, registration, logout)
- ✅ Role-based access control (admin and user roles)
- ✅ Admin dashboard using Avo
- ✅ Custom user dashboard
- ✅ Internationalization (English & Indonesian)
- ✅ Form validation with React Hook Form + Zod
- ✅ Error tracking with Sentry
- ✅ UUID primary keys for all models
- ✅ Responsive UI with Tailwind CSS and Shadcn UI

## Prerequisites

- Ruby 3.4.7 (see `.ruby-version`)
- PostgreSQL
- Node.js (for Bun 1.3.2)
- Bun package manager (v1.3.2)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd anvil
   ```

2. Install Ruby dependencies:
   ```bash
   bundle install
   ```

3. Install JavaScript dependencies:
   ```bash
   bun install
   ```

4. Set up the database:
   ```bash
   bin/rails db:create
   bin/rails db:migrate
   ```

   Or use the setup script:
   ```bash
   bin/setup
   ```

5. Set up environment variables:
   ```bash
   # Edit Rails credentials for database configuration
   EDITOR="code --wait" bin/rails credentials:edit
   
   # Optional: Set up Sentry DSN for error tracking
   # Add SENTRY_DSN to your environment variables or Rails credentials
   ```

   Notes: structure init credentials (you can update by looking on database.yml)
   ```yml
   database:
    port:
    host:
    username:
    password:
   ```

6. Create a user (optional, via Rails console):
   ```bash
   bin/rails console
   ```
   ```ruby
   # Create an admin user
   User.create!(
     name: "Admin User",
     email: "admin@example.com",
     password: "password",
     password_confirmation: "password",
     role: :admin
   )
   
   # Create a regular user
   User.create!(
     name: "Regular User",
     email: "user@example.com",
     password: "password",
     password_confirmation: "password",
     role: :user
   )
   ```

### Running the Application

Start the development server:
```bash
bin/dev
```

This will start both the Rails server and Vite dev server concurrently.

The application will be available at `http://localhost:3000`.

## Development

### Code Quality

#### RuboCop

This project uses [RuboCop Rails Omakase](https://github.com/rails/rubocop-rails-omakase) for Ruby code style enforcement.

Run RuboCop:
```bash
bin/rubocop
```

Auto-correct offenses:
```bash
bin/rubocop -A
```

#### Security Scanning

Run security audits:
```bash
# Scan for security vulnerabilities in gems
bin/bundler-audit

# Static analysis for Rails security vulnerabilities
bin/brakeman --no-pager
```

### Running Tests

Run the test suite:
```bash
bin/rails test
bin/rails test:system
```

### Database

Create and migrate the database:
```bash
bin/rails db:create
bin/rails db:migrate
```

Reset the database (development only):
```bash
bin/rails db:reset
```

### Frontend Development

The frontend code is located in `app/frontend/`:
- `entrypoints/` - Application entry points
- `Pages/` - React page components (Auth, Dashboard, etc.)
- `components/` - Reusable React components (UI components from Shadcn)
- `styles/` - CSS and Tailwind styles
- `types/` - TypeScript type definitions
- `lib/` - Utility functions and validation schemas

Vite handles hot module replacement during development.

#### Form Management

Forms use React Hook Form with Zod validation:
- Login form: `app/frontend/Pages/Auth/Login.tsx`
- Registration form: `app/frontend/Pages/Auth/Register.tsx`
- Validation schemas: `app/frontend/lib/validations.ts`

#### Internationalization

Translations are managed in Rails and shared with the frontend:
- English: `config/locales/en.yml`
- Indonesian: `config/locales/id.yml`
- Translations are automatically shared via Inertia.js

## Configuration

### Database

Database configuration is managed through `config/database.yml`. Credentials are stored in Rails encrypted credentials.

All models use UUID as primary keys (configured in `config/application.rb`).

Edit credentials:
```bash
EDITOR="code --wait" bin/rails credentials:edit
```

### Authentication & Authorization

- **Authentication**: Devise handles user authentication
- **Authorization**: Pundit policies control access to resources
- **Roles**: Users have `admin` or `user` roles
- **Admin Panel**: Avo is available at `/avo` for admin users only
- **User Dashboard**: Custom dashboard at `/dashboard` for all authenticated users

### Internationalization

The application supports multiple locales:
- **Default locale**: English (`en`)
- **Available locales**: English (`en`), Indonesian (`id`)
- **Locale switching**: Managed via session and URL parameters
- **Translations**: Stored in `config/locales/*.yml`

Change locale:
- Via URL parameter: `?locale=id`
- Via session (persisted across requests)

### Error Tracking

Sentry is configured for error tracking:
- Set `SENTRY_DSN` environment variable or add to Rails credentials
- Error tracking is enabled in `production` and `staging` environments
- User context is automatically attached to error reports

### Environment Variables

Set up your environment variables as needed:
- Database credentials: Rails encrypted credentials
- Sentry DSN: `SENTRY_DSN` environment variable or Rails credentials
- Other configuration: Rails encrypted credentials or environment variables

## Services

This application uses Rails' built-in database-backed adapters:

- **Solid Cache** - Database-backed cache store
- **Solid Queue** - Database-backed job queue
- **Solid Cable** - Database-backed Action Cable adapter

These services use separate PostgreSQL databases in production (configured in `config/database.yml`).

## Deployment

This application is configured for deployment with [Kamal](https://kamal-deploy.org).

Deploy to production:
```bash
bin/kamal deploy
```

See `config/deploy.yml` for deployment configuration.

## CI/CD

The project includes GitHub Actions workflows for:
- Code linting (RuboCop)
- Security scanning (Brakeman, bundler-audit)
- Test suite execution

Run the full CI suite locally:
```bash
bin/ci
```

## Project Structure

### Backend

```
app/
  controllers/
    application_controller.rb    # Main controller with i18n, Pundit, Sentry setup
    users/
      registrations_controller.rb # Custom Devise registration controller
      sessions_controller.rb      # Custom Devise session controller
    dashboards_controller.rb      # User dashboard controller
  models/
    user.rb                       # User model with Devise and roles
  policies/                       # Pundit authorization policies
  avo/                           # Avo admin panel resources
config/
  locales/
    en.yml                       # English translations
    id.yml                       # Indonesian translations
  initializers/
    devise.rb                    # Devise configuration
    pundit.rb                    # Pundit configuration
    sentry.rb                    # Sentry configuration
    avo.rb                       # Avo configuration
```

### Frontend

```
app/frontend/
  Pages/
    Auth/
      Login.tsx                  # Login page with React Hook Form
      Register.tsx               # Registration page with React Hook Form
    Dashboard/
      Index.tsx                  # User dashboard
  components/
    ui/                          # Shadcn UI components
    layout/
      layout.tsx                 # Main layout component
  lib/
    validations.ts               # Zod validation schemas
  types/
    index.ts                     # TypeScript type definitions
  styles/
    application.css              # Tailwind CSS styles
```

## Pre-commit Hooks

This project uses [Overcommit](https://github.com/sds/overcommit) to manage Git hooks and ensure code quality before commits.

### Setup

After cloning the repository, install the hooks:

```bash
bundle install
bundle exec overcommit --install
```

### Enabled Hooks

The following hooks are enabled:

**Pre-commit:**
- **RuboCop** - Ruby code style checking (fails on warnings)
- **ESLint** - JavaScript/TypeScript linting
- **TrailingWhitespace** - Removes trailing whitespace
- **HardTabs** - Prevents hard tabs
- **AuthorEmail** - Ensures author email is set
- **AuthorName** - Ensures author name is set
- **FileSize** - Prevents committing files larger than 1MB
- **DetectPrivateKey** - Prevents committing private keys

**Note:** YamlLint is disabled by default as it requires Python and yamllint. To enable it, install yamllint via `pip install yamllint` and uncomment the YamlLint section in `.overcommit.yml`.

**Post-commit:**
- **BundleInstall** - Installs missing gems after merge/checkout

### Disabling Hooks

To temporarily disable hooks (not recommended):

```bash
SKIP=RuboCop git commit -m "Your message"
```

To disable hooks permanently, edit `.overcommit.yml` and set `enabled: false` for the hook.

### Updating Hooks

After updating the `.overcommit.yml` configuration:

```bash
bundle exec overcommit --sign
```

### Troubleshooting

**YamlLint errors:**
- YamlLint is disabled by default as it requires Python and yamllint
- If you want to enable it, install yamllint: `pip install yamllint`
- Then uncomment the YamlLint section in `.overcommit.yml`

**Trailing whitespace errors:**
- The TrailingWhitespace hook automatically removes trailing whitespace
- Certain files are excluded from this check (markdown files, generated files, etc.)
- If the hook finds trailing whitespace, it will auto-fix it
- You may need to stage the fixed files and commit again: `git add -u && git commit`

**ESLint errors:**
- Make sure you have run `yarn install` to install dependencies
- Fix any ESLint errors before committing
- Or temporarily skip: `SKIP=ESLint git commit -m "Your message"`

## Additional Tools

- **Solargraph** - Ruby language server for IDE support
- **HTMLBeautifier** - HTML formatter
- **Debug** - Ruby debugger
- **RuboCop** - Ruby code style enforcement
- **Brakeman** - Security vulnerability scanner
- **Bundler Audit** - Dependency vulnerability scanner
- **Overcommit** - Git hooks manager

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```
   Pre-commit hooks will automatically run RuboCop, ESLint, and other checks.

3. **Run tests**:
   ```bash
   bin/rails test
   ```

4. **Check code quality** (hooks run automatically, but you can also run manually):
   ```bash
   bin/rubocop
   yarn lint
   bin/brakeman --no-pager
   bin/bundler-audit
   ```

5. **Start development server**:
   ```bash
   bin/dev
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

Copyright (c) 2024 Anvil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
