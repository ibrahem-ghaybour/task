# Authentication Store Setup

## Overview
The authentication store has been configured to work with your Laravel Passport API that returns tokens in the following format:

```json
{
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "def50200fef49f58b2d2737...",
    "expires_in": 28800
  },
  "status": 200,
  "message": "تم تسجيل الدخول بنجاح"
}
```

## What Was Created/Updated

### 1. **Types** (`app/types/auth.ts`)
- `User`: User data interface
- `LoginPayload`: Login credentials
- `RegisterPayload`: Registration data
- `AuthResponse`: API response structure for login/register
- `MeResponse`: API response structure for fetching current user

### 2. **Auth Store** (`app/stores/auth.ts`)
Updated to:
- Extract `access_token` from `response.data.access_token`
- Store access token in a cookie with 15-minute expiry
- Automatically fetch user data after login/register
- Handle logout properly

### 3. **API Plugin** (`app/plugins/api.ts`)
Updated to:
- Handle token refresh with the new response structure
- Extract `access_token` from `response.data.access_token` in refresh endpoint

### 4. **Nuxt Config** (`nuxt.config.ts`)
Added:
- `@pinia/nuxt` module for state management
- Runtime config for API base URL

### 5. **UI Components**
- Created `Spinner.vue` for loading states
- Login page now properly renders the Login component

## Configuration

### Environment Variables
Create a `.env` file (see `.env.example`):
```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Usage

### In Components
```vue
<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();

const handleLogin = async () => {
  try {
    await auth.login({
      email: "user@example.com",
      password: "password123"
    });
    // User is now logged in and currentUser is populated
    navigateTo("/");
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>
```

### Store Properties
- `auth.accessToken` - Current access token (stored in cookie)
- `auth.currentUser` - Current user data
- `auth.loading` - Loading state for auth operations
- `auth.isAuthenticated` - Computed boolean for auth status

### Store Methods
- `auth.login(payload)` - Login user
- `auth.register(payload)` - Register new user
- `auth.logout()` - Logout user
- `auth.fetchMe()` - Fetch current user data

## API Endpoints Expected

Your API should have these endpoints:

1. **POST /auth/login**
   - Body: `{ email, password }`
   - Returns: `AuthResponse`

2. **POST /auth/register**
   - Body: `{ name, email, password, password_confirmation }`
   - Returns: `AuthResponse`

3. **POST /auth/refresh**
   - Credentials: include (sends refresh_token cookie)
   - Returns: `{ data: { access_token: string } }`

4. **GET /auth/me**
   - Headers: `Authorization: Bearer {access_token}`
   - Returns: `{ data: { user: User } }`

5. **POST /auth/logout**
   - Credentials: include
   - Clears refresh token cookie

## Token Management

- **Access Token**: Stored in cookie, expires in 15 minutes
- **Refresh Token**: Sent as HTTP-only cookie from server
- **Auto-refresh**: The API plugin automatically refreshes expired tokens
- **JWT Validation**: Token expiry is checked before each request

## Notes

- The TypeScript error in `nuxt.config.ts` about `process` is normal in Nuxt config files and can be ignored
- Make sure your API sets the refresh_token as an HTTP-only cookie
- The access token is stored in a client-side cookie for convenience (adjust security as needed)
