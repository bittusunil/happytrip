# Deployment Guide for HappyTrip

This guide covers deployment of HappyTrip to various platforms and environments.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] Linting passes without errors
- [ ] No console errors or warnings
- [ ] Code reviewed and approved
- [ ] Dependencies updated and audited

### Security
- [ ] Environment variables configured
- [ ] API keys secured
- [ ] CORS properly configured
- [ ] HTTPS enabled
- [ ] Database credentials secured
- [ ] JWT secrets strong and unique

### Performance
- [ ] Frontend optimized (images, bundles)
- [ ] Backend optimized (queries, caching)
- [ ] Database indexes created
- [ ] CDN configured (if applicable)
- [ ] Caching strategies implemented

### Documentation
- [ ] README updated
- [ ] API documentation current
- [ ] Deployment steps documented
- [ ] Known issues documented
- [ ] Rollback procedure documented

## Backend Deployment

### Option 1: Heroku

#### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository initialized

#### Steps

1. **Create Heroku App**
```bash
heroku create happytrip-backend
```

2. **Add PostgreSQL Add-on**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. **Add MongoDB Add-on**
```bash
heroku addons:create mongolab:sandbox
```

4. **Configure Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MAIL_HOST=smtp.gmail.com
heroku config:set MAIL_USER=your_email@gmail.com
heroku config:set MAIL_PASSWORD=your_app_password
```

5. **Deploy**
```bash
git push heroku main
```

6. **Run Migrations**
```bash
heroku run npm run migration:run
```

### Option 2: Railway

#### Prerequisites
- Railway account
- Railway CLI installed
- Git repository initialized

#### Steps

1. **Connect Repository**
```bash
railway link
```

2. **Add Services**
```bash
# PostgreSQL
railway add postgres

# MongoDB
railway add mongodb
```

3. **Configure Environment**
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_secret_key
```

4. **Deploy**
```bash
railway up
```

### Option 3: Docker Deployment

#### Prerequisites
- Docker installed
- Docker Hub account
- Docker Compose installed

#### Steps

1. **Build Docker Image**
```bash
cd backend
docker build -t happytrip-backend:latest .
```

2. **Push to Docker Hub**
```bash
docker tag happytrip-backend:latest yourusername/happytrip-backend:latest
docker push yourusername/happytrip-backend:latest
```

3. **Deploy with Docker Compose**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 4: AWS EC2

#### Prerequisites
- AWS account
- EC2 instance running Ubuntu 20.04+
- SSH access to instance

#### Steps

1. **SSH into Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

2. **Install Dependencies**
```bash
sudo apt update
sudo apt install nodejs npm postgresql mongodb
```

3. **Clone Repository**
```bash
git clone https://github.com/yourusername/happytrip.git
cd happytrip/backend
```

4. **Install & Build**
```bash
npm install
npm run build
```

5. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with production values
nano .env
```

6. **Start Application**
```bash
npm run start:prod
```

7. **Setup PM2 for Process Management**
```bash
npm install -g pm2
pm2 start dist/main.js --name "happytrip-backend"
pm2 startup
pm2 save
```

## Frontend Deployment

### Option 1: Vercel

#### Prerequisites
- Vercel account
- GitHub repository connected

#### Steps

1. **Connect Repository**
   - Visit vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Select "happytrip/frontend" as root directory

2. **Configure Environment Variables**
   - Add `NEXT_PUBLIC_API_URL` pointing to backend
   - Add other required variables

3. **Deploy**
   - Vercel automatically deploys on git push
   - View deployment at provided URL

### Option 2: Netlify

#### Prerequisites
- Netlify account
- GitHub repository connected

#### Steps

1. **Connect Repository**
   - Visit netlify.com
   - Click "New site from Git"
   - Select your GitHub repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Root directory: `frontend`

3. **Add Environment Variables**
   - NEXT_PUBLIC_API_URL

4. **Deploy**
   - Netlify automatically deploys on git push

### Option 3: AWS S3 + CloudFront

#### Prerequisites
- AWS account
- AWS CLI configured

#### Steps

1. **Build Frontend**
```bash
cd frontend
npm run build
npm run export
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://happytrip-frontend
```

3. **Upload Build**
```bash
aws s3 sync out/ s3://happytrip-frontend --delete
```

4. **Setup CloudFront**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure SSL certificate

### Option 4: Docker Deployment

#### Prerequisites
- Docker installed
- Docker Hub account

#### Steps

1. **Build Docker Image**
```bash
cd frontend
docker build -t happytrip-frontend:latest .
```

2. **Push to Docker Hub**
```bash
docker tag happytrip-frontend:latest yourusername/happytrip-frontend:latest
docker push yourusername/happytrip-frontend:latest
```

3. **Deploy**
```bash
docker run -p 3000:3000 happytrip-frontend:latest
```

### Option 5: Traditional VPS

#### Prerequisites
- VPS with Ubuntu 20.04+
- Node.js installed
- Nginx installed

#### Steps

1. **SSH into VPS**
```bash
ssh root@your-vps-ip
```

2. **Install Dependencies**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs nginx
```

3. **Clone Repository**
```bash
cd /var/www
git clone https://github.com/yourusername/happytrip.git
cd happytrip/frontend
```

4. **Install & Build**
```bash
npm install
npm run build
```

5. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Start Application**
```bash
npm run start &
```

## Database Setup

### PostgreSQL

