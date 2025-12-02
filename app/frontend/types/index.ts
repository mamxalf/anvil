// Base PageProps that all pages inherit
export type PageProps<T = Record<string, unknown>> = {
  auth: {
    user: User | null
  }
  flash: {
    success?: string
    error?: string
    notice?: string
    alert?: string
  }
  errors: Record<string, string[]>
  locale?: string
  translations?: Translations
} & T

// Translations interface
export interface Translations {
  auth?: Record<string, string>
  dashboard?: Record<string, string>
  common?: Record<string, string>
  nav?: Record<string, string>
  menus?: Record<string, string | Record<string, string>>
  food_items?: Record<string, string | Record<string, string>>
  institutions?: Record<string, string | Record<string, string>>
  beneficiaries?: Record<string, string | Record<string, string>>
  meal_distributions?: Record<string, string>
  nutrition?: Record<string, string | Record<string, string>>
  target_groups?: Record<string, string>
  messages?: Record<string, string>
}

// User interface
export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'dietitian'
}

// Target Group interface
export interface TargetGroup {
  id: string
  name: string
  code: string
  description?: string
  min_energy: number
  min_protein: number
  min_fat: number
  min_carbohydrate: number
  min_fiber: number
  age_range_start?: number
  age_range_end?: number
  nutrition_requirements?: NutritionRequirements
}

// Nutrition Requirements interface
export interface NutritionRequirements {
  energy: number
  protein: number
  fat: number
  carbohydrate: number
  fiber: number
  vitamins?: Record<string, number>
  minerals?: Record<string, number>
}

// Food Item interface
export interface FoodItem {
  id: string
  name: string
  code?: string
  category: string
  category_name_id?: string
  description?: string
  energy_per_100g: number
  protein_per_100g: number
  fat_per_100g: number
  carbohydrate_per_100g: number
  fiber_per_100g: number
  portion_size: number
  portion_unit: string
  urt_description?: string
}

// Menu interface
export interface Menu {
  id: string
  name: string
  description?: string
  target_group_id: string
  target_group?: TargetGroup
  status: 'draft' | 'published' | 'archived'
  total_energy: number
  total_protein: number
  total_fat: number
  total_carbohydrate: number
  total_fiber: number
  day_number?: number
  created_by?: User
  created_by_id: string
  menu_items?: MenuItem[]
  nutrition_summary?: NutritionSummary
  meets_requirements?: boolean
  created_at?: string
  updated_at?: string
}

// Menu Item interface
export interface MenuItem {
  id: string
  menu_id: string
  food_item_id: string
  food_item?: FoodItem
  portion_size: number
  portion_unit: string
  meal_type: 'makanan_utama' | 'selingan'
  energy?: number
  protein?: number
  fat?: number
  carbohydrate?: number
  fiber?: number
}

// Nutrition Summary interface
export interface NutritionSummary {
  energy: number
  protein: number
  fat: number
  carbohydrate: number
  fiber: number
}

// Nutrition Compliance interface
export interface NutritionCompliance {
  energy: { value: number; required: number; met: boolean }
  protein: { value: number; required: number; met: boolean }
  fat: { value: number; required: number; met: boolean }
  carbohydrate: { value: number; required: number; met: boolean }
}

// Institution interface
export interface Institution {
  id: string
  name: string
  institution_type: string
  institution_type_name_id?: string
  address?: string
  province?: string
  city?: string
  district?: string
  postal_code?: string
  phone?: string
  email?: string
  student_count: number
  contact_person?: string
  total_beneficiaries?: number
  full_address?: string
  beneficiaries?: Beneficiary[]
}

// Beneficiary interface
export interface Beneficiary {
  id: string
  name: string
  institution_id: string
  institution?: Institution
  target_group_id: string
  target_group?: TargetGroup
  date_of_birth?: string
  age?: number
  gender: 'male' | 'female'
  gender_name_id?: string
  special_needs?: string
  allergies?: string
  has_dietary_restrictions?: boolean
  dietary_restrictions?: string[]
}

// Meal Distribution interface
export interface MealDistribution {
  id: string
  institution_id: string
  institution?: Institution
  menu_id: string
  menu?: Menu
  distribution_date: string
  recipient_count: number
  notes?: string
  distributed_by_id: string
  distributed_by?: User
  menu_name?: string
  institution_name?: string
  target_group_name?: string
  nutrition_delivered?: NutritionSummary
}

// Statistics interface
export interface DashboardStatistics {
  total_beneficiaries: number
  total_institutions: number
  total_menus: number
  published_menus: number
  total_distributions: number
  distributions_this_month: number
  recipients_this_month: number
  target_groups_count: number
  food_items_count: number
}

// Distribution Statistics
export interface DistributionStats {
  total_distributions: number
  total_recipients: number
  unique_institutions: number
  unique_menus: number
}

// Filter interfaces
export interface MenuFilters {
  target_group_id?: string
  status?: string
}

export interface InstitutionFilters {
  institution_type?: string
  province?: string
  city?: string
  search?: string
}

export interface BeneficiaryFilters {
  target_group_id?: string
  institution_id?: string
  gender?: string
  search?: string
}

export interface DistributionFilters {
  institution_id?: string
  date?: string
  start_date?: string
  end_date?: string
}

// Select option interface
export interface SelectOption {
  value: string
  label: string
}
