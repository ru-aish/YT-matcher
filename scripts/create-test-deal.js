const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set in env");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function createDeal() {
  try {
    const brand = await sql`SELECT * FROM users WHERE google_id = 'dev_brand_123'`;
    const creator = await sql`SELECT * FROM users WHERE google_id = 'dev_creator_456'`;
    
    if (brand.length === 0 || creator.length === 0) {
      console.error("Missing brand or creator");
      return;
    }

    // Delete existing deals and messages between them to keep it clean
    await sql`DELETE FROM messages WHERE deal_id IN (SELECT id FROM deals WHERE brand_id = ${brand[0].id} AND creator_id = ${creator[0].id});`;
    await sql`DELETE FROM deals WHERE brand_id = ${brand[0].id} AND creator_id = ${creator[0].id};`;

    const deal = await sql`
      INSERT INTO deals (brand_id, creator_id, status, price)
      VALUES (${brand[0].id}, ${creator[0].id}, 'pending', 1500)
      RETURNING *;
    `;
    const dealIdFile = path.join(process.cwd(), '.chat-test-deal-id');
    fs.writeFileSync(dealIdFile, String(deal[0].id));

    console.log("Created test Deal:", deal[0]);
    console.log(`DEAL_ID=${deal[0].id}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
createDeal();
