/**
 * GTA 6 Decoded - 100% Tracker
 * SINGLE CONFIGURATION FILE FOR MONETIZATION & SOCIAL LINKS
 *
 * Huong dan cho Duy:
 * - Chi can dan link that vao ben trong dau ngoac kep "" ben duoi.
 * - Muc nao de trong "" se tu dong hien trang thai "Setup pending" (khong bao gio bi nut chet).
 * - Khi dan link vao xong, luu file nay va day len Cloudflare Pages la ca web tu cap nhat.
 */
window.GTA6_CONFIG = {
  brand: {
    name: "GTA 6 Decoded",
    subtitle: "100% Secrets, Map & Money Tracker",
    version: "v1.0 (Leonida Edition)",
    lastUpdated: "Nov 2026"
  },
  social: {
    youtubeMain: {
      label: "Kiz Decoded on YouTube",
      url: "https://www.youtube.com/@KizDecoded"
    },
    fbDecoded: {
      label: "GTA 6 Decoded Page",
      url: "https://www.facebook.com/profile.php?id=61596780513728"
    },
    fbLootGuides: {
      label: "GTA 6 Loot & Guides",
      url: "" // Dan link Fanpage GTA 6 Loot & Guides sau khi lap ngay 26/11
    }
  },
  support: {
    buyMeACoffee: {
      label: "Support on BuyMeACoffee",
      description: "Keep the Leonida tracker free and ad-light for the community.",
      url: "" // Dan link BuyMeACoffee (VD: "https://buymeacoffee.com/gta6decoded")
    }
  },
  affiliates: [
    {
      id: "gaming-vpn",
      tag: "Low-Ping Setup",
      title: "Gaming VPN for GTA Online & Launch Day",
      summary: "Reduce lobby lag, protect your home IP in public sessions, and bypass ISP throttling on launch night.",
      ctaLabel: "Check Gaming VPN Offer",
      url: "" // Dan link Affiliate VPN (NordVPN / ExpressVPN / Surfshark)
    },
    {
      id: "console-ssd",
      tag: "Launch Storage",
      title: "2TB NVMe SSD for PS5 & Xbox Series X",
      summary: "GTA 6 is expected to require a massive install footprint. Prep high-speed Gen4 storage before pre-load opens.",
      ctaLabel: "View Top 2TB Drives on Amazon",
      url: "" // Dan link Amazon Associates SSD
    },
    {
      id: "pro-controller",
      tag: "Precision Aim",
      title: "Pro Controller & Spatial Headset Kit",
      summary: "Back paddles for drive-by shooting and crisp 3D audio to spot hidden collectibles and ambient Easter eggs.",
      ctaLabel: "Browse Gear Picks on Amazon",
      url: "" // Dan link Amazon Associates Gear
    }
  ]
};
