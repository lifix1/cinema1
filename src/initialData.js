const getRelativeDate = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_MOVIES = [
  {
    id: 'raya',
    title: 'Райя и последний дракон',
    originalTitle: 'Raya and the Last Dragon',
    year: 2021,
    match: 98,
    tags: ['Фэнтези', 'Приключения', 'Семейный'],
    duration: '1 ч 47 мин',
    description: 'Длинное путешествие в сказочное царство Кумандра, где люди и драконы когда-то жили в согласии. Спустя сотни лет, когда зло возвращается, отважная воительница Райя отправляется на поиски последнего легендарного дракона, чтобы восстановить мир.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/l0Byv0YgG767Zv2v3Y5E6XG2YmY.jpg',
    backdropUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80',
    rating: 4.8,
  },
  {
    id: 'john-wick',
    title: 'Джон Уик',
    originalTitle: 'John Wick',
    year: 2014,
    match: 95,
    tags: ['Экшн', 'Триллер', 'Криминал'],
    duration: '1 ч 41 мин',
    description: 'Бывший наемный убийца Джон Уик вынужден вернуться к своему опасному ремеслу после того, как банда преступников отнимает у него то, что было ему дороже всего на свете.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/fZPS6gU6vIuK6897LI7r67G2g64.jpg',
    backdropUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=1600&auto=format&fit=crop&q=80',
    rating: 4.7,
  },
  {
    id: 'baby-driver',
    title: 'Малыш на драйве',
    originalTitle: 'Baby Driver',
    year: 2017,
    match: 92,
    tags: ['Экшн', 'Криминал', 'Музыка'],
    duration: '1 ч 53 мин',
    description: 'Молодой и невероятно талантливый водитель по прозвищу Малыш помогает грабителям скрываться с мест преступлений под ритм своей любимой музыки. Но однажды ему приходится пойти против воли босса.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8a/Baby_Driver_poster.jpg',
    backdropUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&auto=format&fit=crop&q=80',
    rating: 4.5,
  },
  {
    id: 'blade-runner',
    title: 'Бегущий по лезвию 2049',
    originalTitle: 'Blade Runner 2049',
    year: 2017,
    match: 96,
    tags: ['Фантастика', 'Драма', 'Экшн'],
    duration: '2 ч 44 мин',
    description: 'В новом мире, где репликанты сосуществуют с людьми, офицер полиции Кей совершает неожиданное открытие, способное уничтожить хрупкое равновесие в обществе. Ему предстоит найти пропавшего Рика Декарда.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/g653mqg6YmAL6vq669Y6977_A4L.jpg',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    rating: 4.9,
  },
  {
    id: 'bohemian-rhapsody',
    title: 'Богемская рапсодия',
    originalTitle: 'Bohemian Rhapsody',
    year: 2018,
    match: 94,
    tags: ['Биография', 'Драма', 'Музыка'],
    duration: '2 ч 14 мин',
    description: 'Чествование группы Queen, ее музыки и ее выдающегося вокалиста Фредди Меркьюри, который бросил вызов стереотипам и победил, чтобы стать одним из самых любимых артистов планеты.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Bohemian_Rhapsody_poster.png',
    backdropUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600&auto=format&fit=crop&q=80',
    rating: 4.6,
  },
  {
    id: 'brave',
    title: 'Храбрая сердцем',
    originalTitle: 'Brave',
    year: 2012,
    match: 90,
    tags: ['Анимация', 'Фэнтези', 'Семейный'],
    duration: '1 ч 33 мин',
    description: 'Умелой лучнице Мериде, свободолюбивой шотландской принцессе, приходится сделать сложный выбор между вековыми традициями королевства и собственным сердцем. Чтобы спасти маму, ей придется проявить истинную храбрость.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/2/27/Brave_Poster.jpg',
    backdropUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80',
    rating: 4.4,
  },
  {
    id: 'casablanca',
    title: 'Касабланка',
    originalTitle: 'Casablanca',
    year: 1942,
    match: 99,
    tags: ['Драма', 'Мелодрама', 'Классика'],
    duration: '1 ч 42 мин',
    description: 'Величайшая классика мирового кинематографа. В марокканском городе Касабланка во время Второй мировой войны бывшие влюбленные Рик Блейн и Ильза Лунд сталкиваются вновь, вынужденные принимать судьбоносные решения.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/CasablancaPoster-Gold.jpg',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80',
    rating: 4.9,
  },
  {
    id: 'crazy-stupid-love',
    title: 'Эта дурацкая любовь',
    originalTitle: 'Crazy, Stupid, Love.',
    year: 2011,
    match: 89,
    tags: ['Комедия', 'Мелодрама', 'Драма'],
    duration: '1 ч 58 мин',
    description: 'У Кола Уивера идеальная жизнь, пока его жена не заявляет об измене и желании развестись. Пытаясь преодолеть кризис, Кол заводит дружбу с обаятельным плейбоем Джейкобом, который учит его искусству соблазнения.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/Crazy_Stupid_Love_Poster.jpg',
    backdropUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop&q=80',
    rating: 4.3,
  },
  {
    id: 'deadpool',
    title: 'Дэдпул',
    originalTitle: 'Deadpool',
    year: 2016,
    match: 97,
    tags: ['Экшн', 'Комедия', 'Фантастика'],
    duration: '1 ч 48 мин',
    description: 'Бывший спецназовец Уэйд Уилсон после жестокого эксперимента получает невероятные способности к исцелению и изуродованное лицо. Вооружившись черным юмором и парой катарт, он выслеживает человека, который разрушил его жизнь.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/2/23/Deadpool_poster.jpg',
    backdropUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1600&auto=format&fit=crop&q=80',
    rating: 4.7,
  }
];

