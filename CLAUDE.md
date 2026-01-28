# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KodiLearn is a STEM Learning Management System (LMS) for children built with:
- **Backend**: Rails 8.1.1 with PostgreSQL, Devise auth, Pundit authorization
- **Frontend**: React 19.2 + TypeScript with Inertia.js, Vite, Tailwind CSS v4, Shadcn UI
- **Special Features**: Arduino Playground with visual block programming (Blockly) + Wokwi simulation

## Essential Commands

### Development
```bash
# Start all services (Rails + Vite)
bin/dev

# Start services individually
bin/vite dev     # Frontend dev server (localhost:5173)
bin/rails s      # Rails server (localhost:3000)

# Database
bin/rails db:create
bin/rails db:migrate
bin/rails db:reset    # Reset development database

# Testing
bin/rails test        # Run all tests
bin/rspec             # Run RSpec tests

# Arduino Compiler Server (separate service)
ruby arduino-compiler-server.rb    # Runs on port 4567
```

### Code Quality
```bash
# Ruby
bin/rubocop           # Lint Ruby code
bin/rubocop -A        # Auto-fix issues
bin/brakeman --no-pager    # Security scan
bin/bundler-audit     # Check gem vulnerabilities

# JavaScript/TypeScript
yarn lint             # ESLint frontend code
yarn lint:fix         # Auto-fix ESLint issues
yarn format           # Prettier format
```

### Docker Services (Optional)
```bash
docker-compose -f docker-compose.dev.yml up -d
# Starts: PostgreSQL (5432), Arduino Compiler (4567)
```

## Architecture

### Role-Based Routing Structure
The app uses namespace-based routing with role-specific controllers:
- `/student/*` → Student namespace (for students)
- `/parent/*` → Parent namespace (for parents)
- `/admin/*` → Avo admin panel (admin/instructor only)
- `/api/*` → API endpoints (e.g., Arduino compilation)

User roles: `student`, `parent`, `instructor`, `admin` (defined in `User` model)

### Inertia.js Integration Pattern
**Backend controllers** render Inertia pages with props:
```ruby
render inertia: "Student/ArduinoPlayground/Index", props: {
  sketches: @sketches.as_json(only: [:id, :name, :code]),
  currentSketch: @current_sketch
}
```

**Frontend pages** receive props via `usePage<PageProps>()`:
```tsx
const { sketches, currentSketch } = usePage<PageProps>().props
```

### Shared Data via ApplicationController
All Inertia pages automatically receive:
- `auth.user` - Current user info (id, name, email, role, avatar_url)
- `flash` - Flash messages (success, error, notice, alert)
- `errors` - Validation errors (auto-cleared after render)
- `locale` - Current locale (en/id)
- `translations` - i18n translations for key namespaces

**Location**: `app/controllers/application_controller.rb:14-28`

### Frontend Path Aliases
TypeScript `@/*` maps to `app/frontend/*`:
- `@/components` → `app/frontend/components`
- `@/Pages` → `app/frontend/Pages`
- `@/hooks` → `app/frontend/hooks`
- `@/Layouts` → `app/frontend/Layouts`

**Location**: `tsconfig.json` and `vite.config.ts`

### Model Architecture
- **UUID primary keys** for all models (configured in `config/application.rb`)
- **Role-based profiles**: `User` has_one `:student_profile` or `:instructor_profile`
- **Parent-child relationships**: `User` has_many `:children` and `:parents` through `ParentChild`
- Automatic profile creation on user signup via `after_create :create_profile_for_role`

**Key models**:
- `User` - Devise authentication with enum roles
- `StudentProfile` - Student-specific data (points, level, avatar)
- `Course`, `CourseModule`, `Lesson` - Hierarchical curriculum
- `Enrollment` - Student-course enrollment with progress tracking
- `ArduinoSketch` - Visual block code sketches saved by students

### Arduino Playground Architecture
**Visual Programming Flow**:
1. Frontend: `BlocklyWorkspace` (react-blockly) with custom Arduino blocks
2. Block-to-Code: `javascriptGenerator` converts blocks to JavaScript
3. Simulation: `avr8js` emulates Arduino hardware in browser
4. Compilation: Optional compile via Arduino compiler service (port 4567)

**Key files**:
- `app/frontend/Pages/Student/ArduinoPlayground/Index.tsx` - Main playground
- `app/frontend/components/ArduinoBlockly/` - Custom block definitions
- `app/frontend/hooks/useArduinoSimulation.ts` - Hardware emulation logic
- `app/controllers/api/arduino_compiler_controller.rb` - Compile API proxy
- `arduino-compiler-server.rb` - Standalone compilation service

