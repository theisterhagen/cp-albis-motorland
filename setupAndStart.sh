# #!/bin/sh
npx prisma migrate deploy && npm run docker-start

# echo "Current directory:"
# pwd
# echo "Listing directory contents:"
# ls -la

# echo "Listing /app directory contents:"
# ls -la /app

# echo "Listing /app/cronJobs directory contents (if exists):"
# ls -la /app/cronJobs
# Run Prisma migrations
# npx prisma migrate deploy

# Start the background cron jo  b
# node app/cronJobs.js &

# Start the Docker application
# npm run docker-start