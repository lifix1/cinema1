-- ============================================================================
-- Миграция инициализации базы данных «Lumière Cinema» (PostgreSQL)
-- Файл: prisma/migrations/0_init/migration.sql
-- ============================================================================

-- 1. Создание перечислений (ENUM)
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN', 'MANAGER', 'CASHIER');
CREATE TYPE "SeatType" AS ENUM ('STANDARD', 'VIP', 'ACCESSIBLE');
CREATE TYPE "SessionType" AS ENUM ('FORMAT_2D', 'FORMAT_3D', 'FORMAT_IMAX');
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'OPEN', 'CLOSED', 'CANCELLED');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');

-- 2. Таблица пользователей (users)
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- 3. Таблица фильмов (movies)
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "tmdb_id" INTEGER,
    "title" TEXT NOT NULL,
    "original_title" TEXT,
    "description" TEXT,
    "duration_minutes" INTEGER NOT NULL,
    "release_year" INTEGER NOT NULL,
    "poster_url" TEXT,
    "backdrop_url" TEXT,
    "age_rating" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- 4. Таблица жанров (genres)
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- 5. Промежуточная таблица связей фильмов и жанров (movie_genres)
CREATE TABLE "movie_genres" (
    "movie_id" TEXT NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "movie_genres_pkey" PRIMARY KEY ("movie_id","genre_id")
);

-- 6. Таблица кинозалов (halls)
CREATE TABLE "halls" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "total_seats" INTEGER NOT NULL,
    "screen_type" TEXT NOT NULL DEFAULT 'Standard',
    "sound_system" TEXT NOT NULL DEFAULT 'Dolby Digital',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "halls_pkey" PRIMARY KEY ("id")
);

-- 7. Таблица кресел (seats)
CREATE TABLE "seats" (
    "id" TEXT NOT NULL,
    "hall_id" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "seat_type" "SeatType" NOT NULL DEFAULT 'STANDARD',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- 8. Таблица сеансов (sessions)
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "hall_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "session_type" "SessionType" NOT NULL DEFAULT 'FORMAT_2D',
    "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- 9. Таблица заказов / бронирований (bookings)
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "booking_code" TEXT NOT NULL,
    "user_id" TEXT,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- 10. Таблица забронированных мест (booking_seats)
CREATE TABLE "booking_seats" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "booking_seats_pkey" PRIMARY KEY ("id")
);

-- 11. Таблица отзывов зрителей (reviews)
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- -------------------------------------------------------------
-- Уникальные индексы и ограничения (Unique Constraints)
-- -------------------------------------------------------------

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "movies_tmdb_id_key" ON "movies"("tmdb_id");
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");
CREATE UNIQUE INDEX "genres_slug_key" ON "genres"("slug");
CREATE UNIQUE INDEX "halls_name_key" ON "halls"("name");
CREATE UNIQUE INDEX "seats_hall_id_row_number_key" ON "seats"("hall_id", "row", "number");
CREATE UNIQUE INDEX "bookings_booking_code_key" ON "bookings"("booking_code");
-- Ключевое ограничение: запрет одновременной продажи одного места на один сеанс
CREATE UNIQUE INDEX "booking_seats_session_id_seat_id_key" ON "booking_seats"("session_id", "seat_id");
CREATE UNIQUE INDEX "reviews_movie_id_user_id_key" ON "reviews"("movie_id", "user_id");

-- -------------------------------------------------------------
-- Индексы для оптимизации выборок (Performance Indexes)
-- -------------------------------------------------------------

CREATE INDEX "sessions_movie_id_idx" ON "sessions"("movie_id");
CREATE INDEX "sessions_hall_id_idx" ON "sessions"("hall_id");
CREATE INDEX "sessions_start_time_idx" ON "sessions"("start_time");
CREATE INDEX "bookings_session_id_idx" ON "bookings"("session_id");
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");
CREATE INDEX "booking_seats_booking_id_idx" ON "booking_seats"("booking_id");

-- -------------------------------------------------------------
-- Внешние ключи (Foreign Keys)
-- -------------------------------------------------------------

ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "seats" ADD CONSTRAINT "seats_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "booking_seats" ADD CONSTRAINT "booking_seats_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "booking_seats" ADD CONSTRAINT "booking_seats_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "booking_seats" ADD CONSTRAINT "booking_seats_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
