# Smart Student Hub 🎓

A comprehensive full-stack platform for Higher Education Institutions (HEIs) that enables students to upload, manage, and showcase their academic and extracurricular achievements in a verified and structured way.

## 🌟 Features

### Authentication & User Management
- **Multi-role system**: Student, Faculty, and Admin roles
- **Secure JWT-based authentication** with password hashing
- **Role-based access control** with different permissions

### Student Dashboard
- **Activity tracking** with semester-wise organization
- **Credit system** for different activity types
- **Real-time progress monitoring**
- **Comprehensive analytics** with interactive charts

### Activity Management
- **Document upload** for certificates and proofs
- **Category-based organization**: Academic, Extracurricular, Internships, Workshops, Volunteering, Certificates
- **Credit assignment** per activity type
- **Status tracking**: Pending, Approved, Rejected

### Faculty/Admin Panel
- **Review system** for submitted activities
- **Approval workflow** with optional comments
- **Bulk review capabilities**
- **Activity oversight** across all students

### Portfolio Generation
- **Auto-generated PDF portfolios** with professional formatting
- **QR code integration** for easy sharing and verification
- **Downloadable certificates** and activity summaries
- **Mobile-responsive design**

### Notifications & Analytics
- **Email notifications** for status updates (ready for SendGrid integration)
- **Interactive analytics dashboard** with charts and insights
- **Activity trends** and progress tracking
- **Semester-wise reporting**

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **UI Components**: Lucide React icons + Framer Motion animations
- **Charts**: Recharts for data visualization
- **PDF Generation**: jsPDF for portfolio creation
- **QR Codes**: qrcode library for sharing
- **State Management**: React Context + Local Storage
- **Notifications**: React Hot Toast

## 📦 Installation & Setup

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Access the application**:
   - Open your browser to `http://localhost:5173`

## 🔐 Demo Accounts

Use these pre-configured accounts to explore different roles:

| Role | Email | Password |
|------|-------|----------|
| Student | `student@demo.com` | `password` |
| Faculty | `faculty@demo.com` | `password` |
| Admin | `admin@demo.com` | `password` |

## 🎯 User Journeys

### Student Flow
1. **Register/Login** with student credentials
2. **Submit activities** with documents and descriptions
3. **Track approval status** and earn credits
4. **Generate portfolio** with QR code for sharing
5. **View analytics** and progress over time

### Faculty/Admin Flow
1. **Login** with elevated privileges
2. **Review submitted activities** from students
3. **Approve or reject** with detailed comments
4. **Monitor platform** activity and statistics
5. **Generate reports** and insights

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication forms
│   ├── activities/     # Activity management
│   ├── dashboard/      # Dashboard widgets
│   ├── portfolio/      # Portfolio generation
│   ├── analytics/      # Charts and reports
│   └── admin/          # Admin/Faculty tools
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
├── utils/              # Helper functions
└── pages/              # Main page components
```

### Key Features Implementation

**Authentication System**:
- JWT-based authentication with secure storage
- Role-based route protection
- Password hashing and validation

**Activity Management**:
- File upload simulation with preview
- Multi-step approval workflow
- Credit calculation and tracking

**Portfolio Generation**:
- Dynamic PDF creation with student data
- QR code generation for easy sharing
- Professional formatting and layout

**Analytics Dashboard**:
- Real-time data visualization
- Interactive charts and graphs
- Semester-wise progress tracking

## 🔧 Configuration

### Environment Variables (Production Ready)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SENDGRID_API_KEY=your_sendgrid_api_key
```

### Database Schema (Ready for Supabase)
The application is structured to easily integrate with Supabase:
- User authentication with RLS policies
- Activity submissions with approval workflow
- File storage for documents and certificates
- Real-time notifications and updates

## 📱 Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Responsive breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- **Touch-friendly interactions** and optimized layouts
- **Progressive Web App** capabilities

## 🎨 Design System

- **Color Palette**: Primary Blue (#3B82F6), Secondary Purple (#8B5CF6), Success Green (#10B981)
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable, accessible UI components
- **Animations**: Smooth transitions with Framer Motion

## 🚀 Deployment

### Quick Deploy Options
1. **Netlify**: Connect your repo for automatic deployments
2. **Vercel**: Zero-config deployment with GitHub integration
3. **Railway**: Full-stack deployment with database

### Production Optimizations
- Code splitting and lazy loading
- Image optimization and compression
- Bundle analysis and tree shaking
- Performance monitoring ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review demo accounts and examples

---

**Smart Student Hub** - Empowering students to showcase their achievements with verified, professional portfolios! 🎓✨