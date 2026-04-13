# MediStore – Your Trusted Online Pharmacy

MediStore is a premium, professional-grade medical store website designed to provide a seamless and secure shopping experience for healthcare products, medicines, and equipment.

## 🚀 Features

-   **Dynamic Catalog**: Browse a wide range of medicines by categories (Tablets, Syrups, Vitamins) or specific health conditions.
-   **Advanced Navigation**: Professional header with integrated search and dark mode support.
-   **User Dashboard**: Centralized hub for managing:
    -   **Profile**: Personal details and account management.
    -   **Order History**: Track previous purchases with status updates.
    -   **Wishlist**: Save your favorite medical products for later.
    -   **Order Tracking**: Real-time status visualization for active orders.
-   **Seamless Checkout**: Integrated cart system and a secure-feeling checkout flow.
-   **Authentication**: Mock "Continue with Google" integration for a modern UX.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
-   **Dark Mode**: A beautiful, premium dark theme for comfortable nighttime browsing.

## 🔄 User Workflow

1.  **Discovery**: Users browse medicines via the home page, product gallery, or by selecting specific health conditions.
2.  **Selection**: Items can be saved to a **Wishlist** for future reference or added directly to the **Shopping Cart**.
3.  **Authentication**: Users log in (or sign up) via a premium mock-Google authentication flow to manage their personal data.
4.  **Checkout**: A streamlined multi-step process for entering delivery details and placing a mock order.
5.  **Management**: After ordering, users can track their shipment, view order history, and manage their profile through the **User Dashboard**.

## 🛠️ Technology Stack

-   **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (Vanilla)
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (Mongoose)
-   **Authentication**: JSON Web Tokens (JWT) & Mock Google Auth
-   **Icons**: Font Awesome 6
-   **Typography**: Google Fonts (Poppins, Inter, Outfit)
-   **Storage**: MongoDB (Cloud/Local) & Browser `localStorage` for session persistence.

## 🏁 Getting Started

Follow these steps to get the full application (Frontend + Backend) running on your local machine.

### 1. Prerequisites
- **Node.js**: Installed on your system.
- **MongoDB**: A local instance running on `mongodb://localhost:27017/medistore` (or update the `.env` file).

### 2. Setup & Backend Execution
1. Open your terminal at the project root.
2. Navigate to the backend directory:
   ```cmd
   cd backend
   ```
3. Install dependencies:
   ```cmd
   npm install
   ```
4. Start the backend server:
   ```cmd
   npm start
   ```
   *The server will run on `http://localhost:5000`.*

### 3. Frontend Execution
You have two ways to run the frontend:

**Option A: Using a Local Server (Recommended)**
This is required for dynamic features and API interaction.
```cmd
# From the project root
npx live-server frontend
```

**Option B: Manual Opening**
Open `frontend/html/index.html` directly in any modern web browser.

---

### 🔑 Admin Credentials
To access the **Admin Portal** (`frontend/html/admin.html`):
- **Username:** `admin`
- **Password:** `admin@123`

---

## 🛠️ Technology Stack

The project has been verified for:
-   Multi-browser compatibility.
-   Responsive layout transitions.
-   Real-time data persistence (Cart & Orders).
-   Theme consistency across all pages.

---
MediStore – *Made with ❤️ for better health.*
