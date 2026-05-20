const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set in env');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function upgradeSchema() {
  console.log('Upgrading marketplace database schema...');

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        brand_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        requirements TEXT,
        budget INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);`;
    await sql`ALTER TABLE deals ADD COLUMN IF NOT EXISTS campaign_id INTEGER REFERENCES campaigns(id);`;
    await sql`ALTER TABLE deals ADD COLUMN IF NOT EXISTS title VARCHAR(255);`;
    await sql`ALTER TABLE deals ADD COLUMN IF NOT EXISTS description TEXT;`;
    await sql`ALTER TABLE deals ADD COLUMN IF NOT EXISTS requirements TEXT;`;

    await sql`
      CREATE TABLE IF NOT EXISTS campaign_interests (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER REFERENCES campaigns(id),
        creator_id INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'interested',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('✅ Marketplace schema upgraded successfully.');
  } catch (error) {
    console.error('❌ Marketplace schema upgrade failed:', error);
    process.exit(1);
  }
}

upgradeSchema();
