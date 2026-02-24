<div align="center">
  <h1 style="font-family: sans-serif; font-weight: bold; letter-spacing: -1px;">
    shrwd<span style="color: #50C878;">.</span>
  </h1>
  <p><strong>Beta Distribution Portal</strong></p>
</div>

---

A web portal created to securely manage the beta distribution of the SHRWD React Native mobile application. Engineered to securely distribute iOS and Android dev builds and handle OTA (Over-The-Air) release notes.

## Live Demo & Access

The portal is currently live and protected by Next.js Edge Middleware.

* **Live Site:** https://shrewd-beta.vercel.app
* **Guest Access Key:** `GUEST-2026`

*(Note: Guest access grants entry to the dashboard and release history for portfolio review, but binary downloads are restricted to authorized testing accounts).*

## Technical Architecture

This repository contains the web distribution layer. The primary native mobile application is developed and maintained in a separate repository.

**Core Stack**
* Framework: Next.js (App Router)
* Styling: Tailwind CSS v4
* Security:
  * Edge-level route protection (middleware.ts) preventing unauthorized access prior to server rendering.
  * Secure, httpOnly cookie injection via Next.js serverless API routes.
* Hosting & Distribution:
  * Application UI hosted on Vercel.
  * Heavy binary hosting handled via GitHub Releases to optimize delivery and bypass serverless payload limits.

## About the Core Mobile App (SHRWD)

SHRWD is a premium, locally-first personal finance and budgeting application.

* Built with React Native and Expo.
* Global state management handled via Zustand.
* Local data storage engineered with SQLite for secure, offline-first performance.

---
*Designed and engineered for the SHRWD beta testing group.*