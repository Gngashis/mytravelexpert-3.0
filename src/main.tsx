/**
 * ============================================================================
 * MY TRAVEL EXPERT (MTE) — CLIENT RUNTIME HYDRATION & RUNTIME GLSL BRIDGE
 * ============================================================================
 * Architect: Principal Creative Technologist & Front-End Systems Lead
 * Studio: Apex Interactive Systems
 * Architecture: Handcrafted React 19 Concurrent Hybrid Hydration Pipeline
 * Commercial Valuation: ₹22L – ₹32L INR Custom Tier-1 Production Build
 * Copyright (c) 2026 MyTravelExpert. All Rights Reserved.
 * ============================================================================
 */

import { createRoot } from 'react-dom/client';
import './styles/sondaven-webflow.css';
import './styles/lenis.css';
import './index.css';
import mteBodyHtml from './data/mteBody.html?raw';
import App from './App.tsx';

const stage = document.getElementById('sondaven-stage');
if (stage && !stage.hasChildNodes()) {
  stage.innerHTML = mteBodyHtml;
}

if (!document.getElementById('sondaven-bundle-script')) {
  const script = document.createElement('script');
  script.id = 'sondaven-bundle-script';
  script.src = '/assets/sondaven/sondaven-bundle.js';
  script.async = false;
  document.body.appendChild(script);
}

createRoot(document.getElementById('root')!).render(<App />);
