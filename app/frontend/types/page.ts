import { User } from './user'

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
    errors: Record<string, string>
    locale?: string
    translations?: {
        auth: {
            login: string
            register: string
            logout: string
            email: string
            password: string
            password_confirmation: string
            name: string
            remember_me: string
            forgot_password: string
            already_have_account: string
            dont_have_account: string
            sign_in: string
            sign_up: string
            sign_out: string
        }
        auth_kids: {
            login_title: string
            login_description: string
            register_title: string
            register_description: string
            email_placeholder: string
            password_placeholder: string
            password_confirmation_placeholder?: string
            login_button: string
            register_button: string
            name?: string
            name_placeholder?: string
            // Fallback/Shared keys
            login?: string
            email?: string
            password?: string
            remember_me?: string
            sign_in?: string
            register?: string
            dont_have_account?: string
            already_have_account?: string
            password_confirmation?: string
            sign_up?: string
        }
        dashboard: {
            title: string
            welcome: string
            admin_panel: string
        }
        common: {
            save: string
            cancel: string
            edit: string
            delete: string
            create: string
            update: string
            back: string
        }
    }
} & T
