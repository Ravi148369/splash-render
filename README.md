# Splash API

Project for Integrated The World’s Largest Boat Rental.

# Table of Contents
[Pre-requisites](#Pre-requisites)

[Getting started](#Getting-started)

[API Document endpoints](#API-endpoints)

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version >= 14.10.0

# Getting-started
- Clone the repository
```
git clone  <git lab url> /<project-name>.git
```
- Install dependencies
```
cd <project-name>
npm install
```
- Configure .env file (rename .env.example to .env)

- Setup database
```
Create database splash and update connection details in .env file
```
- Build and run the project
```
npm start
```
- run sequelize seed command
```
npx sequelize-cli db:seed:all
```
-  Navigate to `http://localhost:5000`

# API-endpoints
```
  swagger Endpoint : http://localhost:5000/api-docs 
  username: backend@mailinator.com 
  password: Test@123
```
