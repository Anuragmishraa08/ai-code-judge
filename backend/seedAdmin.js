const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/db');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || 'admin@aijudge.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const name = process.env.ADMIN_NAME || 'Admin';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists:', email);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'admin'
  });

  console.log('Admin user created:', email);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
