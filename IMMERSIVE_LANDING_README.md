# RentReady - Immersive 3D Landing Page

A production-ready, fully interactive 3D website built with cutting-edge web technologies. This landing page features immersive animations, advanced 3D scenes, and a seamless user experience.

## 🎨 Features

### 3D & Graphics
- **React Three Fiber (R3F)** - Advanced 3D rendering with WebGL
- **Custom GLSL Shaders** - Iridescent distortion effects on 3D meshes
- **Particle System** - 5,000+ interactive particles with scroll-driven animations
- **Torus Rings** - Dynamic 3D geometry with real-time transformations
- **Environment Lighting** - HDRI-based procedural lighting with point lights

### Animations & Interactions
- **GSAP + ScrollTrigger** - Cinematic scroll-driven animations with 1.5s scrub
- **Framer Motion** - Smooth UI micro-interactions and page transitions
- **Lenis Scroll** - Buttery smooth scrolling experience
- **Custom Cursor** - Magnetic cursor with trailing gradient blob
- **VanillaTilt** - 3D perspective tilt on cards and interactive elements

### UI/UX Components
- **Animated Navbar** - Frosted glass effect with scroll morphing
- **Loading Screen** - Animated logo reveal with progress bar
- **3D Cards** - Interactive cards with shine effects and hover animations
- **Carousel** - 3D rotating testimonials with auto-play
- **Animated Counters** - Scroll-triggered number animations
- **Mesh Gradients** - Canvas-based gradient backgrounds with grain texture
- **Scroll Progress** - Visual progress indicator at top of page
- **Floating Action Button** - Smooth scroll-to-top button

### Sections
1. **Hero** - Full-viewport 3D scene with animated headline
2. **Features** - 6 feature cards with hover animations
3. **How It Works** - 3-step process with animated icons
4. **Projects/Solutions** - 3D card grid with VanillaTilt
5. **Stats** - Animated counters with scroll triggers
6. **Testimonials** - 3D carousel with smooth transitions
7. **Pricing** - Feature comparison with CTA buttons
8. **Contact** - Email signup with confetti animation
9. **Footer** - Social links with spring animations

## 🚀 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **GSAP** - Animation library
- **Framer Motion** - React animation library
- **Lenis** - Smooth scroll library
- **Tailwind CSS** - Utility-first CSS framework
- **Canvas Confetti** - Confetti animation
- **VanillaTilt** - 3D tilt effect

### Development
- **TypeScript 5.9** - Latest TypeScript
- **Tailwind CSS 4.1** - Latest Tailwind
- **Vite 7.1** - Fast build tool
- **PostCSS** - CSS processing

## 📦 Installation

### Prerequisites
- Node.js 18+ (tested with 22.13.0)
- pnpm 10+ (package manager)

### Setup

```bash
# Navigate to project directory
cd rentReady

# Install dependencies (already done if running after initial setup)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The development server will start at `http://localhost:5173`

## 🎯 Key Components

### 3D Scene (`AdvancedScene.tsx`)
- Advanced shader materials with time-based animations
- 5,000+ particle system with color variation
- Scroll-responsive distortion effects
- Multiple point lights with different colors

### Custom Cursor (`CustomCursor.tsx`)
- Smooth lerp-based following
- Gradient blob effect with blur
- Magnetic interaction ready

### Smooth Scroll (`SmoothScroll.tsx`)
- Lenis integration for smooth scrolling
- Customizable easing and duration
- Gesture support

### Loading Screen (`LoadingScreen.tsx`)
- Animated logo reveal
- Progress bar with smooth animation
- Animated background elements

### Navbar (`Navbar.tsx`)
- Scroll-responsive styling
- Animated hamburger menu
- Frosted glass effect
- Mobile-responsive

### 3D Cards (`Card3D.tsx`)
- VanillaTilt 3D perspective
- Shine effect on hover
- Icon scaling animation
- Gradient backgrounds

### Carousel (`Carousel3D.tsx`)
- 3D rotation transitions
- Auto-play with pause on interaction
- Indicator dots with smooth animation

### Animated Counters (`AnimatedCounter.tsx`)
- Scroll-triggered animations
- Smooth number transitions
- Customizable duration and formatting

## 🎬 Animation Details

### Scroll Animations
- **Scrub Time**: 1.5 seconds for cinematic pacing
- **Easing**: Custom easing function for smooth motion
- **Parallax**: 3-depth level parallax on sections

### Shader Effects
- **Iridescent Material**: RGB color variation based on UV coordinates and time
- **Wave Distortion**: Sine wave deformation on geometry
- **Scroll Integration**: Distortion responds to scroll progress

### Particle System
- **Count**: 5,000 particles for visual richness
- **Movement**: Velocity-based physics simulation
- **Wrapping**: Particles wrap around scene bounds
- **Colors**: Rainbow color variation per particle

## 📱 Responsive Design

- **Mobile First**: Optimized for all screen sizes
- **Touch Friendly**: Larger touch targets on mobile
- **Performance**: Canvas suspension on low-power devices
- **Adaptive**: Navbar hamburger menu on mobile

## ⚡ Performance Optimizations

- **Lazy Loading**: 3D assets load on demand
- **Debounced Events**: Mouse move handlers debounced
- **RAF Loops**: Proper requestAnimationFrame usage
- **Instanced Meshes**: Repeated geometry uses instancing
- **Code Splitting**: Route-based code splitting via Vite

## 🎨 Color Scheme

- **Primary Accent**: Violet (#a78bfa)
- **Secondary Accent**: Cyan (#06b6d4)
- **Tertiary Accent**: Pink (#ec4899)
- **Background**: Slate-900 (#0f172a)
- **Text**: White with slate-300/400 for secondary

## 🔧 Customization

### Change Accent Colors
Edit the gradient colors in:
- `EnhancedLanding.tsx` - Main landing page
- `Navbar.tsx` - Navigation bar
- `CustomCursor.tsx` - Cursor styling
- `MeshGradient.tsx` - Background gradient

### Adjust Animation Timings
- GSAP animations: Search for `duration` and `delay` in component files
- Framer Motion: Look for `transition` props
- Scroll triggers: Modify `scrub` value in `EnhancedLanding.tsx`

### Modify 3D Scene
- Shader materials: Edit vertex/fragment shaders in `AdvancedScene.tsx`
- Particle count: Change `particleCount` variable
- Lighting: Adjust `pointLight` intensity and position

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy via Vercel
# Connect your GitHub repo to Vercel dashboard
```

### Docker
```bash
# Build image
docker build -t rentready .

# Run container
docker run -p 3000:3000 rentready
```

### Manual Deployment
```bash
# Build for production
pnpm build

# Upload dist/public to your server
# Configure server to serve index.html for all routes
```

## 📊 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## 🐛 Troubleshooting

### 3D Scene Not Rendering
- Check browser WebGL support
- Verify Three.js is installed: `pnpm list three`
- Check browser console for errors

### Animations Stuttering
- Reduce particle count in `AdvancedScene.tsx`
- Disable smooth scroll on low-end devices
- Check for CPU-intensive operations

### Cursor Not Visible
- Ensure `CustomCursor.tsx` is imported in `App.tsx`
- Check z-index values (should be 9999)
- Verify CSS `cursor-none` class is applied

### Scroll Issues
- Clear browser cache
- Check Lenis initialization in `SmoothScroll.tsx`
- Verify ScrollTrigger is registered with GSAP

## 📚 Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [GSAP Documentation](https://gsap.com/docs/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation above

---

**Built with ❤️ for RentReady**

*An immersive, production-ready landing page that wins awards.*
