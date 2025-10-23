# Product Management System

A modern, full-featured product management application built with Nuxt 3, featuring authentication, CRUD operations, and a beautiful UI.

## 🚀 Features

- ✅ **Authentication System** - Login with username/password/provider/OTP
- ✅ **Product Management** - Full CRUD operations for products
- ✅ **Pagination** - Efficient product list pagination
- ✅ **Form Validation** - Zod schema validation with real-time feedback
- ✅ **Loading States** - Proper loading indicators for all async operations
- ✅ **Error Handling** - Toast notifications for success/error messages
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Type Safety** - Full TypeScript support
- ✅ **State Management** - Pinia stores for global state
- ✅ **Composables** - Reusable composition functions
- ✅ **Modern UI** - shadcn-vue components with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Nuxt 3
- **Language**: TypeScript
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-vue
- **Form Validation**: Vee-Validate + Zod
- **Icons**: Lucide Vue
- **Notifications**: vue-sonner
- **HTTP Client**: ofetch

## 📋 Prerequisites

- Node.js 18+ or Bun
- npm/pnpm/yarn/bun package manager

## 🔧 Setup

### 1. Install Dependencies

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### 2. Environment Configuration

The API base URL is configured in `nuxt.config.ts`:
```typescript
apiBaseUrl: 'https://freestore.ezeestock.com/api'
```

You can override this by creating a `.env` file:
```env
NUXT_PUBLIC_API_BASE_URL=https://your-api-url.com/api
```

### 3. Start Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## 📁 Project Structure

```
app/
├── composables/      # Reusable composition functions
│   ├── useApi.ts     # API wrapper
│   ├── useAuth.ts    # Authentication logic
│   ├── useProducts.ts # Product operations
│   └── useToast.ts   # Toast notifications
├── components/       # Vue components
│   ├── auth/         # Auth components
│   └── ui/           # UI components (shadcn-vue)
├── middleware/       # Route middleware
│   └── auth.ts       # Auth guard
├── pages/            # File-based routing
│   ├── auth/login.vue
│   ├── products/
│   │   ├── index.vue    # List
│   │   ├── [id].vue     # Details
│   │   └── create.vue   # Create
│   └── index.vue
├── plugins/          # Nuxt plugins
│   └── api.ts        # API plugin with interceptors
├── stores/           # Pinia stores
│   ├── auth.ts
│   └── products.ts
├── types/            # TypeScript types
│   ├── auth.ts
│   └── product.ts
└── utils/            # Utility functions
    └── validation.ts # Zod schemas
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed documentation.

## 🔐 Authentication

### Login Credentials
```json
{
  "username": "admin",
  "password": "admin",
  "provider": "mgr",
  "otp": ""
}
```

### Authentication Flow
1. User submits login form
2. API returns access token
3. Token stored in cookie (15min expiry)
4. Protected routes require authentication
5. Auto token refresh on expiry

## 📡 API Endpoints

### Authentication
- `POST /login` - User login

### Products
- `GET /dashboard/products?page=1&per_page=5` - List products
- `GET /dashboard/products/{id}` - Get product details
- `POST /dashboard/products` - Create product
- `PUT /dashboard/products/{id}` - Update product
- `DELETE /dashboard/products/{id}` - Delete product

## 🎨 UI Components

This project uses [shadcn-vue](https://www.shadcn-vue.com/) components:
- Card, Button, Input
- Form components with validation
- Toast notifications
- Loading spinners

## 📝 Code Quality

### Best Practices Implemented
- ✅ Composables for reusable logic
- ✅ Centralized validation schemas
- ✅ Proper error handling
- ✅ Loading states for all async operations
- ✅ TypeScript for type safety
- ✅ JSDoc comments for documentation
- ✅ Responsive design
- ✅ Clean code structure

### Validation
All forms use Zod schemas defined in `utils/validation.ts`:
- Login validation
- Product validation with business rules
- Type-safe form data

### State Management
Pinia stores provide:
- Centralized state
- Type-safe actions
- Computed properties
- Persistent data

## 🚦 Usage Examples

### Using Composables
```vue
<script setup>
const productsApi = useProducts();
const toast = useToast();

const loadData = async () => {
  try {
    await productsApi.fetchProducts(1, 10);
    toast.success("Products loaded");
  } catch (error) {
    toast.error("Failed", error.message);
  }
};
</script>
```

### Protected Routes
```vue
<script setup>
definePageMeta({
  middleware: "auth" // Requires login
});
</script>
```

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure:
- API allows requests from your origin
- No `credentials: "include"` with wildcard CORS

### Token Expiry
- Access tokens expire after 15 minutes
- Auto-refresh is handled by API plugin
- Manual refresh available via `/auth/refresh`

## 📚 Documentation

- [Project Structure](./PROJECT_STRUCTURE.md) - Detailed architecture
- [Nuxt 3 Docs](https://nuxt.com/docs)
- [Pinia Docs](https://pinia.vuejs.org/)
- [shadcn-vue](https://www.shadcn-vue.com/)

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Add JSDoc comments to functions
4. Test on mobile devices
5. Handle errors properly
6. Show loading states

## 📄 License

MIT
