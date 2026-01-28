# KodiLearn

A specialized STEM Learning Management System (LMS) designed for children, built with React, TypeScript, and Inertia.js on top of Rails.

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
- **Package Manager**: Yarn 4.11.0

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
- ✅ Maze game integration with Code.org-style learning
- ✅ Platformer game for visual programming learning

## Future Features Roadmap

### 🎮 Interactive Learning Games

| Feature | Description | Concepts Taught |
|---------|-------------|-----------------|
| **🐢 Turtle Graphics** | Draw shapes with commands like `maju`, `belok kanan 90°` | Geometry, angles, loops |
| **📊 Sorting Visualizer** | Visual animations of bubble sort, selection sort | Algorithms, complexity |
| **🧩 Pattern Recognition** | Guess the next pattern (numbers, colors, shapes) | Logic, sequences |
| **🧊 3D Voxel Builder** | Build 3D models with blocks, export to .obj | Spatial reasoning, 3D coordinates |

### ⚡ STEM Simulations

| Feature | Description | Concepts Taught |
|---------|-------------|-----------------|
| **🔌 Circuit Builder** | Drag-and-drop components: battery, lamp, switch, resistor | Electricity, series vs parallel |
| **🔬 Physics Sandbox** | Simulate gravity, projectiles, friction | Physics fundamentals |
| **🧬 Simple Biology** | Interactive cell/ecosystem simulations | Life sciences |

### 🤖 Arduino & IoT Extensions

| Feature | Description |
|---------|-------------|
| **Mission-Based Challenges** | Guided tasks with real sensors and actuators |
| **Virtual Robot Simulator** | Program a virtual robot before real hardware |
| **IoT Dashboard** | Real-time sensor monitoring and data visualization |

### 📚 Learning Enhancements

| Feature | Description |
|---------|-------------|
| **Adaptive Difficulty** | AI-powered level adjustment based on student progress |
| **Collaborative Coding** | Real-time pair programming for students |
| **Parent Dashboard** | Progress reports and learning analytics for parents |
| **Offline Mode** | Download lessons for offline learning |

## Maze Game Integration

### Overview

KodiLearn includes a Code.org-style maze game integration for interactive coding lessons. Students learn programming concepts by solving maze puzzles with visual block programming.

### Features

- **Tabbed Learning Interface** - Separate Materi (content) and Praktik (practice) tabs
- **Smart Hints System** - Multi-tier hints (beginner, intermediate, advanced) that appear based on student progress
- **3-Star Completion** - Gamified completion with 1-3 stars based on performance (blocks used, time elapsed)
- **Real-time Feedback** - Immediate feedback on code execution with celebration confetti
- **XP Awards** - Experience points multiplied by stars earned (1x, 1.5x, 2x)

### For Students

**How to complete a maze lesson:**

1. Navigate to a maze lesson in your course
2. Read the learning material in the "📚 Materi" tab
3. Scroll through the content to unlock the "🎮 Praktik" tab
4. Switch to Praktik tab (unlocks after reading material)
5. Drag programming blocks to build your solution
6. Click "Run" to execute your program
7. Earn stars based on your efficiency:
   - ⭐ Complete the maze
   - ⭐⭐ Use optimal or fewer blocks
   - ⭐⭐⭐ Complete within optimal time

**Scoring:**
- **Blocks Used**: Fewer blocks = better score
- **Time Elapsed**: Faster completion = better score
- **Stars Earned**: 1-3 stars based on performance

### For Teachers/Admins

**Creating Maze Lessons:**

1. Navigate to `/avo` (admin panel)
2. Go to Lessons and create/edit a lesson
3. Set "Activity Type" to "Maze"
4. Configure "Activity Config" with JSON:

```json
{
  "maze_level": 1,
  "grid_size": [5, 5],
  "start_pos": [0, 0],
  "goal_pos": [4, 4],
  "obstacles": [[2, 2], [2, 3]],
  "optimal_blocks": 5,
  "optimal_time_seconds": 30,
  "available_blocks": ["forward", "turn_left", "turn_right"],
  "character": "rabbit",
  "goal_item": "carrot"
}
```

**Configuring Hints:**

1. In the Lesson detail view, go to "Hints" section
2. Create hints for each tier (beginner, intermediate, advanced)
3. Set trigger conditions:
   - `failed_runs_threshold`: Show after N failed attempts (default: 3)
   - `time_threshold_seconds`: Show after N seconds (default: 120)
   - `show_immediately`: Show on maze start (default: false)

**Viewing Student Progress:**

1. Navigate to `/avo` → "Maze Attempts"
2. View all student attempts with:
   - Blocks used, time elapsed, failed runs
   - Stars earned
   - Attempt status (in_progress, completed)

### Technical Details

**Backend Architecture:**
- **Models**: `LessonHint`, `MazeAttempt` with UUID primary keys
- **API Endpoints**: `/api/maze_attempts`, `/api/lessons/:lesson_id/hints`
- **Star Calculation**: Automatic based on optimal blocks and time
- **XP Multipliers**: 1x (1 star), 1.5x (2 stars), 2x (3 stars)

**Frontend Components:**
- **TabNav**: Tab navigation with lock/unlock states
- **MazePractice**: Container for maze game with progress tracking
- **HintTooltip**: Smart hint display with tier indicators
- **CompletionModal**: Trophy celebration with star display
- **useMazeTracker**: Auto-sync attempt progress to backend
- **useSmartHints**: Trigger-based hint display system

**Blockly Integration:**
- Custom Arduino blocks for maze movements
- Visual block-to-code generation
- JavaScript maze interpreter for execution

**See also:** [CLAUDE.md](CLAUDE.md) for detailed architecture documentation

## Prerequisites

- Ruby 3.4.7 (see `.ruby-version`)
- PostgreSQL
- Node.js (for Yarn 4.11.0)
- Yarn package manager (v4.11.0)

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
   yarn install
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

### Design System

#### Colors

| Name | HEX | RGB | Usage |
|------|-----|-----|-------|
| **Kodibot Orange** | `#E18914` | 225, 137, 20 | Aksen utama, headline, CTA buttons |
| **Kodibot Green** | `#1D8536` | 29, 133, 54 | Edukasi, trust, success states |
| **Kodibot Yellow** | `#F9DB2B` | 249, 219, 43 | Highlight, elemen playful, badges |

#### Color Meaning

| Color | Represents |
|-------|------------|
| **Orange** | Semangat belajar, energi, keberanian |
| **Green** | Pertumbuhan, pendidikan, kepercayaan |
| **Yellow** | Keceriaan, kreativitas, optimisme |

#### Neutral Colors

| Name | HEX | Usage |
|------|-----|-------|
| **Dark** | `#2D2D2D` | Body text, heading |
| **Gray** | `#6B7280` | Secondary text, captions |
| **Light Gray** | `#F3F4F6` | Background, dividers |
| **White** | `#FFFFFF` | Background, card surfaces |

#### Color Usage Rules

- **Orange** sebagai aksen utama & headline
- **Green** untuk edukasi & trust indicators
- **Yellow** untuk highlight & elemen playful
- Rasio kontras minimal **4.5:1** untuk aksesibilitas
- Hindari gradasi kompleks, gunakan warna solid

#### Color Combinations

```
Primary background: White (#FFFFFF)
Primary text: Dark (#2D2D2D)
Primary accent: Orange (#E18914)
Secondary accent: Green (#1D8536)
Highlight: Yellow (#F9DB2B)
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
