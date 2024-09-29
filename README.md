# A Food Logger with Image Recognition

This is a Nuxt 3 web app project that seeks to encourage people to keep track of their daily intake by improving UX experience through image food recognition offered by LogMeal.

## Features

- User basic registration
- Food log creation and management
- Meal tracking with image support
- Demonstrating RESTful API for data operations (GET, POST, PATCH, DELETE)

## Tech Stack

- Frontend: Nuxt 3, Vue 3, Tailwind CSS, shadcn-vue
- Backend: Node.js, Express, Sequelize, SQLite
- Authentication: bcrypt for password hashing on SQLite
- Testing: Vitest and Supertest for auto-testing backend API endpoints
- OpenAPI 3.0 specifications
- API Validation: Express Openapi Validator to auto-validate incoming/outoging requests

## Environment Setup

Suggest node version: v22 or above (tested: v22.9.0)
Suggest NPM version: v10.5.1 or above (tested: v10.8.3 )

- Please apply the sample environment variable file, [\_.env](backend_.env) file as `.env` in `backend` folder, i.e.

```bash
cd backend
cp _.env .env
```

**IMPORTANT NOTICE: The bearer token in the env file, even though it is for a free API without any PII, should not normally exist in a repository. The token provided here is only for ease of testing before 14-Oct-2024 and will be invalidated without further notice!**

## Installation

Install dependencies for both frontend and backend:

```bash
cd frontend
npm install

cd ../backend
npm install
```

## Running in development environment

### Start the backend dev server

```bash
cd backend
npm run dev
```

By default, the API endpoint of backend server on `http://localhost:4000`.

See API spec output yaml on http://localhost:4000/spec to verify the backend server running and is accessible.

**Note: The base URL of API enpoint is configurable through editing `.env` local file, and please remember to update frontend `.nuxt.config.ts` config file as well.**

### Start the frontend nitro dev server

On a new terminal, run

```bash
cd frontend
npm run dev
```

By default, the frontend can be accessible via browser at `http://localhost:3000`.

## Testing with the food image recognition

You can try with the food photos you have or use the below samples:

- [Tomatoes](backend/src/assets/1724193.jpg)
- [Fish and chips](backend/src/assets/1728298.jpg)
- [French fries](backend/src/assets/1728299.jpg)
- [Eggs benedict](backend/src/assets/1728394.jpg)
- Or you can find more from [Logmeal](https://logmeal.com/api/demo/)

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

API endpoints are documented using OpenAPI. Please refer to either:

1. Copy the [YAML](backend/src/api_v1.yaml) file in the repository and paste to [Swagger.io](https://editor-next.swagger.io), or
2. Download [API spec](backend/docs/index.html) HTML file to check the generated API document, or
3. Visit `/spec` endpoint (via browser or import URL to Postman) when the backend server is running (e.g. http://localhost:4000/spec)

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
