const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set in env");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  console.log("Seeding test users for chat verification...");
  try {
    const existingUsers = await sql`
      SELECT id FROM users
      WHERE email IN ('test_brand@example.com', 'test_creator@example.com');
    `;
    const existingUserIds = existingUsers.map((user) => user.id);

    if (existingUserIds.length > 0) {
      await sql`
        DELETE FROM messages
        WHERE deal_id IN (
          SELECT id FROM deals
          WHERE brand_id = ANY(${existingUserIds}) OR creator_id = ANY(${existingUserIds})
        );
      `;
      await sql`
        DELETE FROM deals
        WHERE brand_id = ANY(${existingUserIds}) OR creator_id = ANY(${existingUserIds});
      `;
      await sql`DELETE FROM users WHERE id = ANY(${existingUserIds});`;
    }

    // Insert Brand
    const brand = await sql`
      INSERT INTO users (email, role, name, google_id, profile_completed, company_name, bio)
      VALUES (
        'test_brand@example.com',
        'brand',
        'CyberBrand Inc.',
        'dev_brand_123',
        true,
        'CyberBrand Inc.',
        'A leading technology advertiser looking for high-quality review videos.'
      )
      RETURNING *;
    `;
    console.log("Seeded Brand:", brand[0]);

    // Insert Creator
    const creator = await sql`
      INSERT INTO users (email, role, name, google_id, profile_completed, youtube_channel, bio)
      VALUES (
        'test_creator@example.com',
        'creator',
        'Marques Reviews',
        'dev_creator_456',
        true,
        'Marques Reviews',
        'Professional technology review channel with 15M+ tech enthusiasts.'
      )
      RETURNING *;
    `;
    console.log("Seeded Creator:", creator[0]);

    console.log("✅ Database test users seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
