const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set in env");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function setup() {
  console.log("Setting up chat-related database tables...");
  try {
    // Create deals table
    await sql`
      CREATE TABLE IF NOT EXISTS deals (
        id SERIAL PRIMARY KEY,
        brand_id INTEGER REFERENCES users(id),
        creator_id INTEGER REFERENCES users(id),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        price INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ Table 'deals' created successfully.");

    // Create messages table
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        deal_id INTEGER REFERENCES deals(id),
        sender_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ Table 'messages' created successfully.");

    console.log("Database schema successfully extended for Chat!");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

setup();