#### Heroku
```bash
# Automatically set up with add-on
# Connection string in DATABASE_URL
```

#### AWS RDS
```bash
# Create RDS instance
# Configure security groups
# Update connection string in .env
```

#### Self-Hosted
```bash
# Create database
createdb happytrip_db

# Create user
createuser happytrip_user

# Grant privileges
psql -c "ALTER USER happytrip_user WITH PASSWORD 'password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE happytrip_db TO happytrip_user;"

# Run migrations
npm run migration:run
```

### MongoDB

#### MongoDB Atlas
1. Create cluster at mongodb.com
2. Create database user
3. Whitelist IP addresses
4. Get connection string
5. Update MONGODB_URI in .env

#### Self-Hosted
```bash
# Start MongoDB
mongod

# Create database
mongo
> use happytrip_db

# Create user
> db.createUser({
    user: "happytrip_user",
    pwd: "password",
    roles: ["dbOwner"]
  })
```

## Environment Configuration

### Backend Production (.env)

```env
NODE_ENV=production
PORT=3001
APP_NAME=HappyTrip

# Database
DATABASE_HOST=your-postgres-host
DATABASE_PORT=5432
DATABASE_USER=happytrip_user
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=happytrip_db

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/happytrip_db

# JWT
JWT_SECRET=your_very_secure_secret_key_min_32_chars
JWT_EXPIRATION=24h

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=noreply@happytrip.com

# API
API_URL=https://api.happytrip.com
FRONTEND_URL=https://happytrip.com

# Logging
LOG_LEVEL=info
```

### Frontend Production (.env.production)

```env
NEXT_PUBLIC_API_URL=https://api.happytrip.com
NEXT_PUBLIC_APP_NAME=HappyTrip
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_SUPPORTED_CURRENCIES=EUR,GBP,USD,CHF,SEK,NOK,DKK,CZK,PLN,HUF,RON
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,de,fr,es,it,pt,nl,pl,cs,hu,ro,sv,no,da
NEXT_PUBLIC_DEFAULT_CURRENCY=EUR
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

## SSL/TLS Certificate

### Let's Encrypt (Free)

```bash
# Using Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

### AWS Certificate Manager

1. Request certificate in ACM
2. Validate domain
3. Attach to load balancer

## Monitoring & Maintenance

### Backend Monitoring

#### PM2 Monitoring
```bash
pm2 monit
pm2 logs
```

#### Application Logging
```bash
# View logs
tail -f logs/app.log

# Rotate logs
logrotate /etc/logrotate.d/happytrip
```

#### Health Checks
```bash
# Create health check endpoint
GET /health

# Monitor with uptime robot
# Configure alerts for downtime
```

### Database Backups

#### PostgreSQL
```bash
# Daily backup
0 2 * * * pg_dump happytrip_db > /backups/happytrip_$(date +\%Y\%m\%d).sql

# Restore
psql happytrip_db < /backups/happytrip_20240115.sql
```

#### MongoDB
```bash
# Daily backup
0 2 * * * mongodump --db happytrip_db --out /backups/happytrip_$(date +\%Y\%m\%d)

# Restore
mongorestore /backups/happytrip_20240115/happytrip_db
```

### Performance Monitoring

- **New Relic**: Application performance monitoring
- **DataDog**: Infrastructure monitoring
- **Sentry**: Error tracking
- **LogRocket**: Frontend monitoring

## Scaling

### Horizontal Scaling

#### Load Balancing
```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

#### Database Replication
- PostgreSQL streaming replication
- MongoDB replica sets

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement caching (Redis)

## Rollback Procedure

### Backend Rollback
```bash
# Revert to previous version
git revert <commit-hash>
git push

# Or deploy previous version
heroku releases
heroku rollback v123
```

### Frontend Rollback
```bash
# Vercel automatic rollback
# Or redeploy previous version
git revert <commit-hash>
git push
```

## Troubleshooting

### Backend Issues

**Application won't start**
```bash
# Check logs
pm2 logs happytrip-backend

# Check port
lsof -i :3001

# Check environment variables
env | grep DATABASE
```

**Database connection error**
```bash
# Test connection
psql -h host -U user -d database

# Check credentials
cat .env | grep DATABASE
```

**Out of memory**
```bash
# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=2048 npm start

# Check memory usage
free -h
```

### Frontend Issues

**Build fails**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**API connection error**
```bash
# Check API URL
echo $NEXT_PUBLIC_API_URL

# Test connection
curl $NEXT_PUBLIC_API_URL/health
```

**Slow performance**
```bash
# Analyze bundle
npm run analyze

# Check network tab in DevTools
# Optimize images
```

## Maintenance

### Regular Tasks

- [ ] Monitor disk space
- [ ] Update dependencies
- [ ] Review logs
- [ ] Test backups
- [ ] Update SSL certificates
- [ ] Security patches
- [ ] Performance optimization

### Monthly

- [ ] Database optimization
- [ ] Backup verification
- [ ] Security audit
- [ ] Performance review

### Quarterly

- [ ] Dependency updates
- [ ] Security assessment
- [ ] Capacity planning
- [ ] Disaster recovery test

## References

- [Heroku Deployment](https://devcenter.heroku.com/)
- [Vercel Deployment](https://vercel.com/docs)
- [AWS Deployment](https://aws.amazon.com/getting-started/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Status**: Deployment Guide Complete
**Last Updated**: January 2024