export const INITIAL_HALLS = [
  {
    id: 'hall-imax',
    name: 'Зал 1 — IMAX Laser',
    rows: 6,
    cols: 10,
    vipRows: [4, 5],
  },
  {
    id: 'hall-dolby',
    name: 'Зал 2 — Dolby Atmos',
    rows: 5,
    cols: 8,
    vipRows: [4],
  },
  {
    id: 'hall-vip',
    name: 'Зал 3 — Premium VIP Lounge',
    rows: 4,
    cols: 6,
    vipRows: [0, 1, 2, 3],
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    movieId: 'raya',
    userName: 'Елена К.',
    rating: 5,
    text: 'Потрясающий и безумно красивый мультфильм! Прекрасная история о доверии и дружбе. Смотрели всей семьей на одном дыхании, музыка просто невероятная.',
    date: '2026-05-18',
  },
  {
    id: 'rev-2',
    movieId: 'raya',
    userName: 'Михаил_99',
    rating: 4,
    text: 'Очень классная детализация воды, волос и текстур дракона Сису! Сюжет достаточно предсказуем для Диснея, но проработан на отлично. Рекомендую.',
    date: '2026-05-20',
  },
  {
    id: 'john-wick',
    userName: 'Киноман_Дэн',
    movieId: 'john-wick',
    rating: 5,
    text: 'Икона современного экшена. Киану Ривз идеально вписался в образ. Стильный неон, зубодробительный экшен и отличный лор о синдикате убийц.',
    date: '2026-05-12',
  },
  {
    id: 'blade-runner',
    userName: 'Siri_User',
    movieId: 'blade-runner',
    rating: 5,
    text: 'Шедевр киноискусства! Визуальный ряд Роджера Дикинса заслуживает вечной памяти. Медленный, глубокий, философский нео-нуар, который хочется пересматривать.',
    date: '2026-05-15',
  }
];

export const generateDefaultSessions = (customMovies) => {
  const sessions = [];
  const times = ['10:00', '13:00', '16:15', '19:00', '21:45', '23:55'];
  
  const movies = customMovies || INITIAL_MOVIES;
  const halls = INITIAL_HALLS;

  let sessionCounter = 1;

  for (let offset = 0; offset < 7; offset++) {
    const dateStr = getRelativeDate(offset);
    
    movies.forEach((movie, mIdx) => {
      const hallIdx = (mIdx + offset) % halls.length;
      const selectedHall = halls[hallIdx];
      
      const t1 = times[(mIdx + offset) % times.length];
      const t2 = times[(mIdx + offset + 3) % times.length];

      const getPrice = (time, hallId) => {
        const hour = parseInt(time.split(':')[0], 10);
        let base = hour < 14 ? 300 : hour < 19 ? 400 : 500;
        if (hallId === 'hall-imax') base += 120;
        if (hallId === 'hall-vip') base += 350;
        return base;
      };

      sessions.push({
        id: `sess-${sessionCounter++}`,
        movieId: movie.id,
        hallId: selectedHall.id,
        date: dateStr,
        time: t1,
        price: getPrice(t1, selectedHall.id)
      });

      if (!(movie.id === 'brave' || movie.id === 'raya' && t2 === '23:55')) {
        sessions.push({
          id: `sess-${sessionCounter++}`,
          movieId: movie.id,
          hallId: selectedHall.id,
          date: dateStr,
          time: t2,
          price: getPrice(t2, selectedHall.id)
        });
      }
    });
  }

  return sessions;
};
