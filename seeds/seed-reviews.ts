import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    university: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

const Review = mongoose.model('Review', reviewSchema);

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
  const mongoUri =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/sca_database';

  try {
    await mongoose.connect(mongoUri);
    console.log('🔗 Connected to MongoDB:', mongoUri);

    // Clear existing reviews
    const deleted = await Review.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing reviews`);

    // Insert seed reviews
    const reviews = await Review.insertMany(seedReviews);
    console.log(`✅ Seeded ${reviews.length} reviews`);

    console.log('\n📊 Seeded Reviews:');
    console.table(
      reviews.map((r) => ({
        Name: r.name,
        University: r.university,
        Rating: r.rating,
        Status: r.status,
      })),
    );

    await mongoose.disconnect();
    console.log('\n✅ Seed completed and disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
