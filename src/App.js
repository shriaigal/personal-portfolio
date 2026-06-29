import React, { useState, useEffect, useRef, useCallback } from "react";
import * as emailjs from "@emailjs/browser";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0F172A;
    --card: #1E293B;
    --card-hover: #243451;
    --border: #334155;
    --border-subtle: #1e293b;
    --primary: #2563EB;
    --accent: #3B82F6;
    --text: #F1F5F9;
    --text-muted: #94A3B8;
    --text-dim: #64748B;
    --radius: 12px;
    --radius-lg: 16px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --transition: 200ms ease;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
    font-size: 16px;
    overflow-x: hidden;
  }

  .container { max-width: 1120px; margin: 0 auto; padding: 0 24px; }

  section { padding: 96px 0; }

  .section-eyebrow {
    font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 12px;
  }

  .section-title {
    font-size: clamp(28px, 4vw, 40px); font-weight: 700;
    color: var(--text); margin-bottom: 16px; line-height: 1.2;
  }

  .section-subtitle { font-size: 17px; color: var(--text-muted); max-width: 560px; line-height: 1.7; text-align: justify;}

  .section-header { margin-bottom: 56px; }

  /* NAVBAR */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: rgba(15,23,42,0.85); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-subtle); transition: border-color var(--transition);
  }
  .navbar.scrolled { border-bottom-color: var(--border); }
  .nav-inner {
    display: flex; align-items: center; justify-content: space-between;
    height: 64px; max-width: 1120px; margin: 0 auto; padding: 0 24px;
  }
  .nav-logo {
    font-size: 18px; font-weight: 700; color: var(--text);
    text-decoration: none; display: flex; align-items: center; gap: 8px;
  }
  .nav-logo span {
    width: 32px; height: 32px; background: var(--primary); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #fff;
  }
  .nav-links { display: flex; align-items: center; gap: 4px; list-style: none; }
  .nav-links a {
    font-size: 14px; font-weight: 500; color: var(--text-muted);
    text-decoration: none; padding: 6px 12px; border-radius: 6px;
    transition: color var(--transition), background var(--transition);
  }
  .nav-links a:hover, .nav-links a.active { color: var(--text); background: rgba(255,255,255,0.06); }
  .nav-resume {
    font-size: 14px; font-weight: 600; color: #fff; background: var(--primary);
    padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer;
    text-decoration: none; transition: background var(--transition), transform var(--transition);
  }
  .nav-resume:hover { background: var(--accent); transform: translateY(-1px); }
  .nav-mobile-btn {
    display: none; background: none; border: none; cursor: pointer;
    padding: 8px; color: var(--text); font-size: 22px;
  }
  .nav-mobile-menu {
    display: none; flex-direction: column; gap: 4px;
    padding: 16px 24px 20px; border-top: 1px solid var(--border);
    background: rgba(15,23,42,0.97);
  }
  .nav-mobile-menu.open { display: flex; }
  .nav-mobile-menu a {
    font-size: 15px; font-weight: 500; color: var(--text-muted);
    text-decoration: none; padding: 10px 0; border-bottom: 1px solid var(--border-subtle);
    transition: color var(--transition);
  }
  .nav-mobile-menu a:hover, .nav-mobile-menu a.active { color: var(--text); }

  /* HERO */
  #home { min-height: 100vh; display: flex; align-items: center; padding-top: 64px; }
  .hero-grid { display: grid; grid-template-columns: 1fr 400px; gap: 64px; align-items: center; }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500;
    color: var(--accent); background: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.2);
    border-radius: 100px; padding: 6px 14px; margin-bottom: 24px;
  }
  .hero-eyebrow::before { content: ''; width: 6px; height: 6px; background: var(--accent); border-radius: 50%; }
  .hero-name { font-size: clamp(36px, 5.5vw, 64px); font-weight: 700; line-height: 1.1; color: var(--text); margin-bottom: 16px; }
  .hero-name .highlight { color: var(--accent); }
  .hero-headline { font-size: clamp(18px, 2.5vw, 22px); font-weight: 500; color: var(--text-muted); margin-bottom: 20px; }
  .hero-intro { font-size: 16px; color: var(--text-muted); line-height: 1.75; max-width: 520px; margin-bottom: 36px; text-align: justify; }
  .hero-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 36px; }
  .hero-tag {
    font-size: 12px; font-weight: 500; color: var(--text-dim);
    background: var(--card); border: 1px solid var(--border); border-radius: 100px; padding: 4px 12px;
  }
  .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600;
    color: #fff; background: var(--primary); padding: 12px 24px; border-radius: 10px;
    border: none; cursor: pointer; text-decoration: none;
    transition: background var(--transition), transform var(--transition);
  }
  .btn-primary:hover { background: var(--accent); transform: translateY(-2px); }
  .btn-secondary {
    display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600;
    color: var(--text); background: transparent; padding: 12px 24px; border-radius: 10px;
    border: 1px solid var(--border); cursor: pointer; text-decoration: none;
    transition: background var(--transition), border-color var(--transition), transform var(--transition);
  }
  .btn-secondary:hover { background: var(--card); border-color: var(--text-dim); transform: translateY(-2px); }
  .hero-image-wrap { display: flex; justify-content: center; align-items: center; }
  .hero-image-container { position: relative; width: 320px; height: 320px; }
  .hero-image-ring {
    position: absolute; inset: -12px; border: 2px solid rgba(37,99,235,0.2);
    border-radius: 50%; animation: ring-pulse 3s ease-in-out infinite;
  }
  @keyframes ring-pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.03); opacity: 1; }
  }
  .hero-avatar {
    width: 100%; height: 100%; border-radius: 50%;
    background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
    border: 3px solid var(--border); display: flex; align-items: center;
    justify-content: center; font-size: 96px; font-weight: 700; color: var(--accent);
    overflow: hidden; user-select: none;
  }
  .hero-profile-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
  .badge-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: blink 2s ease-in-out infinite; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  /* ABOUT */
  .about-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 64px; align-items: start; }
  .about-text p { color: var(--text-muted); line-height: 1.8; margin-bottom: 16px; text-align: justify; }
  .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .stat-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; transition: border-color var(--transition), transform var(--transition);
  }
  .stat-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .stat-card .stat-value { font-size: 26px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .stat-card .stat-label { font-size: 13px; color: var(--text-muted); }
  .stat-card .stat-icon { font-size: 20px; margin-bottom: 12px; }

  /* EDUCATION */
  .edu-timeline { position: relative; padding-left: 32px; }
  .edu-timeline::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 2px; background: linear-gradient(to bottom, var(--primary), transparent);
  }
  .edu-item { position: relative; margin-bottom: 40px; }
  .edu-item::before {
    content: ''; position: absolute; left: -38px; top: 20px;
    width: 12px; height: 12px; background: var(--primary); border-radius: 50%;
    border: 2px solid var(--bg); box-shadow: 0 0 0 3px rgba(37,99,235,0.2);
  }
  .edu-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 28px 32px; transition: border-color var(--transition), transform var(--transition);
  }
  .edu-card:hover { border-color: var(--accent); transform: translateX(4px); }
  .edu-degree { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .edu-institution { font-size: 15px; font-weight: 500; color: var(--accent); margin-bottom: 12px; }
  .edu-meta { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 12px; }
  .edu-meta-item { font-size: 13px; color: var(--text-dim); display: flex; align-items: center; gap: 6px; }
  .edu-desc { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-subtle); text-align: justify; }

  /* JOURNEY */
  .journey-track {
    display: flex; gap: 0; overflow-x: auto; padding-bottom: 16px;
    scrollbar-width: thin; scrollbar-color: var(--border) transparent;
  }
  .journey-item { flex: 1; min-width: 120px; text-align: center; position: relative; }
  .journey-item:not(:last-child)::after {
    content: ''; position: absolute; top: 20px; right: -24px;
    width: 48px; height: 2px; background: var(--border); z-index: 0;
  }
  .journey-item.active:not(:last-child)::after { background: var(--primary); }
  .journey-dot-wrap { display: flex; justify-content: center; margin-bottom: 12px; }
  .journey-dot {
    width: 40px; height: 40px; border-radius: 50%; background: var(--card);
    border: 2px solid var(--border); display: flex; align-items: center;
    justify-content: center; font-size: 16px; position: relative; z-index: 1;
    transition: border-color var(--transition), background var(--transition);
  }
  .journey-item.active .journey-dot { background: rgba(37,99,235,0.15); border-color: var(--primary); }
  .journey-label { font-size: 12px; font-weight: 500; color: var(--text-dim); line-height: 1.4; }
  .journey-item.active .journey-label { color: var(--text); }

  /* SKILLS */
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
  .skill-category {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 28px; transition: border-color var(--transition), transform var(--transition);
  }
  .skill-category:hover { border-color: rgba(37,99,235,0.4); transform: translateY(-2px); }
  .skill-cat-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .skill-cat-icon {
    width: 36px; height: 36px; background: rgba(37,99,235,0.12); border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .skill-cat-name { font-size: 15px; font-weight: 600; color: var(--text); }
  .skill-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-chip {
    font-size: 13px; font-weight: 500; color: var(--text-muted);
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    border-radius: 6px; padding: 5px 12px;
    transition: color var(--transition), border-color var(--transition), background var(--transition);
  }
  .skill-chip:hover { color: var(--accent); border-color: rgba(37,99,235,0.4); background: rgba(37,99,235,0.06); }

  /* PROJECTS */
  .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px; }
  .project-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg);
    overflow: hidden; transition: border-color var(--transition), transform var(--transition);
    display: flex; flex-direction: column;
  }
  .project-card:hover { border-color: rgba(37,99,235,0.4); transform: translateY(-4px); }