### Rails Services Architecture
Uses database-backed adapters for simplicity:
- **Solid Cache** - Rails cache in PostgreSQL
- **Solid Queue** - Background jobs in PostgreSQL
- **Solid Cable** - WebSockets in PostgreSQL

**Config files**: `config/cache.yml`, `config/queue.yml`, `config/cable.yml`

## Internationalization (i18n)

**Supported locales**: `en` (English), `id` (Indonesian)

**Translation files**: `config/locales/en.yml`, `config/locales/id.yml`

**Frontend usage**:
```tsx
import { useTranslation } from '@/hooks/useTranslation'
const { t } = useTranslation()
const text = t('auth.login.title')  // Returns translated string
```

Translation namespaces are pre-loaded in ApplicationController and shared with frontend.

## Testing with RSpec

**Test structure**:
- `spec/models/` - Model specs
- `spec/requests/` - Request/integration specs
- `spec/policies/` - Pundit policy specs
- `spec/system/` - Capybara system specs (with Playwright driver)
- `spec/factories/` - FactoryBot factories

**Run specific test**:
```bash
bin/rspec spec/models/user_spec.rb
bin/rspec spec/models/user_spec.rb:10  # Specific line
```

## Common Development Patterns

### Creating a New Inertia Page

1. **Backend controller** (`app/controllers/student/feature_controller.rb`):
```ruby
class Student::FeatureController < ApplicationController
  before_action :authenticate_user!

  def index
    @items = Item.all
    render inertia: "Student/Feature/Index", props: {
      items: @items.as_json(only: [:id, :name])
    }
  end
end
```

2. **Add route** (`config/routes.rb`):
```ruby
namespace :student do
  get "feature", to: "feature#index"
end
```

3. **Frontend page** (`app/frontend/Pages/Student/Feature/Index.tsx`):
```tsx
import { usePage } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'

interface Props {
  items: Array<{ id: string; name: string }>
}

export default function Index({ items }: Props) {
  return (
    <StudentLayout>
      {/* Your UI */}
    </StudentLayout>
  )
}

Index.layout = StudentLayout
```

### Form Validation Pattern

**Backend validation** with Zod schema on frontend:
- Validation schemas: `app/frontend/lib/validations.ts`
- Form component: Uses React Hook Form + Zod resolver
- Server errors: Shared via `session[:errors]` in ApplicationController

### Adding a New Model with UUID

1. **Generate migration**:
```bash
bin/rails generate model CreateFeature name:string description:text
```

2. **Edit migration** to use UUID:
```ruby
create_table :features, id: :uuid do |t|
  t.string :name
  t.text :description
  t.timestamps
end
```

3. **Update model** (`app/models/feature.rb`):
```ruby
class Feature < ApplicationRecord
  validates :name, presence: true
end
```

4. **Add policy** (`app/policies/feature_policy.rb`):
```ruby
class FeaturePolicy < ApplicationPolicy
  # Authorization rules
end
```

## Code Style & Conventions

- **Ruby**: Follow RuboCop Rails Omakase (run `bin/rubocop`)
- **TypeScript/React**: ESLint + Prettier (run `yarn lint`)
- **UI Components**: Use Shadcn UI components from `@/components/ui`
- **Styling**: Tailwind CSS v4 utility classes
- **Git Hooks**: Overcommit runs RuboCop + ESLint automatically before commits

## Important File Locations

- **Entry point**: `app/frontend/entrypoints/application.tsx`
- **Main layout**: `app/frontend/Layouts/StudentLayout.tsx`
- **Shared data**: `app/controllers/application_controller.rb` (inertia_share block)
- **Type definitions**: `app/frontend/types/index.ts`
- **Translations**: `config/locales/{en,id}.yml`
- **Services**: `app/services/` (business logic outside controllers)
- **Policies**: `app/policies/` (Pundit authorization)

## Deployment

- **Tool**: Kamal (containerized deployment)
- **Command**: `bin/kamal deploy`
- **Config**: `config/deploy.yml`

## Pre-commit Hooks (Overcommit)

Enabled hooks run automatically:
- RuboCop (Ruby style)
- ESLint (JavaScript/TypeScript style)
- Trailing whitespace removal
- Private key detection
- File size limits (1MB max)

To skip: `SKIP=RuboCop git commit -m "message"`
