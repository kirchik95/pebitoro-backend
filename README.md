# Pebitoro Backend

This is the backend for the pebitoro project.

## Prerequisites

1. Install PostgreSQL:
   Before setting up the project, make sure you have PostgreSQL installed on your system. This will allow you to connect to the database via the console.

   - For macOS, you can use Homebrew:
     ```
     brew install postgresql
     ```
   - For Ubuntu/Debian:
     ```
     sudo apt-get update
     sudo apt-get install postgresql
     ```
   - For Windows, download the installer from the official PostgreSQL website.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a .env file in the root directory and add the following variables:

   ```
   DATABASE_URL=your_database_url_here
   JWT_SECRET=your_jwt_secret_here
   ```

   Replace `your_database_url_here` with your actual PostgreSQL database URL and `your_jwt_secret_here` with a secure secret for JWT token generation.

3. Set up the development environment:

   ```
   npm run docker:build
   ```

   This command will set up the necessary Docker containers for your development environment.

4. Generate database migrations:

   ```
   npm run migration:generate
   npm run migration:apply
   ```

5. Start the development server:
   ```
   npm run dev
   ```
   This will start the server in watch mode, automatically restarting when changes are detected.