.project-img {
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    position: relative;
    padding: 0;
    margin: 0;
    border-bottom: 1px solid var(--border);
}

.project-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
}

.project-card:hover .project-image {
    transform: scale(1.05);
}
  .project-card:hover .project-image { transform: scale(1.03); }
  .project-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,.35) 100%);
  }
  .project-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
  .project-title { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .project-desc { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px; flex: 1;text-align: justify; }
  .project-stack { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
  .project-tag {
    font-size: 11px; font-weight: 600; color: var(--accent);
    background: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.2);
    border-radius: 4px; padding: 3px 8px; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em;
  }
  .project-actions { display: flex; gap: 8px; }
  .project-btn {
    flex: 1; display: inline-flex; align-items: center; justify-content: center;
    gap: 6px; font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 8px;
    cursor: pointer; text-decoration: none; border: 1px solid var(--border);
    color: var(--text-muted); background: transparent; transition: all var(--transition);
  }
  .project-btn:hover { color: var(--text); border-color: var(--text-dim); background: rgba(255,255,255,0.04); }
  .project-btn.primary { color: var(--accent); border-color: rgba(37,99,235,0.3); background: rgba(37,99,235,0.06); }
  .project-btn.primary:hover { background: rgba(37,99,235,0.14); border-color: var(--accent); }

  /* PROJECT MODAL */
  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    backdrop-filter: blur(4px); animation: fadein 200ms ease;
  }
  @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
  .modal-box {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg);
    max-width: 720px; width: 100%; max-height: 90vh; overflow-y: auto;
    animation: slidein 220ms ease; scrollbar-width: thin; scrollbar-color: var(--border) transparent;
  }
  @keyframes slidein { from { transform: translateY(16px); opacity: 0; } to { transform: none; opacity: 1; } }
  .modal-header {
  z-index: 999;
    padding: 28px 32px 20px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: flex-start;
    position: sticky; top: 0; background: var(--card);
  }
  .modal-close {
    background: none; border: none; cursor: pointer; color: var(--text-dim);
    font-size: 22px; line-height: 1; padding: 4px; transition: color var(--transition);
  }
  .modal-close:hover { color: var(--text); }
  .modal-body { padding: 28px 32px; }
  .modal-section { margin-bottom: 28px; }
  .modal-section h3 {
    font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--text-dim); margin-bottom: 10px;
  }
  .modal-section p { font-size: 15px; color: var(--text-muted); line-height: 1.75; }
  .modal-section ul { list-style: none; padding: 0; }
  .modal-section ul li {
    font-size: 14px; color: var(--text-muted); padding: 5px 0;
    padding-left: 16px; position: relative;
  }
  .modal-section ul li::before { content: '→'; position: absolute; left: 0; color: var(--accent); font-size: 12px; }

  /* ======================================================
     CERTIFICATIONS — Rebuilt
     Grid of cards with click-to-open modal pattern.
     Clean, minimal, recruiter-friendly.
     ====================================================== */

  .certs-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  /* The card itself */
  .cert-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: border-color 220ms ease, transform 220ms ease, box-shadow 220ms ease;
    outline: none;
  }

  .cert-card:hover,
  .cert-card:focus-visible {
    border-color: rgba(59, 130, 246, 0.45);
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  }

  .cert-card:focus-visible {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
  }

  /* Image area */
  .cert-card-image {
    height: 180px;
    background: #0f172a;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--border);
    overflow: hidden;
  }

  .cert-card-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
    background: #fff;
    transition: transform 320ms ease;
  }

  .cert-card:hover .cert-card-image img {
    transform: scale(1.04);
  }

  /* Card body */
  .cert-card-body {
    padding: 20px 22px 22px;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 6px;
  }

  .cert-card-badge {
    display: inline-flex;
    align-self: flex-start;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #93c5fd;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.22);
    border-radius: 100px;
    padding: 3px 10px;
    margin-bottom: 2px;
  }

  .cert-card-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.35;
  }

  .cert-card-org {
    font-size: 13px;
    color: var(--accent);
    font-weight: 500;
  }

  .cert-card-year {
    font-size: 12px;
    color: var(--text-dim);
    margin-top: 2px;
  }

  /* "View details" hint row */
  .cert-card-hint {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid var(--border-subtle);
  }

  .cert-card-hint span {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-dim);
  }

  .cert-card-hint svg {
    width: 14px;
    height: 14px;
    color: var(--text-dim);
    transition: transform 200ms ease, color 200ms ease;
  }

  .cert-card:hover .cert-card-hint svg,
  .cert-card:focus-visible .cert-card-hint svg {
    transform: translateX(3px);
    color: var(--accent);
  }

  /* ---- Cert Detail Modal ---- */
  .cert-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(6px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadein 180ms ease;
  }

  .cert-modal {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 680px;
    max-height: 92vh;
    overflow-y: auto;
    animation: slidein 220ms ease;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
    display: flex;
    flex-direction: column;
  }

  /* Modal header */
  .cert-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 24px 28px 20px;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    background: var(--card);
    z-index: 1;
  }

  .cert-modal-title-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cert-modal-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
  }

  .cert-modal-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.3;
  }

  .cert-modal-close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: none;
    border: 1px solid var(--border);
    cursor: pointer;
    color: var(--text-dim);
    font-size: 16px;
    line-height: 1;
    transition: color var(--transition), border-color var(--transition), background var(--transition);
  }

  .cert-modal-close:hover { color: var(--text); border-color: var(--text-dim); background: rgba(255,255,255,0.04); }

  /* Modal body */
  .cert-modal-body { padding: 24px 28px 28px; display: flex; flex-direction: column; gap: 24px; }

  /* Full certificate image inside modal */
  .cert-modal-image-wrap {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    cursor: pointer;
  }

  .cert-modal-image-wrap img {
    width: 100%;
    height: auto;
    max-height: 320px;
    object-fit: contain;
    border-radius: 8px;
    display: block;
    transition: transform 300ms ease;
  }

  .cert-modal-image-wrap:hover img { transform: scale(1.02); }

  .cert-modal-image-hint {
    text-align: center;
    font-size: 11px;
    color: var(--text-dim);
    margin-top: 6px;
  }

  /* Meta row */
  .cert-modal-meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .cert-modal-meta-item {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    padding: 12px 14px;
  }

  .cert-modal-meta-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-dim);
    margin-bottom: 4px;
  }

  .cert-modal-meta-value {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.3;
  }

  /* Description */
  .cert-modal-desc {
  text-align: justify;
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.8;
  }

  /* Skills chips */
  .cert-modal-skills-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 10px;
  }

  .cert-modal-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .cert-modal-chip {
    font-size: 12px;
    font-weight: 600;
    color: #93c5fd;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.22);
    border-radius: 100px;
    padding: 5px 12px;
    transition: background 200ms ease, color 200ms ease;
  }

  .cert-modal-chip:hover { background: rgba(59,130,246,0.22); color: #bfdbfe; }

  /* Action buttons */
  .cert-modal-actions {
    display: flex;
    gap: 10px;
  }

  .cert-modal-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    font-size: 14px;
    font-weight: 600;
    padding: 11px 20px;
    border-radius: 10px;
    cursor: pointer;
    text-decoration: none;
    transition: all 200ms ease;
  }

  .cert-modal-btn.primary {
    background: var(--primary);
    color: #fff;
    border: none;
  }

  .cert-modal-btn.primary:hover { background: var(--accent); transform: translateY(-1px); }

  .cert-modal-btn.secondary {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
  }

  .cert-modal-btn.secondary:hover { color: var(--text); border-color: var(--text-dim); background: rgba(255,255,255,0.04); transform: translateY(-1px); }

  /* ======================================================
     END CERTIFICATIONS
     ====================================================== */

  /* HACKATHONS */
  .hack-timeline { display: flex; flex-direction: column; gap: 28px; }
  .hack-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 28px 32px; display: grid; grid-template-columns: 80px 1fr;
    gap: 24px; align-items: start; transition: border-color var(--transition), transform var(--transition);
  }
  .hack-card:hover { border-color: rgba(37,99,235,0.4); transform: translateX(4px); }
  .hack-icon {
    width: 80px; height: 80px; background: rgba(37,99,235,0.1); border-radius: var(--radius);
    display: flex; align-items: center; justify-content: center;
    font-size: 36px; border: 1px solid rgba(37,99,235,0.2);
  }
  .hack-title { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .hack-role { font-size: 13px; color: var(--accent); font-weight: 500; margin-bottom: 10px; }
  .hack-desc { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px; text-align: justify; }
  .hack-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .hack-chip {
    font-size: 11px; font-weight: 500; color: var(--text-dim);
    background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 4px; padding: 3px 8px;
  }
  .hack-achievement {
    display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500;
    color: #f59e0b; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2);
    border-radius: 100px; padding: 4px 12px; margin-top: 12px;
  }

  /* LEARNING */
  .learning-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
  .learning-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; display: flex; align-items: center; gap: 14px;
    transition: border-color var(--transition), transform var(--transition);
  }
  .learning-card:hover { border-color: rgba(37,99,235,0.4); transform: translateY(-2px); }
  .learning-icon {
    width: 40px; height: 40px; background: rgba(37,99,235,0.1); border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
  }
  .learning-name { font-size: 14px; font-weight: 500; color: var(--text); line-height: 1.3; }
  .learning-status { font-size: 11px; color: var(--accent); font-weight: 500; margin-top: 2px; }

  /* DRIVES ME */
  .drives-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
  .drives-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 24px; transition: border-color var(--transition), transform var(--transition);
  }
  .drives-card:hover { border-color: rgba(37,99,235,0.4); transform: translateY(-2px); }
  .drives-icon { font-size: 28px; margin-bottom: 12px; }
  .drives-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
  .drives-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; text-align: justify; }

  /* OBJECTIVE */
  .objective-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 40px 48px; position: relative; overflow: hidden;
  }
  .objective-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 4px; background: var(--primary); border-radius: 4px 0 0 4px;
  }
  .objective-text { font-size: 17px; color: var(--text-muted); line-height: 1.8; font-style: italic; text-align: justify; }

  /* CONTACT */
  .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 56px; align-items: start; }
  .contact-info { display: flex; flex-direction: column; gap: 16px; }
  .contact-item {
    display: flex; align-items: center; gap: 16px; padding: 16px 20px;
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    text-decoration: none; transition: border-color var(--transition), transform var(--transition);
  }
  .contact-item:hover { border-color: var(--accent); transform: translateX(4px); }
  .contact-item-icon {
    width: 40px; height: 40px; background: rgba(37,99,235,0.1); border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;
  }
  .contact-item-label { font-size: 12px; color: var(--text-dim); margin-bottom: 2px; }
  .contact-item-value { font-size: 14px; font-weight: 500; color: var(--text); }

  /* FORM */
  .contact-form { display: flex; flex-direction: column; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group label { font-size: 13px; font-weight: 500; color: var(--text-muted); }
  .form-group input, .form-group textarea {
    background: var(--card); border: 1px solid var(--border); border-radius: 8px;
    padding: 12px 16px; color: var(--text); font-size: 14px; font-family: inherit;
    outline: none; transition: border-color var(--transition); resize: vertical;
  }
  .form-group input:focus, .form-group textarea:focus { border-color: var(--accent); }
  .form-group input::placeholder, .form-group textarea::placeholder { color: var(--text-dim); }
  .form-submit {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-size: 15px; font-weight: 600; color: #fff; background: var(--primary);
    padding: 13px 28px; border-radius: 10px; border: none; cursor: pointer;
    transition: background var(--transition), transform var(--transition); width: 100%;
  }
  .form-submit:hover { background: var(--accent); transform: translateY(-1px); }

  /* FOOTER */
  footer { border-top: 1px solid var(--border-subtle); padding: 48px 0 32px; }
  .footer-inner { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
  .footer-brand p { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-top: 10px; }
  .footer-col h4 { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 16px; letter-spacing: 0.04em; }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .footer-col ul a { font-size: 14px; color: var(--text-muted); text-decoration: none; transition: color var(--transition); }
  .footer-col ul a:hover { color: var(--text); }
  .footer-bottom { border-top: 1px solid var(--border-subtle); padding-top: 24px; display: flex; align-items: center; justify-content: space-between; }
  .footer-bottom p { font-size: 13px; color: var(--text-dim); }
  .back-to-top {
    display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500;
    color: var(--text-muted); background: var(--card); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 14px; cursor: pointer; text-decoration: none; transition: all var(--transition);
  }
  .back-to-top:hover { color: var(--accent); border-color: var(--accent); }

  /* DIVIDER */
  .section-divider { border: none; border-top: 1px solid var(--border-subtle); margin: 0; }

  /* FADE IN */
  .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 500ms ease, transform 500ms ease; }
  .fade-in.visible { opacity: 1; transform: none; }

  /* RESPONSIVE */
  @media (max-width: 1024px) {
    .certs-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr; text-align: center; }
    .hero-image-wrap { order: -1; }
    .hero-image-container { width: 220px; height: 220px; }
    .hero-actions { justify-content: center; }
    .hero-tags { justify-content: center; }
    .hero-intro { margin: 0 auto 36px; }
    .about-grid { grid-template-columns: 1fr; }
    .contact-grid { grid-template-columns: 1fr; }
    .footer-inner { grid-template-columns: 1fr 1fr; }
    .hack-card { grid-template-columns: 1fr; }
    .hack-icon { width: 60px; height: 60px; font-size: 28px; }
    .cert-modal-meta { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 640px) {
    section { padding: 64px 0; }
    .nav-links { display: none; }
    .nav-resume { display: none; }
    .nav-mobile-btn { display: flex; }
    .hero-image-container { width: 180px; height: 180px; }
    .about-stats { grid-template-columns: 1fr 1fr; }
    .objective-card { padding: 28px 24px; }
    .modal-body { padding: 20px 20px; }
    .modal-header { padding: 20px 20px 16px; }
    .footer-inner { grid-template-columns: 1fr; gap: 28px; }
    .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
    .certs-grid { grid-template-columns: 1fr; }
    .cert-modal-meta { grid-template-columns: 1fr; }
    .cert-modal-actions { flex-direction: column; }
    .cert-modal-body { padding: 20px; gap: 20px; }
    .cert-modal-header { padding: 18px 20px 16px; }
  }
`;
const top_logo="</>";

const resumePDF = "/resume/A_S_Shridatta_Aigal_Resume.pdf";

const SKILLS_DATA = [
  { icon: "💻", name: "Programming Languages", skills: ["Java", "Python", "JavaScript", "SQL"] },
  { icon: "🎨", name: "Frontend", skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design"] },
  { icon: "⚙️", name: "Backend", skills: ["Flask", "REST APIs", "Authentication", "Session Management"] },
  { icon: "🗄️", name: "Database", skills: ["Oracle SQL", "SQLite", "MongoDB (Learning)"] },
  { icon: "☁️", name: "Cloud — AWS", skills: ["EC2", "S3", "ECR"] },
  { icon: "🐳", name: "DevOps", skills: ["Docker", "Jenkins", "GitHub Actions", "CI/CD Pipelines", "Git", "GitHub"] },
  { icon: "🤖", name: "Machine Learning", skills: ["ML Fundamentals", "Data Preprocessing", "XGBoost"] },
  { icon: "📐", name: "Computer Science", skills: ["Data Structures & Algorithms", "OOPs", "DBMS", "Operating Systems"] },
];

const PROJECTS_DATA = [
  {
    id: 1,
    image: "./projects/SAP.png",
    title: "Student Academic Portal",
    description: "A comprehensive academic management platform with QR attendance, analytics dashboards, and PDF report generation built using Flask and SQLite.",
    stack: ["Python", "Flask", "SQLite", "Chart.js", "Tailwind CSS"],
    features: ["QR Attendance", "Admin Dashboard", "Student Analytics", "Marks Management", "PDF Reports", "Timetable", "Feedback System"],
    overview: "A full-featured academic management system designed to streamline the day-to-day operations of educational institutions. The platform provides role-based access for students, faculty, and administrators.",
    problem: "Educational institutions often rely on manual processes for attendance tracking, marks management, and report generation — leading to errors, delays, and lack of real-time visibility.",
    solution: "Built a centralized Flask-based web application with a relational SQLite database, enabling QR-based attendance, automated report generation, and real-time performance dashboards.",
    challenges: "Designing a QR-based attendance system that prevents proxy marking, and generating PDF reports dynamically from live database data required custom solutions with Python libraries.",
    learning: "Gained deep experience in Flask session management, SQLite relationships, Chart.js visualizations, and Python-based PDF generation.",
    architecture: "MVC pattern with Flask Blueprints separating admin, faculty, and student modules. SQLite handles data persistence with normalized schema design.",
  },
  {
    id: 2,
    image: "./projects/agriprice.png",
    title: "AgriPrice Portal",
    description: "A role-based agricultural marketplace connecting farmers and buyers with OTP verification, multilingual support, and real-time price comparison.",
    stack: ["Python", "Flask", "SQLite", "HTML", "CSS", "JavaScript"],
    features: ["Seller Registration", "OTP Verification", "Product Management", "Price Comparison", "Multilingual UI", "Dark/Light Theme", "Search & Filter"],
    overview: "An agricultural marketplace designed to bridge the gap between farmers and buyers by providing transparent price listings, direct communication channels, and a secure verification system.",
    problem: "Farmers in rural areas often have limited access to fair market prices and face exploitation by middlemen. Buyers lack a reliable platform to source agricultural produce directly.",
    solution: "Developed a Flask web application with role-based authentication (seller/buyer/admin), OTP-based verification for trust, and multilingual support to cater to diverse regional users.",
    challenges: "Implementing OTP verification without a paid SMS gateway, building a multilingual interface with dynamic language switching, and ensuring mobile responsiveness for rural users.",
    learning: "Learned role-based access control design, session security, dynamic UI themes, and building for low-bandwidth environments.",
    architecture: "Single Flask application with role middleware, SQLite database for product listings and user data, and client-side JavaScript for dynamic filtering.",
  },
  {
    id: 3,
    image: "./projects/TAS.png",
    title: "Traffic Analytics System",
    description: "An intelligent transportation platform combining XGBoost-based traffic prediction with graph algorithms for real-time route optimization.",
    stack: ["Python", "Flask", "XGBoost", "Scikit-learn", "Pandas", "NumPy"],
    features: ["Traffic Prediction", "Route Optimization", "Weather Integration", "Interactive Heatmaps", "ML Model", "Graph Algorithms", "Analytics Dashboard"],
    overview: "An AI-powered transportation analytics system that predicts traffic congestion using machine learning and recommends optimal routes using graph-based algorithms.",
    problem: "Urban traffic congestion causes significant time loss and fuel waste. Existing navigation tools lack predictive capabilities based on historical patterns and real-time weather data.",
    solution: "Combined an XGBoost-based ML model trained on historical traffic data with Dijkstra's graph algorithm for dynamic route optimization, presented through an interactive Flask dashboard.",
    challenges: "Feature engineering for temporal traffic patterns, integrating weather API data as input features, and visualizing traffic heatmaps interactively in a web browser.",
    learning: "Practical experience with end-to-end ML pipeline: data preprocessing, feature engineering, model training with XGBoost, evaluation, and deployment within a Flask application.",
    architecture: "Data layer (Pandas/NumPy) → ML layer (Scikit-learn/XGBoost) → API layer (Flask REST) → Frontend (Chart.js heatmaps, interactive dashboard).",
  },
];

const CERTS_DATA = [

  {
    id: 4,
    image: "./certificates/AWS.png",
    title: "Cloud Computing in AWS",
    org: "CertoMeter",
    completed: "2026",
    year: "2026",
    credential: "Workshop Certificate",
    description:
      "Completed cloud computing fundamentals on AWS covering EC2, S3, IAM, networking, deployment, and cloud architecture — with hands-on exercises for provisioning and managing cloud resources.",
    skills: ["AWS", "EC2", "S3", "IAM", "Networking", "Cloud Computing", "Virtual Machines"],
    link: "./certificates/AWS.png",
    download: "./certificates/AWS.png",
  },
  {
    id: 3,
    image: "./certificates/Hackverse2.0.png",
    title: "HackVerse 2.0",
    org: "Department of MCA, BMSIT&M",
    completed: "2026",
    year: "2026",
    credential: "National Level Participation",
    description:
      "Led Team NextGen Bharat as Team Leader in the National Level HackVerse 2.0 Hackathon, building and presenting an AI-powered solution under strict time constraints.",
    skills: ["AI", "Machine Learning", "Python", "Flask", "Team Leadership", "Presentation", "Rapid Prototyping"],
    link: "./certificates/Hackverse2.0.png",
    download: "./certificates/Hackverse2.0.png",
  },
    {
    id: 2,
    image: "./certificates/DBMS.jpeg",
    title: "DBMS with Oracle PL/SQL",
    org: "SQE Systems & Solutions × BMSIT&M",
    completed: "June 2026",
    year: "2026",
    credential: "Certificate of Completion",
    description:
      "Completed an intensive Oracle Database & PL/SQL training covering SQL, PL/SQL programming, stored procedures, functions, triggers, packages, cursors, and relational database design with normalization principles.",
    skills: ["Oracle SQL", "PL/SQL", "Stored Procedures", "Functions", "Triggers", "Packages", "Database Design", "Normalization"],
    link: "./certificates/DBMS.jpeg",
    download: "./certificates/DBMS.jpeg",
  },
  {
    id: 1,
    image: "./certificates/TCS.png",
    title: "TCS iON Career Edge – Young Professional",
    org: "Tata Consultancy Services",
    completed: "2025",
    year: "2025",
    credential: "Professional Certificate",
    description:
      "Completed TCS iON Young Professional certification covering communication, workplace readiness, business etiquette, interview preparation, and professional ethics in a corporate environment.",
    skills: ["Communication", "Professional Skills", "Business Etiquette", "Interview Skills", "Presentation", "Resume Building"],
    link: "./certificates/TCS.png",
    download: "./certificates/TCS.png",
  },
];

const DRIVES_DATA = [
  { icon: "⚙️", title: "Building real-world software", desc: "I care about creating software that solves genuine problems, not just theoretical exercises." },
  { icon: "🧩", title: "Solving complex challenges", desc: "Complex technical problems are opportunities to grow and discover creative solutions." },
  { icon: "🚀", title: "Emerging technologies", desc: "Cloud, AI, and DevOps represent the frontier of what software can do — I want to be there." },
  { icon: "✍️", title: "Clean, maintainable code", desc: "Well-structured code is a form of communication. I write for the next developer, not just the compiler." },
  { icon: "🤝", title: "Collaborative teams", desc: "The best software is built by people who listen, share ideas, and lift each other up." },
  { icon: "📈", title: "Continuous improvement", desc: "Every project, every hackathon, every course is a step toward a better version of myself." },
];

const LEARNING_DATA = [
  { icon: "⚛️", name: "MERN Stack", status: "In progress" },
  { icon: "🧠", name: "ML Fundamentals", status: "In progress" },
  { icon: "💻", name: "AWS EC2", status: "In progress" },
  { icon: "🪣", name: "AWS S3", status: "In progress" },
  { icon: "📦", name: "AWS ECR", status: "In progress" },
  { icon: "🐳", name: "Docker", status: "Deepening" },
  { icon: "🔧", name: "Jenkins", status: "In progress" },
  { icon: "⚡", name: "GitHub Actions", status: "In progress" },
  { icon: "🔄", name: "CI/CD Pipelines", status: "In progress" },
];

const JOURNEY_DATA = [
  { icon: "🎓", label: "BCA", active: true },
  { icon: "🐍", label: "Python", active: true },
  { icon: "🌐", label: "Flask", active: true },
  { icon: "💻", label: "Web Dev", active: true },
  { icon: "☁️", label: "AWS", active: true },
  { icon: "🐳", label: "Docker", active: true },
  { icon: "🔄", label: "CI/CD", active: true },
  { icon: "🤖", label: "ML", active: true },
  { icon: "⚛️", label: "MERN", active: false },
  { icon: "🏢", label: "SDE", active: false },
];

const NAV_SECTIONS = ["home","about","education","journey","skills","projects","hackathons","certifications","learning","contact"];

function useScrollSpy() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 80;
      for (const id of [...NAV_SECTIONS].reverse()) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return active;
}

function useFadeIn(ref) {
  useEffect(() => {
    if (!ref.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(ref.current);

    return () => obs.disconnect();
  }, [ref]); // ✅
}

function FadeIn({ children, delay = 0 }) {
  const ref = useRef();
  useFadeIn(ref);
  return <div ref={ref} className="fade-in" style={{ transitionDelay: delay + "ms" }}>{children}</div>;
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-label={project.title}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Project Detail</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{project.title}</div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-section"><h3>Overview</h3><p>{project.overview}</p></div>
          <div className="modal-section"><h3>Problem statement</h3><p>{project.problem}</p></div>
          <div className="modal-section"><h3>Solution</h3><p>{project.solution}</p></div>
          <div className="modal-section"><h3>Key features</h3><ul>{project.features.map(f => <li key={f}>{f}</li>)}</ul></div>
          <div className="modal-section"><h3>Architecture</h3><p>{project.architecture}</p></div>
          <div className="modal-section"><h3>Challenges</h3><p>{project.challenges}</p></div>
          <div className="modal-section"><h3>Learning outcomes</h3><p>{project.learning}</p></div>
          <div className="modal-section">
            <h3>Technologies</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.stack.map(t => <span key={t} className="project-tag">{t}</span>)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <a href="https://github.com/shriaigal" className="project-btn primary" style={{ flex: 1, textDecoration: "none" }}>⬡ View on GitHub</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Certification card modal ──────────────────────────────────────────────────
function CertModal({ cert, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    // Lock body scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="cert-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={cert.title}
    >
      <div className="cert-modal">
        {/* Header */}
        <div className="cert-modal-header">
          <div className="cert-modal-title-group">
            <span className="cert-modal-eyebrow">Certification</span>
            <h2 className="cert-modal-title">{cert.title}</h2>
          </div>
          <button className="cert-modal-close" onClick={onClose} aria-label="Close certification details">✕</button>
        </div>

        <div className="cert-modal-body">
          {/* Full image — click to open in new tab */}
          <div>
            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-modal-image-wrap" aria-label="Open full certificate">
              <img src={cert.image} alt={`${cert.title} certificate`} />
            </a>
            <p className="cert-modal-image-hint">Click image to open full certificate ↗</p>
          </div>

          {/* Meta grid */}
          <div className="cert-modal-meta">
            <div className="cert-modal-meta-item">
              <div className="cert-modal-meta-label">Issued by</div>
              <div className="cert-modal-meta-value">{cert.org}</div>
            </div>
            <div className="cert-modal-meta-item">
              <div className="cert-modal-meta-label">Completed</div>
              <div className="cert-modal-meta-value">{cert.completed}</div>
            </div>
            <div className="cert-modal-meta-item">
              <div className="cert-modal-meta-label">Credential type</div>
              <div className="cert-modal-meta-value">{cert.credential}</div>
            </div>
          </div>

          {/* Description */}
          <p className="cert-modal-desc">{cert.description}</p>

          {/* Skills */}
          <div>
            <div className="cert-modal-skills-label">Skills covered</div>
            <div className="cert-modal-chips">
              {cert.skills.map(s => <span key={s} className="cert-modal-chip">{s}</span>)}
            </div>
          </div>

          {/* Actions */}
          <div className="cert-modal-actions">
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-modal-btn primary"
            >
              ↗ View certificate
            </a>
            <a
              href={cert.download}
              download
              className="cert-modal-btn secondary"
            >
              ⬇ Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Certification card ────────────────────────────────────────────────────────
function CertCard({ cert, onClick }) {
  return (
    <div
      className="cert-card"
      onClick={() => onClick(cert)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(cert); } }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${cert.title}`}
    >
      <div className="cert-card-image">
        <img src={cert.image} alt={`${cert.title} preview`} />
      </div>
      <div className="cert-card-body">
        <span className="cert-card-badge">Certification</span>
        <div className="cert-card-title">{cert.title}</div>
        <div className="cert-card-org">{cert.org}</div>
        <div className="cert-card-year">📅 {cert.year}</div>
        <div className="cert-card-hint">
          <span>View details</span>
          {/* Inline arrow SVG — no external dep needed */}
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Main Portfolio component ──────────────────────────────────────────────────
export default function Portfolio() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalProject, setModalProject] = useState(null);
  const [activeCert, setActiveCert] = useState(null);
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const active = useScrollSpy();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  const handleFormChange = (e) => setFormState(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const currentDateTime = new Date().toLocaleString("en-IN", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
    });
    emailjs
      .send("service_4wcwbeo", "template_dozcdur", {
        from_name: formState.name,
        from_email: formState.email,
        subject: formState.subject,
        message: formState.message,
        time: currentDateTime,
      }, "hvOAqVVuwmPtInani")
      .then(() => {
        alert("Message sent successfully!");
        setFormState({ name: "", email: "", subject: "", message: "" });
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to send message.");
      });
  };

  return (
    <>
      <style>{css}</style>

      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo("home"); }}>
            <span>{top_logo}</span>
            A S Shridatta Aigal
          </a>
          <ul className="nav-links">
            {["About","Education","Journey","Skills","Projects","Contact"].map(n => (
              <li key={n}>
                <a href={`#${n.toLowerCase()}`} className={active === n.toLowerCase() ? "active" : ""}
                  onClick={(e) => { e.preventDefault(); scrollTo(n.toLowerCase()); }}>
                  {n}
                </a>
              </li>
            ))}
          </ul>
          {/* <a href={resumePDF} target="_blank" rel="noopener noreferrer" className="nav-resume">Download Resume</a> */}
          <button className="nav-mobile-btn" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
        <div className={`nav-mobile-menu${mobileOpen ? " open" : ""}`}>
          {NAV_SECTIONS.map(id => (
            <a key={id} href={`#${id}`} className={active === id ? "active" : ""}
              onClick={(e) => { e.preventDefault(); scrollTo(id); }}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="home">
        <div className="container">
          <div className="hero-grid">
            <div>
              <FadeIn>
                <h1 className="hero-name">A S Shridatta Aigal</h1>
                <p className="hero-headline">Software Development Engineer</p>
<p className="hero-intro">
  MCA student at BMS Institute of Technology & Management (BMSIT&M), Bengaluru, passionate about building scalable software solutions that solve real-world problems. Currently focused on Full Stack Development, Cloud Computing, DevOps, and Machine Learning.
</p>
                <div className="hero-tags">
                  {["Full Stack Dev","Cloud & DevOps","Machine Learning","Open to SDE Roles"].map(t => (
                    <span key={t} className="hero-tag">{t}</span>
                  ))}
                </div>
                <div className="hero-actions">
                  <a href="#projects" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo("projects"); }}>View Projects →</a>
                  <a href="#contact" className="btn-secondary" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Contact Me</a>
                  <a
    href={resumePDF}
    target="_blank"
    rel="noopener noreferrer"
   className="btn-secondary">⬇ Resume</a>
                </div>
              </FadeIn>
            </div>
            <div className="hero-image-wrap">
              <FadeIn delay={150}>
                <div className="hero-image-container">
                  <div className="hero-image-ring" />
                  <div className="hero-avatar">
                    <img src="./profile.jpg" alt="A S Shridatta Aigal" className="hero-profile-img" />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ABOUT */}
      <section id="about">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <div className="section-eyebrow">About</div>
              <h2 className="section-title">Building software with purpose</h2>
              <p className="section-subtitle">A developer who cares about clean architecture, real-world impact, and continuous growth.</p>
            </div>
          </FadeIn>
          <div className="about-grid">
            <FadeIn>
