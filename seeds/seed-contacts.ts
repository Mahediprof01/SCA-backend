import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

const seedContacts = [
  {
    name: 'Aisha Patel',
    email: 'aisha.patel@email.com',
    phone: '+44 7123 456789',
    subject: 'Inquiry about MSc Computer Science',
    message:
      'Hi, I am interested in applying for the MSc Computer Science program at Oxford. I have a background in IT and would like to know more about the program structure and requirements.',
    status: 'pending',
  },
  {
    name: 'Muhammad Khan',
    email: 'muhammad.khan@email.com',
    phone: '+92 321 5678901',
    subject: 'Business Administration Program',
    message:
      'I am looking for information about MBA programs in the UK. I have 5 years of work experience in finance and want to pursue further studies.',
    status: 'active',
  },
  {
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+61 2 9876 5432',
    subject: 'Engineering Scholarship',
    message:
      'Are there any scholarship opportunities for international students applying to the Engineering program? I am particularly interested in civil engineering.',
    status: 'pending',
  },
  {
    name: 'Raj Verma',
    email: 'raj.verma@email.com',
    phone: '+91 98765 43210',
    subject: 'Medical School Application',
    message:
      'I would like to know about the USMLE requirements for international medical graduates. Can you provide information about your medical programs?',
    status: 'active',
  },
  {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '+1 555 234 5678',
    subject: 'Law Program Inquiry',
    message:
      'I am interested in studying law in the UK. Can you provide details about the duration, fees, and career prospects after graduation?',
    status: 'pending',
  },
  {
    name: 'Chen Wei',
    email: 'chen.wei@email.com',
    phone: '+86 10 1234 5678',
    subject: 'Psychology Masters Program',
    message:
      'I am looking for a research-focused Masters program in Clinical Psychology. Could you tell me about your program and admission requirements?',
    status: 'active',
  },
  {
    name: 'Isabella Santos',
    email: 'isabella.santos@email.com',
    phone: '+55 11 98765 4321',
    subject: 'Environmental Science PhD',
    message:
      'I am interested in pursuing a PhD in Environmental Science with focus on climate change. Do you have faculty working in this area?',
    status: 'pending',
  },
  {
    name: 'Thomas Anderson',
    email: 'thomas.anderson@email.com',
    phone: '+47 9876 5432',
    subject: 'Economics and Finance',
    message:
      'I am interested in the MSc Economics program. I have a background in mathematics. Are there any requirements I should know about before applying?',
    status: 'active',
  },
  {
    name: 'Fatima Hassan',
    email: 'fatima.hassan@email.com',
    phone: '+966 55 1234567',
    subject: 'Architecture and Design',
    message:
      'I would like information about the Architecture program. I have completed my bachelor degree and would like to pursue a specialization in sustainable design.',
    status: 'pending',
  },
  {
    name: 'Lucas Oliveira',
    email: 'lucas.oliveira@email.com',
    phone: '+351 912 345 678',
    subject: 'Mechanical Engineering',
    message:
      'I am interested in a Masters program in Mechanical Engineering with specialization in robotics. Can you help me with the application process?',
    status: 'active',
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sca_database';

    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    console.log('🧹 Clearing existing contacts...');
    await Contact.deleteMany({});
    console.log('✅ Cleared contacts collection');

    console.log('📝 Seeding contacts...');
    const result = await Contact.insertMany(seedContacts);
    console.log(`✅ Successfully seeded ${result.length} contacts`);

    // Display seeded data
    const contacts = await Contact.find();
    console.log('\n📊 Seeded Contacts:');
    console.table(
      contacts.map((c) => ({
        Name: c.name,
        Email: c.email,
        Subject: c.subject,
        Status: c.status,
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
