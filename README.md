# Task_manager
A Task Management System with Role-Based Access Control (RBAC) built using Node.js, Express, MongoDB, JWT, and Redis. This system allows users to create, manage, and track tasks efficiently while ensuring secure access based on predefined roles.

Features
 User Authentication & Authorization (JWT-based)
Role-Based Access Control (RBAC) (Admin, Manager, User)
Task CRUD Operations (Create, Read, Update, Delete)
Redis Caching for optimized performance
Pagination & Filtering for task retrieval
Soft & Hard Deletion (Cron Job for permanent removal)
provides logging using winston library
morgan is also used for http request logging

Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (Mongoose ORM)
Authentication: JWT (JSON Web Token)
Caching: Redis
Task Scheduling: Node Cron Jobs
