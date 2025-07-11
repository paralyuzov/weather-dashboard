# WeatherDashboard

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)
3. Replace `your_api_key_here` in `.env` with your actual API key
4. Update `src/environment/enviroment.ts` with your API key:
   ```typescript
   export const environment = {
     production: false,
     openWeatherApi: 'YOUR_API_KEY_HERE',
     openWeatherBaseUrl: 'https://api.openweathermap.org/data/2.5',
   };
   ```

**⚠️ Important:** Never commit your API key to version control. The environment file is already added to `.gitignore`.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
