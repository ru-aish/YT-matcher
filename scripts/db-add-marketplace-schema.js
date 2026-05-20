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
        brand_user_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        target_audience_country VARCHAR(255),
        budget_min_usd INTEGER DEFAULT 0,
        budget_max_usd INTEGER DEFAULT 0,
        required_deliverable VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);`;
    await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS brand_user_id INTEGER REFERENCES users(id);`;
    await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS target_audience_country VARCHAR(255);`;
    await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS budget_min_usd INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS budget_max_usd INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS required_deliverable VARCHAR(255);`;
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
