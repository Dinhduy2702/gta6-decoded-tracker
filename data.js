/**
 * GTA 6 Decoded - 100% Tracker Dataset
 * Source tags:
 *   "confirmed" -> Verified from official Rockstar Trailers, press materials, or announcements.
 *   "rumor"     -> Community analysis, map-mapping projects, or unconfirmed reports.
 */
window.GTA6_DATA = {
  categories: [
    { id: "easter-eggs", label: "Easter Eggs & Secrets", shortLabel: "Secrets" },
    { id: "locations", label: "Locations & Map POIs", shortLabel: "Locations" },
    { id: "vehicles", label: "Rare Vehicles", shortLabel: "Vehicles" },
    { id: "weapons", label: "Hidden Weapons & Gear", shortLabel: "Weapons" },
    { id: "characters", label: "Characters & Factions", shortLabel: "Characters" },
    { id: "money", label: "Money & Launch Prep", shortLabel: "Money" }
  ],
  regions: [
    { id: "vice-city", label: "Vice City Metro", color: "#F25C54" },
    { id: "vice-beach", label: "Vice Beach & Ocean", color: "#14B8A6" },
    { id: "leonida-keys", label: "Leonida Keys", color: "#38BDF8" },
    { id: "grassrivers", label: "Grassrivers Wetlands", color: "#84CC16" },
    { id: "port-gellhorn", label: "Port Gellhorn", color: "#F59E0B" },
    { id: "ambrosia", label: "Ambrosia & Kelly County", color: "#C084FC" }
  ],
  items: [
    // EASTER EGGS & SECRETS
    {
      id: "ee-ocean-view-hotel",
      title: "Ocean View Hotel Neon Facade",
      category: "easter-eggs",
      region: "vice-beach",
      source: "confirmed",
      x: 78,
      y: 55,
      reward: "Classic Callback",
      summary: "The iconic pastel hotel from GTA: Vice City returns on the Ocean Beach strip with updated signage and bustling nightlife.",
      tip: "Visit at dusk on Ocean Drive to trigger the full neon lighting sequence seen in Trailer 1."
    },
    {
      id: "ee-uncle-jacks-liquor",
      title: "Uncle Jack's Liquor Store Robbery Spot",
      category: "easter-eggs",
      region: "port-gellhorn",
      source: "confirmed",
      x: 34,
      y: 52,
      reward: "Story Landmark",
      summary: "Featured in the final scene of Trailer 1 where Lucia and Jason kick open the doors with bandanas raised.",
      tip: "Check the bulletin board near the entrance for local Leonida County wanted flyers and micro-stories."
    },
    {
      id: "ee-leonida-man-gator",
      title: "Convenience Store Gator Encounter",
      category: "easter-eggs",
      region: "grassrivers",
      source: "confirmed",
      x: 49,
      y: 65,
      reward: "Random Event",
      summary: "Alligators can wander off the Grassrivers swamp edge straight into roadside gas stations and suburban pools.",
      tip: "Patrol the wetland highway rest stops during morning hours to witness dynamic wildlife events."
    },
    {
      id: "ee-vice-metro-mule",
      title: "Vice City Metro Transit Mural",
      category: "easter-eggs",
      region: "vice-city",
      source: "confirmed",
      x: 68,
      y: 47,
      reward: "Photo Op",
      summary: "Elevated rail stations across downtown Vice City feature satirical ads referencing Pißwasser, eCola, and Sprunk.",
      tip: "Ride the full metro loop once to spot hidden rooftop graffiti tags visible only from the train."
    },
    {
      id: "ee-leonida-keys-shipwreck",
      title: "Sunken Smuggler Wreck off Leonida Keys",
      category: "easter-eggs",
      region: "leonida-keys",
      source: "rumor",
      x: 63,
      y: 86,
      reward: "$15,000 Cache",
      summary: "Community divers expect submerged cartel wrecks along the Keys reef chain holding cash briefcases and collectibles.",
      tip: "Bring scuba gear or a dinghy along the southern bridge pillars to scan the reef drop-offs."
    },
    {
      id: "ee-bermuda-mystery-signal",
      title: "Offshore Static Radio Frequency",
      category: "easter-eggs",
      region: "vice-beach",
      source: "rumor",
      x: 90,
      y: 66,
      reward: "Mystery Clue",
      summary: "Long-running Rockstar UFO and coastal mystery theories point to an offshore anomaly east of Vice Beach.",
      tip: "Take a boat past the outer buoys at 03:00 during stormy weather and monitor cockpit radio chatter."
    },
    {
      id: "ee-social-clip-stunts",
      title: "Viral Social Feed Stunt Hotspots",
      category: "easter-eggs",
      region: "vice-city",
      source: "confirmed",
      x: 72,
      y: 40,
      reward: "Social Clip",
      summary: "In-game social video clips showcase street takeovers, roof-top car surfing, and chaotic neighborhood stunts.",
      tip: "Watch the in-game phone feed for trending locations that spawn unique NPC street spectacles."
    },
    {
      id: "ee-prison-intake-file",
      title: "Leonida Department of Corrections Intake",
      category: "easter-eggs",
      region: "ambrosia",
      source: "confirmed",
      x: 43,
      y: 26,
      reward: "Lore File",
      summary: "Opening setting for Lucia's backstory and ankle monitor parole conditions before returning to the streets.",
      tip: "Track the perimeter guard towers and nearby highway signposts for subtle Rockstar date nods."
    },

    // LOCATIONS & MAP POIS
    {
      id: "loc-vice-beach",
      title: "Vice Beach Boardwalk & Lifeguard Towers",
      category: "locations",
      region: "vice-beach",
      source: "confirmed",
      x: 81,
      y: 50,
      reward: "Major POI",
      summary: "Dense beachfront strip packed with sunbathers, jet skis, beachfront hotels, and neon-lit nightclubs.",
      tip: "Use the boardwalk as a fast east-side escape corridor on dirt bikes or jet skis."
    },
    {
      id: "loc-vice-international",
      title: "Vice City International Airport (VCIA)",
      category: "locations",
      region: "vice-city",
      source: "confirmed",
      x: 61,
      y: 53,
      reward: "Aviation Hub",
      summary: "Major commercial airport connecting Vice City to the rest of Leonida with private hangars and runway access.",
      tip: "Scout the cargo apron for parked light aircraft and armored airport security vans."
    },
    {
      id: "loc-starfish-causeway",
      title: "Venetian & Starfish Island Causeways",
      category: "locations",
      region: "vice-beach",
      source: "confirmed",
      x: 74,
      y: 53,
      reward: "Luxury District",
      summary: "Multi-bridge island chain lined with waterfront mansions, superyachts, and high-end sports cars.",
      tip: "Prime hunting ground for exotic supercar spawns and high-value mansion recon."
    },
    {
      id: "loc-leonida-keys-bridge",
      title: "Leonida Keys Overseas Highway",
      category: "locations",
      region: "leonida-keys",
      source: "confirmed",
      x: 56,
      y: 82,
      reward: "Scenic Highway",
      summary: "Long turquoise-water bridge network linking small tropical islands, marinas, and seaplane docks.",
      tip: "Ideal straightaway for testing top-speed supercars without city intersection traffic."
    },
    {
      id: "loc-grassrivers-swamp",
      title: "Grassrivers Everglades Basin",
      category: "locations",
      region: "grassrivers",
      source: "confirmed",
      x: 45,
      y: 61,
      reward: "Wilderness Zone",
      summary: "Expansive marshland dominated by airboats, wildlife, hidden shacks, and off-grid smuggling drops.",
      tip: "Avoid heavy sports cars here; switch to an airboat or lifted 4x4 to cross mud flats."
    },
    {
      id: "loc-port-gellhorn",
      title: "Port Gellhorn Pawn & Motel Strip",
      category: "locations",
      region: "port-gellhorn",
      source: "confirmed",
      x: 27,
      y: 48,
      reward: "Western City",
      summary: "Gritty western coastal town featuring pawn shops, cheap motels, strip malls, and heavy VCPD / county patrol presence.",
      tip: "Best area for early-game low-profile side hustles, pawn fencing, and vehicle chop runs."
    },
    {
      id: "loc-thrillbilly-mud-club",
      title: "Thrillbilly Mud Club Arena",
      category: "locations",
      region: "ambrosia",
      source: "confirmed",
      x: 37,
      y: 34,
      reward: "Side Activity",
      summary: "Rural off-road mud pit and monster truck gathering spot seen in Trailer 1 with lifted trucks and dirt tracks.",
      tip: "Bring a custom lifted pickup or buggy to compete in mud-bogging side challenges."
    },
    {
      id: "loc-vice-port-docks",
      title: "Vice City Container Port",
      category: "locations",
      region: "vice-city",
      source: "confirmed",
      x: 71,
      y: 60,
      reward: "Smuggling Hub",
      summary: "Massive shipping crane terminal handling cargo vessels, freight trucks, and high-security warehouse yards.",
      tip: "Climb the crane catwalks for sniper overwatch and hidden cargo crate drops."
    },
    {
      id: "loc-mount-kalaga",
      title: "Northern Highlands & Lake Leonida",
      category: "locations",
      region: "ambrosia",
      source: "rumor",
      x: 52,
      y: 18,
      reward: "Exploration",
      summary: "Community map reconstructions highlight a large inland lake and northern rural hills bordering Leonida.",
      tip: "Use a helicopter to map fire-lookout towers and hidden mountain trails once unlocked."
    },

    // RARE VEHICLES
    {
      id: "veh-cheetah-classic",
      title: "Grotti Cheetah Classic (Vice Spec)",
      category: "vehicles",
      region: "vice-beach",
      source: "confirmed",
      x: 79,
      y: 46,
      reward: "Exotic Classic",
      summary: "Iconic 80s wedge supercar cruising Ocean Drive in white and sunset-red trims.",
      tip: "Cruises most frequently along Ocean Beach and Starfish Island during evening hours."
    },
    {
      id: "veh-tulip-getaway",
      title: "Declasse Tulip (Lucia & Jason Getaway)",
      category: "vehicles",
      region: "port-gellhorn",
      source: "confirmed",
      x: 31,
      y: 55,
      reward: "Signature Muscle",
      summary: "The classic four-door muscle sedan driven by Jason and Lucia during high-speed police chases.",
      tip: "Upgrade armor plating and bulletproof tires early; it serves as a reliable four-seat getaway car."
    },
    {
      id: "veh-grassrivers-airboat",
      title: "High-Thrust Swamp Airboat",
      category: "vehicles",
      region: "grassrivers",
      source: "confirmed",
      x: 51,
      y: 69,
      reward: "Swamp Utility",
      summary: "Cage-fan flat-bottom airboat built to skim shallow Grassrivers marshes and dodge gators.",
      tip: "Look for wooden dock launches along the eastern marsh canals."
    },
    {
      id: "veh-lifted-donk",
      title: "Custom Donk & Oversized Wheel Lowrider",
      category: "vehicles",
      region: "vice-city",
      source: "confirmed",
      x: 65,
      y: 42,
      reward: "Street Custom",
      summary: "Florida-signature lifted classic sedans with candy paint and huge chrome rims spotted at night car meets.",
      tip: "Check Wynwood-style art district parking lots after midnight for street takeover spawns."
    },
    {
      id: "veh-seaplane-dodo",
      title: "Dodo Amphibious Seaplane",
      category: "vehicles",
      region: "leonida-keys",
      source: "confirmed",
      x: 50,
      y: 85,
      reward: "Water Aircraft",
      summary: "Twin-pontoon seaplane capable of landing directly next to Keys islands and coastal docks.",
      tip: "Essential for reaching isolated reef sandbars and offshore stash locations."
    },
    {
      id: "veh-interceptor-cruiser",
      title: "VCPD Modern Interceptor Cruiser",
      category: "vehicles",
      region: "vice-city",
      source: "confirmed",
      x: 69,
      y: 51,
      reward: "Law Enforcement",
      summary: "Updated Vice City Police Department pursuit cruiser with aggressive pursuit AI and PIT maneuvers.",
      tip: "Watch for unmarked county units patrolling the Port Gellhorn highway interchange."
    },
    {
      id: "veh-hovercraft-prototype",
      title: "Coast Guard Amphibious Hovercraft",
      category: "vehicles",
      region: "leonida-keys",
      source: "rumor",
      x: 68,
      y: 79,
      reward: "Rare Amphibious",
      summary: "Community vehicle wishlists and coastal patrol leaks point to a multi-terrain hovercraft for swamp-to-sea runs.",
      tip: "Check coastal rescue stations near the southern Keys channel."
    },

    // HIDDEN WEAPONS & GEAR
    {
      id: "wep-ankle-monitor-bypass",
      title: "Parole Ankle Monitor & Restricted Zone Gear",
      category: "weapons",
      region: "ambrosia",
      source: "confirmed",
      x: 41,
      y: 30,
      reward: "Story Mechanic",
      summary: "Official artwork shows Lucia wearing an electronic ankle monitor, hinting at early-game map boundary restrictions.",
      tip: "Complete initial parole story missions before attempting long cross-county escapes."
    },
    {
      id: "wep-duffel-loadout",
      title: "Trunk & Duffel Bag Weapon Carry System",
      category: "weapons",
      region: "port-gellhorn",
      source: "rumor",
      x: 29,
      y: 44,
      reward: "Tactical System",
      summary: "Expected Red Dead Redemption 2 style realism where heavy rifles live in your vehicle trunk or duffel bag.",
      tip: "Pre-pack a shotgun, suppressed pistol, and medkits in your personal car trunk before every score."
    },
    {
      id: "wep-suppressed-smg",
      title: "Compact Suppressed SMG (Pawn Shop Backroom)",
      category: "weapons",
      region: "port-gellhorn",
      source: "rumor",
      x: 25,
      y: 51,
      reward: "Stealth Weapon",
      summary: "Underground weapon vendors in Port Gellhorn pawn shops are expected to carry early stealth hardware.",
      tip: "Build rapport with local fences to unlock black-market suppressors and extended mags."
    },
    {
      id: "wep-bolt-cutters",
      title: "Heavy Bolt Cutters & Lockpick Kit",
      category: "weapons",
      region: "vice-city",
      source: "rumor",
      x: 66,
      y: 57,
      reward: "Heist Utility",
      summary: "Bypass padlocked shipping containers, motel storage units, and back-alley security gates silently.",
      tip: "Check construction sites around the Vice City Container Port to grab utility tools for free."
    },
    {
      id: "wep-speargun-reef",
      title: "Underwater Speargun & Dive Torch",
      category: "weapons",
      region: "leonida-keys",
      source: "rumor",
      x: 59,
      y: 88,
      reward: "Aquatic Gear",
      summary: "Useful for defending against sharks or rival smugglers while looting submerged Keys shipwrecks.",
      tip: "Check bait-and-tackle shops along the Leonida Keys highway."
    },

    // CHARACTERS & FACTIONS
    {
      id: "char-lucia",
      title: "Lucia (Dual Protagonist)",
      category: "characters",
      region: "vice-city",
      source: "confirmed",
      x: 70,
      y: 45,
      reward: "Main Character",
      summary: "Sharp, driven protagonist starting her arc under Leonida corrections supervision before teaming up for major scores.",
      tip: "Track Lucia-exclusive story outfits, parole milestones, and close-quarters combat perks."
    },
    {
      id: "char-jason",
      title: "Jason (Dual Protagonist)",
      category: "characters",
      region: "port-gellhorn",
      source: "confirmed",
      x: 33,
      y: 47,
      reward: "Main Character",
      summary: "Partner-in-crime paired with Lucia in a modern Bonnie-and-Clyde dynamic built around trust and coordinated robberies.",
      tip: "Use quick character switching mid-robbery to control both crowd intimidation and getaway driving."
    },
    {
      id: "char-vcpd-taskforce",
      title: "Vice City Police & Leonida County Deputies",
      category: "characters",
      region: "vice-city",
      source: "confirmed",
      x: 67,
      y: 49,
      reward: "Law Faction",
      summary: "Coordinated dispatch units featuring bodycam raids, SWAT trucks, and highway pursuit teams.",
      tip: "Change vehicles out of sightlines; witness descriptions and license plates matter more than ever."
    },
    {
      id: "char-high-rollerz",
      title: "High Rollerz Street Crew",
      category: "characters",
      region: "vice-city",
      source: "confirmed",
      x: 63,
      y: 38,
      reward: "Street Faction",
      summary: "Street racing and lifestyle crew spotted on banners and custom cars across downtown Vice City.",
      tip: "Win underground street sprints to unlock custom paint finishes and engine upgrades."
    },
    {
      id: "char-uncle-jack-syndicate",
      title: "Port Gellhorn Pawn & Fence Network",
      category: "characters",
      region: "port-gellhorn",
      source: "rumor",
      x: 23,
      y: 45,
      reward: "Underground Network",
      summary: "Local fences who buy stolen jewelry, electronics, and rare collectibles without alerting Vice City authorities.",
      tip: "Never sell hot jewelry at the first shop; compare fence payouts across counties."
    },

    // MONEY & LAUNCH PREP
    {
      id: "mon-store-holdup-loop",
      title: "Fast Convenience Store & Register Chain",
      category: "money",
      region: "port-gellhorn",
      source: "confirmed",
      x: 30,
      y: 53,
      reward: "$2,500 - $8,000",
      summary: "Quick early-game cash loop hitting highway liquor stores and gas stations with a parked getaway sedan.",
      tip: "Keep engine running facing the highway, mask up before entry, and clear out in under 45 seconds."
    },
    {
      id: "mon-armored-van-intercept",
      title: "Gruppe Sechs / Armored Cash Van Intercept",
      category: "money",
      region: "vice-city",
      source: "rumor",
      x: 73,
      y: 49,
      reward: "$25,000+",
      summary: "Classic GTA armored truck ambushes along downtown Vice City bank corridors and casino drop-offs.",
      tip: "Hit the rear doors with sticky charges at traffic choke points before escort cars box you in."
    },
    {
      id: "mon-yacht-smuggle-run",
      title: "Leonida Keys Night Boat Delivery",
      category: "money",
      region: "leonida-keys",
      source: "rumor",
      x: 54,
      y: 80,
      reward: "$40,000+",
      summary: "High-risk coastal runs moving contraband between Keys marinas while evading Coast Guard choppers.",
      tip: "Run during night fog and stay close to bridge arches to break helicopter thermal lock."
    },
    {
      id: "mon-pawn-flipping",
      title: "High-Value Loot Fencing (Watches & Tech)",
      category: "money",
      region: "port-gellhorn",
      source: "rumor",
      x: 28,
      y: 50,
      reward: "$5,000 - $18,000",
      summary: "Convert stolen luxury watches, handbags, and car electronics into clean cash at back-alley pawn shops.",
      tip: "Hold rare items until a high-demand buyer event pops up in your phone contacts."
    },
    {
      id: "mon-launch-storage",
      title: "Pre-Launch: Free 200GB+ SSD Space",
      category: "money",
      region: "vice-city",
      source: "confirmed",
      x: 69,
      y: 43,
      reward: "Launch Ready",
      summary: "Clear console or PC NVMe storage ahead of pre-load day so you can jump into Leonida minute one.",
      tip: "Verify system firmware updates and controller battery charge 24 hours before unlock."
    },
    {
      id: "mon-launch-crew",
      title: "Pre-Launch: Lock In Your 4-Player Heist Crew",
      category: "money",
      region: "vice-beach",
      source: "confirmed",
      x: 76,
      y: 57,
      reward: "Co-op Ready",
      summary: "Assign roles early (Driver, Hacker, Crowd Control, Lookout) for day-one GTA Online Leonida heists.",
      tip: "Use the Heist Payout Splitter in the Money & Prep tab to agree on fair cuts before launch."
    }
  ],
  moneyMilestones: [
    { id: "ms-1", title: "Starter Safehouse & Garage", target: 50000, note: "First clean stash spot and upgraded getaway car." },
    { id: "ms-2", title: "Full Heist Tactical Kit", target: 150000, note: "Armor, suppressed weapons, duffel gear, and fast boat." },
    { id: "ms-3", title: "Vice Beach Luxury Condo", target: 500000, note: "Ocean-view pad with multi-car garage." },
    { id: "ms-4", title: "Leonida Kingpin Treasury", target: 2000000, note: "Supercars, hangar aircraft, and passive front businesses." }
  ]
};
