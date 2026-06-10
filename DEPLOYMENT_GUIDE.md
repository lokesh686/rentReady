# Deployment Guide - RentReady Immersive Landing Page

This guide covers deploying the RentReady immersive 3D landing page to various platforms.

## Prerequisites

- Node.js 18+ installed
- pnpm package manager installed
- Git configured with your credentials
- Account on your chosen deployment platform

## Local Development

### Setup

```bash
cd rentReady
pnpm install
pnpm dev
```

The development server runs at `http://localhost:5173`

### Build

```bash
pnpm build
```

This creates optimized production builds in the `dist/` directory.

## Deployment Platforms

### Vercel (Recommended)

Vercel is the fastest way to deploy with automatic deployments on git push.

#### Setup

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Authorize Vercel to access your repos

2. **Configure Project**
   - Framework: Vite
   - Root Directory: `.`
   - Build Command: `pnpm build`
   - Output Directory: `dist/public`

3. **Environment Variables**
   - Add any required environment variables in Vercel dashboard
   - No additional setup needed for this project

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically deploys on every push to main

#### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel

### Netlify

#### Setup

1. **Connect GitHub**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select GitHub and authorize
   - Choose your repository

2. **Configure Build**
   - Build Command: `pnpm build`
   - Publish Directory: `dist/public`
   - Node Version: 18 (or higher)

3. **Deploy**
   - Netlify automatically deploys on git push

#### Custom Domain

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

### AWS S3 + CloudFront

For more control and scalability.

#### Setup

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://rentready-landing --region us-east-1
   ```

2. **Build Project**
   ```bash
   pnpm build
   ```

3. **Upload to S3**
   ```bash
   aws s3 sync dist/public s3://rentready-landing --delete
   ```

4. **Create CloudFront Distribution**
   - Origin: Your S3 bucket
   - Default Root Object: `index.html`
   - Error Pages: Route 404 to `index.html`

5. **Update DNS**
   - Point your domain to CloudFront distribution

#### Automated Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS S3

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: 'us-east-1'
          SOURCE_DIR: 'dist/public'
```

### Docker Deployment

#### Create Dockerfile

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist/public ./dist/public

EXPOSE 3000

CMD ["serve", "-s", "dist/public", "-l", "3000"]
```

#### Build and Run

```bash
# Build image
docker build -t rentready:latest .

# Run container
docker run -p 3000:3000 rentready:latest

# Push to Docker Hub
docker tag rentready:latest your-username/rentready:latest
docker push your-username/rentready:latest
```

#### Docker Compose

```yaml
version: '3.8'

services:
  rentready:
    image: your-username/rentready:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Run with: `docker-compose up -d`

### Traditional Server (Ubuntu/Debian)

#### Setup

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm install -g pnpm
   ```

2. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/your-username/rentReady.git
   cd rentReady
   ```

3. **Install Dependencies**
   ```bash
   pnpm install --prod
   ```

4. **Build**
   ```bash
   pnpm build
   ```

5. **Setup Nginx**
   ```bash
   sudo apt-get install nginx
   ```

   Create `/etc/nginx/sites-available/rentready`:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           root /var/www/rentReady/dist/public;
           try_files $uri $uri/ /index.html;
       }

       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           root /var/www/rentReady/dist/public;
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

6. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/rentready /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **SSL Certificate (Let's Encrypt)**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

#### Auto-Deploy with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Server

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          source: "dist/public"
          target: "/var/www/rentReady"
      - uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/rentReady
            sudo systemctl restart nginx
```

## Performance Optimization

### Enable Gzip Compression

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json;
gzip_min_length 1000;
```

### Enable Caching

**Nginx:**
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### CDN Integration

Use Cloudflare for free CDN:
1. Add your domain to Cloudflare
2. Update nameservers
3. Enable caching rules

## Monitoring

### Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com) - Free tier available
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

### Error Tracking

Integrate Sentry:

```bash
pnpm add @sentry/react @sentry/tracing
```

Initialize in `main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### Analytics

The project includes Umami analytics support. Configure in `client/index.html`:

```html
<script async src="https://your-analytics.com/script.js" 
        data-website-id="your-website-id"></script>
```

## Troubleshooting

### Build Fails

1. Clear cache: `rm -rf node_modules pnpm-lock.yaml`
2. Reinstall: `pnpm install`
3. Check Node version: `node --version` (should be 18+)

### Deployment Fails

1. Check build logs in deployment platform
2. Verify environment variables are set
3. Ensure all dependencies are installed

### Performance Issues

1. Check bundle size: `pnpm build` output
2. Enable gzip compression
3. Use CDN for static assets
4. Optimize images

### 3D Scene Not Rendering

1. Check browser WebGL support
2. Verify Three.js is loaded
3. Check browser console for errors
4. Test on different browser

## Security

### Environment Variables

Never commit sensitive data. Use `.env.local`:

```
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=your-id
```

### Headers

Add security headers in Nginx:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### HTTPS

Always use HTTPS in production. Use Let's Encrypt for free certificates.

## Rollback

### Vercel
- Go to Deployments
- Click on previous deployment
- Click "Redeploy"

### Manual
```bash
git revert HEAD
git push
```

## Support

For deployment issues:
- Check platform documentation
- Review error logs
- Open GitHub issue
- Contact support team

---

**Happy Deploying! 🚀**
