# HydroMax Shop 

> **Status: work in progress.** This README is temporary and will be finalised before submission.

## What the app does

**Customers**
- Log in, register and browse products
- Write, view, update and delete their own product reviews (only for products from completed orders)
- Comment on other members' reviews, reply to comments, and delete their own comments

**Administrators**
- Log in and open the Sales Order Summary dashboard
- Filter, sort and group sales data (by date range, gender, product category, status and more)
- See summary cards and export the results as CSV

## Tech stack
| Layer | Tools |
|---|---|
| Front-end | HTML, CSS, JavaScript |
| Back-end | Node.js, Express |
| Database | PostgreSQL (managed with pgAdmin 4) |
| Auth | JSON Web Tokens (JWT), passwords hashed with bcrypt |
| Version control | Git and GitHub |

## Before you start

You need these installed:

- Node.js and npm
- PostgreSQL and pgAdmin 4
- Git

## How to run it

**1. Clone and install**

```bash
git clone <repository-url>
cd <repository-folder>/ecommerce
npm install
```

**2. Set up the database**

1. In pgAdmin, create a database named `ecommerce`.
2. Run `CreateDbTable.sql` (the starter script) to create and seed the 5 original tables.
3. Run `functions_&_stored_procedures.sql` to create all the database functions. 

Alternatively, restore the submitted database backup (`YourName_Db.zip`) in pgAdmin.

**3. Create a `.env` file** in the `ecommerce` folder:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=<your-postgres-username>
DB_PASSWORD=<your-postgres-password>
DB_NAME=ecommerce

JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

PORT=3000
```

**4. Start the app**

```bash
npm run dev
```

Then open http://localhost:3000.

## Test accounts

| Role | Username | Password | Lands on |
|---|---|---|---|
| Admin | `admin` | `Password1!` | Sales Order Summary dashboard |
| User | `johnsmith` | `Password1!` | Product list |

## Database functions

| Function | Purpose | Status |
|---|---|---|
| `create_review` | Add a review (validates order, rating, duplicates) | Not started |
| `update_review` | Edit your own review | Not started |
| `delete_review` | Delete your own review and its comments | Not started |
| `get_reviews` | List a member's reviews | Not started |
| `create_comment` | Add a comment or reply | Not started |
| `get_comments` | Get the comments of a review, nested | Not started |
| `delete_comment` | Delete your own comment | Not started |
| `get_sale_order_summary` | Filtered, sorted and grouped sales data for the admin | In progress |

## Main pages

| Page | URL |
|---|---|
| Login / Register | `/auth/login`, `/auth/register` |
| Products | `/product/retrieve` |
| Create review | `/review/create` |
| My reviews | `/review/retrieve/all` |
| Update / delete review | `/review/update`, `/review/delete` |
| Admin dashboard | `/admin/dashboard/salesOrderSummary` |

## How the code is organised

The app follows a route → controller → model pattern. Each model calls the database, each controller handles the request and response, and each route maps a URL to a controller.

```text
ecommerce/
├── app.js              # starts the server, mounts routes, serves pages
├── .env                # local settings (not committed)
├── config/database.js  # PostgreSQL connection
├── middleware/auth.js  # JWT and admin checks
├── routes/             # auth, products, reviews, comments, admin
├── controllers/        # one controller per route file
├── models/             # one model per route file
└── public/             # front-end pages (index.html, style.css, script.js each)
    ├── auth/           # login, register
    ├── product/        # product list and details
    ├── review/         # create, retrieve/all, update, delete
    └── admin/          # dashboard/salesOrderSummary
```

## Author

- **Name:** yumi
- **Student ID:** 2537159
- **Module:** ST0525 Database Systems
