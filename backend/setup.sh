#!/bin/bash
set -e

echo "=== BAZAGOD HMS Backend Setup ==="
echo ""

# Check PHP and Composer
php -v > /dev/null 2>&1 || { echo "PHP is required. Install PHP 8.2+"; exit 1; }
composer -V > /dev/null 2>&1 || { echo "Composer is required."; exit 1; }

# Install dependencies
echo "Installing Composer dependencies..."
composer install --no-interaction

# Copy .env if needed
if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate
    echo "Created .env — update database credentials before continuing."
    echo ""
fi

# Check DB connection
echo "Testing database connection..."
php artisan db:show > /dev/null 2>&1 || {
    echo ""
    echo "DATABASE CONNECTION FAILED."
    echo "Please update .env with valid MySQL credentials:"
    echo ""
    echo "  DB_CONNECTION=mysql"
    echo "  DB_HOST=127.0.0.1"
    echo "  DB_PORT=3306"
    echo "  DB_DATABASE=bazagod_hms"
    echo "  DB_USERNAME=your_user"
    echo "  DB_PASSWORD=your_password"
    echo ""
    echo "Then create the database:"
    echo "  mysql -u root -e 'CREATE DATABASE bazagod_hms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'"
    echo ""
    echo "And re-run: php artisan migrate --seed"
    exit 1
}

# Run migrations and seed
echo "Running migrations..."
php artisan migrate --force

echo "Seeding database..."
php artisan db:seed --force

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Start the API server:"
echo "  php artisan serve"
echo ""
echo "Default credentials:"
echo "  Email: admin@bazagod.bi"
echo "  Password: password"
echo ""
echo "API available at: http://localhost:8000/api/v1"
