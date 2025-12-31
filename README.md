# MoodyMe Admin Dashboard

A professional admin dashboard for managing the MoodyMe mobile application. Built with Next.js 15, TypeScript, Prisma, and Tailwind CSS.

## Features

### 🎨 Beautiful UI/UX
- Modern, clean interface inspired by professional dashboards
- Fully responsive design (mobile, tablet, desktop)
- Dark mode support with smooth transitions
- Custom color scheme easily configurable via CSS variables

### 🔐 Authentication System
- User registration (signup)
- Secure login with JWT tokens
- Password reset via email with one-time tokens
- Role-based access control (USER/ADMIN)

### 👥 User Management
- View all registered users
- Search and filter users
- Activate/deactivate user accounts
- Edit user details
- Delete users
- Pagination support

### 📄 Content Management
- Manage About Us, Help & Support, and Privacy Policy pages
- Rich text content editing
- Toggle content visibility
- Dynamic content updates

### 🎯 Banner Management
- Create promotional banners for the mobile app
- Upload banner images
- Set banner order and links
- Enable/disable banners dynamically

### 📊 Dashboard Analytics
- Total users count
- Active/inactive users
- Banner statistics
- Recent user registrations
- Content page count

### 🌓 Dark/Light Mode
- System preference detection
- Manual toggle
- Persistent theme preference
- Smooth color transitions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or MySQL/SQLite)
- Resend account for email (optional, for password reset)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Setup environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: Your database connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `RESEND_API_KEY`: Your Resend API key (for emails)

3. **Initialize database:**
```bash
npx prisma generate
npx prisma db push
```

4. **Run development server:**
```bash
npm run dev
```

5. **Open your browser:**
```
http://localhost:3000/admin
```

## Color Customization

All colors are defined as CSS variables in `app/globals.css`. You can easily customize the theme by updating the `oklch` values.

## API Documentation

Complete API documentation is available in [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

Built with ❤️ for MoodyMe
