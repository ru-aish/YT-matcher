'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  X,
  Plus,
  MousePointer2,
  Megaphone,
  Users,
  MessageSquare,
  DollarSign,
  Sparkles,
  Building2,
  Hand,
  CheckCircle,
  Send,
} from 'lucide-react';
import styles from './GuidedFlow.module.css';

/*
  GuidedFlow — a self-contained, scripted "see how it works" walkthrough.
  It renders an animated fake cursor over a mock of the dashboard and plays the
  end-to-end journey. It does NOT call any server actions or touch real data —
  purely a frontend demo overlay layered above the real dashboard.

  Brand journey:
    new campaign -> auto-fill fields -> publish card -> interested creators
    appear -> click "Start chat" -> view expands into a chat with that creator.
  Creator journey:
    browse campaign cards -> click a campaign -> details load -> "Open chat"
    appears -> click -> view expands into a chat with that brand.
*/

const DEMO = {
  brand: {
    creator: { name: 'Aria Vale', handle: '@ariabuilds', niche: 'Tech', subs: '420K', hue: 14 },
    campaign: {
      title: 'Q4 Smart-Home Launch',
      budget: '5000',
      deliverable: '1 dedicated 60s integration',
      desc: 'Looking for a tech creator to feature our new smart-home hub.',
    },
    interested: [
      { name: 'Aria Vale', handle: '@ariabuilds', niche: 'Tech', subs: '420K', hue: 14 },
      { name: 'Pixel Theory', handle: '@pixeltheory', niche: 'Tech · Gaming', subs: '950K', hue: 268 },
      { name: 'The Ledger', handle: '@theledger', niche: 'Finance', subs: '240K', hue: 200 },
    ],
    chat: [
      { from: 'them', text: 'Hey! The smart-home brief looks perfect for my audience.' },
      { from: 'you', text: 'Love your work, Aria. Budget is $5k for a 60s integration — next week work?' },
      { from: 'them', text: 'Works for me. I’ll send a script outline tomorrow.' },
      { from: 'sys', text: 'Deal opened · escrow coming soon' },
    ],
  },
  creator: {
    brand: { name: 'Northwind Co.', cat: 'Smart Home', budget: '$5,000', hue: 150 },
    campaigns: [
      { title: 'Q4 Smart-Home Launch', brand: 'Northwind Co.', budget: '$5,000', tag: 'Tech', hue: 150 },
      { title: 'Summer Skincare Push', brand: 'Aera', budget: '$3,400', tag: 'Beauty', hue: 330 },
      { title: 'Indie Game Spotlight', brand: 'Bytewave', budget: '$4,100', tag: 'Gaming', hue: 210 },
    ],
    chat: [
      { from: 'them', text: 'Hi Aria — we’d love you for the smart-home launch.' },
      { from: 'you', text: 'Thanks! I’m in. $5k for a dedicated 60s spot sounds right.' },
      { from: 'them', text: 'Perfect. Sending the brief over now.' },
      { from: 'sys', text: 'Deal opened · escrow coming soon' },
    ],
  },
};

