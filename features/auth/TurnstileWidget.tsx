"use client";

import Script from "next/script";

export function TurnstileWidget({ siteKey }: { siteKey?: string }) {
  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-response-field-name="captchaToken"
        data-theme="dark"
      />
    </>
  );
}

