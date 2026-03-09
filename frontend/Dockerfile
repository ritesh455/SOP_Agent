FROM node:20-alpine AS build
WORKDIR /app

# Copy only the package files first
COPY package*.json ./

# This runs INSIDE the Linux container, so it downloads Linux libraries
RUN npm install --include=optional

# Now copy your code, but NOT your local node_modules
COPY . .

# Vite will now find the Linux 'wrench' it needs to build
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy your custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]