# FurnitureLab - 3D Furniture E-commerce

A modern e-commerce platform for furniture shopping with interactive 3D visualization capabilities. Built with React.js, Vite, Tailwind CSS, and React Three Fiber.

## Features

- Interactive 3D model viewing of furniture products
- Virtual room visualization with customizable wall colors and floor textures
- Product browsing by categories
- Shopping cart and favorites management
- User authentication (demo)
- Admin dashboard for product management
- Responsive design for all devices
- Modern UI with animations

## Demo Accounts

- Admin User:

  - Email: admin@example.com
  - Password: admin

- Regular User:
  - Email: user@example.com
  - Password: user

## Technologies Used

- React.js
- Vite
- Tailwind CSS
- React Three Fiber (R3F)
- React Router DOM
- Framer Motion
- Heroicons
- Context API for state management

## Prerequisites

- Node.js 14.0 or later
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/furniture-lab.git
   cd furniture-lab
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── layout/
│   ├── ui/
│   └── 3d/
├── pages/
│   ├── admin/
│   ├── auth/
│   └── user/
├── context/
├── data/
├── utils/
└── assets/
    ├── models/
    └── images/
```

## Development

- The project uses Vite for fast development and building
- Tailwind CSS for styling
- React Three Fiber for 3D model rendering
- Context API for state management
- React Router for navigation

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- 3D models sourced from [source]
- Icons from Heroicons
- UI inspiration from various modern e-commerce platforms
