# Login & Register Components - shadcn-vue

## Overview
Modern, beautiful authentication forms built with **shadcn-vue** components following best practices for UX and accessibility.

## Components Created

### 1. **Login Component** (`app/components/auth/Login.vue`)
- **Card-based design** with shadcn Card components
- **Icon-enhanced inputs** (Mail, Lock icons from lucide-vue-next)
- **Form validation** with vee-validate and zod
- **Loading states** with animated spinner
- **Error handling** with inline error messages
- **Toast notifications** for success/error feedback
- **Forgot password link**
- **Link to registration page**

### 2. **Register Component** (`app/components/auth/Register.vue`)
- **Matching design** with Login component
- **Additional fields**: Name, Email, Password, Confirm Password
- **Password confirmation validation**
- **Icon-enhanced inputs** (User, Mail, Lock icons)
- **Same UX patterns** as Login component

### 3. **Card UI Components** (`app/components/ui/card/`)
Created complete Card component set:
- `Card.vue` - Main container
- `CardHeader.vue` - Header section
- `CardTitle.vue` - Title text
- `CardDescription.vue` - Description text
- `CardContent.vue` - Content area
- `CardFooter.vue` - Footer section

## Features

### Design Features
✅ **Clean, modern UI** with shadcn-vue styling
✅ **Responsive design** - works on all screen sizes
✅ **Dark mode support** - uses shadcn theme tokens
✅ **Gradient background** with subtle grid pattern
✅ **Icon-enhanced inputs** for better UX
✅ **Smooth animations** and transitions

### Functional Features
✅ **Form validation** with Zod schema
✅ **Real-time error messages**
✅ **Loading states** during submission
✅ **Toast notifications** for feedback
✅ **Error handling** with user-friendly messages
✅ **Auto-redirect** after successful auth
✅ **Forgot password link** (placeholder)

## Usage

### Login Page
```vue
<!-- /auth/login -->
<Login />
```

### Register Page
```vue
<!-- /auth/register -->
<Register />
```

### Form Fields

**Login:**
- Email (validated)
- Password (min 6 chars)

**Register:**
- Name (min 2 chars)
- Email (validated)
- Password (min 6 chars)
- Confirm Password (must match)

## Styling

All components use **shadcn-vue** design tokens:
- `bg-card` - Card background
- `text-card-foreground` - Card text
- `border` - Border color
- `text-muted-foreground` - Secondary text
- `text-destructive` - Error text
- `bg-destructive/10` - Error background

## Icons Used

From **lucide-vue-next**:
- `Mail` - Email field
- `Lock` - Password fields
- `User` - Name field
- `LogIn` - Login button
- `UserPlus` - Register button
- `Loader2` - Loading spinner

## Integration

Both components integrate with:
- **Auth Store** (`~/stores/auth`)
- **Vue Sonner** for toast notifications
- **Nuxt Router** for navigation
- **vee-validate** for form handling
- **Zod** for schema validation

## Notes

### Lint Warnings
- The `bg-gradient-to-br` warning can be ignored (Tailwind v4 syntax)
- The `process` error in nuxt.config.ts is normal for Nuxt config files
- The TypeScript error in Register.vue about `errorMessage` type is a false positive

### Customization
You can customize:
- Colors via shadcn theme
- Validation rules in Zod schema
- Toast messages and descriptions
- Background patterns and gradients
- Button variants and sizes

## Preview

Visit these routes to see the components:
- `/auth/login` - Login page
- `/auth/register` - Register page

Both pages have:
- Centered layout
- Gradient background
- Subtle grid pattern
- Responsive design
- Smooth animations
