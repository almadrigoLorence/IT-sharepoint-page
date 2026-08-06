# XAMPP MySQL Database Setup & API Guide

This guide details how to load the database using **XAMPP Control Panel** (phpMyAdmin / MySQL) and run the Express API server.

---

## Step 1: Start XAMPP Control Panel

1. Open **XAMPP Control Panel** on your computer.
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.

---

## Step 2: Import `schema.sql` into phpMyAdmin

1. Open your browser and navigate to:
   ```text
   http://localhost/phpmyadmin
   ```
2. Click on the **Import** tab in the top navigation bar.
3. Click **Choose File** and select the `schema.sql` file located at the root of this project:
   ```text
   IT-sharepoint-page/schema.sql
   ```
4. Scroll to the bottom and click **Import** (or **Go**).
5. You should see a success message: `Import has been successfully finished`. A new database named `aseph_academy` with 8 pre-populated tables will be created automatically.

---

## Step 3: Install & Start the API Backend Server

1. Open a terminal in the project directory:
   ```bash
   npm install express mysql2 cors dotenv
   ```
2. Start the Express API server:
   ```bash
   node server/index.js
   ```
   *The server will run at `http://localhost:5000` and connect to XAMPP MySQL.*

---

## Step 4: Run the Frontend Application

1. In a separate terminal window, start the React frontend:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:5173` (or the URL shown in your terminal) in your browser.

> **Note:** If the backend server or XAMPP MySQL is temporarily stopped, the application automatically falls back to browser local storage seamlessly.
