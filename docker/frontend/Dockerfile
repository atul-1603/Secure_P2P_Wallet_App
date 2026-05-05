FROM node:20-alpine AS builder

WORKDIR /workspace/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

FROM nginx:alpine

# Set a default port for local development (Cloud Run will override this)
ENV PORT=8080

# COPY it into the templates directory so Nginx automatically replaces ${PORT}
COPY docker/frontend/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /workspace/frontend/dist /usr/share/nginx/html

EXPOSE 8080

# Update the healthcheck to look at the new dynamic port
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:${PORT}/ || exit 1
