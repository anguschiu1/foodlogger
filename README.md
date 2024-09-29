# A Food logger with image recognition

This is Nuxt 3 web app project that seeks to encourage people to keep track of their daily intake, by improving UX experience through image food recognition offered by LogMeal.

## Features

- User basic registration
- Food log creation and management
- Meal tracking with image support
- RESTful API for data operations

## Tech Stack

- Frontend: Nuxt 3, Vue 3, Tailwind CSS, shadcn-vue
- Backend: Node.js, Express, Sequelize, SQLite
- Authentication: bcrypt for password hashing on SQLite

## Setup

### Environment

Suggest node version: v22 or above (tested: v22.9.0)
Suggest NPM version: v10.5.1 or above (tested: v10.8.3 )

```bash
node -v
v22.9.0
npm -v
10.8.3
```

### Steps

1. Clone the repository
2. Install dependencies for both frontend and backend:

   ```bash
   cd frontend
   npm install

   cd ../backend
   npm install
   ```

## Running in development environment

1. Start the backend dev server:

```bash
cd backend
npm run dev
```

By default, the API endpoint of backend server on `http://localhost:4000`.

See API spec output yaml on http://localhost:4000/spec to verify the backend server running and is accessible.

**Note: The base URL of API enpoint is configurable through editing `.env` local file, and please remember to update `.nuxt.config.ts` as well to ensure the frontend app aware of the change.**

1. **Open a new terminal** and start the frontend nitro dev server:

```bash
cd frontend
npm run dev
```

By default, the frontend can be accessible via browser at `http://localhost:3000`.

## TODO/FIXME List

The following items are on the project's todo list:

- TODO: Implement JWT for session authentication and authorization
- TODO: Image file preprocessing to ehance the image recognition accuracy
- Logmeal free tier only allow 25 API calls per day. Source for other vendors to improve UX.
- TODO: Develop a mobile app version for iOS and Android
- TODO: Source for a comprehensive nutrition database
- FIXME: Squash many UX nuances and bugs.
- Add data visualization for food intake trends
- Implement social sharing features for meal achievements
- Implement user profile management features
- Add multi-language support for international users
- Implement advanced search and filtering for food logs
- Develop a recommendation system for balanced meals

## API Documentation

API endpoints are documented using OpenAPI. Please refers either:

1. Copy [YAML](backend/src/api_v1.yaml) file in the repository and paste to [Swagger.io](https://editor-next.swagger.io), or
2. Visit [API spec](backend/src/doc/index.html) to check the generated API document, or
3. Visit `/spec` on browser or import URL to Postman, once the backend server is running (e.g. http://localhost:4000/spec)

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
