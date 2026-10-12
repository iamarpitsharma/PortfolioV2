# EmailJS Integration & Security Guide

This document details the complete EmailJS integration for the portfolio contact transmission system, including required `.env` variables, the exact template layout, and security measures.

---

## 1. Environment Variables (`.env`)

In Next.js, variables accessible in the browser must start with `NEXT_PUBLIC_`.

Create or update your `.env` file in the project root with the following keys:

```env
# ==========================================
# EMAILJS CONFIGURATION (Client-side exposed)
# ==========================================

# 1. Service ID (Email Services tab in EmailJS dashboard)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here

# 2. Template ID (Email Templates tab in EmailJS dashboard)
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here

# 3. Public Key (Account > General > API Keys > Public Key)
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

> **Note:** A matching template file has been placed in `.env.example`. When deploying to Vercel or any hosting platform, add these three exact keys under your project's Environment Variables settings.

---

## 2. EmailJS Template Setup & Variable Mapping

In your [EmailJS Dashboard](https://dashboard.emailjs.com/) -> **Email Templates** -> **Create New Template**, configure the template with the exact variables supplied by the application:

### Variable List Sent by the Application

| Variable Name | Description | Source in Form |
| :--- | :--- | :--- |
| `{{from_name}}` | Sender's full name | `contactForm.name` |
| `{{from_email}}` | Sender's email address | `contactForm.email` |
| `{{reply_to}}` | Address your reply will go to | `contactForm.email` |
| `{{subject}}` | Subject line of the opportunity | `contactForm.subject` (fallback: `"Portfolio Inquiry (Backend Role)"`) |
| `{{message}}` | The main message content | `contactForm.message` |
| `{{to_name}}` | Recipient name | Hardcoded to `"Arpit Sharma"` |

---

### Recommended Email Template Blueprint

In the EmailJS template editor, configure:

#### **Subject Line:**
```text
Portfolio Transmission: {{subject}} [From {{from_name}}]
```

#### **Content (Email Body):**
```html
<div style="font-family: monospace, sans-serif; padding: 24px; border: 3px solid #000; background-color: #FFFDF5; max-width: 600px;">
  <div style="background-color: #FFD23F; padding: 12px 16px; border: 2px solid #000; font-weight: bold; margin-bottom: 20px;">
    ⚡ DIRECT TRANSMISSION FROM PORTFOLIO
  </div>

  <p><strong>From:</strong> {{from_name}} (&lt;{{from_email}}&gt;)</p>
  <p><strong>Subject:</strong> {{subject}}</p>
  
  <div style="margin-top: 16px; padding: 16px; background-color: #ffffff; border: 2px solid #000; white-space: pre-wrap;">
    <strong>Message Brief:</strong><br><br>
    {{message}}
  </div>

  <div style="margin-top: 20px; font-size: 11px; color: #555;">
    To reply directly to {{from_name}}, click Reply in your email client.
  </div>
</div>
```

#### **Settings Tab (in Template Editor):**
- **To Email:** Your personal email address (e.g. `your_email@gmail.com`)
- **From Name:** `{{from_name}} (via Portfolio)`
- **Reply To:** `{{reply_to}}` *(Crucial so hitting "Reply" in your inbox replies directly to the recruiter/client!)*

---

## 3. Security Hardening & Best Practices

Because EmailJS uses client-side JavaScript (`@emailjs/browser`), the **Public Key** is visible in client network traffic. To protect your service from unauthorized use or spam:

### 1. Restrict Allowed Origins (Domain Whitelisting)
- Go to **Account** -> **Security** in the EmailJS dashboard.
- Enable **Allowed Origins / Whitelist Domains**.
- Add only your authorized domains:
  - `http://localhost:3000` (for local development)
  - `https://your-domain.vercel.app` (or your custom domain)
- This prevents third-party websites from calling your EmailJS service using your Public Key.

### 2. Enable reCAPTCHA (Anti-Spam)
- In EmailJS Dashboard -> **Account** -> **Security** -> **reCAPTCHA**.
- You can turn on EmailJS's built-in Google reCAPTCHA v2 / v3 integration to stop automated bot spam from burning through your monthly email quota.

### 3. Rate Limiting
- In EmailJS Dashboard -> **Account** -> **Security** -> **Rate Limiting**.
- Configure request limits (e.g., maximum 5 transmissions per IP per hour) to block spam bursts.

### 4. Never Expose Private Keys
- Only `Public Key` (`NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`) should ever be in client code or `.env`.
- **Never** expose your `Private Key` in any client-facing `.env` or React component.

---

## 4. UI Fallback / Local Development Mode

The contact handler in `app/page.tsx` includes an automatic safety check:
- If environment variables are set to placeholder values (`your_service_id_here`) or missing, it runs in **Demonstration Mode** (simulates a clean transmission with realistic latency without crashing or showing an error).
- Once actual keys are supplied in `.env`, it automatically sends live transmissions via `emailjs.send(...)`.
