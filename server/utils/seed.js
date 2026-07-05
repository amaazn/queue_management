import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Manager from "../models/Manager.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  const email = (process.env.SEED_ADMIN_EMAIL || "admin@gmail.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const name = process.env.SEED_ADMIN_NAME || "Queue Manager";

  const existing = await Manager.findOne({ email });
  if (existing) {
    console.log(`ℹ️  Manager "${email}" already exists — nothing to seed.`);
  } else {
    await Manager.create({ name, email, password });
    console.log(`✅ Seeded default manager:`);
    console.log(`   email:    ${email}`);
    console.log(`   password: ${password}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(async (err) => {
  console.error(`❌ Seed failed: ${err.message}`);
  await mongoose.disconnect();
  process.exit(1);
});
