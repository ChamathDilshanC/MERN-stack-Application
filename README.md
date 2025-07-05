# 🎮 Gadget Vault - Modern POS System

<div align="center">
  <h3>A full-stack Point of Sale system built with React, TypeScript, and Node.js</h3>
  
  [![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
</div>

## 📖 Overview

Gadget Vault is a comprehensive Point of Sale (POS) system designed for retail businesses. It features a modern, responsive interface with full CRUD operations for customers, items, and orders, along with advanced features like authentication, data visualization, and real-time updates.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- Protected routes and role-based access
- Secure password hashing with bcrypt
- HTTP-only cookies for token storage

### 📊 Dashboard & Analytics
- Interactive charts using Recharts
- Real-time sales analytics
- Revenue tracking and order statistics
- Recent activity monitoring

### 👥 Customer Management
- Full CRUD operations for customers
- Advanced form validation
- Search and filter capabilities
- Customer order history

### 📦 Inventory Management
- Item catalog with pricing
- Stock management
- Category organization
- Price tracking

### 🛒 Order Management
- Dynamic order creation
- Order status tracking (Pending, Completed, Cancelled)
- Multi-item orders with quantity management
- Order history and search

### 🎨 Modern UI/UX
- Responsive design with TailwindCSS
- Dark/light theme support
- Loading states and error handling
- Toast notifications
- Mobile-friendly interface

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Recharts** - Data visualization
- **React Hot Toast** - Notification system
- **React Icons** - Icon library
- **React Spinners** - Loading components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe server development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie parsing middleware

## 📂 Project Structure

```
gadget-vault/
├── Node_Server/                 # Backend API
│   ├── src/
│   │   ├── controller/         # Route controllers
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # API routes
│   │   ├── middlewares/        # Custom middleware
│   │   ├── services/           # Business logic
│   │   └── errors/             # Error handling
│   └── package.json
├── mini-pos-redux-with-axios/   # Frontend React App
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── types/              # TypeScript types
│   │   ├── context/            # React context
│   │   └── utils/              # Utility functions
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/gadget-vault.git
cd gadget-vault/Node_Server
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the Node_Server directory:
```env
# Database
DB_URL=mongodb://localhost:27017/gadget_vault

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS
CLIENT_ORIGIN=http://localhost:5173
```

4. **Start the server**
```bash
npm run dev
```

The backend server will start on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../mini-pos-redux-with-axios
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📱 Usage

### Getting Started
1. Open your browser and navigate to `http://localhost:5173`
2. Create a new account using the signup page
3. Login with your credentials
4. Access the dashboard and start managing your business

### Key Features

#### Customer Management
- Add new customers with contact information
- Edit existing customer details
- View customer order history
- Delete customers (with confirmation)

#### Inventory Management
- Add items with names and prices
- Update item information
- Track total inventory value
- Remove items from catalog

#### Order Processing
- Create new orders by selecting customers and items
- Modify quantities and see real-time totals
- Update order status throughout fulfillment
- View detailed order history

## 🔧 API Endpoints

### Authentication
```http
POST /api/auth/signup      # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
POST /api/auth/refresh-token # Refresh access token
```

### Customers
```http
GET    /api/customers      # Get all customers
POST   /api/customers      # Create new customer
GET    /api/customers/:id  # Get customer by ID
PUT    /api/customers/:id  # Update customer
DELETE /api/customers/:id  # Delete customer
```

### Items
```http
GET    /api/items          # Get all items
POST   /api/items          # Create new item
GET    /api/items/:id      # Get item by ID
PUT    /api/items/:id      # Update item
DELETE /api/items/:id      # Delete item
```

### Orders
```http
GET    /api/orders                    # Get all orders
POST   /api/orders                    # Create new order
GET    /api/orders/:id                # Get order by ID
PUT    /api/orders/:id                # Update order
DELETE /api/orders/:id                # Delete order
PATCH  /api/orders/:id/status         # Update order status
GET    /api/orders/customer/:customerId # Get orders by customer
```

## 🧪 Development

### Available Scripts

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Backend
```bash
npm run dev      # Start with nodemon
npm run build    # Compile TypeScript
npm start        # Start production server
```

### Code Style
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Conventional commits for git messages

## 🌟 Key Features Deep Dive

### Authentication System
- **JWT Implementation**: Secure token-based authentication
- **Refresh Tokens**: Automatic token renewal for seamless UX
- **Protected Routes**: Route guards for authenticated areas
- **Persistent Sessions**: Users stay logged in across browser sessions

### Data Management
- **Real-time Updates**: Optimistic UI updates with error handling
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error messages and fallbacks
- **Loading States**: Smooth loading indicators throughout the app

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Desktop Enhanced**: Rich desktop experience
- **Touch Friendly**: Large touch targets for mobile users
- **Accessibility**: WCAG compliant components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the amazing frontend framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Recharts](https://recharts.org/) for beautiful data visualizations
- [Express.js](https://expressjs.com/) for the robust backend framework
- [MongoDB](https://www.mongodb.com/) for the flexible database solution

## 📞 Support

If you have any questions or issues, please:
1. Check the [Issues](https://github.com/yourusername/gadget-vault/issues) section
2. Create a new issue with detailed information
3. Contact the maintainers

---

<div align="center">
  <p>Made with ❤️ by Chaamth Dilshan</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
