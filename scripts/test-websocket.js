const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

function getDealId() {
  if (process.env.DEAL_ID) {
    return process.env.DEAL_ID;
  }

  const dealIdFile = path.join(process.cwd(), '.chat-test-deal-id');
  if (fs.existsSync(dealIdFile)) {
    return fs.readFileSync(dealIdFile, 'utf8').trim();
  }

  return '1';
}

async function runTest() {
  console.log("Starting E2E WebSocket & Escrow Simulation Test...");
  const dealId = getDealId();
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext();
    const pageA = await context.newPage();
    const pageB = await context.newPage();
    console.log(`Navigating Brand tab to Deal ${dealId}...`);
    await pageA.goto(`http://localhost:3000/deal/${dealId}?dev_user_id=dev_brand_123&dev_user_role=brand&dev_user_email=test_brand@example.com`);
    console.log(`Navigating Creator tab to Deal ${dealId}...`);
    await pageB.goto(`http://localhost:3000/deal/${dealId}?dev_user_id=dev_creator_456&dev_user_role=creator&dev_user_email=test_creator@example.com`);

    // Wait for both pages to render content
    await pageA.waitForSelector('text=Agreement Parameters');
    await pageB.waitForSelector('text=Agreement Parameters');
    console.log("Both pages loaded successfully.");

    // 3. Send Message from Brand
    const testMessage = `Hello from the Brand via WebSockets! Time: ${Date.now()}`;
    console.log(`Brand sending message: "${testMessage}"`);
    
    // Find input and type message
    await pageA.fill('.chat-input-field', testMessage);
    await pageA.click('button[type="submit"]');

    // 4. Assert Creator receives message (Pusher Live Sync)
    console.log("Waiting for Creator (Context B) to receive message...");
    const creatorBubble = pageB.locator(`text=${testMessage}`);
    
    // Wait up to 5 seconds for message to appear via WebSockets
    await creatorBubble.waitFor({ state: 'visible', timeout: 5000 });
    console.log("WebSocket message received in real-time by Creator.");

    // 5. Test Escrow simulation when the deal is still unfunded.
    const escrowButton = pageA.locator('text=Fund Escrow (Simulate)');
    const escrowVisible = await escrowButton.isVisible().catch(() => false);

    if (escrowVisible) {
      console.log("Brand triggering Escrow Simulation...");
      await escrowButton.click();

      console.log("Waiting for status update sync...");
      await pageA.waitForSelector('text=Escrow Fully Funded', { timeout: 5000 });
      await pageB.waitForSelector('text=Escrow Fully Funded', { timeout: 5000 });
      console.log("Escrow status synced successfully to both Brand and Creator views.");
    } else {
      await pageA.waitForSelector('text=Escrow Fully Funded', { timeout: 5000 });
      await pageB.waitForSelector('text=Escrow Fully Funded', { timeout: 5000 });
      console.log("Escrow was already funded; verified funded state is visible in both tabs.");
    }

    console.log("\n=================================");
    console.log("Stage 4 & Escrow Tests Passed!");
    console.log("=================================\n");
  } catch (error) {
    console.error("E2E Test Failed:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTest();
