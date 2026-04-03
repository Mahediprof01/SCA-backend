import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

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

    console.log('🧹 Clearing existing contacts...');
    await dataSource.query('DELETE FROM contacts');
    console.log('✅ Cleared contacts table');

    console.log('📝 Seeding contacts...');
    for (const contact of seedContacts) {
      await dataSource.query(
        'INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, ?)',
        [contact.name, contact.email, contact.phone, contact.subject, contact.message, contact.status],
      );
    }
    console.log(`✅ Successfully seeded ${seedContacts.length} contacts`);

    const contacts = await dataSource.query('SELECT name, email, subject, status FROM contacts');
    console.log('\n📊 Seeded Contacts:');
    console.table(contacts);

    await dataSource.destroy();
    console.log('\n✅ Seed completed and disconnected from MySQL');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
