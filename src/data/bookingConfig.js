export const STORAGE_KEY = "qonoq_booking";

export const DURATION_OPTIONS = ["2h", "4h", "6h", "10h", "1d"];

export const DURATION_HOURS = {
  "2h": 2,
  "4h": 4,
  "6h": 6,
  "10h": 10,
  "1d": 24,
};

// ==========================
// 🖼️ IMAGE STRUCTURE (CLEAN)
// ==========================

// 🔹 Tashkent Airport
const TashkentAirportImages = {
  standard: ["/10.jpg", "/27.jpg", "/28.jpg", "/29.jpg"],
  family: ["/17.jpg", "/26.jpg", "/28.jpg", "/29.jpg"],
};

// 🔹 Samarkand Airport
const SamarkandAirportImages = {
  standard: ["/30.jpg", "/32.jpg", "/34.jpg", "/35.jpg"],
  family: ["/31.jpg", "/33.jpg", "/34.jpg", "/35.jpg"],
};

// 🔹 Samarkand Railway
const SamarkandRailwayImages = {
  standard: ["/39.jpg", "/41.jpg", "/38.jpg", "/42.jpg"],
  family: ["/37.jpg", "/43.jpg", "/38.jpg", "/42.jpg"],

  // luxe = same images
  standard_luxe: ["/39.jpg", "/41.jpg", "/38.jpg", "/42.jpg"],
  family_luxe: ["/37.jpg", "/43.jpg", "/38.jpg", "/42.jpg"],
};

// ==========================
// 🧩 CAPSULE TYPES (NO IMAGES)
// ==========================

export const CAPSULE_TYPES = {
  standard: {
    key: "standard",
    labelKey: "capsule_standard",
    fallbackLabel: "Standard Capsule",
    cardTitleKey: "standard_title",
    fallbackTitle: "Standard Capsule",
    guestsKey: "standard_guests",
    sizeKey: "standard_size",
    descriptionKey: "standard_description",
    backendType: "standard",
  },
  family: {
    key: "family",
    labelKey: "capsule_family",
    fallbackLabel: "Family Capsule",
    cardTitleKey: "family_title",
    fallbackTitle: "Family Capsule",
    guestsKey: "family_guests",
    sizeKey: "family_size",
    descriptionKey: "family_description",
    backendType: "family",
  },
  standard_luxe: {
    key: "standard_luxe",
    labelKey: "capsule_standard_luxe",
    fallbackLabel: "Standard Luxe Capsule",
    cardTitleKey: "standard_luxe_title",
    fallbackTitle: "Standard Luxe Capsule",
    guestsKey: "standard_guests",
    sizeKey: "standard_size",
    descriptionKey: "standard_description",
    backendType: "standard",
  },
  family_luxe: {
    key: "family_luxe",
    labelKey: "capsule_family_luxe",
    fallbackLabel: "Family Luxe Capsule",
    cardTitleKey: "family_luxe_title",
    fallbackTitle: "Family Luxe Capsule",
    guestsKey: "family_guests",
    sizeKey: "family_size",
    descriptionKey: "family_description",
    backendType: "family",
  },
};

// ==========================
// 🏢 BRANCHES (WITH IMAGES)
// ==========================

export const BRANCHES = {
  tashkent_airport: {
    key: "tashkent_airport",
    value: "tashkent_airport",
    legacyValues: ["tas"],
    slug: "tashkent-airport",
    path: "/tashkent-airport",
    backendBranch: "airport",
    labelKey: "branch_tashkent_airport",
    fallbackLabel: "Tashkent Airport",
    capsuleLocationKey: "branch_tashkent_airport_capsule_location",
    fallbackCapsuleLocation: "Tashkent Airport Qonoq Capsule",
    capsuleTypes: ["standard", "family"],

    images: TashkentAirportImages,

    prices: {
      standard: {
        "2h": 500,
        "4h": 460000,
        "6h": 690000,
        "10h": 920000,
        "1d": 1500000,
      },
      family: {
        "2h": 460000,
        "4h": 690000,
        "6h": 920000,
        "10h": 1150000,
        "1d": 1750000,
      },
    },
  },

  samarkand_airport: {
    key: "samarkand_airport",
    value: "samarkand_airport",
    legacyValues: ["buh", "sam_air"],
    slug: "samarkand-airport",
    path: "/samarkand-airport",
    backendBranch: "city",
    labelKey: "branch_samarkand_airport",
    fallbackLabel: "Samarkand Airport",
    capsuleLocationKey: "branch_samarkand_airport_capsule_location",
    fallbackCapsuleLocation: "Samarkand Airport Qonoq Capsule",
    capsuleTypes: ["standard", "family"],

    images: SamarkandAirportImages,

    prices: {
      standard: {
        "2h": 200000,
        "4h": 300000,
        "6h": 400000,
        "10h": 600000,
        "1d": 800000,
      },
      family: {
        "2h": 300000,
        "4h": 400000,
        "6h": 500000,
        "10h": 700000,
        "1d": 1000000,
      },
    },
  },

  samarkand_railway: {
    key: "samarkand_railway",
    value: "samarkand_railway",
    legacyValues: ["sam", "sam_rail"],
    slug: "samarkand-railway",
    path: "/samarkand-railway",
    backendBranch: "north",
    labelKey: "branch_samarkand_railway",
    fallbackLabel: "Samarkand Railway",
    capsuleLocationKey: "branch_samarkand_railway_capsule_location",
    fallbackCapsuleLocation: "Samarkand Railway Qonoq Capsule",
    capsuleTypes: ["standard", "family", "standard_luxe", "family_luxe"],

    images: SamarkandRailwayImages,

    prices: {
      standard: {
        "2h": 150000,
        "4h": 180000,
        "6h": 250000,
        "10h": 300000,
        "1d": 400000,
      },
      family: {
        "2h": 220000,
        "4h": 300000,
        "6h": 380000,
        "10h": 500000,
        "1d": 700000,
      },
      standard_luxe: {
        "2h": 180000,
        "4h": 250000,
        "6h": 300000,
        "10h": 400000,
        "1d": 550000,
      },
      family_luxe: {
        "2h": 260000,
        "4h": 350000,
        "6h": 450000,
        "10h": 600000,
        "1d": 750000,
      },
    },
  },
};

