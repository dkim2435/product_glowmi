// K-Beauty Product Recommendation Database
// Real products with verified information from major K-Beauty brands
// Last updated: 2026-02-11

export const PRODUCT_DB = [
  // ============================================================
  // CLEANSERS
  // ============================================================
  {
    id: "banila-co-clean-it-zero-original",
    name: "Clean It Zero Cleansing Balm Original",
    nameKr: "클린잇제로 클렌징밤 오리지널",
    brand: "Banila Co",
    category: "cleanser",
    subcategory: "oil_cleanser",
    keyIngredients: ["Cetyl Ethylhexanoate", "PEG-20 Glyceryl Triisostearate", "Vitamin C", "Vitamin E", "Acerola Extract"],
    skinTypes: ["normal", "dry", "combination", "oily", "sensitive"],
    skinConcerns: ["dryness", "texture"],
    priceRange: "mid",
    description: "Cult-favorite sherbet-textured cleansing balm that melts away waterproof makeup and sunscreen without stripping the skin.",
    rating: 4.6
  },
  {
    id: "heimish-all-clean-balm",
    name: "All Clean Balm",
    nameKr: "올클린밤",
    brand: "Heimish",
    category: "cleanser",
    subcategory: "oil_cleanser",
    keyIngredients: ["Shea Butter", "Coconut Extract", "Citrus Herb Oil", "White Flower Complex", "Vitamin E"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["dryness", "texture"],
    priceRange: "budget",
    description: "Affordable cleansing balm with natural botanical oils that gently dissolves makeup while nourishing and soothing the skin.",
    rating: 4.5
  },
  {
    id: "anua-heartleaf-pore-control-cleansing-oil",
    name: "Heartleaf Pore Control Cleansing Oil",
    nameKr: "어성초 모공 컨트롤 클렌징 오일",
    brand: "Anua",
    category: "cleanser",
    subcategory: "oil_cleanser",
    keyIngredients: ["Houttuynia Cordata Extract", "Jojoba Oil", "Grape Seed Oil", "Tea Tree Oil", "Macadamia Oil"],
    skinTypes: ["normal", "oily", "combination"],
    skinConcerns: ["pores", "oiliness", "acne"],
    priceRange: "mid",
    description: "Viral lightweight cleansing oil with heartleaf extract that unclogs pores, removes blackheads, and balances sebum production.",
    rating: 4.4
  },
  {
    id: "cosrx-low-ph-good-morning-gel-cleanser",
    name: "Low pH Good Morning Gel Cleanser",
    nameKr: "로우 pH 굿모닝 젤 클렌저",
    brand: "COSRX",
    category: "cleanser",
    subcategory: "water_cleanser",
    keyIngredients: ["Betaine Salicylate", "Tea Tree Oil", "Beta-Glucan", "Saccharomyces Ferment"],
    skinTypes: ["normal", "oily", "combination", "sensitive"],
    skinConcerns: ["acne", "oiliness", "pores"],
    priceRange: "budget",
    description: "pH-balanced gel cleanser with mild BHA that gently exfoliates and removes impurities without disrupting the skin barrier.",
    rating: 4.5
  },
  {
    id: "innisfree-green-tea-foam-cleanser",
    name: "Green Tea Amino Acid Cleansing Foam",
    nameKr: "그린티 아미노산 클렌징폼",
    brand: "Innisfree",
    category: "cleanser",
    subcategory: "water_cleanser",
    keyIngredients: ["Green Tea Extract", "Amino Acids", "Hyaluronic Acid", "Panthenol"],
    skinTypes: ["normal", "combination", "sensitive"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "budget",
    description: "Cushiony amino acid foam cleanser enriched with Jeju green tea that gently cleanses while calming redness and maintaining hydration.",
    rating: 4.3
  },
  {
    id: "round-lab-1025-dokdo-cleanser",
    name: "1025 Dokdo Cleanser",
    nameKr: "1025 독도 클렌저",
    brand: "Round Lab",
    category: "cleanser",
    subcategory: "water_cleanser",
    keyIngredients: ["Deep Sea Water", "Panthenol", "Allantoin", "Betaine", "Minerals"],
    skinTypes: ["normal", "sensitive", "dry", "combination"],
    skinConcerns: ["dryness", "redness", "texture"],
    priceRange: "mid",
    description: "Low-pH mineral-rich cleanser with 74 types of deep sea minerals that gently removes impurities while strengthening the skin barrier.",
    rating: 4.5
  },
  {
    id: "etude-soonjung-ph65-whip-cleanser",
    name: "SoonJung pH 6.5 Whip Cleanser",
    nameKr: "순정 pH 6.5 거품 클렌저",
    brand: "Etude House",
    category: "cleanser",
    subcategory: "water_cleanser",
    keyIngredients: ["Panthenol", "Madecassoside", "Centella Asiatica"],
    skinTypes: ["sensitive", "dry", "normal"],
    skinConcerns: ["redness", "dryness"],
    priceRange: "budget",
    description: "Ultra-gentle low-pH whip cleanser with 98.9% naturally derived ingredients, free of fragrance and parabens, ideal for sensitive skin.",
    rating: 4.6
  },
  {
    id: "innisfree-volcanic-pore-cleansing-foam",
    name: "Jeju Volcanic Pore Cleansing Foam",
    nameKr: "제주 화산송이 모공 클렌징폼",
    brand: "Innisfree",
    category: "cleanser",
    subcategory: "water_cleanser",
    keyIngredients: ["Jeju Volcanic Clusters", "Salicylic Acid", "AHA"],
    skinTypes: ["oily", "combination"],
    skinConcerns: ["pores", "oiliness", "texture"],
    priceRange: "budget",
    description: "Deep-cleansing foam with Jeju volcanic ash and BHA that removes excess sebum, unclogs pores, and refines skin texture.",
    rating: 4.2
  },
  {
    id: "round-lab-birch-juice-moisturizing-cleanser",
    name: "Birch Juice Moisturizing Cleanser",
    nameKr: "자작나무 수분 클렌저",
    brand: "Round Lab",
    category: "cleanser",
    subcategory: "water_cleanser",
    keyIngredients: ["Birch Juice", "Betaine", "Panthenol", "Hyaluronic Acid"],
    skinTypes: ["dry", "normal", "sensitive"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "mid",
    description: "Soft gel-type low-pH cleanser with birch juice containing 17 amino acids and minerals that cleanses while delivering deep hydration.",
    rating: 4.4
  },
  {
    id: "some-by-mi-aha-bha-pha-miracle-acne-cleanser",
    name: "AHA BHA PHA 30 Days Miracle Acne Clear Foam",
    nameKr: "AHA BHA PHA 30일 미라클 여드름 클리어폼",
    brand: "Some By Mi",
    category: "cleanser",
    subcategory: "water_cleanser",
    keyIngredients: ["AHA", "BHA", "PHA", "Tea Tree Extract", "Niacinamide"],
    skinTypes: ["oily", "combination"],
    skinConcerns: ["acne", "oiliness", "pores", "texture"],
    priceRange: "budget",
    description: "Triple-acid foam cleanser with tea tree extract that targets acne, exfoliates dead skin cells, and controls excess oil production.",
    rating: 4.2
  },

  // ============================================================
  // TONERS
  // ============================================================
  {
    id: "klairs-supple-preparation-facial-toner",
    name: "Supple Preparation Facial Toner",
    nameKr: "서플 프레퍼레이션 페이셜 토너",
    brand: "Klairs",
    category: "toner",
    subcategory: "hydrating_toner",
    keyIngredients: ["Hyaluronic Acid", "Phyto-Oligo", "Beta-Glucan", "Centella Asiatica", "Amino Acids"],
    skinTypes: ["dry", "normal", "sensitive", "combination"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "mid",
    description: "Deeply hydrating toner with amino acids and plant extracts that calms inflammation, balances pH, and prepares skin for the next steps.",
    rating: 4.6
  },
  {
    id: "anua-heartleaf-77-soothing-toner",
    name: "Heartleaf 77% Soothing Toner",
    nameKr: "어성초 77% 수딩 토너",
    brand: "Anua",
    category: "toner",
    subcategory: "hydrating_toner",
    keyIngredients: ["Houttuynia Cordata Extract (77%)", "Hyaluronic Acid", "Panthenol", "Glycerin"],
    skinTypes: ["sensitive", "oily", "combination", "normal"],
    skinConcerns: ["redness", "oiliness", "acne"],
    priceRange: "mid",
    description: "Bestselling mildly acidic toner with 77% heartleaf extract that soothes skin troubles, balances oil-moisture levels, and calms redness.",
    rating: 4.6
  },
  {
    id: "round-lab-1025-dokdo-toner",
    name: "1025 Dokdo Toner",
    nameKr: "1025 독도 토너",
    brand: "Round Lab",
    category: "toner",
    subcategory: "hydrating_toner",
    keyIngredients: ["Deep Sea Water", "Panthenol", "Allantoin", "Glycerin", "Seaweed Extract"],
    skinTypes: ["sensitive", "dry", "normal", "combination"],
    skinConcerns: ["dryness", "redness", "texture"],
    priceRange: "mid",
    description: "Mineral-rich watery toner with deep-sea water that gently exfoliates, hydrates, and improves skin texture without sticky residue.",
    rating: 4.5
  },
  {
    id: "pyunkang-yul-essence-toner",
    name: "Essence Toner",
    nameKr: "에센스 토너",
    brand: "Pyunkang Yul",
    category: "toner",
    subcategory: "hydrating_toner",
    keyIngredients: ["Astragalus Membranaceus Root Extract (91.3%)", "Betaine", "Butylene Glycol"],
    skinTypes: ["dry", "sensitive", "normal", "combination"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "budget",
    description: "Minimalist 7-ingredient essence toner with 91.3% astragalus root extract that delivers 24-hour hydration and reduces sebum production by 32.7%.",
    rating: 4.5
  },
  {
    id: "etude-soonjung-ph55-relief-toner",
    name: "SoonJung pH 5.5 Relief Toner",
    nameKr: "순정 pH 5.5 릴리프 토너",
    brand: "Etude House",
    category: "toner",
    subcategory: "hydrating_toner",
    keyIngredients: ["Panthenol", "Madecassoside", "Glycerin"],
    skinTypes: ["sensitive", "dry", "normal"],
    skinConcerns: ["redness", "dryness"],
    priceRange: "budget",
    description: "Ultra-gentle relief toner with 97% naturally derived ingredients, panthenol, and madecassoside that soothes and hydrates reactive skin.",
    rating: 4.5
  },
  {
    id: "some-by-mi-aha-bha-pha-miracle-toner",
    name: "AHA BHA PHA 30 Days Miracle Toner",
    nameKr: "AHA BHA PHA 30일 미라클 토너",
    brand: "Some By Mi",
    category: "toner",
    subcategory: "exfoliating_toner",
    keyIngredients: ["AHA (Citric Acid)", "BHA (Salicylic Acid)", "PHA (Lactobionic Acid)", "Tea Tree Extract", "Niacinamide"],
    skinTypes: ["oily", "combination", "normal"],
    skinConcerns: ["acne", "texture", "pores", "oiliness"],
    priceRange: "mid",
    description: "Triple-acid exfoliating toner with tea tree extract and 2% niacinamide that boosts cell turnover, clears pores, and evens skin tone.",
    rating: 4.3
  },
  {
    id: "isntree-hyaluronic-acid-toner",
    name: "Hyaluronic Acid Toner",
    nameKr: "히알루론산 토너",
    brand: "Isntree",
    category: "toner",
    subcategory: "hydrating_toner",
    keyIngredients: ["Hyaluronic Acid", "Sodium Hyaluronate", "Aloe Vera", "Centella Asiatica", "Glycerin"],
    skinTypes: ["dry", "sensitive", "normal", "combination"],
    skinConcerns: ["dryness", "aging"],
    priceRange: "mid",
    description: "Triple hyaluronic acid toner with three molecular weights that hydrates at every skin layer, free from fragrance, alcohol, and parabens.",
    rating: 4.5
  },
  {
    id: "skin1004-madagascar-centella-toning-toner",
    name: "Madagascar Centella Toning Toner",
    nameKr: "마다가스카르 센텔라 토닝 토너",
    brand: "SKIN1004",
    category: "toner",
    subcategory: "hydrating_toner",
    keyIngredients: ["Centella Asiatica Extract (84%)", "Gluconolactone", "Niacinamide", "Hyaluronic Acid", "Betaine"],
    skinTypes: ["sensitive", "normal", "combination"],
    skinConcerns: ["redness", "texture", "dark_spots"],
    priceRange: "mid",
    description: "Gentle PHA toner with 84% centella asiatica extract that soothes sensitive skin, mildly exfoliates, brightens, and strengthens the barrier.",
    rating: 4.4
  },
  {
    id: "torriden-dive-in-low-molecular-hyaluronic-acid-toner",
    name: "DIVE-IN Low Molecule Hyaluronic Acid Toner",
    nameKr: "다이브인 저분자 히알루론산 토너",
    brand: "Torriden",
    category: "toner",
    subcategory: "hydrating_toner",
    keyIngredients: ["5D Hyaluronic Acid Complex", "Panthenol", "Allantoin", "Madecassoside"],
    skinTypes: ["dry", "sensitive", "normal", "combination"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "mid",
    description: "Award-winning hydrating toner with five types of hyaluronic acid at different molecular weights for multi-layer hydration without stickiness.",
    rating: 4.5
  },

  // ============================================================
  // ESSENCES
  // ============================================================
  {
    id: "cosrx-advanced-snail-96-mucin-power-essence",
    name: "Advanced Snail 96 Mucin Power Essence",
    nameKr: "어드밴스드 스네일 96 뮤신 파워 에센스",
    brand: "COSRX",
    category: "essence",
    subcategory: "hydrating_essence",
    keyIngredients: ["Snail Secretion Filtrate (96%)", "Sodium Hyaluronate", "Betaine", "Panthenol"],
    skinTypes: ["normal", "dry", "combination", "oily", "sensitive"],
    skinConcerns: ["dryness", "aging", "acne", "dark_spots", "texture"],
    priceRange: "mid",
    description: "Iconic bestselling essence with 96% snail mucin that deeply hydrates, repairs damaged skin, improves elasticity, and reduces acne scars.",
    rating: 4.7
  },
  {
    id: "missha-time-revolution-first-treatment-essence-5x",
    name: "Time Revolution The First Essence 5X",
    nameKr: "타임 레볼루션 더 퍼스트 에센스 5X",
    brand: "Missha",
    category: "essence",
    subcategory: "first_essence",
    keyIngredients: ["Saccharomyces Ferment Filtrate (80%)", "Bifida Ferment Lysate", "Niacinamide", "Sodium Hyaluronate", "Adenosine"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["aging", "dark_spots", "texture", "dryness"],
    priceRange: "mid",
    description: "Flagship yeast ferment essence with 80% saccharomyces filtrate that smooths texture, brightens complexion, and boosts skin radiance.",
    rating: 4.5
  },
  {
    id: "numbuzin-no3-skin-softening-serum",
    name: "No.3 Skin Softening Serum",
    nameKr: "3번 피부결 세럼",
    brand: "numbuzin",
    category: "essence",
    subcategory: "fermented_essence",
    keyIngredients: ["Galactomyces Ferment Filtrate", "Niacinamide", "Bifida Ferment Lysate", "Panthenol"],
    skinTypes: ["normal", "combination", "oily"],
    skinConcerns: ["texture", "pores", "dryness"],
    priceRange: "mid",
    description: "Bio-fermented essence that rapidly softens skin texture and refines pores, often compared to SK-II at a fraction of the price.",
    rating: 4.5
  },
  {
    id: "sulwhasoo-first-care-activating-serum-vi",
    name: "First Care Activating Serum VI",
    nameKr: "윤조에센스 VI",
    brand: "Sulwhasoo",
    category: "essence",
    subcategory: "first_essence",
    keyIngredients: ["500-Hour Aged Ginseng Extract", "Korean Herb Extract", "Vitamin C Derivative", "Panax Ginseng Root Extract"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["aging", "dryness", "dark_spots", "texture"],
    priceRange: "premium",
    description: "Luxury anti-aging activating serum with 500-hour aged ginseng extract that boosts hydration, firms skin, and addresses fine lines and wrinkles.",
    rating: 4.6
  },

  // ============================================================
  // SERUMS & AMPOULES
  // ============================================================
  {
    id: "beauty-of-joseon-glow-serum-propolis-niacinamide",
    name: "Glow Serum: Propolis + Niacinamide",
    nameKr: "광채 세럼: 프로폴리스 + 나이아신아마이드",
    brand: "Beauty of Joseon",
    category: "serum",
    subcategory: "brightening_serum",
    keyIngredients: ["Propolis Extract (60%)", "Niacinamide (2%)", "Turmeric Extract", "Tea Tree Extract", "Centella Asiatica"],
    skinTypes: ["normal", "oily", "combination", "sensitive"],
    skinConcerns: ["pores", "redness", "oiliness", "acne"],
    priceRange: "budget",
    description: "Honey-textured serum with 60% propolis and niacinamide that refines pores, controls excess sebum, calms redness, and adds a natural glow.",
    rating: 4.5
  },
  {
    id: "beauty-of-joseon-glow-deep-serum-rice-arbutin",
    name: "Glow Deep Serum: Rice + Alpha-Arbutin",
    nameKr: "광채 딥 세럼: 쌀 + 알파알부틴",
    brand: "Beauty of Joseon",
    category: "serum",
    subcategory: "brightening_serum",
    keyIngredients: ["Rice Bran Water (68%)", "Alpha-Arbutin (2%)", "Niacinamide", "Panthenol"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["dark_spots", "dryness", "texture"],
    priceRange: "budget",
    description: "Brightening serum with 68% rice bran water and alpha-arbutin that targets uneven skin tone, hyperpigmentation, and dullness.",
    rating: 4.5
  },
  {
    id: "cosrx-bha-blackhead-power-liquid",
    name: "BHA Blackhead Power Liquid",
    nameKr: "BHA 블랙헤드 파워 리퀴드",
    brand: "COSRX",
    category: "serum",
    subcategory: "exfoliating_serum",
    keyIngredients: ["Betaine Salicylate (4%)", "Niacinamide", "Sodium Hyaluronate", "Panthenol", "Willow Bark Water"],
    skinTypes: ["oily", "combination", "normal"],
    skinConcerns: ["acne", "pores", "oiliness", "texture"],
    priceRange: "mid",
    description: "Gentle leave-on BHA exfoliant with 4% betaine salicylate that penetrates pores to dissolve blackheads, whiteheads, and excess sebum.",
    rating: 4.6
  },
  {
    id: "cosrx-aha-7-whitehead-power-liquid",
    name: "AHA 7 Whitehead Power Liquid",
    nameKr: "AHA 7 화이트헤드 파워 리퀴드",
    brand: "COSRX",
    category: "serum",
    subcategory: "exfoliating_serum",
    keyIngredients: ["Glycolic Acid (7%)", "Apple Water", "Niacinamide", "Sodium Hyaluronate"],
    skinTypes: ["normal", "combination", "oily"],
    skinConcerns: ["texture", "acne", "dark_spots", "aging"],
    priceRange: "mid",
    description: "Chemical exfoliant with 7% glycolic acid that dissolves dead skin cells, clears whiteheads, improves texture, and brightens skin tone.",
    rating: 4.4
  },
  {
    id: "cosrx-propolis-light-ampoule",
    name: "Full Fit Propolis Light Ampoule",
    nameKr: "풀핏 프로폴리스 라이트 앰플",
    brand: "COSRX",
    category: "serum",
    subcategory: "soothing_serum",
    keyIngredients: ["Black Bee Propolis Extract (83.25%)", "Glycerin", "Betaine", "Sodium Hyaluronate"],
    skinTypes: ["normal", "oily", "combination", "sensitive"],
    skinConcerns: ["redness", "dryness", "acne"],
    priceRange: "mid",
    description: "Lightweight non-greasy ampoule with 83.25% black bee propolis that soothes inflammation, hydrates, and provides antioxidant protection.",
    rating: 4.3
  },
  {
    id: "klairs-freshly-juiced-vitamin-drop",
    name: "Freshly Juiced Vitamin Drop",
    nameKr: "프레쉬리 쥬스드 비타민 드롭",
    brand: "Klairs",
    category: "serum",
    subcategory: "brightening_serum",
    keyIngredients: ["Ascorbic Acid (5%)", "Sodium Ascorbyl Phosphate", "Centella Asiatica Extract", "Yuzu Extract"],
    skinTypes: ["sensitive", "normal", "dry", "combination"],
    skinConcerns: ["dark_spots", "aging", "texture"],
    priceRange: "mid",
    description: "Gentle 5% vitamin C serum with centella and yuzu extract, perfect for sensitive skin beginners looking to brighten and protect against UV damage.",
    rating: 4.4
  },
  {
    id: "numbuzin-no5-vitamin-concentrated-serum",
    name: "No.5 Vitamin Concentrated Serum",
    nameKr: "5번 비타민 농축 세럼",
    brand: "numbuzin",
    category: "serum",
    subcategory: "brightening_serum",
    keyIngredients: ["Tranexamic Acid (4%)", "Niacinamide (5%)", "Glutathione", "Vitamin C", "Alpha-Arbutin"],
    skinTypes: ["normal", "combination", "sensitive", "oily"],
    skinConcerns: ["dark_spots", "texture", "aging"],
    priceRange: "mid",
    description: "Multi-brightening serum with glutathione, tranexamic acid, and niacinamide that fades hyperpigmentation and evens skin tone with 95% satisfaction rate.",
    rating: 4.5
  },
  {
    id: "torriden-dive-in-low-molecular-hyaluronic-acid-serum",
    name: "DIVE-IN Low Molecular Hyaluronic Acid Serum",
    nameKr: "다이브인 저분자 히알루론산 세럼",
    brand: "Torriden",
    category: "serum",
    subcategory: "hydrating_serum",
    keyIngredients: ["5D Hyaluronic Acid Complex", "Panthenol", "Allantoin", "Madecassoside", "Malachite Extract"],
    skinTypes: ["dry", "sensitive", "normal", "combination"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "mid",
    description: "Award-winning hydrating serum with five types of hyaluronic acid that delivers deep moisture without stickiness, soothing dry and sensitive skin.",
    rating: 4.6
  },
  {
    id: "skin1004-madagascar-centella-ampoule",
    name: "Madagascar Centella Asiatica 100 Ampoule",
    nameKr: "마다가스카르 센텔라 아시아티카 100 앰플",
    brand: "SKIN1004",
    category: "serum",
    subcategory: "soothing_serum",
    keyIngredients: ["Centella Asiatica Extract (100%)"],
    skinTypes: ["sensitive", "oily", "combination", "normal"],
    skinConcerns: ["redness", "acne", "dryness"],
    priceRange: "mid",
    description: "Pure 100% centella asiatica extract ampoule that calms irritated and sensitive skin, strengthens the skin barrier, and soothes redness.",
    rating: 4.4
  },
  {
    id: "beauty-of-joseon-revive-eye-serum-ginseng-retinal",
    name: "Revive Eye Serum: Ginseng + Retinal",
    nameKr: "리바이브 아이세럼: 인삼 + 레티날",
    brand: "Beauty of Joseon",
    category: "eye_cream",
    subcategory: "eye_serum",
    keyIngredients: ["Ginseng Root Extract", "Retinal", "Niacinamide", "Adenosine"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["aging", "dark_spots", "dryness"],
    priceRange: "budget",
    description: "Award-winning eye serum combining antioxidant-rich ginseng with retinal to target fine lines, dark circles, and signs of aging around the eyes.",
    rating: 4.5
  },
  {
    id: "purito-centella-green-level-buffet-serum",
    name: "Centella Green Level Buffet Serum",
    nameKr: "센텔라 그린레벨 버핏 세럼",
    brand: "Purito",
    category: "serum",
    subcategory: "soothing_serum",
    keyIngredients: ["Centella Asiatica Extract", "Niacinamide", "Peptides", "Hyaluronic Acid", "Adenosine"],
    skinTypes: ["sensitive", "normal", "combination", "dry"],
    skinConcerns: ["redness", "aging", "dryness"],
    priceRange: "mid",
    description: "Multi-functional serum with high concentration of centella asiatica that soothes irritation, reduces redness, and provides anti-aging benefits.",
    rating: 4.3
  },
  {
    id: "some-by-mi-aha-bha-pha-miracle-serum",
    name: "AHA BHA PHA 30 Days Miracle Serum",
    nameKr: "AHA BHA PHA 30일 미라클 세럼",
    brand: "Some By Mi",
    category: "serum",
    subcategory: "exfoliating_serum",
    keyIngredients: ["AHA", "BHA", "PHA", "Tea Tree Extract", "Niacinamide", "Adenosine"],
    skinTypes: ["oily", "combination", "normal"],
    skinConcerns: ["acne", "texture", "pores", "oiliness"],
    priceRange: "mid",
    description: "Triple-acid serum with tea tree that targets acne and blemishes, exfoliates dead skin, refines pores, and promotes clearer skin in 30 days.",
    rating: 4.2
  },
  {
    id: "sulwhasoo-concentrated-ginseng-rejuvenating-serum",
    name: "Concentrated Ginseng Rejuvenating Serum",
    nameKr: "자음생 세럼",
    brand: "Sulwhasoo",
    category: "serum",
    subcategory: "anti_aging_serum",
    keyIngredients: ["Ginseng Actives", "Ginseng Peptide", "Retinol", "Panax Ginseng Root Extract"],
    skinTypes: ["normal", "dry", "combination"],
    skinConcerns: ["aging", "dryness", "texture"],
    priceRange: "premium",
    description: "Luxury anti-aging serum powered by Korean ginseng actives and ginseng peptide that firms skin, reduces wrinkles, and supports self-rejuvenation.",
    rating: 4.6
  },

  // ============================================================
  // MOISTURIZERS
  // ============================================================
  {
    id: "cosrx-advanced-snail-92-all-in-one-cream",
    name: "Advanced Snail 92 All In One Cream",
    nameKr: "어드밴스드 스네일 92 올인원 크림",
    brand: "COSRX",
    category: "moisturizer",
    subcategory: "gel_cream",
    keyIngredients: ["Snail Secretion Filtrate (92%)", "Sodium Hyaluronate", "Betaine", "Panthenol", "Adenosine"],
    skinTypes: ["normal", "dry", "combination", "oily", "sensitive"],
    skinConcerns: ["dryness", "aging", "acne", "texture"],
    priceRange: "mid",
    description: "Lightweight jelly cream with 92% snail mucin that soothes, repairs, and moisturizes all skin types while improving skin elasticity and healing.",
    rating: 4.5
  },
  {
    id: "laneige-water-bank-blue-hyaluronic-cream",
    name: "Water Bank Blue Hyaluronic Cream",
    nameKr: "워터뱅크 블루 히알루로닉 크림",
    brand: "Laneige",
    category: "moisturizer",
    subcategory: "cream",
    keyIngredients: ["Blue Hyaluronic Acid", "Squalane", "Ceramides", "Peptides", "Niacinamide"],
    skinTypes: ["normal", "dry", "combination"],
    skinConcerns: ["dryness", "aging"],
    priceRange: "mid",
    description: "Rich yet lightweight moisturizer with blue hyaluronic acid technology that delivers long-lasting deep hydration and strengthens the moisture barrier.",
    rating: 4.4
  },
  {
    id: "dr-jart-ceramidin-cream",
    name: "Ceramidin Skin Barrier Moisturizing Cream",
    nameKr: "세라마이딘 크림",
    brand: "Dr.Jart+",
    category: "moisturizer",
    subcategory: "cream",
    keyIngredients: ["5-Cera Complex", "Panthenol", "Shea Butter", "Ceramides", "Hyaluronic Acid"],
    skinTypes: ["dry", "sensitive", "normal"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "premium",
    description: "Rich barrier-repair cream with 5-Cera Complex of five ceramides and panthenol that strengthens the skin barrier and locks in maximum moisture.",
    rating: 4.6
  },
  {
    id: "dr-jart-cicapair-tiger-grass-cream",
    name: "Cicapair Tiger Grass Color Correcting Treatment SPF 30",
    nameKr: "시카페어 타이거 그래스 컬러 코렉팅 트리트먼트",
    brand: "Dr.Jart+",
    category: "moisturizer",
    subcategory: "treatment_cream",
    keyIngredients: ["Centella Asiatica", "Niacinamide", "Panthenol", "Zinc Oxide", "Titanium Dioxide"],
    skinTypes: ["sensitive", "combination", "normal"],
    skinConcerns: ["redness", "acne"],
    priceRange: "premium",
    description: "Green-to-beige color correcting cream with centella asiatica that neutralizes redness, repairs the skin barrier, and provides SPF 30 protection.",
    rating: 4.5
  },
  {
    id: "beauty-of-joseon-dynasty-cream",
    name: "Dynasty Cream",
    nameKr: "조선미녀 왕조 크림",
    brand: "Beauty of Joseon",
    category: "moisturizer",
    subcategory: "cream",
    keyIngredients: ["Rice Bran Water (29%)", "Ginseng Root Water", "Niacinamide", "Squalane", "Ceramides", "Honey Extract"],
    skinTypes: ["normal", "dry", "combination"],
    skinConcerns: ["dryness", "aging", "dark_spots"],
    priceRange: "budget",
    description: "Nourishing cream inspired by Joseon dynasty royal beauty rituals with rice bran water, ginseng, and ceramides for a dewy, luminous finish.",
    rating: 4.5
  },
  {
    id: "innisfree-green-tea-seed-cream",
    name: "Green Tea Seed Hyaluronic Cream",
    nameKr: "그린티 씨드 히알루론산 크림",
    brand: "Innisfree",
    category: "moisturizer",
    subcategory: "cream",
    keyIngredients: ["Green Tea Seed Oil", "Jeju Green Tea Extract", "Hyaluronic Acid", "Squalane"],
    skinTypes: ["normal", "combination", "dry"],
    skinConcerns: ["dryness", "aging"],
    priceRange: "mid",
    description: "Hydrating cream with 100% Jeju green tea and hyaluronic acid that delivers up to 72 hours of moisture while providing antioxidant protection.",
    rating: 4.3
  },
  {
    id: "klairs-midnight-blue-calming-cream",
    name: "Midnight Blue Calming Cream",
    nameKr: "미드나잇 블루 카밍 크림",
    brand: "Klairs",
    category: "moisturizer",
    subcategory: "treatment_cream",
    keyIngredients: ["Guaiazulene", "Centella Asiatica", "Panthenol", "Beta-Glucan"],
    skinTypes: ["sensitive", "normal", "combination"],
    skinConcerns: ["redness", "acne"],
    priceRange: "mid",
    description: "Cooling calming cream with chamomile-derived guaiazulene and centella asiatica that soothes inflammation, redness, and irritated skin after treatments.",
    rating: 4.4
  },
  {
    id: "pyunkang-yul-nutrition-cream",
    name: "Nutrition Cream",
    nameKr: "영양 크림",
    brand: "Pyunkang Yul",
    category: "moisturizer",
    subcategory: "cream",
    keyIngredients: ["Astragalus Extract", "Shea Butter", "Macadamia Oil", "Jojoba Oil"],
    skinTypes: ["dry", "normal", "sensitive"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "budget",
    description: "Dense nourishing cream with minimal ingredients from the Pyunkang Oriental Medicine Clinic that deeply moisturizes and protects dry, sensitive skin.",
    rating: 4.3
  },
  {
    id: "sulwhasoo-concentrated-ginseng-rejuvenating-cream",
    name: "Concentrated Ginseng Rejuvenating Cream",
    nameKr: "자음생 크림",
    brand: "Sulwhasoo",
    category: "moisturizer",
    subcategory: "cream",
    keyIngredients: ["Korean Ginseng Actives", "Ginseng Peptide", "Retinol", "Panax Ginseng Root Extract"],
    skinTypes: ["normal", "dry"],
    skinConcerns: ["aging", "dryness", "texture"],
    priceRange: "premium",
    description: "Luxury anti-aging cream powered by ginseng actives and peptide technology that visibly firms, reduces wrinkles, and supports skin self-rejuvenation.",
    rating: 4.7
  },
  {
    id: "round-lab-birch-juice-moisturizing-cream",
    name: "Birch Juice Moisturizing Cream",
    nameKr: "자작나무 수분 크림",
    brand: "Round Lab",
    category: "moisturizer",
    subcategory: "cream",
    keyIngredients: ["Birch Juice", "Hyaluronic Acid", "Panthenol", "Squalane"],
    skinTypes: ["dry", "normal", "sensitive"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "mid",
    description: "Deep hydrating cream with birch juice and hyaluronic acid that provides lasting moisture and strengthens the skin barrier for dry and dehydrated skin.",
    rating: 4.4
  },

  // ============================================================
  // SUNSCREENS
  // ============================================================
  {
    id: "beauty-of-joseon-relief-sun-rice-probiotics",
    name: "Relief Sun: Rice + Probiotics SPF50+ PA++++",
    nameKr: "맑은 쌀 선크림",
    brand: "Beauty of Joseon",
    category: "sunscreen",
    subcategory: "chemical_sunscreen",
    keyIngredients: ["Rice Extract", "Grain-Derived Probiotics", "Chemical UV Filters"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["aging", "dark_spots"],
    priceRange: "budget",
    description: "Viral ultra-light sunscreen with rice extract and probiotics that provides SPF50+ PA++++ protection without white cast, fragrance-free and non-irritating.",
    rating: 4.6
  },
  {
    id: "skin1004-madagascar-centella-hyalu-cica-sun-serum",
    name: "Madagascar Centella Hyalu-Cica Water-Fit Sun Serum SPF50+ PA++++",
    nameKr: "마다가스카르 센텔라 히알루시카 워터핏 선 세럼",
    brand: "SKIN1004",
    category: "sunscreen",
    subcategory: "chemical_sunscreen",
    keyIngredients: ["Centella Asiatica", "Hyaluronic Acid", "Chemical UV Filters"],
    skinTypes: ["sensitive", "oily", "combination", "normal"],
    skinConcerns: ["redness", "acne", "aging"],
    priceRange: "mid",
    description: "Lightweight dewy sun serum with centella and hyaluronic acid that calms redness, provides SPF50+ protection, and leaves no white cast.",
    rating: 4.5
  },
  {
    id: "isntree-hyaluronic-acid-watery-sun-gel",
    name: "Hyaluronic Acid Watery Sun Gel SPF50+ PA++++",
    nameKr: "히알루론산 워터리 선젤",
    brand: "Isntree",
    category: "sunscreen",
    subcategory: "chemical_sunscreen",
    keyIngredients: ["8 Types of Hyaluronic Acid", "Chemical UV Filters"],
    skinTypes: ["dry", "sensitive", "normal"],
    skinConcerns: ["dryness", "aging"],
    priceRange: "mid",
    description: "Intensely hydrating sunscreen gel with 8 types of hyaluronic acid that provides SPF50+ protection with no white cast, no fragrance, and no alcohol.",
    rating: 4.4
  },
  {
    id: "round-lab-birch-juice-moisturizing-sun-cream",
    name: "Birch Juice Moisturizing Sun Cream SPF50+ PA++++",
    nameKr: "자작나무 수분 선크림",
    brand: "Round Lab",
    category: "sunscreen",
    subcategory: "chemical_sunscreen",
    keyIngredients: ["Birch Juice", "Hyaluronic Acid", "Panthenol", "UV Filters"],
    skinTypes: ["dry", "normal", "sensitive"],
    skinConcerns: ["dryness", "aging"],
    priceRange: "mid",
    description: "Moisturizing sun cream with birch juice that hydrates while providing SPF50+ PA++++ broad-spectrum protection, ideal for dry and sensitive skin.",
    rating: 4.3
  },
  {
    id: "innisfree-daily-uv-defense-sunscreen",
    name: "Daily UV Defense Sunscreen SPF36 PA+++",
    nameKr: "데일리 UV 디펜스 선스크린",
    brand: "Innisfree",
    category: "sunscreen",
    subcategory: "chemical_sunscreen",
    keyIngredients: ["Sunflower Seed Oil", "Green Tea Extract", "Chemical UV Filters", "Ceramides"],
    skinTypes: ["normal", "combination", "sensitive"],
    skinConcerns: ["aging"],
    priceRange: "mid",
    description: "Lightweight everyday sunscreen with green tea extract that provides broad-spectrum protection while nourishing and moisturizing the skin.",
    rating: 4.2
  },
  {
    id: "missha-all-around-safe-block-essence-sun",
    name: "All Around Safe Block Essence Sun SPF45 PA+++",
    nameKr: "올 어라운드 세이프 블록 에센스 선",
    brand: "Missha",
    category: "sunscreen",
    subcategory: "chemical_sunscreen",
    keyIngredients: ["Hyaluronic Acid", "Chemical UV Filters", "Glycerin"],
    skinTypes: ["normal", "combination", "oily"],
    skinConcerns: ["aging", "oiliness"],
    priceRange: "budget",
    description: "Lightweight watery essence sunscreen that absorbs quickly with no white cast, providing daily broad-spectrum protection for all skin types.",
    rating: 4.3
  },

  // ============================================================
  // MASKS & TREATMENTS
  // ============================================================
  {
    id: "laneige-water-sleeping-mask",
    name: "Water Sleeping Mask",
    nameKr: "워터 슬리핑 마스크",
    brand: "Laneige",
    category: "mask",
    subcategory: "sleeping_mask",
    keyIngredients: ["Squalane", "Niacinamide", "Ceramides", "3x Hyaluronic Acid Blend", "Probiotics Complex"],
    skinTypes: ["normal", "dry", "combination"],
    skinConcerns: ["dryness", "aging"],
    priceRange: "mid",
    description: "Iconic overnight hydrating mask with squalane and triple hyaluronic acid blend that replenishes moisture while you sleep for plump, dewy skin.",
    rating: 4.6
  },
  {
    id: "laneige-lip-sleeping-mask",
    name: "Lip Sleeping Mask",
    nameKr: "립 슬리핑 마스크",
    brand: "Laneige",
    category: "mask",
    subcategory: "lip_mask",
    keyIngredients: ["Berry Mix Complex", "Coconut Oil", "Shea Butter", "Murumuru Seed Butter", "Vitamin C"],
    skinTypes: ["normal", "dry", "combination", "oily", "sensitive"],
    skinConcerns: ["dryness"],
    priceRange: "mid",
    description: "Award-winning overnight lip treatment with berry antioxidants and coconut oil that deeply nourishes and softens dry, chapped lips while you sleep.",
    rating: 4.7
  },
  {
    id: "cosrx-ultimate-nourishing-rice-overnight-mask",
    name: "Ultimate Nourishing Rice Overnight Spa Mask",
    nameKr: "얼티밋 너리싱 라이스 오버나이트 스파 마스크",
    brand: "COSRX",
    category: "mask",
    subcategory: "sleeping_mask",
    keyIngredients: ["Rice Extract (68%)", "Niacinamide", "Glycerin"],
    skinTypes: ["normal", "dry", "combination"],
    skinConcerns: ["dryness", "dark_spots", "texture"],
    priceRange: "budget",
    description: "Brightening overnight mask with 68% rice extract that intensively hydrates, evens skin tone, and improves texture for a radiant morning glow.",
    rating: 4.4
  },
  {
    id: "cosrx-ultimate-moisturizing-honey-overnight-mask",
    name: "Ultimate Moisturizing Honey Overnight Mask",
    nameKr: "얼티밋 모이스처라이징 허니 오버나이트 마스크",
    brand: "COSRX",
    category: "mask",
    subcategory: "sleeping_mask",
    keyIngredients: ["Propolis Extract", "Beeswax", "Glycerin", "Betaine"],
    skinTypes: ["dry", "normal", "sensitive"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "budget",
    description: "Versatile honey and propolis overnight mask that can be used as sleeping mask, wash-off mask, or moisturizer for deep soothing hydration.",
    rating: 4.3
  },
  {
    id: "sulwhasoo-first-care-activating-mask",
    name: "First Care Activating Mask",
    nameKr: "윤조마스크",
    brand: "Sulwhasoo",
    category: "mask",
    subcategory: "sheet_mask",
    keyIngredients: ["Korean Ginseng Extract", "Korean Herb Complex", "Hyaluronic Acid"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["aging", "dryness", "texture"],
    priceRange: "premium",
    description: "Luxury sheet mask infused with ginseng and herbal complex that delivers concentrated anti-aging and hydrating benefits in a single treatment.",
    rating: 4.5
  },
  {
    id: "medicube-zero-pore-pad",
    name: "Zero Pore Pad 2.0",
    nameKr: "제로 모공 패드 2.0",
    brand: "medicube",
    category: "treatment",
    subcategory: "exfoliating_pad",
    keyIngredients: ["Lactic Acid (AHA 4.5%)", "Salicylic Acid (BHA 0.45%)", "Panthenol", "Allantoin", "Anti Sebum P Complex"],
    skinTypes: ["oily", "combination", "normal"],
    skinConcerns: ["pores", "oiliness", "acne", "texture"],
    priceRange: "mid",
    description: "Bestselling dual-textured exfoliating pads with AHA and BHA that dissolve dead skin cells, clear sebum, minimize pores, and smooth skin texture.",
    rating: 4.5
  },

  // ============================================================
  // EYE CREAMS
  // ============================================================
  {
    id: "sulwhasoo-concentrated-ginseng-renewing-eye-cream",
    name: "Concentrated Ginseng Renewing Eye Cream",
    nameKr: "자음생 아이크림",
    brand: "Sulwhasoo",
    category: "eye_cream",
    subcategory: "anti_aging_eye_cream",
    keyIngredients: ["Ginseng Extract", "Retinol", "Ginseng Peptide", "Adenosine"],
    skinTypes: ["normal", "dry"],
    skinConcerns: ["aging", "dryness"],
    priceRange: "premium",
    description: "Luxury anti-aging eye cream with potent ginseng and retinol that targets wrinkles, firms delicate eye area skin, and provides intense nourishment.",
    rating: 4.6
  },
  {
    id: "innisfree-jeju-orchid-eye-cream",
    name: "Jeju Orchid Eye Cream",
    nameKr: "제주 오키드 아이크림",
    brand: "Innisfree",
    category: "eye_cream",
    subcategory: "anti_aging_eye_cream",
    keyIngredients: ["Orchid Extract", "Hyaluronic Acid", "Peptides", "Adenosine"],
    skinTypes: ["normal", "dry", "combination"],
    skinConcerns: ["aging", "dryness"],
    priceRange: "mid",
    description: "Firming eye cream with powerful orchid extract and peptides that improves elasticity, nourishes, and smooths tired under-eyes with quick absorption.",
    rating: 4.3
  },
  {
    id: "missha-misa-geum-sul-vitalizing-eye-cream",
    name: "MISA Geum Sul Vitalizing Eye Cream",
    nameKr: "미샤 금설 바이탈라이징 아이크림",
    brand: "Missha",
    category: "eye_cream",
    subcategory: "anti_aging_eye_cream",
    keyIngredients: ["Gold", "Ginseng Extract", "Deer Antler Extract", "Adenosine"],
    skinTypes: ["normal", "dry"],
    skinConcerns: ["aging", "dryness", "dark_spots"],
    priceRange: "mid",
    description: "Luxurious eye cream with 24K gold and traditional hanbang ingredients that firms, moisturizes, and brightens the delicate eye area.",
    rating: 4.2
  },

  // ============================================================
  // EXFOLIATORS
  // ============================================================
  {
    id: "cosrx-aha-bha-clarifying-treatment-toner",
    name: "AHA/BHA Clarifying Treatment Toner",
    nameKr: "AHA/BHA 클래리파잉 트리트먼트 토너",
    brand: "COSRX",
    category: "exfoliator",
    subcategory: "chemical_exfoliator",
    keyIngredients: ["Glycolic Acid (AHA)", "Betaine Salicylate (BHA)", "Mineral Water", "Willow Bark Water"],
    skinTypes: ["oily", "combination", "normal"],
    skinConcerns: ["pores", "texture", "acne"],
    priceRange: "budget",
    description: "Mild daily exfoliating toner with AHA and BHA that prepares skin by gently sweeping away dead cells and balancing pH for better product absorption.",
    rating: 4.3
  },
  {
    id: "neogen-bio-peel-gauze-peeling-wine",
    name: "Bio-Peel Gauze Peeling Wine",
    nameKr: "바이오필 가제 필링 와인",
    brand: "Neogen",
    category: "exfoliator",
    subcategory: "physical_exfoliator",
    keyIngredients: ["Resveratrol", "Lactic Acid", "Glycolic Acid", "Croton Lechleri Resin Extract"],
    skinTypes: ["normal", "combination", "oily"],
    skinConcerns: ["texture", "dark_spots", "aging", "pores"],
    priceRange: "mid",
    description: "Three-layer gauze exfoliating pads soaked in red wine extract that gently polish skin for smoother texture and brighter complexion.",
    rating: 4.4
  },

  // ============================================================
  // ADDITIONAL SERUMS & TREATMENTS
  // ============================================================
  {
    id: "cosrx-centella-blemish-cream",
    name: "Centella Blemish Cream",
    nameKr: "센텔라 블레미쉬 크림",
    brand: "COSRX",
    category: "treatment",
    subcategory: "spot_treatment",
    keyIngredients: ["Centella Asiatica", "Zinc Oxide", "Madecassic Acid", "Asiaticoside"],
    skinTypes: ["oily", "combination", "sensitive"],
    skinConcerns: ["acne", "redness"],
    priceRange: "budget",
    description: "Targeted spot treatment with centella asiatica and zinc oxide that calms active blemishes, reduces redness, and helps heal acne marks.",
    rating: 4.3
  },
  {
    id: "cosrx-acne-pimple-master-patch",
    name: "Acne Pimple Master Patch",
    nameKr: "어크네 핌플 마스터 패치",
    brand: "COSRX",
    category: "treatment",
    subcategory: "pimple_patch",
    keyIngredients: ["Hydrocolloid"],
    skinTypes: ["normal", "oily", "combination", "sensitive", "dry"],
    skinConcerns: ["acne"],
    priceRange: "budget",
    description: "Thin hydrocolloid patches that protect and absorb pus and fluids from blemishes overnight, speeding up healing without scarring.",
    rating: 4.7
  },
  {
    id: "innisfree-green-tea-seed-hyaluronic-serum",
    name: "Green Tea Seed Hyaluronic Serum",
    nameKr: "그린티 씨드 히알루론산 세럼",
    brand: "Innisfree",
    category: "serum",
    subcategory: "hydrating_serum",
    keyIngredients: ["Green Tea Extract (75.9%)", "Green Tea Seed Oil", "Hyaluronic Acid", "Betaine"],
    skinTypes: ["normal", "combination", "oily"],
    skinConcerns: ["dryness", "oiliness"],
    priceRange: "mid",
    description: "Lightweight oil-free hydrating serum with 75.9% green tea extract and encapsulated hyaluronic acid that delivers 72-hour moisture without heaviness.",
    rating: 4.3
  },
  {
    id: "pyunkang-yul-moisture-serum",
    name: "Moisture Serum",
    nameKr: "수분 세럼",
    brand: "Pyunkang Yul",
    category: "serum",
    subcategory: "hydrating_serum",
    keyIngredients: ["Olive Oil", "Barberry Root Extract", "Glycerin", "Betaine"],
    skinTypes: ["dry", "sensitive", "normal"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "budget",
    description: "Minimalist 15-ingredient serum with olive oil and barberry root that naturally moisturizes, calms sensitivity, and reduces skin temperature.",
    rating: 4.3
  },
  {
    id: "purito-centella-green-level-recovery-cream",
    name: "Centella Green Level Recovery Cream",
    nameKr: "센텔라 그린레벨 리커버리 크림",
    brand: "Purito",
    category: "moisturizer",
    subcategory: "treatment_cream",
    keyIngredients: ["Centella Asiatica (50%)", "Panthenol", "Shea Butter", "Squalane", "Ceramides"],
    skinTypes: ["sensitive", "dry", "normal", "combination"],
    skinConcerns: ["redness", "dryness", "acne"],
    priceRange: "mid",
    description: "Soothing recovery cream with 50% centella asiatica that repairs damaged skin, calms redness, and strengthens the moisture barrier.",
    rating: 4.4
  },
  {
    id: "etude-soonjung-2x-barrier-intensive-cream",
    name: "SoonJung 2x Barrier Intensive Cream",
    nameKr: "순정 2x 배리어 인텐시브 크림",
    brand: "Etude House",
    category: "moisturizer",
    subcategory: "cream",
    keyIngredients: ["Panthenol (2x)", "Madecassoside", "Shea Butter", "Squalane"],
    skinTypes: ["sensitive", "dry", "normal"],
    skinConcerns: ["redness", "dryness"],
    priceRange: "budget",
    description: "Fragrance-free barrier-repair cream with double panthenol concentration that intensely soothes and restores the moisture barrier of reactive skin.",
    rating: 4.5
  },
  {
    id: "laneige-cream-skin-cerapeptide-refiner",
    name: "Cream Skin Cerapeptide Refiner",
    nameKr: "크림스킨 세라펩타이드 리파이너",
    brand: "Laneige",
    category: "toner",
    subcategory: "cream_toner",
    keyIngredients: ["Ceramides", "Peptides", "Amino Acids", "Shea Butter"],
    skinTypes: ["dry", "normal", "sensitive"],
    skinConcerns: ["dryness", "aging"],
    priceRange: "mid",
    description: "Innovative milky cream-to-water toner with ceramides and peptides that combines toner and cream benefits for deep hydration in a single step.",
    rating: 4.4
  },
  {
    id: "round-lab-1025-dokdo-lotion",
    name: "1025 Dokdo Lotion",
    nameKr: "1025 독도 로션",
    brand: "Round Lab",
    category: "moisturizer",
    subcategory: "lotion",
    keyIngredients: ["Deep Sea Water", "Panthenol", "Allantoin", "Hyaluronic Acid"],
    skinTypes: ["normal", "combination", "oily", "sensitive"],
    skinConcerns: ["dryness", "oiliness"],
    priceRange: "mid",
    description: "Lightweight fast-absorbing lotion enriched with deep seawater minerals that provides lasting hydration, leaving skin smooth, plump, and balanced.",
    rating: 4.4
  },
  {
    id: "isntree-chestnut-aha-8-clear-essence",
    name: "Chestnut AHA 8% Clear Essence",
    nameKr: "밤나무 AHA 8% 클리어 에센스",
    brand: "Isntree",
    category: "exfoliator",
    subcategory: "chemical_exfoliator",
    keyIngredients: ["Glycolic Acid (8%)", "Chestnut Shell Extract", "Niacinamide", "Centella Asiatica"],
    skinTypes: ["normal", "combination", "oily"],
    skinConcerns: ["texture", "dark_spots", "pores", "aging"],
    priceRange: "mid",
    description: "Gentle 8% glycolic acid exfoliating essence with chestnut shell extract that smooths texture, fades dark spots, and unclogs pores.",
    rating: 4.3
  },
  {
    id: "tirtir-milk-skin-toner",
    name: "Milk Skin Toner",
    nameKr: "밀크 스킨 토너",
    brand: "TIRTIR",
    category: "toner",
    subcategory: "cream_toner",
    keyIngredients: ["Milk Protein Extract", "Ceramides", "Panthenol", "Hyaluronic Acid"],
    skinTypes: ["dry", "normal", "sensitive"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "mid",
    description: "Milky cream toner with milk protein extract and ceramides that deeply moisturizes, soothes, and strengthens the skin barrier.",
    rating: 4.2
  },
  {
    id: "numbuzin-no9-secret-lifting-ampoule",
    name: "No.9 Secret NAD+ Bio Lifting-sil Essence",
    nameKr: "9번 시크릿 NAD+ 바이오 리프팅실 에센스",
    brand: "numbuzin",
    category: "essence",
    subcategory: "anti_aging_essence",
    keyIngredients: ["NAD+", "Bio Ferment Complex", "Peptides", "Niacinamide"],
    skinTypes: ["normal", "combination", "dry"],
    skinConcerns: ["aging", "texture", "dryness"],
    priceRange: "mid",
    description: "Advanced bio-fermented anti-aging essence with NAD+ technology that firms, lifts, and improves skin elasticity for a more youthful complexion.",
    rating: 4.4
  },
  {
    id: "anua-heartleaf-70-daily-lotion",
    name: "Heartleaf 70% Daily Lotion",
    nameKr: "어성초 70% 데일리 로션",
    brand: "Anua",
    category: "moisturizer",
    subcategory: "lotion",
    keyIngredients: ["Houttuynia Cordata Extract (70%)", "Ceramides", "Panthenol", "Squalane"],
    skinTypes: ["sensitive", "oily", "combination", "normal"],
    skinConcerns: ["redness", "oiliness", "acne"],
    priceRange: "mid",
    description: "Lightweight daily lotion with 70% heartleaf extract that soothes redness, calms irritation, and provides balanced hydration for oily and sensitive skin.",
    rating: 4.3
  },
  {
    id: "some-by-mi-snail-truecica-miracle-repair-serum",
    name: "Snail Truecica Miracle Repair Serum",
    nameKr: "스네일 트루시카 미라클 리페어 세럼",
    brand: "Some By Mi",
    category: "serum",
    subcategory: "repair_serum",
    keyIngredients: ["Black Snail Mucin", "Centella Asiatica (Truecica)", "Niacinamide", "Tea Tree Extract"],
    skinTypes: ["sensitive", "combination", "normal", "oily"],
    skinConcerns: ["acne", "redness", "texture", "dark_spots"],
    priceRange: "mid",
    description: "Repair serum with black snail mucin and centella asiatica that heals blemishes, fades acne marks, calms inflammation, and improves skin texture.",
    rating: 4.3
  },

  // ============================================================
  // TRENDING INGREDIENTS - PDRN (Salmon DNA)
  // ============================================================
  {
    id: "anua-pdrn-hyaluronic-acid-capsule-100-serum",
    name: "PDRN Hyaluronic Acid Capsule 100 Serum",
    nameKr: "피디알엔 히알루론산 캡슐 100 세럼",
    brand: "Anua",
    category: "serum",
    subcategory: "hydrating_serum",
    keyIngredients: ["Sodium DNA (PDRN)", "Hyaluronic Acid", "Hydrolyzed Collagen", "Niacinamide", "Glutathione", "Sodium Hyaluronate Crosspolymer"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["dryness", "aging", "texture"],
    priceRange: "mid",
    trendingIngredients: ["PDRN"],
    description: "Olive Young No.1 serum and Glow Pick Awards winner with salmon-derived PDRN, multi-weight hyaluronic acid, and collagen that delivers intense hydration and plumping for glass skin.",
    rating: 4.6
  },
  {
    id: "mixsoon-pdrn-collagen-cream",
    name: "PDRN Collagen Cream",
    nameKr: "믹순 PDRN 콜라겐 크림",
    brand: "Mixsoon",
    category: "moisturizer",
    subcategory: "gel_cream",
    keyIngredients: ["Sodium DNA (PDRN)", "Collagen Extract", "Copper Tripeptide-1", "Niacinamide", "Hydrolyzed Hyaluronic Acid", "Saccharomyces/Rice Ferment Filtrate"],
    skinTypes: ["normal", "oily", "combination", "sensitive"],
    skinConcerns: ["aging", "dryness", "texture"],
    priceRange: "mid",
    trendingIngredients: ["PDRN"],
    description: "Lightweight gel cream with plant-based PDRN, low-molecular collagen, and liposomal peptides that restores skin elasticity and firmness while brightening with rice ferment filtrate.",
    rating: 4.4
  },
  {
    id: "medicube-pdrn-pink-peptide-ampoule",
    name: "PDRN Pink Peptide Ampoule",
    nameKr: "메디큐브 PDRN 핑크 펩타이드 앰플",
    brand: "medicube",
    category: "serum",
    subcategory: "anti_aging_serum",
    keyIngredients: ["Sodium DNA (PDRN)", "Peptides", "Niacinamide", "Collagen", "Adenosine"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["aging", "dark_spots", "texture", "dryness"],
    priceRange: "mid",
    trendingIngredients: ["PDRN"],
    description: "2025 Olive Young Awards winner and Glow Pick Award-winning ampoule with salmon PDRN and peptides that brightens dark spots, firms skin, and provides a radiant pink glow.",
    rating: 4.5
  },
  {
    id: "sungboon-editor-alaska-pdrn-barrier-cream",
    name: "Alaska PDRN Ultra Moisturizing Barrier Cream",
    nameKr: "성분에디터 알래스카 PDRN 울트라 모이스처라이징 배리어 크림",
    brand: "Sungboon Editor",
    category: "moisturizer",
    subcategory: "cream",
    keyIngredients: ["Sodium DNA (PDRN) 5250ppm", "Ceramide NP", "Ceramide AP", "Ceramide EOP", "Panthenol", "Niacinamide", "Hyaluronic Acid", "Palmitoyl Tripeptide-5"],
    skinTypes: ["dry", "normal", "sensitive"],
    skinConcerns: ["dryness", "aging", "redness"],
    priceRange: "mid",
    trendingIngredients: ["PDRN", "Ceramides"],
    description: "Barrier-repair cream featuring 93.5% ultra-pure Alaska Salmon PDRN complex with 5 types of ceramides, clinically proven to improve skin barrier function by 199% in 7 days.",
    rating: 4.5
  },

  // ============================================================
  // TRENDING INGREDIENTS - Exosomes
  // ============================================================
  {
    id: "medicube-zero-one-day-exosome-shot-7500",
    name: "Zero One Day Exosome Shot 7500",
    nameKr: "메디큐브 제로 원데이 엑소좀 샷 모공 앰플 7500",
    brand: "medicube",
    category: "serum",
    subcategory: "pore_serum",
    keyIngredients: ["Lactobacillus Extracellular Vesicles (Exosomes)", "Hydrolyzed Sponge (Spicule)", "AHA", "BHA", "PHA", "Niacinamide", "Panthenol"],
    skinTypes: ["oily", "combination", "normal"],
    skinConcerns: ["pores", "texture", "oiliness", "acne"],
    priceRange: "mid",
    trendingIngredients: ["Exosomes"],
    description: "Exosome-coated spicule ampoule with lacto-exosome technology that delivers anti-inflammatory and pore-tightening effects, enhancing active ingredient uptake by 242%.",
    rating: 4.5
  },
  {
    id: "medicube-zero-one-day-exosome-shot-2000",
    name: "Zero One Day Exosome Shot 2000",
    nameKr: "메디큐브 제로 원데이 엑소좀 샷 모공 앰플 2000",
    brand: "medicube",
    category: "serum",
    subcategory: "pore_serum",
    keyIngredients: ["Lactobacillus Extracellular Vesicles (Exosomes)", "Hydrolyzed Sponge (Spicule)", "Niacinamide", "Panthenol", "Adenosine"],
    skinTypes: ["oily", "combination", "normal", "sensitive"],
    skinConcerns: ["pores", "texture", "oiliness"],
    priceRange: "mid",
    trendingIngredients: ["Exosomes"],
    description: "Entry-level exosome-coated spicule ampoule for sensitive skin with gentler 2000 PPM concentration that refines pores and smooths skin texture with minimal irritation.",
    rating: 4.4
  },
  {
    id: "medicube-exosome-cica-calming-pad",
    name: "Exosome Cica Calming Pad",
    nameKr: "메디큐브 엑소좀 시카 카밍 패드",
    brand: "medicube",
    category: "treatment",
    subcategory: "toner_pad",
    keyIngredients: ["Centella Asiatica Leaf Vesicles (Exosome Cica)", "Centella Asiatica Extract", "Madecassoside", "Niacinamide (2%)", "Tea Tree Water", "Houttuynia Cordata Water", "Ectoin"],
    skinTypes: ["sensitive", "oily", "combination", "normal"],
    skinConcerns: ["redness", "acne", "pores"],
    priceRange: "mid",
    trendingIngredients: ["Exosomes", "Centella/Cica"],
    description: "Hypoallergenic calming toner pad with nano-sized exosome cica that is 5.3x more powerful than regular cica, featuring 12 types of centella for soothing sensitive and acne-prone skin.",
    rating: 4.5
  },
  {
    id: "vt-cica-exosome-moisture-mask",
    name: "Cica-Exosome Moisture Mask",
    nameKr: "VT 시카 엑소좀 모이스처 마스크",
    brand: "VT Cosmetics",
    category: "mask",
    subcategory: "sheet_mask",
    keyIngredients: ["Centella Asiatica Exosome", "Hyaluronic Acid", "Panthenol", "Niacinamide", "Madecassoside"],
    skinTypes: ["dry", "sensitive", "normal", "combination"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "mid",
    trendingIngredients: ["Exosomes", "Centella/Cica"],
    description: "Vegan biodegradable sheet mask with VT Exosome Delivery (VED) technology that purifies centella extract to 141.9nm particles, 645x smaller than pores, for deep soothing hydration.",
    rating: 4.3
  },
  {
    id: "vt-pdrn-cica-exosome-ampoule",
    name: "PDRN Cica Exosome R5 Firming Ampoule",
    nameKr: "VT PDRN 시카 엑소좀 R5 퍼밍 앰플",
    brand: "VT Cosmetics",
    category: "serum",
    subcategory: "anti_aging_serum",
    keyIngredients: ["Sodium DNA (PDRN)", "Lactobacillus/Soymilk Ferment Filtrate (Exosome)", "Ceramide NP", "Ceramide AS", "Ceramide NS", "Collagen Amino Acids", "Panthenol", "Squalane"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["aging", "dryness", "texture"],
    priceRange: "mid",
    trendingIngredients: ["Exosomes", "PDRN", "Ceramides"],
    description: "Triple-trending-ingredient firming ampoule combining PDRN, exosomes, and ceramides with peptides for advanced anti-aging, wrinkle care, and deep hydration.",
    rating: 4.4
  },

  // ============================================================
  // TRENDING INGREDIENTS - Mugwort (Artemisia)
  // ============================================================
  {
    id: "im-from-mugwort-essence",
    name: "Mugwort Essence",
    nameKr: "아임프롬 머그워트 에센스",
    brand: "I'm From",
    category: "essence",
    subcategory: "soothing_essence",
    keyIngredients: ["Artemisia Princeps Extract", "Sodium Hyaluronate", "Butylene Glycol", "Ethylhexylglycerin"],
    skinTypes: ["sensitive", "oily", "combination", "normal"],
    skinConcerns: ["redness", "acne", "texture"],
    priceRange: "mid",
    trendingIngredients: ["Mugwort"],
    description: "Cult-favorite calming essence with concentrated mugwort extract harvested from Ganghwa Island that soothes irritation, calms redness, and strengthens the skin barrier. Vegan and fragrance-free.",
    rating: 4.6
  },
  {
    id: "im-from-mugwort-cream",
    name: "Mugwort Cream",
    nameKr: "아임프롬 머그워트 크림",
    brand: "I'm From",
    category: "moisturizer",
    subcategory: "treatment_cream",
    keyIngredients: ["Artemisia Princeps Extract (73.55%)", "Propanediol", "Glycerin", "Centella Asiatica Extract", "Tea Tree Extract"],
    skinTypes: ["sensitive", "combination", "normal"],
    skinConcerns: ["redness", "acne", "dryness"],
    priceRange: "mid",
    trendingIngredients: ["Mugwort"],
    description: "Soothing repair cream with 73.55% mugwort extract that calms sensitive and troubled skin, reduces redness, and provides a healthy radiance. Vegan and cruelty-free.",
    rating: 4.5
  },
  {
    id: "im-from-mugwort-mask",
    name: "Mugwort Mask",
    nameKr: "아임프롬 머그워트 마스크",
    brand: "I'm From",
    category: "mask",
    subcategory: "wash_off_mask",
    keyIngredients: ["Artemisia Princeps Extract", "Artemisia Princeps Leaf Powder", "Mugwort Root Extract"],
    skinTypes: ["sensitive", "oily", "combination", "normal"],
    skinConcerns: ["redness", "acne", "pores"],
    priceRange: "mid",
    trendingIngredients: ["Mugwort"],
    description: "Wash-off mask packed with real mugwort leaves from Ganghwa Island that deeply purifies pores, soothes irritation, and calms inflamed, troubled skin.",
    rating: 4.5
  },
  {
    id: "bringgreen-artemisia-cera-calming-repair-cream",
    name: "Artemisia Cera Calming Moisture Repair Cream",
    nameKr: "브링그린 쑥 세라 카밍 모이스처 리페어 크림",
    brand: "BringGreen",
    category: "moisturizer",
    subcategory: "treatment_cream",
    keyIngredients: ["Artemisia Capillaris Extract", "Ceramides", "Panthenol", "Centella Asiatica Extract", "Madecassoside"],
    skinTypes: ["sensitive", "dry", "normal", "combination"],
    skinConcerns: ["redness", "dryness", "acne"],
    priceRange: "budget",
    trendingIngredients: ["Mugwort", "Ceramides"],
    description: "Vegan calming repair cream with Artemisia Ceramide complex that strengthens the skin moisture barrier, reduces redness, and soothes stressed and irritated sensitive skin.",
    rating: 4.3
  },
  {
    id: "bringgreen-artemisia-calming-ex-water-cream",
    name: "Artemisia Calming EX Water Cream",
    nameKr: "브링그린 사철쑥 카밍 EX 수분 크림",
    brand: "BringGreen",
    category: "moisturizer",
    subcategory: "gel_cream",
    keyIngredients: ["Artemisia Capillaris Extract", "Niacinamide", "Panthenol", "Allantoin", "Dipotassium Glycyrrhizate"],
    skinTypes: ["oily", "combination", "sensitive", "normal"],
    skinConcerns: ["redness", "oiliness", "acne"],
    priceRange: "budget",
    trendingIngredients: ["Mugwort"],
    description: "Lightweight water cream with low-molecular artemisia that synergizes with high-molecular soothing ingredients for effective calming, ideal for oily and combination skin.",
    rating: 4.2
  },
  {
    id: "bringgreen-artemisia-cera-calming-toner",
    name: "Artemisia Cera Calming Moisture Toner",
    nameKr: "브링그린 쑥 세라 카밍 모이스처 토너",
    brand: "BringGreen",
    category: "toner",
    subcategory: "hydrating_toner",
    keyIngredients: ["Artemisia Capillaris Extract", "Ceramides", "Panthenol", "Hyaluronic Acid", "Allantoin"],
    skinTypes: ["sensitive", "dry", "normal", "combination"],
    skinConcerns: ["redness", "dryness"],
    priceRange: "budget",
    trendingIngredients: ["Mugwort", "Ceramides"],
    description: "Calming toner with artemisia ceramide complex that preps and hydrates sensitive skin while strengthening the moisture barrier and reducing irritation.",
    rating: 4.2
  },

  // ============================================================
  // TRENDING INGREDIENTS - Tranexamic Acid
  // ============================================================
  {
    id: "anua-niacinamide-10-txa-4-serum",
    name: "Niacinamide 10% + TXA 4% Dark Spot Correcting Serum",
    nameKr: "아누아 나이아신아마이드 10 TXA 4 다크 스팟 코렉팅 세럼",
    brand: "Anua",
    category: "serum",
    subcategory: "brightening_serum",
    keyIngredients: ["Niacinamide (10%)", "Tranexamic Acid (4%)", "Alpha-Arbutin (2%)", "Hyaluronic Acid", "Glutathione"],
    skinTypes: ["normal", "oily", "combination", "sensitive"],
    skinConcerns: ["dark_spots", "texture", "acne"],
    priceRange: "mid",
    trendingIngredients: ["Tranexamic Acid"],
    description: "Powerful yet gentle dark spot correcting serum with 10% niacinamide, 4% tranexamic acid, and 2% arbutin that fades hyperpigmentation and prevents new spots from forming.",
    rating: 4.5
  },
  {
    id: "mary-and-may-tranexamic-acid-glutathione-eye-cream",
    name: "Tranexamic Acid + Glutathione Eye Cream",
    nameKr: "메리앤메이 트라넥삼산 + 글루타치온 아이크림",
    brand: "Mary&May",
    category: "eye_cream",
    subcategory: "brightening_eye_cream",
    keyIngredients: ["Tranexamic Acid (1000ppm)", "Glutathione (1000ppm)", "Niacinamide", "Panthenol", "Sodium Hyaluronate", "Ascorbic Acid"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["dark_spots", "aging", "dryness"],
    priceRange: "mid",
    trendingIngredients: ["Tranexamic Acid"],
    description: "Brightening eye cream with tranexamic acid and glutathione that targets dark circles, pigmentation around the eyes, and provides deep nourishment to the delicate eye area.",
    rating: 4.3
  },

  // ============================================================
  // TRENDING INGREDIENTS - Ceramides
  // ============================================================
  {
    id: "illiyoon-ceramide-ato-concentrate-cream",
    name: "Ceramide Ato Concentrate Cream",
    nameKr: "일리윤 세라마이드 아토 집중크림",
    brand: "Illiyoon",
    category: "moisturizer",
    subcategory: "cream",
    keyIngredients: ["Ceramides", "Cholesterol", "Fatty Acids", "Panthenol", "Sunflower Seed Oil"],
    skinTypes: ["dry", "sensitive", "normal"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "budget",
    trendingIngredients: ["Ceramides"],
    description: "Olive Young No.1 repurchase cream with ceramide capsule technology that provides 100+ hours of moisturization, strengthens the skin barrier, and soothes dry, sensitive, and eczema-prone skin.",
    rating: 4.7
  },
  {
    id: "aestura-atobarrier-365-cream",
    name: "Atobarrier 365 Cream",
    nameKr: "에스트라 아토베리어365 크림",
    brand: "Aestura",
    category: "moisturizer",
    subcategory: "cream",
    keyIngredients: ["Long-Chain Ceramides", "Linker Ceramides", "Cholesterol", "DermaON Complex", "Panthenol"],
    skinTypes: ["dry", "sensitive", "normal"],
    skinConcerns: ["dryness", "redness", "aging"],
    priceRange: "mid",
    trendingIngredients: ["Ceramides"],
    description: "Olive Young Awards No.1 cream with long-chain and linker ceramides that provides 120-hour moisturization, repairs the damaged skin barrier, and protects sensitive skin from external irritants.",
    rating: 4.6
  },

  // ============================================================
  // TRENDING INGREDIENTS - Centella/Cica
  // ============================================================
  {
    id: "aestura-a-cica-365-soothing-repair-cream",
    name: "A-Cica 365 Soothing Repair Cream pH4.5",
    nameKr: "에스트라 에이시카365 리페어 크림 pH4.5",
    brand: "Aestura",
    category: "moisturizer",
    subcategory: "treatment_cream",
    keyIngredients: ["Madecassoside", "Beta-Glucan", "Centella Asiatica Extract", "Panthenol", "Allantoin"],
    skinTypes: ["sensitive", "combination", "normal", "oily"],
    skinConcerns: ["redness", "acne", "dryness"],
    priceRange: "mid",
    trendingIngredients: ["Centella/Cica"],
    description: "pH 4.5 soothing repair cream with madecassoside and beta-glucan that forms a moisture coating film preventing evaporation for 48 hours, proven for all trouble-prone sensitive skin types.",
    rating: 4.5
  },

  // ============================================================
  // TRENDING INGREDIENTS - Ginseng
  // ============================================================
  {
    id: "beauty-of-joseon-ginseng-essence-water",
    name: "Ginseng Essence Water",
    nameKr: "조선미녀 인삼 에센스워터",
    brand: "Beauty of Joseon",
    category: "essence",
    subcategory: "hydrating_essence",
    keyIngredients: ["Ginseng Water (80%)", "Niacinamide (2%)", "Adenosine (0.04%)", "Panax Ginseng Root Extract"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["dryness", "aging", "dark_spots", "texture"],
    priceRange: "budget",
    trendingIngredients: ["Ginseng"],
    description: "Barrier-boosting essence packed with 80% ginseng water, 2% niacinamide, and adenosine that provides lasting hydration, antioxidant benefits, controls sebum, and reduces wrinkles for a glow boost.",
    rating: 4.5
  },

  // ============================================================
  // ADDITIONAL TRENDING PRODUCTS
  // ============================================================
  {
    id: "vt-cica-exosome-h3-hydro-ampoule",
    name: "Cica Exosome H3 Hydro Ampoule",
    nameKr: "VT 시카 엑소좀 H3 하이드로 앰플",
    brand: "VT Cosmetics",
    category: "serum",
    subcategory: "hydrating_serum",
    keyIngredients: ["Centella Asiatica Exosome", "Liposome Hyaluronic Acid", "Panthenol", "Ceramide NP", "Niacinamide"],
    skinTypes: ["dry", "sensitive", "normal", "combination"],
    skinConcerns: ["dryness", "redness"],
    priceRange: "mid",
    trendingIngredients: ["Exosomes", "Centella/Cica", "Ceramides"],
    description: "Deeply hydrating ampoule with cica exosome complex and liposome hyaluronic acids that delivers moisture deep into skin layers while soothing and calming sensitive skin.",
    rating: 4.3
  },
  {
    id: "im-from-mugwort-serum",
    name: "Mugwort Serum",
    nameKr: "아임프롬 머그워트 세럼",
    brand: "I'm From",
    category: "serum",
    subcategory: "soothing_serum",
    keyIngredients: ["Artemisia Princeps Extract", "Panthenol", "Allantoin", "Sodium Hyaluronate"],
    skinTypes: ["sensitive", "oily", "combination", "normal"],
    skinConcerns: ["redness", "acne", "texture"],
    priceRange: "mid",
    trendingIngredients: ["Mugwort"],
    description: "Concentrated mugwort serum that targets skin troubles and inflammation, calms reactive skin, and strengthens the natural skin barrier for healthy, balanced complexion.",
    rating: 4.4
  },
  {
    id: "bringgreen-artemisia-cera-calming-cleanser",
    name: "Artemisia Cera Calming Moisture pH Balance Cleansing Foam",
    nameKr: "브링그린 쑥 세라 카밍 모이스처 pH밸런스 클렌징폼",
    brand: "BringGreen",
    category: "cleanser",
    subcategory: "water_cleanser",
    keyIngredients: ["Artemisia Capillaris Extract", "Ceramides", "Panthenol", "Centella Asiatica Extract"],
    skinTypes: ["sensitive", "dry", "normal", "combination"],
    skinConcerns: ["redness", "dryness"],
    priceRange: "budget",
    trendingIngredients: ["Mugwort", "Ceramides"],
    description: "pH-balanced gentle foam cleanser with artemisia ceramide complex that cleanses without stripping, soothes sensitive skin, and maintains the moisture barrier.",
    rating: 4.1
  },
  {
    id: "aestura-a-cica-365-hydrating-relief-toner",
    name: "A-Cica 365 Hydrating Relief Toner pH4.5",
    nameKr: "에스트라 에이시카365 하이드레이팅 릴리프 토너 pH4.5",
    brand: "Aestura",
    category: "toner",
    subcategory: "hydrating_toner",
    keyIngredients: ["Madecassoside", "Centella Asiatica Extract", "Beta-Glucan", "Panthenol", "Allantoin"],
    skinTypes: ["sensitive", "combination", "normal"],
    skinConcerns: ["redness", "dryness", "acne"],
    priceRange: "mid",
    trendingIngredients: ["Centella/Cica"],
    description: "pH 4.5 mildly acidic toner with madecassoside and beta-glucan that hydrates, calms sensitive skin, and preps the barrier for optimal absorption of subsequent skincare steps.",
    rating: 4.4
  },
  {
    id: "aestura-a-cica-365-soothing-relief-serum",
    name: "A-Cica 365 Soothing Relief Serum pH4.5",
    nameKr: "에스트라 에이시카365 수딩 릴리프 세럼 pH4.5",
    brand: "Aestura",
    category: "serum",
    subcategory: "soothing_serum",
    keyIngredients: ["Madecassoside", "Centella Asiatica Extract", "Beta-Glucan", "Panthenol"],
    skinTypes: ["sensitive", "combination", "normal"],
    skinConcerns: ["redness", "acne", "dryness"],
    priceRange: "mid",
    trendingIngredients: ["Centella/Cica"],
    description: "Soothing serum that pairs with A-Cica cream to strengthen the barrier up to 218%, featuring madecassoside for intensive calming and repair of stressed, trouble-prone skin.",
    rating: 4.4
  },
  {
    id: "isntree-tranexamic-acid-glutathione-serum",
    name: "Spot Saver Tranexamic Acid + Glutathione Serum",
    nameKr: "이즈앤트리 스팟 세이버 트라넥삼산 + 글루타치온 세럼",
    brand: "Isntree",
    category: "serum",
    subcategory: "brightening_serum",
    keyIngredients: ["Tranexamic Acid (3%)", "Glutathione", "Niacinamide (2%)", "4-Butylresorcinol", "Alpha-Arbutin"],
    skinTypes: ["normal", "combination", "sensitive", "oily"],
    skinConcerns: ["dark_spots", "texture", "acne"],
    priceRange: "mid",
    trendingIngredients: ["Tranexamic Acid", "Niacinamide"],
    description: "5-target brightening serum with tranexamic acid, glutathione, and niacinamide that fades dark spots, post-acne marks, and melasma through multi-pathway melanin inhibition.",
    rating: 4.5
  },
  {
    id: "anua-heartleaf-80-moisture-soothing-ampoule",
    name: "Heartleaf 80% Moisture Soothing Ampoule",
    nameKr: "아누아 어성초 80% 수분 진정 앰플",
    brand: "Anua",
    category: "serum",
    subcategory: "soothing_serum",
    keyIngredients: ["Houttuynia Cordata Extract (80%)", "Panthenol", "Allantoin", "Beta-Glucan", "Sodium Hyaluronate"],
    skinTypes: ["sensitive", "oily", "combination", "normal"],
    skinConcerns: ["redness", "acne", "dryness"],
    priceRange: "mid",
    trendingIngredients: ["Heartleaf"],
    description: "Concentrated 80% heartleaf ampoule that delivers intense soothing and moisture to irritated and troubled skin, reducing redness and strengthening the barrier.",
    rating: 4.5
  },
  {
    id: "skin1004-centella-tone-brightening-capsule-ampoule",
    name: "Madagascar Centella Tone Brightening Capsule Ampoule",
    nameKr: "스킨1004 마다가스카르 센텔라 톤 브라이트닝 캡슐 앰플",
    brand: "SKIN1004",
    category: "serum",
    subcategory: "brightening_serum",
    keyIngredients: ["Centella Asiatica Extract", "Tranexamic Acid", "Niacinamide", "Glutathione", "Alpha-Arbutin"],
    skinTypes: ["normal", "combination", "sensitive", "oily"],
    skinConcerns: ["dark_spots", "redness", "texture"],
    priceRange: "mid",
    trendingIngredients: ["Centella/Cica", "Tranexamic Acid", "Niacinamide"],
    description: "Triple-brightening ampoule combining centella with tranexamic acid, niacinamide, and glutathione that fades dark spots while calming sensitive skin.",
    rating: 4.4
  },
  {
    id: "mixsoon-bean-essence",
    name: "Bean Essence",
    nameKr: "믹순 빈 에센스",
    brand: "Mixsoon",
    category: "essence",
    subcategory: "hydrating_essence",
    keyIngredients: ["Glycine Soja (Soybean) Seed Extract (90.7%)", "Niacinamide", "Sodium Hyaluronate"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["dryness", "texture", "dark_spots"],
    priceRange: "mid",
    trendingIngredients: ["Niacinamide"],
    description: "Olive Young bestseller with 90.7% fermented soybean extract that brightens, hydrates, and smooths skin texture with a clean, minimal formula.",
    rating: 4.5
  },
  {
    id: "anua-pdrn-cell-regenerating-eye-cream",
    name: "PDRN Cell Regenerating Eye Cream",
    nameKr: "아누아 PDRN 셀 리제너레이팅 아이크림",
    brand: "Anua",
    category: "eye_cream",
    subcategory: "anti_aging_eye_cream",
    keyIngredients: ["Sodium DNA (PDRN)", "Niacinamide", "Peptides", "Adenosine", "Caffeine"],
    skinTypes: ["normal", "dry", "combination", "sensitive"],
    skinConcerns: ["aging", "dark_spots", "dryness"],
    priceRange: "mid",
    trendingIngredients: ["PDRN", "Niacinamide"],
    description: "Eye cream with PDRN and peptides that targets dark circles, fine lines, and puffiness while boosting cell regeneration around the delicate eye area.",
    rating: 4.4
  },
  {
    id: "illiyoon-ceramide-ato-soothing-gel",
    name: "Ceramide Ato Soothing Gel",
    nameKr: "일리윤 세라마이드 아토 수딩젤",
    brand: "Illiyoon",
    category: "moisturizer",
    subcategory: "gel_cream",
    keyIngredients: ["Ceramides", "Panthenol", "Allantoin", "Centella Asiatica Extract"],
    skinTypes: ["oily", "combination", "sensitive", "normal"],
    skinConcerns: ["redness", "oiliness", "dryness"],
    priceRange: "budget",
    trendingIngredients: ["Ceramides", "Centella/Cica"],
    description: "Lightweight gel moisturizer with ceramide capsule technology ideal for oily and combination skin that calms, hydrates, and reinforces the moisture barrier.",
    rating: 4.4
  }
];

// Category display names and icons
export const PRODUCT_CATEGORIES = {
  cleanser: { name: "Cleanser", nameKr: "클렌저", icon: "🧴" },
  toner: { name: "Toner", nameKr: "토너", icon: "💧" },
  essence: { name: "Essence", nameKr: "에센스", icon: "✨" },
  serum: { name: "Serum", nameKr: "세럼", icon: "💎" },
  moisturizer: { name: "Moisturizer", nameKr: "보습제", icon: "🧊" },
  sunscreen: { name: "Sunscreen", nameKr: "선크림", icon: "☀️" },
  mask: { name: "Mask", nameKr: "마스크", icon: "🎭" },
  eye_cream: { name: "Eye Cream", nameKr: "아이크림", icon: "👁️" },
  exfoliator: { name: "Exfoliator", nameKr: "각질제거제", icon: "🔄" },
  treatment: { name: "Treatment", nameKr: "트리트먼트", icon: "💊" }
};

// Brand information
export const BRAND_INFO = {
  "COSRX": { nameKr: "코스알엑스", origin: "Korea", priceRange: "budget-mid", specialty: "Minimalist formulas for acne-prone and sensitive skin" },
  "Laneige": { nameKr: "라네즈", origin: "Korea", priceRange: "mid", specialty: "Hydration-focused water science technology" },
  "Innisfree": { nameKr: "이니스프리", origin: "Korea", priceRange: "budget-mid", specialty: "Jeju Island natural ingredients" },
  "Etude House": { nameKr: "에뛰드하우스", origin: "Korea", priceRange: "budget", specialty: "Affordable basics for sensitive and young skin" },
  "Some By Mi": { nameKr: "썸바이미", origin: "Korea", priceRange: "budget-mid", specialty: "AHA/BHA/PHA acid treatments for troubled skin" },
  "Klairs": { nameKr: "클레어스", origin: "Korea", priceRange: "mid", specialty: "Gentle formulas for sensitive skin" },
  "Beauty of Joseon": { nameKr: "조선미녀", origin: "Korea", priceRange: "budget-mid", specialty: "Traditional Korean hanbang ingredients" },
  "Round Lab": { nameKr: "라운드랩", origin: "Korea", priceRange: "mid", specialty: "Korean natural resource-based skincare" },
  "Isntree": { nameKr: "이즈앤트리", origin: "Korea", priceRange: "mid", specialty: "Clean, minimal ingredient formulas" },
  "Pyunkang Yul": { nameKr: "편강율", origin: "Korea", priceRange: "budget-mid", specialty: "Oriental medicine-based minimal skincare" },
  "Sulwhasoo": { nameKr: "설화수", origin: "Korea", priceRange: "premium", specialty: "Luxury ginseng-based anti-aging skincare" },
  "Dr.Jart+": { nameKr: "닥터자르트", origin: "Korea", priceRange: "mid-premium", specialty: "Dermatologist-developed barrier repair" },
  "Missha": { nameKr: "미샤", origin: "Korea", priceRange: "budget-mid", specialty: "Ferment-based essences and treatments" },
  "Banila Co": { nameKr: "바닐라코", origin: "Korea", priceRange: "mid", specialty: "Cleansing balms and makeup removers" },
  "Heimish": { nameKr: "해미쉬", origin: "Korea", priceRange: "budget", specialty: "Gentle botanical cleansing products" },
  "Purito": { nameKr: "퓨리토", origin: "Korea", priceRange: "mid", specialty: "Centella-based soothing skincare" },
  "Torriden": { nameKr: "토리든", origin: "Korea", priceRange: "mid", specialty: "Multi-weight hyaluronic acid hydration" },
  "Anua": { nameKr: "아누아", origin: "Korea", priceRange: "mid", specialty: "Heartleaf (houttuynia cordata) skincare" },
  "medicube": { nameKr: "메디큐브", origin: "Korea", priceRange: "mid", specialty: "Derma-grade pore and skin texture solutions" },
  "SKIN1004": { nameKr: "스킨1004", origin: "Korea", priceRange: "mid", specialty: "Madagascar centella asiatica skincare" },
  "numbuzin": { nameKr: "넘버즈인", origin: "Korea", priceRange: "mid", specialty: "Number-coded targeted treatments" },
  "TIRTIR": { nameKr: "티르티르", origin: "Korea", priceRange: "mid", specialty: "Skincare-meets-makeup hybrid products" },
  "Neogen": { nameKr: "네오젠", origin: "Korea", priceRange: "mid", specialty: "Innovative exfoliating treatments" },
  "I'm From": { nameKr: "아임프롬", origin: "Korea", priceRange: "mid", specialty: "Single-ingredient concentrated natural essences" },
  "BringGreen": { nameKr: "브링그린", origin: "Korea", priceRange: "budget", specialty: "Artemisia (mugwort) and botanical calming skincare" },
  "Aestura": { nameKr: "에스트라", origin: "Korea", priceRange: "mid", specialty: "Dermatologist-tested ceramide barrier repair" },
  "Illiyoon": { nameKr: "일리윤", origin: "Korea", priceRange: "budget", specialty: "Ceramide-based sensitive and ato skin care" },
  "Mixsoon": { nameKr: "믹순", origin: "Korea", priceRange: "mid", specialty: "Pure single-ingredient clean skincare" },
  "VT Cosmetics": { nameKr: "브이티", origin: "Korea", priceRange: "mid", specialty: "Cica exosome and PDRN technology" },
  "Mary&May": { nameKr: "메리앤메이", origin: "Korea", priceRange: "mid", specialty: "Clean vegan skincare with active ingredients" },
  "Sungboon Editor": { nameKr: "성분에디터", origin: "Korea", priceRange: "mid", specialty: "Ingredient-focused PDRN barrier skincare" }
};

// Ingredient Korean name map (INCI → Korean)
export const INGREDIENT_KR = {
  // Hydration
  'Hyaluronic Acid': '히알루론산', 'Sodium Hyaluronate': '히알루론산나트륨', 'Glycerin': '글리세린',
  'Betaine': '베타인', 'Panthenol': '판테놀', 'Allantoin': '알란토인', 'Squalane': '스쿠알란',
  'Ceramides': '세라마이드', 'Amino Acids': '아미노산', 'Deep Sea Water': '심층수', 'Minerals': '미네랄',
  'Birch Juice': '자작나무수액', 'Aloe Vera': '알로에베라', 'Collagen': '콜라겐',
  'Hydrolyzed Collagen': '가수분해콜라겐',
  // Actives
  'Niacinamide': '나이아신아마이드', 'Retinol': '레티놀', 'Retinal': '레티날', 'Adenosine': '아데노신',
  'Peptides': '펩타이드', 'AHA': 'AHA', 'BHA': 'BHA', 'PHA': 'PHA',
  'Salicylic Acid': '살리실산', 'Glycolic Acid': '글리콜산', 'Lactic Acid': '젖산',
  'Tranexamic Acid': '트라넥사믹산', 'Alpha-Arbutin': '알파알부틴', 'Glutathione': '글루타치온',
  'Ascorbic Acid': '아스코르빈산', 'Resveratrol': '레스베라트롤',
  // Vitamins
  'Vitamin C': '비타민C', 'Vitamin E': '비타민E', 'Vitamin C Derivative': '비타민C유도체',
  // Botanicals
  'Centella Asiatica': '센텔라아시아티카', 'Centella Asiatica Extract': '센텔라추출물',
  'Madecassoside': '마데카소사이드', 'Green Tea Extract': '녹차추출물', 'Green Tea Seed Oil': '녹차씨오일',
  'Tea Tree Oil': '티트리오일', 'Tea Tree Extract': '티트리추출물',
  'Houttuynia Cordata Extract': '어성초추출물', 'Propolis Extract': '프로폴리스추출물',
  'Acerola Extract': '아세로라추출물', 'Coconut Extract': '코코넛추출물',
  'Ginseng Root Extract': '인삼근추출물', 'Panax Ginseng Root Extract': '인삼추출물',
  'Ginseng Extract': '인삼추출물', 'Korean Ginseng Extract': '고려인삼추출물',
  'Seaweed Extract': '해조추출물', 'Rice Extract': '쌀추출물', 'Rice Bran Water': '미강수',
  'Orchid Extract': '난초추출물', 'Honey Extract': '꿀추출물',
  'Artemisia Princeps Extract': '쑥추출물', 'Artemisia Capillaris Extract': '인진쑥추출물',
  // Oils & Butters
  'Shea Butter': '시어버터', 'Jojoba Oil': '호호바오일', 'Grape Seed Oil': '포도씨오일',
  'Macadamia Oil': '마카다미아오일', 'Coconut Oil': '코코넛오일', 'Olive Oil': '올리브오일',
  'Sunflower Seed Oil': '해바라기씨오일', 'Citrus Herb Oil': '시트러스허브오일',
  // Ferments
  'Saccharomyces Ferment': '효모발효추출물', 'Saccharomyces Ferment Filtrate': '효모발효여과물',
  'Galactomyces Ferment Filtrate': '갈락토미세스발효여과물', 'Bifida Ferment Lysate': '비피다발효용해물',
  // Snail / Special
  'Snail Secretion Filtrate': '달팽이점액여과물', 'Beta-Glucan': '베타글루칸',
  'Guaiazulene': '과이아줄렌', 'Hydrocolloid': '하이드로콜로이드', 'Gold': '금',
  'Zinc Oxide': '징크옥사이드', 'Titanium Dioxide': '이산화티탄', 'Beeswax': '밀랍',
  'Cholesterol': '콜레스테롤', 'Fatty Acids': '지방산', 'Caffeine': '카페인',
  // Tech
  'Sodium DNA (PDRN)': 'PDRN', 'Chemical UV Filters': '화학자외선차단제', 'UV Filters': '자외선차단제',
}

// Helper function to get products by category
export function getProductsByCategory(category) {
  return PRODUCT_DB.filter(p => p.category === category);
}

// Helper function to get products by skin type
export function getProductsBySkinType(skinType) {
  return PRODUCT_DB.filter(p => p.skinTypes.includes(skinType));
}

// Helper function to get products by skin concern
export function getProductsByConcern(concern) {
  return PRODUCT_DB.filter(p => p.skinConcerns.includes(concern));
}

// Helper function to get products by brand
export function getProductsByBrand(brand) {
  return PRODUCT_DB.filter(p => p.brand === brand);
}

// Helper function to get products by price range
export function getProductsByPriceRange(priceRange) {
  return PRODUCT_DB.filter(p => p.priceRange === priceRange);
}

// Helper function to search products by name or ingredient
export function searchProducts(query) {
  const q = query.toLowerCase();
  return PRODUCT_DB.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.nameKr.includes(q) ||
    p.keyIngredients.some(i => i.toLowerCase().includes(q)) ||
    p.description.toLowerCase().includes(q)
  );
}

// Trending ingredient keyword detection
const TRENDING_KEYWORDS = {
  'PDRN': ['pdrn', 'sodium dna'],
  'Exosomes': ['exosome', 'extracellular vesicle'],
  'Centella/Cica': ['centella', 'madecassoside', 'asiaticoside'],
  'Heartleaf': ['houttuynia cordata'],
  'Ginseng': ['ginseng', 'panax ginseng'],
  'Tranexamic Acid': ['tranexamic acid'],
  'Ceramides': ['ceramide', 'cera complex'],
  'Snail Mucin': ['snail secretion filtrate', 'snail mucin'],
  'Mugwort': ['artemisia'],
  'Niacinamide': ['niacinamide'],
};

// Calculate trending score for a product
function getTrendingScore(product) {
  // Explicit trendingIngredients field gives highest boost
  if (product.trendingIngredients) return product.trendingIngredients.length * 2;
  // Auto-detect from keyIngredients
  const joined = product.keyIngredients.map(i => i.toLowerCase()).join(' ');
  let score = 0;
  for (const keywords of Object.values(TRENDING_KEYWORDS)) {
    if (keywords.some(kw => joined.includes(kw))) score++;
  }
  return score;
}

// Helper function to get product recommendations based on skin analysis
export function getRecommendations({ skinType, concerns = [], priceRange = null, categories = null }) {
  let products = PRODUCT_DB;

  // Filter by skin type
  if (skinType) {
    products = products.filter(p => p.skinTypes.includes(skinType));
  }

  // Filter by concerns (match at least one)
  if (concerns.length > 0) {
    products = products.filter(p =>
      p.skinConcerns.some(c => concerns.includes(c))
    );
  }

  // Filter by price range
  if (priceRange) {
    products = products.filter(p => p.priceRange === priceRange);
  }

  // Filter by category
  if (categories && categories.length > 0) {
    products = products.filter(p => categories.includes(p.category));
  }

  // Sort: concern match (×3) + trending boost (×2) + rating
  products.sort((a, b) => {
    const aMatch = a.skinConcerns.filter(c => concerns.includes(c)).length;
    const bMatch = b.skinConcerns.filter(c => concerns.includes(c)).length;
    const aTrend = getTrendingScore(a);
    const bTrend = getTrendingScore(b);
    const aScore = aMatch * 3 + aTrend * 2 + (a.rating || 0);
    const bScore = bMatch * 3 + bTrend * 2 + (b.rating || 0);
    return bScore - aScore;
  });

  return products;
}

// Build a complete routine recommendation
export function getRoutineRecommendation({ skinType, concerns = [], priceRange = null, timeOfDay = "both" }) {
  const routineSteps = [
    { step: 1, category: "cleanser", name: "Cleanser", nameKr: "클렌저" },
    { step: 2, category: "toner", name: "Toner", nameKr: "토너" },
    { step: 3, category: "essence", name: "Essence", nameKr: "에센스" },
    { step: 4, category: "serum", name: "Serum", nameKr: "세럼" },
    { step: 5, category: "eye_cream", name: "Eye Cream", nameKr: "아이크림" },
    { step: 6, category: "moisturizer", name: "Moisturizer", nameKr: "보습제" },
  ];

  if (timeOfDay === "am" || timeOfDay === "both") {
    routineSteps.push({ step: 7, category: "sunscreen", name: "Sunscreen", nameKr: "선크림" });
  }

  if (timeOfDay === "pm" || timeOfDay === "both") {
    routineSteps.push({ step: 8, category: "mask", name: "Sleeping Mask (2-3x/week)", nameKr: "수면 마스크" });
  }

  const routine = routineSteps.map(step => {
    const recommendations = getRecommendations({
      skinType,
      concerns,
      priceRange,
      categories: [step.category]
    });

    return {
      ...step,
      topPick: recommendations[0] || null,
      alternatives: recommendations.slice(1, 3)
    };
  });

  return routine;
}
