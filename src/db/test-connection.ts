import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  log: ['error'],
});

function maskDatabaseUrl(url?: string): string {
  if (!url) return 'НЕ ЗАДАНА';
  try {
    const parsed = new URL(url);
    if (parsed.password) {
      parsed.password = '******';
    }
    return parsed.toString();
  } catch {
    return url.replace(/:([^:@]+)@/, ':******@');
  }
}

async function checkDatabaseConnection() {
  console.log('\n================================================================');
  console.log('  [Задание 1] Проверка подключения к базе данных PostgreSQL');
  console.log('================================================================');
  
  const rawUrl = process.env.DATABASE_URL;
  console.log(`URL подключения: ${maskDatabaseUrl(rawUrl)}`);
  console.log('Попытка установить соединение с сервером БД...');

  const startTime = Date.now();

  try {
    // Выполняем контрольный нативный запрос к PostgreSQL
    const result = await prisma.$queryRaw<Array<{
      connected: number;
      pg_version: string;
      db_name: string;
      current_user: string;
    }>>`
      SELECT 
        1 AS connected,
        version() AS pg_version,
        current_database() AS db_name,
        current_user AS current_user
    `;

    const latency = Date.now() - startTime;
    const dbInfo = result[0];

    console.log('\n✅ УСПЕШНОЕ ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ!');
    console.log('----------------------------------------------------------------');
    console.log(`• Статус:               ONLINE (Соединение активно)`);
    console.log(`• Время отклика:        ${latency} ms`);
    console.log(`• Имя базы данных:      ${dbInfo?.db_name || 'lumiere_db'}`);
    console.log(`• Пользователь СУБД:    ${dbInfo?.current_user || 'postgres'}`);
    console.log(`• Версия PostgreSQL:    ${dbInfo?.pg_version?.split(' on ')[0] || 'PostgreSQL'}`);
    console.log('----------------------------------------------------------------');
    console.log('Задание 1 выполнено: Проект успешно подключен к PostgreSQL.\n');
    process.exit(0);
  } catch (error: any) {
    const latency = Date.now() - startTime;
    console.error('\n❌ ОШИБКА ПОДКЛЮЧЕНИЯ К БАЗЕ ДАННЫХ!');
    console.error('----------------------------------------------------------------');
    console.error(`• Время до ошибки:      ${latency} ms`);
    console.error(`• Код ошибки Prisma:    ${error?.code || 'UNKNOWN'}`);
    console.error(`• Сообщение:            ${error?.message || error}`);
    console.error('----------------------------------------------------------------');
    console.log('\n📋 Рекомендации по устранению ошибки:');
    if (error?.code === 'P1001') {
      console.log('  1. Сервер PostgreSQL не запущен или недоступен по указанному хосту/порту.');
      console.log('     Запустите локальный контейнер: docker compose up -d');
    } else if (error?.code === 'P1000') {
      console.log('  1. Неверный логин или пароль пользователя PostgreSQL в файле .env.');
    } else if (error?.code === 'P1003') {
      console.log('  1. База данных не существует. Создайте базу lumiere_db командой:');
      console.log('     npx prisma db push или npx prisma migrate dev');
    } else {
      console.log('  1. Проверьте переменную DATABASE_URL в файле .env.');
      console.log('  2. Убедитесь, что служба PostgreSQL запущена: docker compose ps');
    }
    console.log('================================================================\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseConnection();
