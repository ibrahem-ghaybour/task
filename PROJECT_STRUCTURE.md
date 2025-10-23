# Project Structure Documentation

## 📁 Folder Structure

```
app/
├── assets/           # Static assets (CSS, images)
│   └── css/
├── components/       # Reusable Vue components
│   ├── auth/        # Authentication components
│   │   └── Login.vue
│   ├── layouts/     # Layout components
│   └── ui/          # UI components (shadcn-vue)
├── composables/     # Reusable composition functions
│   ├── useApi.ts    # API request wrapper
│   ├── useAuth.ts   # Authentication logic
│   ├── useProducts.ts # Product operations
│   └── useToast.ts  # Toast notifications
├── lib/             # Utility libraries
│   └── utils.ts
├── middleware/      # Route middleware
│   └── auth.ts      # Authentication guard
├── pages/           # File-based routing
│   ├── auth/
│   │   └── login.vue
│   ├── products/
│   │   ├── index.vue      # Products list
│   │   ├── [id].vue       # Product details
│   │   └── create.vue     # Create product
│   └── index.vue          # Home page
├── plugins/         # Nuxt plugins
│   └── api.ts       # API plugin with interceptors
├── stores/          # Pinia state management
│   ├── auth.ts      # Auth store
│   └── products.ts  # Products store
├── types/           # TypeScript type definitions
│   ├── auth.ts      # Auth types
│   └── product.ts   # Product types
└── utils/           # Utility functions
    └── validation.ts # Zod validation schemas
```

## 🎯 Key Concepts

### 1. Composables (Composition API)

Composables are reusable functions that encapsulate stateful logic. They follow the `use*` naming convention.

#### **useApi.ts**
- Generic API request handler
- Provides `get`, `post`, `put`, `delete` methods
- Centralized error handling

#### **useAuth.ts**
- Authentication operations (login, register, logout)
- Exposes loading and error states
- Computed properties for auth status

#### **useProducts.ts**
- Product CRUD operations
- Loading and error state management
- Type-safe API calls

#### **useToast.ts**
- Consistent toast notifications
- Success, error, info, warning methods
- Loading toast with dismissal

### 2. Validation (Zod)

All forms use Zod schemas for validation:

- **loginSchema**: Username, password, provider, OTP
- **registerSchema**: Name, email, password with confirmation
- **productSchema**: Complete product validation with business rules

Benefits:
- Type-safe validation
- Reusable schemas
- Clear error messages
- Runtime type checking

### 3. State Management (Pinia)

#### **Auth Store**
```typescript
- accessToken: Cookie-based token storage
- currentUser: User data
- isAuthenticated: Computed property
- login(), register(), logout(), fetchMe()
```

#### **Products Store**
```typescript
- products: Product array
- currentProduct: Single product
- pagination: Pagination metadata
- CRUD operations
```

### 4. API Integration

#### **API Plugin** (`plugins/api.ts`)
- Automatic token refresh
- Request/response interceptors
- Bearer token authentication
- Error handling

#### **Base URL**
```typescript
https://freestore.ezeestock.com/api
```

#### **Endpoints**
- `POST /login` - User authentication
- `GET /dashboard/products` - List products
- `GET /dashboard/products/{id}` - Get product
- `POST /dashboard/products` - Create product
- `PUT /dashboard/products/{id}` - Update product
- `DELETE /dashboard/products/{id}` - Delete product

### 5. Authentication Flow

1. User submits login form
2. `useAuth` composable validates and sends request
3. API returns access token
4. Token stored in cookie (15min expiry)
5. Auth middleware protects routes
6. API plugin auto-refreshes expired tokens

### 6. Error Handling

#### **Composable Level**
```typescript
try {
  const response = await api.get('/endpoint');
  return response;
} catch (err: any) {
  error.value = err.message;
  throw err;
}
```

#### **Component Level**
```typescript
try {
  await productsApi.fetchProducts();
} catch (error: any) {
  toastNotification.error("Failed", error.message);
}
```

### 7. Loading States

All async operations show loading indicators:

- **Button states**: Disabled with spinner
- **Page states**: Full-page loader
- **Item states**: Individual item loaders (e.g., delete button)

### 8. Responsive Design

- **Mobile-first approach**
- **Tailwind CSS breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Grid layouts**: Responsive columns
- **Touch-friendly**: Large tap targets

### 9. Code Quality

#### **Comments**
- JSDoc-style function documentation
- Inline comments for complex logic
- Component-level descriptions

#### **TypeScript**
- Strict type checking
- Interface definitions
- Type inference

#### **Naming Conventions**
- Components: PascalCase
- Composables: camelCase with `use` prefix
- Files: kebab-case
- Constants: UPPER_SNAKE_CASE

## 🚀 Usage Examples

### Using Composables

```vue
<script setup>
// Import composable
const productsApi = useProducts();
const toast = useToast();

// Use in async function
const loadData = async () => {
  try {
    const response = await productsApi.fetchProducts(1, 10);
    toast.success("Products loaded");
  } catch (error) {
    toast.error("Failed to load", error.message);
  }
};

// Access loading state
const isLoading = productsApi.loading.value;
</script>
```

### Form Validation

```vue
<script setup>
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { loginSchema } from "~/utils/validation";

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { username: "", password: "" }
});

const onSubmit = handleSubmit(async (values) => {
  // Form is validated, values are type-safe
  await auth.login(values);
});
</script>
```

### Protected Routes

```vue
<script setup>
// Add to page component
definePageMeta({
  middleware: "auth" // Requires authentication
});
</script>
```

## 📝 Best Practices

1. **Always use composables** for API calls
2. **Validate all user input** with Zod schemas
3. **Show loading states** for async operations
4. **Handle errors gracefully** with toast notifications
5. **Use TypeScript** for type safety
6. **Comment complex logic** for maintainability
7. **Keep components small** and focused
8. **Reuse code** through composables
9. **Test responsive design** on multiple devices
10. **Follow naming conventions** consistently

## 🔧 Development Workflow

1. **Create types** in `/types`
2. **Define validation** in `/utils/validation.ts`
3. **Build composable** in `/composables`
4. **Create store** if needed in `/stores`
5. **Build component** in `/components` or `/pages`
6. **Add middleware** if route protection needed
7. **Test functionality** with loading/error states
8. **Verify responsive design**

## 📚 Dependencies

- **Nuxt 3**: Vue framework
- **Pinia**: State management
- **Vee-Validate**: Form validation
- **Zod**: Schema validation
- **shadcn-vue**: UI components
- **Tailwind CSS**: Styling
- **Lucide Vue**: Icons
- **vue-sonner**: Toast notifications
