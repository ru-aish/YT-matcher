Here is the ultimate, master blueprint. You can copy and paste this *exactly as it is* directly into your AI coding agent (like Cursor, GitHub Copilot Workspace, or Devin). 

Since your AI has browser testing capabilities (like Playwright or Puppeteer integrated), I have designed this plan so the AI writes the code, and then immediately writes an automated browser test to prove to itself (and to you) that the feature actually works.

***

# System Prompt & Development Plan for AI Agent

**Agent Role:** You are an autonomous Senior Next.js Developer. You will build V1 of a Creator/Brand Matchmaking Marketplace. 
**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Neon DB (Postgres), Drizzle ORM, Clerk (Auth), Pusher (WebSockets), Resend (Emails).
**Execution Rules:** You must execute this plan sequentially. After completing each stage, you must run the specified automated "Verification Test" using your browser automation tools (Playwright/Puppeteer) to ensure the feature works before moving to the next stage. Note: Payments are excluded from this phase. Just place a dummy button for payments.

---

### Stage 1: Infrastructure & Database Foundation
**Objective:** Set up the repo, styling, and database schema.

1.  **Initialize Next.js:** Create the Next.js app with App Router, TypeScript, and Tailwind.
2.  **Initialize shadcn/ui:** Set up shadcn and install basic components (`button`, `card`, `input`, `dialog`).
3.  **Database & ORM:** Install Drizzle ORM and connect it to the Neon DB using `DATABASE_URL`.
4.  **Schema Definition:** Create `schema.ts` with three tables:
    *   `users` (id, clerk_id, email, role [brand/creator], name, profile_data).
    *   `deals` (id, brand_id, creator_id, status [pending, matched, escrow_funded], price).
    *   `messages` (id, deal_id, sender_id, content, created_at).
5.  **Push Schema:** Run Drizzle push to create the tables in Neon.

> **🧪 Stage 1 Verification Test (DB Assertion):**
> Write a quick Node script to insert a dummy user into the Neon database using Drizzle, query it back, assert the data matches, and then delete the dummy user. Print "Stage 1 Passed" to the console.

---

### Stage 2: Authentication & User Sync (Clerk)
**Objective:** Handle logins and ensure users exist in our database.

1.  **Clerk Integration:** Install `@clerk/nextjs`. Wrap the app in `<ClerkProvider>`. Create `/sign-in` and `/sign-up` routes using Clerk components.
2.  **Webhook Sync:** Create an API route (`/api/webhooks/clerk`) using the `svix` package to listen to Clerk's `user.created` event. When a user signs up, insert their `clerk_id`, `email`, and `role` into our Neon `users` table.

> **🧪 Stage 2 Verification Test (Browser Automation):**
> 1. Launch a headless browser.
> 2. Navigate to `/sign-up`.
> 3. Fill the Clerk sign-up form with dummy data (`test_brand@example.com`). Submit.
> 4. Wait 3 seconds for the webhook to fire.
> 5. Connect to the Neon DB directly via Drizzle in the test script and assert that `test_brand@example.com` exists in the `users` table. If true, print "Stage 2 Passed".

---

### Stage 3: Dashboards & Dummy Deal Creation
**Objective:** Build the UI where Brands see Creators and can open a deal.

1.  **Routing Layout:** Create protected routes `/dashboard/brand` and `/dashboard/creator`.
2.  **Mock Seed Data:** Create a server action `seedMockCreators()` that populates the DB with 3 fake creators so the Brand has someone to look at.
3.  **Brand Dashboard:** Fetch the mocked creators from the DB. Render them as shadcn Cards. Add a "Start Deal" button on each card.
4.  **Deal Initialization:** When "Start Deal" is clicked, trigger a Server Action that creates a new record in the `deals` table and redirects the Brand to `/deal/[deal_id]`.
5.  **The Deal Page UI:** Build the layout for `/deal/[id]`. Include a big, inactive dummy button that says `[Simulate Fund Escrow - Payment Integration Later]`.

> **🧪 Stage 3 Verification Test (End-to-End Flow):**
> 1. Launch browser context as the logged-in Brand.
> 2. Navigate to `/dashboard/brand`.
> 3. Assert the page displays Creator cards.
> 4. Click the "Start Deal" button.
> 5. Wait for redirect. Assert the URL contains `/deal/` and the "Simulate Fund Escrow" button is visible in the DOM.

---

### Stage 4: Real-Time Chat (Pusher)
**Objective:** Enable live messaging between Brand and Creator on the Deal page.

1.  **Pusher Setup:** Install `pusher` (server) and `pusher-js` (client).
2.  **Send Message Action:** Create a Server Action `sendMessage(dealId, content)`. This action must:
    *   Save the message to the Neon `messages` table.
    *   Trigger a Pusher event on channel `deal-${dealId}`, event `new-message`.
3.  **Chat UI Component:** Build a React Client Component on the Deal page. 
    *   On load, fetch historical messages from the DB.
    *   Subscribe to the Pusher channel. When a `new-message` event fires, append it to the UI state instantly.

> **🧪 Stage 4 Verification Test (Two-Browser WebSocket Test):**
> *This is the most critical test.*
> 1. Launch **Browser Context A** (Incognito, mocked as Brand User). Navigate to `/deal/123`.
> 2. Launch **Browser Context B** (Incognito, mocked as Creator User). Navigate to `/deal/123`.
> 3. In Context A, locate the chat input, type "Hello from the Brand!", and click send.
> 4. *Do not refresh Context B.* Assert that the text "Hello from the Brand!" appears in the DOM of Context B within 3000ms.
> 5. If it appears, WebSockets are working perfectly. Print "Stage 4 Passed".

---

### Stage 5: Email Notifications (Resend)
**Objective:** Prevent ghosting by sending emails.

1.  **React Email Template:** Create a nice-looking email template using React Email components saying: *"You have a new message regarding your sponsorship deal. Click here to reply."*
2.  **Resend Integration:** Write a utility function `sendUnreadMessageEmail(userEmail, dealId)`.
3.  **Basic Logic:** For V1, update the `sendMessage` server action. If the sender is a Brand, trigger the Resend email to the Creator (and vice versa). *(Note: Do not build complex delay queues yet, just fire it asynchronously on every message or after a brief check).*

> **🧪 Stage 5 Verification Test (API Mock/Execution):**
> 1. In your test script, trigger the `sendMessage` server action.
> 2. Spy on or mock the Resend API call to assert it was called with the correct target email and subject line.
> 3. Alternatively, check the API response from Resend to ensure it returns HTTP 200 (Success).

---

**End of Plan Instructions to AI:**
Once you have consumed this plan, begin with Stage 1. Output the terminal commands required for setup, write the code, and write the Playwright/Node verification script for Stage 1. Wait for my confirmation, run the test, and proceed to Stage 2.