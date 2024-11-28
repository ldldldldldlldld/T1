# Используем официальный образ Python
FROM python:3.12-slim

# Устанавливаем необходимые системные зависимости
RUN apt-get update && apt-get install -y \
    build-essential \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем Poetry
RUN pip install poetry

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы проекта
COPY pyproject.toml poetry.lock* ./

# Устанавливаем зависимости проекта
RUN poetry install --no-root --only main


# Копируем остальной код проекта
COPY . .

# Открываем порт для Django
EXPOSE 8000

# Команда для запуска сервера Django
CMD ["poetry", "run", "python", "myproject/manage.py", "runserver", "0.0.0.0:8000"]