<div className="about-text">
  <p>
    Hello! I'm Shridatta Aigal, an enthusiastic software developer with a passion for designing and building modern applications that solve real-world problems.
  </p>

  <p>
    My journey began during my BCA, where I built my first academic management applications using Python and Flask. Through these projects, I learned the fundamentals of backend development, authentication systems, relational databases, and software architecture.
  </p>

  <p>
    As I progressed, I realized that software engineering is much more than writing code. It requires understanding user requirements, designing scalable systems, solving algorithmic problems, deploying applications, and continuously improving performance and maintainability.
  </p>

  <p>
    Today, as an MCA student, I'm actively expanding my knowledge in cloud computing, DevOps, and machine learning. I am gaining hands-on experience with Docker, AWS, Jenkins, GitHub Actions, and CI/CD pipelines through personal projects and continuous learning. Outside academics, I participate in hackathons and enjoy challenging myself by building practical software solutions.
  </p>
</div>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="about-stats">
                {[
                  { icon: "🎓", value: "MCA", label: "BMSIT&M, Bengaluru" },
                  { icon: "⭐", value: "8.50", label: "Current CGPA" },
                  { icon: "📁", value: "3+", label: "Major Projects" },
                  { icon: "🏆", value: "1+", label: "Hackathons" },
                  { icon: "🛠️", value: "20+", label: "Technologies" },
                  { icon: "📜", value: "4+", label: "Certifications" },
                ].map((s, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-icon">{s.icon}</div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* EDUCATION */}
      <section id="education">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <div className="section-eyebrow">Education</div>
              <h2 className="section-title">Academic background</h2>
              <p className="section-subtitle">A foundation built through rigorous coursework and hands-on project work at every stage.</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="edu-timeline">
              {[
                { degree: "Master of Computer Applications (MCA)", institution: "BMS Institute of Technology & Management, Bengaluru", duration: "2025 – 2027 · 2nd Semester", cgpa: "CGPA: 8.50", desc: "Deepening expertise in advanced programming, software engineering, cloud technologies, machine learning, and full-stack development. Actively working on practical projects and national-level hackathons." },
                { degree: "Bachelor of Computer Applications (BCA)", institution: "Dr. B. B. Hegde First Grade College, Kundapura", duration: "2022 – 2025", cgpa: "CGPA: 8.23", desc: "Strong foundations in programming, databases, OOP, web development, and software design. Developed multiple academic and industry-inspired projects using Python, Flask, SQLite, JavaScript, HTML, and CSS." },
                { degree: "Pre-University Course (Commerce)", institution: "Varasiddi Vinayaka PU College, Keradi", duration: "2020 – 2022", cgpa: null, desc: null },
                { degree: "Secondary School Leaving Certificate (SSLC)", institution: "Government High School, Nittur", duration: "Completed 2020", cgpa: null, desc: null },
              ].map((edu, i) => (
                <div key={i} className="edu-item">
                  <div className="edu-card">
                    <div className="edu-degree">{edu.degree}</div>
                    <div className="edu-institution">{edu.institution}</div>
                    <div className="edu-meta">
                      <span className="edu-meta-item">📅 {edu.duration}</span>
                      {edu.cgpa && <span className="edu-meta-item">⭐ {edu.cgpa}</span>}
                    </div>
                    {edu.desc && <div className="edu-desc">{edu.desc}</div>}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <hr className="section-divider" />

      {/* JOURNEY */}
      <section id="journey">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <div className="section-eyebrow">Journey</div>
              <h2 className="section-title">My learning roadmap</h2>
              <p className="section-subtitle">From learning the fundamentals to building real-world applications, every step has strengthened my skills as a software developer.</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="journey-track">
              {JOURNEY_DATA.map((step, i) => (
                <div key={i} className={`journey-item${step.active ? " active" : ""}`}>
                  <div className="journey-dot-wrap"><div className="journey-dot">{step.icon}</div></div>
                  <div className="journey-label">{step.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40, background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "28px 32px" }}>
              <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.8,textAlign: "justify" }}>
                My software development journey began with a curiosity about how websites and applications are built. Starting with the fundamentals of C, Java, Python, HTML, CSS, and JavaScript, I developed responsive web applications using Flask and SQLite while strengthening my understanding of software engineering principles. As I progressed, I expanded my knowledge into cloud computing, DevOps, and machine learning, gaining hands-on experience with AWS, Docker, Jenkins, GitHub Actions, CI/CD pipelines, and XGBoost-based machine learning models through projects and continuous learning. Today, I am further enhancing my expertise with the MERN stack and modern software engineering practices, focusing on building clean, scalable, maintainable, and user-centric software solutions.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <hr className="section-divider" />

      {/* SKILLS */}
      <section id="skills">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <div className="section-eyebrow">Skills</div>
              <h2 className="section-title">Technical toolkit</h2>
              <p className="section-subtitle">Hands-on experience with modern technologies across frontend, backend, databases, cloud platforms, and development tools.</p>
            </div>
          </FadeIn>
          <div className="skills-grid">
            {SKILLS_DATA.map((cat, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div className="skill-category">
                  <div className="skill-cat-header">
                    <div className="skill-cat-icon">{cat.icon}</div>
                    <div className="skill-cat-name">{cat.name}</div>
                  </div>
                  <div className="skill-chips">
                    {cat.skills.map(s => <span key={s} className="skill-chip">{s}</span>)}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* PROJECTS */}
      <section id="projects">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <div className="section-eyebrow">Projects</div>
              <h2 className="section-title">Featured work</h2>
              <p className="section-subtitle">Real-world applications built to solve practical problems with scalable and user-focused solutions.</p>
            </div>
          </FadeIn>
          <div className="projects-grid">
            {PROJECTS_DATA.map((proj, i) => (
              <FadeIn key={proj.id} delay={i * 80}>
                <div className="project-card">
                  <div className="project-img">
                    <img src={proj.image} alt={proj.title} className="project-image" />
                    <div className="project-img-overlay" />
                  </div>
                  <div className="project-body">
                    <div className="project-title">{proj.title}</div>
                    <div className="project-desc">{proj.description}</div>
                    <div className="project-stack">
                      {proj.stack.map(t => <span key={t} className="project-tag">{t}</span>)}
                    </div>
                    <div className="project-actions">
                      <a href="https://github.com/shriaigal" className="project-btn">⬡ GitHub</a>
                      <button className="project-btn primary" onClick={() => setModalProject(proj)}>Read more →</button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {modalProject && <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />}

      <hr className="section-divider" />

      {/* HACKATHONS */}
      <section id="hackathons">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <div className="section-eyebrow">Hackathons</div>
              <h2 className="section-title">Competitive experience</h2>
              <p className="section-subtitle">Building under pressure, collaborating fast, and shipping functional prototypes.</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="hack-timeline">
              <div className="hack-card">
                <div className="hack-icon">🏆</div>
                <div>
                  <div className="hack-title">HackVerse 2.0</div>
                  <div className="hack-role">Team Leader of NextGen Bharat · National Level Hackathon</div>
                  <div className="hack-desc">
                    Participated in the National Level Hackathon organized by the Department of MCA, BMSIT&M. Collaborated as a team member to design, implement, and present an AI-powered solution within strict time constraints. The experience strengthened rapid prototyping skills, cross-functional teamwork, and real-time problem-solving under pressure.
                  </div>
                  <div className="hack-chips">
                    {["AI/ML","Team Collaboration","Rapid Prototyping","Python","Flask"].map(t => (
                      <span key={t} className="hack-chip">{t}</span>
                    ))}
                  </div>
                  <div className="hack-achievement">🏅 National Level Participation Certificate</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <hr className="section-divider" />

      {/* CERTIFICATIONS — rebuilt */}
      <section id="certifications">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <div className="section-eyebrow">Certifications</div>
              <h2 className="section-title">Credentials & Recognition</h2>
              <p className="section-subtitle">
                Formal recognition of my technical skills, professional learning, hackathons, and continuous development.
              </p>
            </div>
          </FadeIn>

          <div className="certs-grid">
            {CERTS_DATA.map((cert, i) => (
              <FadeIn key={cert.id} delay={i * 70}>
                <CertCard cert={cert} onClick={setActiveCert} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Certification detail modal */}
      {activeCert && <CertModal cert={activeCert} onClose={() => setActiveCert(null)} />}

      <hr className="section-divider" />

      {/* CURRENTLY LEARNING */}
      <section id="learning">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <div className="section-eyebrow">Currently Learning</div>
              <h2 className="section-title">What I'm working on now</h2>
              <p className="section-subtitle">Technology moves fast. Here's where I'm investing my learning time right now.</p>
            </div>
          </FadeIn>
          <div className="learning-grid">
            {LEARNING_DATA.map((item, i) => (
              <FadeIn key={i} delay={i * 40}>
                <div className="learning-card">
                  <div className="learning-icon">{item.icon}</div>
                  <div>
                    <div className="learning-name">{item.name}</div>
                    <div className="learning-status">{item.status}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* WHAT DRIVES ME */}
      <section>
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <div className="section-eyebrow">Motivation</div>
              <h2 className="section-title">What drives me</h2>
              <p className="section-subtitle">The principles and values that shape how I approach engineering.</p>
            </div>
          </FadeIn>
          <div className="drives-grid">
            {DRIVES_DATA.map((item, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div className="drives-card">
                  <div className="drives-icon">{item.icon}</div>
                  <div className="drives-title">{item.title}</div>
                  <div className="drives-desc">{item.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* CAREER OBJECTIVE */}
      <section>
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <div className="section-eyebrow">Career Objective</div>
              <h2 className="section-title">Where I'm headed</h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="objective-card">
              <p className="objective-text">
                "I aspire to build a career as a Software Development Engineer where I can contribute to developing scalable, reliable, and innovative software solutions. I am passionate about continuous learning, solving challenging problems, and applying modern technologies cloud computing, DevOps, and machine learning to create applications that genuinely make an impact. My goal is to join a team at a company like Microsoft, Amazon, Google, or Adobe, where I can grow as an engineer, collaborate with talented peers, and build software that matters."
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <hr className="section-divider" />

      {/* CONTACT */}
      <section id="contact">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <div className="section-eyebrow">Contact</div>
              <h2 className="section-title">Let's connect</h2>
              <p className="section-subtitle">Whether you're interested in a job opportunity, a collaboration, or simply connecting, I'd love to hear from you.</p>
            </div>
          </FadeIn>
          <div className="contact-grid">
            <FadeIn>
              <div className="contact-info">
                {[
                  { icon: "✉️", label: "Email", value: "shriaigal@gmail.com", href: "mailto:shriaigal@gmail.com" },
                  { icon: "📱", label: "Phone", value: "+91 6363352453", href: "tel:+916363352453" },
                  { icon: "📍", label: "Location", value: "Bengaluru, Karnataka", href: null },
                  { icon: "💼", label: "LinkedIn", value: "linkedin.com/a-s-shridatta-aigal", href: "https://www.linkedin.com/in/a-s-shridatta-aigal-27b926323/" },
                  { icon: "⬡", label: "GitHub", value: "github.com/shriaigal", href: "https://github.com/shriaigal" },
                ].map((item, i) => (
                  item.href ? (
                    <a key={i} href={item.href} className="contact-item" target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      <div className="contact-item-icon">{item.icon}</div>
                      <div><div className="contact-item-label">{item.label}</div><div className="contact-item-value">{item.value}</div></div>
                    </a>
                  ) : (
                    <div key={i} className="contact-item" style={{ cursor: "default" }}>
                      <div className="contact-item-icon">{item.icon}</div>
                      <div><div className="contact-item-label">{item.label}</div><div className="contact-item-value">{item.value}</div></div>
                    </div>
                  )
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="cf-name">Your name</label>
                  <input id="cf-name" name="name" type="text" placeholder="shriaigal" value={formState.name} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="cf-email">Email address</label>
                  <input id="cf-email" name="email" type="email" placeholder="shriaigal@gmail.com" value={formState.email} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="cf-subject">Subject</label>
                  <input id="cf-subject" name="subject" type="text" placeholder="SDE opportunity" value={formState.subject} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="cf-message">Message</label>
                  <textarea id="cf-message" name="message" rows={5} placeholder="Hi Shridatta, I came across your portfolio and..." value={formState.message} onChange={handleFormChange} required />
                </div>
                <button type="submit" className="form-submit">Send message →</button>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <a href="#home" className="nav-logo" style={{ textDecoration: "none" }} onClick={(e) => { e.preventDefault(); scrollTo("home"); }}>
                <span>{top_logo}</span> A S Shridatta Aigal
              </a>
              <p>MCA Student · Software Development Engineer · Cloud & DevOps Enthusiast · Machine Learning Learner</p>
            </div>
            <div className="footer-col">
              <h4>Navigation</h4>
              <ul>
                {["Home","About","Education","Skills","Projects"].map(n => (
                  <li key={n}><a href={`#${n.toLowerCase()}`} onClick={(e) => { e.preventDefault(); scrollTo(n.toLowerCase()); }}>{n}</a></li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <ul>
                <li><a href="https://www.linkedin.com/in/a-s-shridatta-aigal-27b926323/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://github.com/shriaigal" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="mailto:shriaigal@gmail.com">Email</a></li>
                <li><a href={resumePDF} target="_blank" rel="noopener noreferrer">Download Resume</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} A S Shridatta Aigal</p>
            <a href="#home" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollTo("home"); }}>↑ Back to top</a>
          </div>
        </div>
      </footer>
    </>
  );
}