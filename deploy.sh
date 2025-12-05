#!/bin/bash

echo "🚀 Platonus Deployment Script"
echo "================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it:"
    echo "npm i -g vercel"
    exit 1
fi

# Check if git is clean
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Commit them first:"
    echo "git add ."
    echo "git commit -m 'Your message'"
    exit 1
fi

read -p "Enter API project name (e.g., platonus-api): " API_PROJECT
read -p "Enter Frontend project name (e.g., platonus-web): " FRONTEND_PROJECT

echo ""
echo "📦 Building frontend..."
npm run build

echo ""
echo "🔄 Deploying backend to Vercel..."
cd apps/api
vercel --prod --name $API_PROJECT
API_URL=$(vercel ls --json | jq -r '.[0].url')
cd ../..

echo ""
echo "✅ Backend deployed at: $API_URL"
echo ""
echo "🔄 Setting frontend environment variables..."
vercel env add VITE_API_URL "https://$API_PROJECT.vercel.app" --prod --project $FRONTEND_PROJECT

echo ""
echo "🔄 Deploying frontend to Vercel..."
vercel --prod --name $FRONTEND_PROJECT

echo ""
echo "✅ Deployment complete!"
echo "Frontend: https://$FRONTEND_PROJECT.vercel.app"
echo "API: https://$API_PROJECT.vercel.app"
