'use client';

import { useState, useCallback, useEffect } from 'react';
import styles from '../landing.module.css';

const PLATFORM_FEE_PERCENT = 10;

// Currency configs by region
const CURRENCY_MAP = {
  INR: { code: 'INR', locale: 'en-IN', min: 5000, max: 500000, step: 5000, default: 100000 },
  USD: { code: 'USD', locale: 'en-US', min: 50, max: 5000, step: 50, default: 1000 },
  GBP: { code: 'GBP', locale: 'en-GB', min: 40, max: 4000, step: 40, default: 800 },
  EUR: { code: 'EUR', locale: 'de-DE', min: 50, max: 5000, step: 50, default: 1000 },
  CAD: { code: 'CAD', locale: 'en-CA', min: 70, max: 7000, step: 50, default: 1400 },
  AUD: { code: 'AUD', locale: 'en-AU', min: 80, max: 8000, step: 50, default: 1500 },
  JPY: { code: 'JPY', locale: 'ja-JP', min: 7000, max: 700000, step: 5000, default: 140000 },
};

// Map country codes to currencies
const COUNTRY_CURRENCY = {
  IN: 'INR',
  US: 'USD',
  GB: 'GBP',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR', GR: 'EUR',
  CA: 'CAD',
  AU: 'AUD', NZ: 'AUD',
  JP: 'JPY',
};

function formatCurrency(amount, currencyConfig) {
  return new Intl.NumberFormat(currencyConfig.locale, {
    style: 'currency',
    currency: currencyConfig.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Detect region from browser timezone as primary, with IP fallback
function detectCurrencyFromTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) return 'INR';
    if (tz.startsWith('America/New_York') || tz.startsWith('America/Chicago') || tz.startsWith('America/Denver') || tz.startsWith('America/Los_Angeles') || tz.startsWith('US/')) return 'USD';
    if (tz.startsWith('Europe/London')) return 'GBP';
    if (tz.startsWith('Europe/')) return 'EUR';
    if (tz.startsWith('America/Toronto') || tz.startsWith('America/Vancouver') || tz.startsWith('Canada/')) return 'CAD';
    if (tz.startsWith('Australia/')) return 'AUD';
    if (tz.startsWith('Asia/Tokyo')) return 'JPY';
  } catch {
    // Fallback
  }
  return null;
}

export default function DealCalculator() {
  const [currencyKey, setCurrencyKey] = useState('INR'); // Default, updated after detection
  const [dealAmount, setDealAmount] = useState(CURRENCY_MAP.INR.default);
  const [detected, setDetected] = useState(false);

  // Detect region on mount
  useEffect(() => {
    async function detectRegion() {
      // Try timezone first (instant, no network)
      const tzCurrency = detectCurrencyFromTimezone();
      if (tzCurrency) {
        setCurrencyKey(tzCurrency);
        setDealAmount(CURRENCY_MAP[tzCurrency].default);
        setDetected(true);
        return;
      }

      // Fallback: IP-based detection (free, no-auth endpoint)
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          const country = data.country_code;
          const mapped = COUNTRY_CURRENCY[country] || 'USD';
          setCurrencyKey(mapped);
          setDealAmount(CURRENCY_MAP[mapped].default);
        }
      } catch {
        // Keep default INR
      }
      setDetected(true);
    }
    detectRegion();
  }, []);

  const config = CURRENCY_MAP[currencyKey];
  const platformFee = Math.round(dealAmount * (PLATFORM_FEE_PERCENT / 100));
  const creatorReceives = dealAmount - platformFee;

  const handleSliderChange = useCallback((e) => {
    setDealAmount(Number(e.target.value));
  }, []);

  // Calculate the fill percentage for the slider track
  const fillPercent = ((dealAmount - config.min) / (config.max - config.min)) * 100;

  return (
    <div className={styles.calculatorCard} id="deal-calculator">
      {/* Slider */}
      <div className={styles.calculatorSlider}>
        <div className={styles.sliderLabel}>
          <span>Deal Amount</span>
          <span className={styles.sliderValue}>
            {detected ? formatCurrency(dealAmount, config) : '...'}
          </span>
        </div>
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={dealAmount}
          onChange={handleSliderChange}
          className={styles.sliderTrack}
          id="deal-amount-slider"
          aria-label="Deal amount"
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${fillPercent}%, var(--bg-elevated) ${fillPercent}%, var(--bg-elevated) 100%)`,
          }}
        />
        <div className={styles.sliderRange}>
          <span>{formatCurrency(config.min, config)}</span>
          <span>{formatCurrency(config.max, config)}</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className={styles.breakdownGrid}>
        <div className={styles.breakdownItem}>
          <span className={styles.breakdownLabel}>Brand Pays</span>
          <span className={styles.breakdownValue}>
            {formatCurrency(dealAmount, config)}
          </span>
        </div>
        <div className={styles.breakdownItem}>
          <span className={styles.breakdownLabel}>Platform Fee ({PLATFORM_FEE_PERCENT}%)</span>
          <span className={styles.breakdownValue}>
            {formatCurrency(platformFee, config)}
          </span>
        </div>
        <div className={`${styles.breakdownItem} ${styles.breakdownHighlight}`}>
          <span className={styles.breakdownLabel}>Creator Receives</span>
          <span className={styles.breakdownValue}>
            {formatCurrency(creatorReceives, config)}
          </span>
        </div>
      </div>
    </div>
  );
}
