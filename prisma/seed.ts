import { PrismaClient, Role, SeatType, SessionType, SessionStatus, BookingStatus, PaymentStatus } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('================================================================');
  console.log('  Наполнение базы данных (Prisma Seed)');
  console.log('================================================================\n');

  console.log('1. Очистка существующих тестовых данных...');
  // Удаляем в обратном порядке зависимостей
  await prisma.bookingSeat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.session.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.hall.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();
  console.log('Таблицы успешно очищены.\n');

  // -------------------------------------------------------------
  // 1. Создание пользователей (Таблица: users, 3 записи)
  // -------------------------------------------------------------
  console.log('2. Добавление пользователей (users)...');
  const userAdmin = await prisma.user.create({
    data: {
      email: 'admin@lumiere.ru',
      passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6DF2m1eN/3Bq36q', // admin123
      firstName: 'Александр',
      lastName: 'Смирнов',
      phone: '+7 (999) 111-22-33',
      role: Role.ADMIN,
    },
  });

  const userManager = await prisma.user.create({
    data: {
      email: 'manager@lumiere.ru',
      passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6DF2m1eN/3Bq36q', // manager123
      firstName: 'Елена',
      lastName: 'Васильева',
      phone: '+7 (999) 444-55-66',
      role: Role.MANAGER,
    },
  });

  const userCustomer = await prisma.user.create({
    data: {
      email: 'customer@lumiere.ru',
      passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6DF2m1eN/3Bq36q', // user123
      firstName: 'Дмитрий',
      lastName: 'Соколов',
      phone: '+7 (999) 777-88-99',
      role: Role.CUSTOMER,
    },
  });
  console.log(`Создано пользователей: 3 (${userAdmin.email}, ${userManager.email}, ${userCustomer.email})`);

  // -------------------------------------------------------------
  // 2. Создание жанров (Таблица: genres, 3 записи)
  // -------------------------------------------------------------
  console.log('3. Добавление жанров (genres)...');
  const genreAction = await prisma.genre.create({
    data: { name: 'Боевик', slug: 'action' },
  });
  const genreSciFi = await prisma.genre.create({
    data: { name: 'Фантастика', slug: 'sci-fi' },
  });
  const genreAnimation = await prisma.genre.create({
    data: { name: 'Анимация', slug: 'animation' },
  });
  console.log(`Создано жанров: 3 (${genreAction.name}, ${genreSciFi.name}, ${genreAnimation.name})`);

  // -------------------------------------------------------------
  // 3. Создание фильмов (Таблица: movies, 3 записи)
  // -------------------------------------------------------------
  console.log('4. Добавление фильмов (movies)...');
  const movieWick = await prisma.movie.create({
    data: {
      tmdbId: 603692,
      title: 'Джон Уик 4',
      originalTitle: 'John Wick: Chapter 4',
      description: 'Джон Уик находит способ победить Правление Кланов. Однако перед тем, как заслужить свободу, ему предстоит сразиться с новым врагом.',
      durationMinutes: 169,
      releaseYear: 2023,
      posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NKnMGKEslUsZ2VoNmQm.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/h8gHn0OzRogL0GayNX0aTXoi9nz.jpg',
      ageRating: '18+',
      rating: 8.2,
      genres: {
        create: [{ genreId: genreAction.id }],
      },
    },
  });

  const movieInterstellar = await prisma.movie.create({
    data: {
      tmdbId: 157336,
      title: 'Интерстеллар',
      originalTitle: 'Interstellar',
      description: 'Группа исследователей использует недавно обнаруженный пространственно-временной тоннель, чтобы обойти ограничения космических полётов.',
      durationMinutes: 169,
      releaseYear: 2014,
      posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/rAiYTsqBkRefTnhVviOdSkROJ9q.jpg',
      ageRating: '12+',
      rating: 8.7,
      genres: {
        create: [{ genreId: genreSciFi.id }, { genreId: genreAction.id }],
      },
    },
  });

  const movieRaya = await prisma.movie.create({
    data: {
      tmdbId: 527774,
      title: 'Райя и последний дракон',
      originalTitle: 'Raya and the Last Dragon',
      description: 'Отважная воительница Райя отправляется в опасное путешествие, чтобы найти последнего дракона и спасти сказочное королевство Кумандра.',
      durationMinutes: 107,
      releaseYear: 2021,
      posterUrl: 'https://image.tmdb.org/t/p/w500/lPsD108MfA9PxX6zNpZqg9gGj8w.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/hJuDvwz2r3z0fWk68dGz3f7d2pC.jpg',
      ageRating: '6+',
      rating: 7.9,
      genres: {
        create: [{ genreId: genreAnimation.id }],
      },
    },
  });
  console.log(`Создано фильмов: 3 («${movieWick.title}», «${movieInterstellar.title}», «${movieRaya.title}»)`);

  // -------------------------------------------------------------
  // 4. Создание залов и кресел (Таблицы: halls, seats, 3 зала)
  // -------------------------------------------------------------
  console.log('5. Добавление залов и кресел (halls, seats)...');
  const hallImax = await prisma.hall.create({
    data: {
      name: 'Зал 1 — IMAX Laser',
      totalSeats: 24,
      screenType: 'IMAX Laser 4K',
      soundSystem: 'Dolby Atmos 12.1',
      isActive: true,
    },
  });

  const hallDolby = await prisma.hall.create({
    data: {
      name: 'Зал 2 — Dolby Atmos',
      totalSeats: 18,
      screenType: 'Laser 4K',
      soundSystem: 'Dolby Atmos 7.1',
      isActive: true,
    },
  });

  const hallVip = await prisma.hall.create({
    data: {
      name: 'Зал 3 — VIP Lounge',
      totalSeats: 12,
      screenType: 'OLED Cinema',
      soundSystem: 'Bowers & Wilkins Custom',
      isActive: true,
    },
  });

  // Заполняем кресла для Зала 1 (3 ряда по 8 мест)
  const imaxSeats = [];
  for (let r = 1; r <= 3; r++) {
    for (let s = 1; s <= 8; s++) {
      imaxSeats.push({
        hallId: hallImax.id,
        row: r,
        number: s,
        seatType: r === 3 ? SeatType.VIP : SeatType.STANDARD,
      });
    }
  }
  await prisma.seat.createMany({ data: imaxSeats });

  // Заполняем кресла для Зала 2 (3 ряда по 6 мест)
  const dolbySeats = [];
  for (let r = 1; r <= 3; r++) {
    for (let s = 1; s <= 6; s++) {
      dolbySeats.push({
        hallId: hallDolby.id,
        row: r,
        number: s,
        seatType: r === 3 ? SeatType.VIP : SeatType.STANDARD,
      });
    }
  }
  await prisma.seat.createMany({ data: dolbySeats });

  // Заполняем кресла для Зала 3 VIP (2 ряда по 6 мест)
  const vipSeats = [];
  for (let r = 1; r <= 2; r++) {
    for (let s = 1; s <= 6; s++) {
      vipSeats.push({
        hallId: hallVip.id,
        row: r,
        number: s,
        seatType: SeatType.VIP,
      });
    }
  }
  await prisma.seat.createMany({ data: vipSeats });
  console.log(`Создано залов: 3, инициализированы кресла (Standard и VIP)`);

  // -------------------------------------------------------------
  // 5. Создание сеансов (Таблица: sessions, 3 записи)
  // -------------------------------------------------------------
  console.log('6. Добавление сеансов (sessions)...');
  const now = new Date();
  
  const tomorrow19 = new Date(now);
  tomorrow19.setDate(tomorrow19.getDate() + 1);
  tomorrow19.setHours(19, 0, 0, 0);

  const tomorrow19End = new Date(tomorrow19);
  tomorrow19End.setMinutes(tomorrow19End.getMinutes() + movieWick.durationMinutes + 20);

  const tomorrow2130 = new Date(now);
  tomorrow2130.setDate(tomorrow2130.getDate() + 1);
  tomorrow2130.setHours(21, 30, 0, 0);

  const tomorrow2130End = new Date(tomorrow2130);
  tomorrow2130End.setMinutes(tomorrow2130End.getMinutes() + movieInterstellar.durationMinutes + 20);

  const dayAfter14 = new Date(now);
  dayAfter14.setDate(dayAfter14.getDate() + 2);
  dayAfter14.setHours(14, 0, 0, 0);

  const dayAfter14End = new Date(dayAfter14);
  dayAfter14End.setMinutes(dayAfter14End.getMinutes() + movieRaya.durationMinutes + 20);

  const session1 = await prisma.session.create({
    data: {
      movieId: movieWick.id,
      hallId: hallImax.id,
      startTime: tomorrow19,
      endTime: tomorrow19End,
      basePrice: 650.0,
      sessionType: SessionType.FORMAT_IMAX,
      status: SessionStatus.OPEN,
    },
  });

  const session2 = await prisma.session.create({
    data: {
      movieId: movieInterstellar.id,
      hallId: hallDolby.id,
      startTime: tomorrow2130,
      endTime: tomorrow2130End,
      basePrice: 500.0,
      sessionType: SessionType.FORMAT_2D,
      status: SessionStatus.OPEN,
    },
  });

  const session3 = await prisma.session.create({
    data: {
      movieId: movieRaya.id,
      hallId: hallVip.id,
      startTime: dayAfter14,
      endTime: dayAfter14End,
      basePrice: 750.0,
      sessionType: SessionType.FORMAT_3D,
      status: SessionStatus.SCHEDULED,
    },
  });
  console.log(`Создано сеансов: 3`);

  // -------------------------------------------------------------
  // 6. Создание бронирований и билетов (Таблицы: bookings, booking_seats, 2 брони)
  // -------------------------------------------------------------
  console.log('7. Добавление бронирований и билетов (bookings, booking_seats)...');
  
  // Получаем кресла для бронирования
  const bookedSeatsSession1 = await prisma.seat.findMany({
    where: { hallId: hallImax.id, row: 2, number: { in: [4, 5] } },
  });

  const booking1 = await prisma.booking.create({
    data: {
      bookingCode: 'LUM-2026-7841',
      userId: userCustomer.id,
      customerName: 'Дмитрий Соколов',
      customerEmail: 'customer@lumiere.ru',
      customerPhone: '+7 (999) 777-88-99',
      sessionId: session1.id,
      totalAmount: 1300.0, // 2 места x 650.00
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      seats: {
        create: bookedSeatsSession1.map((seat) => ({
          sessionId: session1.id,
          seatId: seat.id,
          price: 650.0,
        })),
      },
    },
  });

  const bookedSeatsSession2 = await prisma.seat.findMany({
    where: { hallId: hallDolby.id, row: 3, number: 3 },
  });

  const booking2 = await prisma.booking.create({
    data: {
      bookingCode: 'LUM-2026-9124',
      userId: userManager.id,
      customerName: 'Елена Васильева',
      customerEmail: 'manager@lumiere.ru',
      customerPhone: '+7 (999) 444-55-66',
      sessionId: session2.id,
      totalAmount: 500.0,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
      seats: {
        create: bookedSeatsSession2.map((seat) => ({
          sessionId: session2.id,
          seatId: seat.id,
          price: 500.0,
        })),
      },
    },
  });
  console.log(`Создано бронирований: 2 (Билетов: 3 места, коды: ${booking1.bookingCode}, ${booking2.bookingCode})`);

  // -------------------------------------------------------------
  // 7. Создание отзывов (Таблица: reviews, 3 записи)
  // -------------------------------------------------------------
  console.log('8. Добавление отзывов (reviews)...');
  await prisma.review.create({
    data: {
      movieId: movieWick.id,
      userId: userCustomer.id,
      rating: 5,
      text: 'Невероятный визуальный ряд и саундтрек! Смотреть в зале IMAX с лазерной проекцией — сплошное удовольствие.',
      isPublished: true,
    },
  });

  await prisma.review.create({
    data: {
      movieId: movieInterstellar.id,
      userId: userCustomer.id,
      rating: 5,
      text: 'Шедевр Кристофера Нолана. Органная музыка Ханса Циммера в системе Dolby Atmos звучит до мурашек.',
      isPublished: true,
    },
  });

  await prisma.review.create({
    data: {
      movieId: movieRaya.id,
      userId: userManager.id,
      rating: 4,
      text: 'Красивая восточная сказка с отличным посылом о доверии. Детям и взрослым очень понравилось.',
      isPublished: true,
    },
  });
  console.log(`Создано отзывов: 3`);

  console.log('\n================================================================');
  console.log('SEED УСПЕШНО ЗАВЕРШЕН');
  console.log('Все таблицы базы данных заполнены тестовыми данными.');
  console.log('================================================================\n');
}

main()
  .catch((e) => {
    console.error('Ошибка выполнения seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
