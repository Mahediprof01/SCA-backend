import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    const dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'sca_database',
    });

    console.log('🌱 Connecting to MySQL...');
    await dataSource.initialize();
    console.log('✅ Connected to MySQL');

    console.log('🧹 Clearing existing users...');
    await dataSource.query('DELETE FROM users');
    console.log('✅ Cleared users table');

    const hashedPassword = await bcrypt.hash('adminsca2026', 10);

    console.log('📝 Seeding admin user...');
    await dataSource.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      ['admin@sca.com', hashedPassword, 'admin'],
    );
    console.log('✅ Admin user created: admin@sca.com');

    const users = await dataSource.query('SELECT id, email, role FROM users');
    console.log('\n📊 Seeded Users:');
    console.table(users);

    await dataSource.destroy();
    console.log('\n✅ Seed completed and disconnected from MySQL');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
