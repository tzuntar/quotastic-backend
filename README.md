<p align="center">
  <a href="" rel="noopener">
  <img width="200px" alt="Quotastic Logo" src="https://github.com/tzuntar/quotastic-backend/assets/35228139/f2f365d5-1fba-49cd-a656-c030a781a2db" />
</p>

<h3 align="center">SkillUp Mentor • Quotastic [Back-End]</h3>

---

This repository contains the code for the back-end to the web app Quotastic,
made as a project for the [SkillUp Mentor Bootcamp](https://skillupmentor.com/).

See the [quotastic-frontend](https://github.com/tzuntar/quotastic-frontend) repository for a screenshot and
a more in-depth description of the project.

---


## 📝 Table of Contents

- [Getting Started](#getting_started)
- [Deployment](#deployment)

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the Quotastic back-end up and running on your local machine for development and testing
purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### ✅ Prerequisites <a name = "prerequisites"></a>

- Node.js and NPM or compatible package manager (preferably Yarn)
- A working PostgreSQL instance

### ⏳Installing

1. Install all required dependencies by running `npm install` / `yarn install`
2. Set the following environmental variables:
   - `DATABASE_HOST`
   - `DATABASE_PORT`
   - `DATABASE_USER`
   - `DATABASE_PASS`
   - `DATABASE_NAME`
   - `JWT_SECRET`
   - `JWT_SECRET_EXPIRATION` (default: 3600)
   - `JWT_REFRESH_SECRET`
   - `JWT_REFRESH_SECRET_EXPIRATION` (default: 3600)
4. Run the server using `npm run start` / `yarn run start`

## 🚀 Deployment <a name = "deployment"></a>

Adjust the values in your `.ENV` file to match the remove location. You might also want to reconfigure the
storage options if you are planning on using a CDN for file storage.