export default function GuidedFlow({ role = 'brand', onClose }) {
  const isBrand = role === 'brand';

  // cursor position (in % of the stage)
  const [cursor, setCursor] = useState({ x: 12, y: 14 });
  const [clicking, setClicking] = useState(false);

  // brand stage flags
  const [modalOpen, setModalOpen] = useState(false);
  const [fields, setFields] = useState({ title: '', budget: '', deliverable: '', desc: '' });
  const [published, setPublished] = useState(false);
  const [showInterested, setShowInterested] = useState(false);

  // creator stage flags
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailsReady, setDetailsReady] = useState(false);

  // shared
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [caption, setCaption] = useState('');
  const [replay, setReplay] = useState(0);

  const moveTo = useCallback((x, y) => setCursor({ x, y }), []);
  const click = useCallback(() => {
    setClicking(true);
    setTimeout(() => setClicking(false), 260);
  }, []);

  // Reset all stage state (called at the start of each play / replay).
  const reset = useCallback(() => {
    setCursor({ x: 12, y: 14 });
    setModalOpen(false);
    setFields({ title: '', budget: '', deliverable: '', desc: '' });
    setPublished(false);
    setShowInterested(false);
    setSelectedCampaign(null);
    setDetailsReady(false);
    setChatOpen(false);
    setChatMsgs([]);
    setCaption('');
  }, []);

  // ---- Timeline engine ----------------------------------------------------
  // Runs ONCE per (role, replay). Scripts are defined inside the effect so the
  // step arrays are not recreated on every render (which previously retriggered
  // the effect on each setState and restarted the walkthrough from the start).
  useEffect(() => {
    reset();

    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));

    const typeInto = (field, value, baseDelay) => {
      for (let i = 1; i <= value.length; i++) {
        at(baseDelay + i * 28, () =>
          setFields((f) => ({ ...f, [field]: value.slice(0, i) }))
        );
      }
    };
    const pushChat = (msg, delay) => at(delay, () => setChatMsgs((m) => [...m, msg]));

    if (isBrand) {
      const C = DEMO.brand.campaign;
      at(500, () => { setCaption('A brand starts by creating a campaign brief.'); moveTo(82, 9); });
      at(1300, () => click());
      at(1500, () => { setModalOpen(true); setCaption('Fields fill in with the campaign details…'); });
      at(1700, () => moveTo(50, 30));
      typeInto('title', C.title, 1900);
      typeInto('budget', C.budget, 3100);
      typeInto('deliverable', C.deliverable, 3900);
      typeInto('desc', C.desc, 5000);
      at(6400, () => { setCaption('Publish the campaign.'); moveTo(70, 88); });
      at(7100, () => click());
      at(7350, () => { setModalOpen(false); setPublished(true); });
      at(8100, () => { setCaption('Creators who fit start showing interest…'); setShowInterested(true); });
      at(9700, () => { setCaption('The brand picks one and starts the conversation.'); moveTo(80, 52); });
      at(10500, () => click());
      at(10750, () => { setChatOpen(true); setCaption('The view expands into a live chat with that creator.'); });
      pushChat(DEMO.brand.chat[0], 11300);
      pushChat(DEMO.brand.chat[1], 12400);
      pushChat(DEMO.brand.chat[2], 13500);
      pushChat(DEMO.brand.chat[3], 14500);
      at(15200, () => setCaption('That’s the brand journey — match, agree, chat.'));
    } else {
      at(500, () => { setCaption('A creator browses open campaigns from brands.'); moveTo(22, 30); });
      at(1500, () => { setCaption('They open one that fits their channel.'); moveTo(28, 34); });
      at(2200, () => click());
      at(2450, () => { setSelectedCampaign(0); setCaption('Campaign details load…'); });
      at(4000, () => { setDetailsReady(true); setCaption('They express interest — and a chat opens.'); moveTo(72, 80); });
      at(4900, () => click());
      at(5150, () => { setChatOpen(true); setCaption('The view expands into a live chat with the brand.'); });
      pushChat(DEMO.creator.chat[0], 5700);
      pushChat(DEMO.creator.chat[1], 6800);
      pushChat(DEMO.creator.chat[2], 7900);
      pushChat(DEMO.creator.chat[3], 8900);
      at(9600, () => setCaption('That’s the creator journey — discover, apply, chat.'));
    }

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, replay]);

  // close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="How it works walkthrough">
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.frame}>
        <div className={styles.frameHead}>
          <div className={styles.frameTitle}>
            <span className={styles.liveDot} />
            How it works · {isBrand ? 'Brand' : 'Creator'} journey
          </div>
          <div className={styles.frameActions}>
            <button className={styles.replayBtn} onClick={() => setReplay((r) => r + 1)} type="button">
              Replay
            </button>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close" type="button">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className={styles.stage}>
          {/* Animated fake cursor */}
          <div
            className={`${styles.cursor} ${clicking ? styles.cursorClick : ''}`}
            style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
            aria-hidden
          >
            <MousePointer2 size={22} />
          </div>

          {/* Caption */}
          {caption && <div className={styles.caption}>{caption}</div>}

          {/* ---------- BRAND STAGE ---------- */}
          {isBrand && !chatOpen && (
            <div className={styles.board}>
              <div className={styles.boardHead}>
                <h3 className={styles.boardTitle}>My Campaigns</h3>
                <span className={`${styles.fakeBtn} ${styles.fakeBtnPrimary}`}>
                  <Plus size={14} /> New Campaign
                </span>
              </div>

              {!published ? (
                <div className={styles.emptyBoard}>
                  <Megaphone size={26} />
                  <p>No campaigns yet — let’s create one.</p>
                </div>
              ) : (
                <div className={styles.campaignCardLive}>
                  <div className={styles.ccTop}>
                    <h4>{DEMO.brand.campaign.title}</h4>
                    <span className={styles.badgeActive}>active</span>
                  </div>
                  <p className={styles.ccDesc}>{DEMO.brand.campaign.desc}</p>
                  <div className={styles.ccMeta}>
                    <span><DollarSign size={12} /> ${Number(DEMO.brand.campaign.budget).toLocaleString()}</span>
                    <span><Users size={12} /> {showInterested ? DEMO.brand.interested.length : 0} interested</span>
                  </div>
                </div>
              )}

              {showInterested && (
                <div className={styles.interestedWrap}>
                  <div className={styles.interestedLabel}>
                    <Sparkles size={13} /> Interested creators
                  </div>
                  <div className={styles.interestedList}>
                    {DEMO.brand.interested.map((c, i) => (
                      <div
                        key={c.handle}
                        className={`${styles.creatorRow} ${i === 0 ? styles.creatorRowTarget : ''}`}
                        style={{ animationDelay: `${i * 0.14}s` }}
                      >
                        <span className={styles.avatar} style={{ '--hue': c.hue }} />
                        <div className={styles.crInfo}>
                          <strong>{c.name}</strong>
                          <span>{c.handle} · {c.niche} · {c.subs}</span>
                        </div>
                        <span className={`${styles.fakeBtn} ${i === 0 ? styles.fakeBtnPrimary : styles.fakeBtnGhost}`}>
                          <MessageSquare size={13} /> Start chat
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Create-campaign modal mock */}
              {modalOpen && (
                <div className={styles.mockModal}>
                  <div className={styles.mockModalCard}>
                    <h4 className={styles.mockModalTitle}>Create Campaign</h4>
                    <DemoField label="Campaign Title" value={fields.title} />
                    <DemoField label="Budget (USD)" value={fields.budget} />
                    <DemoField label="Deliverable" value={fields.deliverable} />
                    <DemoField label="Description" value={fields.desc} area />
                    <span className={`${styles.fakeBtn} ${styles.fakeBtnPrimary} ${styles.mockModalCta}`}>
                      Create Campaign
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------- CREATOR STAGE ---------- */}
          {!isBrand && !chatOpen && (
            <div className={styles.board}>
              <div className={styles.boardHead}>
                <h3 className={styles.boardTitle}>Available Campaigns</h3>
              </div>

              {selectedCampaign === null ? (
                <div className={styles.campaignGridDemo}>
                  {DEMO.creator.campaigns.map((c, i) => (
                    <div key={c.title} className={styles.campaignCardLive} style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className={styles.ccTop}>
                        <h4>{c.title}</h4>
                        <span className={styles.badgeTag} style={{ '--hue': c.hue }}>{c.tag}</span>
                      </div>
                      <div className={styles.ccBrand}><Building2 size={12} /> {c.brand}</div>
                      <div className={styles.ccMeta}>
                        <span><DollarSign size={12} /> {c.budget}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.detailCard}>
                  <div className={styles.ccTop}>
                    <h4>{DEMO.creator.campaigns[0].title}</h4>
                    <span className={styles.badgeTag} style={{ '--hue': 150 }}>Tech</span>
                  </div>
                  <div className={styles.ccBrand}><Building2 size={12} /> {DEMO.creator.campaigns[0].brand}</div>
                  {!detailsReady ? (
                    <div className={styles.detailLoading}>
                      <span className={styles.miniSpinner} /> Loading campaign details…
                    </div>
                  ) : (
                    <>
                      <p className={styles.ccDesc}>
                        Looking for a tech creator to feature our new smart-home hub in a dedicated 60s integration.
                      </p>
                      <div className={styles.ccMeta}>
                        <span><DollarSign size={12} /> $5,000</span>
                      </div>
                      <span className={`${styles.fakeBtn} ${styles.fakeBtnPrimary} ${styles.detailCta}`}>
                        <Hand size={14} /> I’m interested · Open chat
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ---------- CHAT STAGE (shared) ---------- */}
          {chatOpen && (
            <div className={styles.chatPanel}>
              <div className={styles.chatHead}>
                <span
                  className={styles.avatar}
                  style={{ '--hue': isBrand ? DEMO.brand.creator.hue : DEMO.creator.brand.hue }}
                />
                <div className={styles.chatWho}>
                  <strong>{isBrand ? DEMO.brand.creator.name : DEMO.creator.brand.name}</strong>
                  <span className={styles.chatLive}><span className={styles.liveDot} /> live now</span>
                </div>
              </div>
              <div className={styles.chatBody}>
                {chatMsgs.map((m, i) =>
                  m.from === 'sys' ? (
                    <div key={i} className={styles.chatSys}>{m.text}</div>
                  ) : (
                    <div key={i} className={`${styles.bubble} ${m.from === 'you' ? styles.bubbleYou : styles.bubbleThem}`}>
                      {m.text}
                    </div>
                  )
                )}
              </div>
              <div className={styles.chatInput}>
                <span className={styles.chatInputText}>Write a message…</span>
                <span className={styles.chatSend}><Send size={15} /></span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footerNote}>
          <CheckCircle size={13} /> This is a guided preview. Your real dashboard is right behind it.
        </div>
      </div>
    </div>
  );
}

function DemoField({ label, value, area }) {
  return (
    <div className={styles.demoField}>
      <span className={styles.demoFieldLabel}>{label}</span>
      <div className={`${styles.demoFieldBox} ${area ? styles.demoFieldArea : ''}`}>
        {value}
        <span className={styles.caret} />
      </div>
    </div>
  );
}
