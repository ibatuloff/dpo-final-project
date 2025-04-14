# Используем официальный образ Node.js
FROM node:18-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Собираем приложение
RUN npm run build

# --- Продакшн-сервер ---
FROM nginx:alpine

# Копируем собранные файлы из предыдущего этапа
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг nginx (если нужно)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