// ==========================
// ⚙️ HELPERS
// ==========================

export const DEFAULT_BRANCH_KEY = "tashkent_airport";

export const BRANCH_ORDER = [
  BRANCHES.tashkent_airport,
  BRANCHES.samarkand_airport,
  BRANCHES.samarkand_railway,
];

const BRANCH_ALIASES = Object.values(BRANCHES).flatMap((branch) => {
  const aliases = [
    branch.key,
    branch.value,
    branch.slug,
    branch.path.replace(/^\//, ""),
    branch.backendBranch,
    ...(branch.legacyValues || []),
  ];

  return aliases.map((alias) => [String(alias).toLowerCase(), branch.key]);
});

const BRANCH_ALIAS_MAP = new Map(BRANCH_ALIASES);

export const normalizeBranchKey = (input) => {
  const normalized = String(input || "")
    .trim()
    .toLowerCase();
  return BRANCH_ALIAS_MAP.get(normalized) || DEFAULT_BRANCH_KEY;
};

export const getBranchConfig = (input) =>
  BRANCHES[normalizeBranchKey(input)] || BRANCHES[DEFAULT_BRANCH_KEY];

export const getBranchPath = (input) => getBranchConfig(input).path;

export const getCapsuleTypeConfig = (typeKey) =>
  CAPSULE_TYPES[typeKey] || CAPSULE_TYPES.standard;

export const getAvailableCapsuleTypes = (branchInput) =>
  getBranchConfig(branchInput).capsuleTypes.map(getCapsuleTypeConfig);

export const isCapsuleTypeAvailable = (branchInput, capsuleTypeKey) =>
  getBranchConfig(branchInput).capsuleTypes.includes(capsuleTypeKey);

export const getDefaultCapsuleType = (branchInput) =>
  getBranchConfig(branchInput).capsuleTypes[0] || "standard";

export const getCapsulePrice = (branchInput, capsuleTypeKey, durationValue) => {
  const branch = getBranchConfig(branchInput);
  return branch.prices?.[capsuleTypeKey]?.[durationValue] || 0;
};

// 🔥 ENG MUHIM (IMAGE GETTER)
export const getCapsuleImages = (branchInput, capsuleTypeKey) => {
  const branch = getBranchConfig(branchInput);
  return branch.images?.[capsuleTypeKey] || [];
};

export const formatPriceLabel = (t, durationValue, price) =>
  `${t(`duration_${durationValue}`, { defaultValue: durationValue })} / ${Number(
    price || 0,
  ).toLocaleString()} UZS`;

export const buildBookingState = ({
  branchInput,
  capsuleTypeKey,
  checkIn,
  checkInTime,
  durationValue,
  t,
}) => {
  const branch = getBranchConfig(branchInput);
  const capsuleType = getCapsuleTypeConfig(capsuleTypeKey);

  return {
    checkIn,
    checkInTime,
    durationValue,
    capsuleTypeValue: capsuleType.key,
    backendCapsuleTypeValue: capsuleType.backendType,
    locationValue: branch.value,
    branchKey: branch.key,
    branchPath: branch.path,
    durationLabel: t(`duration_${durationValue}`, {
      defaultValue: durationValue,
    }),
    capsuleTypeLabel: t(capsuleType.labelKey, {
      defaultValue: capsuleType.fallbackLabel,
    }),
    locationLabel: t(branch.labelKey, {
      defaultValue: branch.fallbackLabel,
    }),
    createdAt: new Date().toISOString(),
  };
};
