import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const seedReviews = [
  {
    name: 'Mahmudul Hasan',
    university: 'Kyung Hee University (South Korea)',
    quote:
      "From the first counselling session to my visa approval, Study Abroad Consultancy guided me like a true mentor. I'm now living my dream in Seoul.",
    rating: 5,
    status: 'active',
  },
  {
    name: 'Tasnim Rahman',
    university: 'Hanyang University (South Korea)',
    quote:
      'I was nervous about applying abroad, but Study Abroad Consultancy made everything so simple. Their team was patient, honest, and always available.',
    rating: 5,
    status: 'active',
  },
  {
    name: 'Sumaiya Islam',
    university: 'Woosuk University (South Korea)',
    quote:
      'Choosing Study Abroad Consultancy was the best decision. Their professional support made my journey to South Korea smooth and successful.',
    rating: 5,
    status: 'active',
  },
  {
    name: 'Nabila Rahman',
    university: 'Yonsei University (South Korea)',
    quote:
      'Study Abroad Consultancy made my dream of studying in South Korea a reality. Their step-by-step guidance and constant support were incredible.',
    rating: 5,
    status: 'active',
  },
];

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

    await dataSource.initialize();
    console.log('🔗 Connected to MySQL');

    // Clear existing reviews
    const deleted = await dataSource.query('DELETE FROM reviews');
    console.log(`🗑️  Cleared existing reviews`);

    // Insert seed reviews
    for (const review of seedReviews) {
      await dataSource.query(
        'INSERT INTO reviews (name, university, quote, rating, status) VALUES (?, ?, ?, ?, ?)',
        [review.name, review.university, review.quote, review.rating, review.status],
      );
    }
    console.log(`✅ Seeded ${seedReviews.length} reviews`);

    const reviews = await dataSource.query('SELECT name, university, rating, status FROM reviews');
    console.log('\n📊 Seeded Reviews:');
    console.table(reviews);

    await dataSource.destroy();
    console.log('\n✅ Seed completed and disconnected from MySQL');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
