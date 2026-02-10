// js/data.js — All data constants

// Quiz Data - Summer Version
var summerQuizQuestions = [
    {
        english: "How does your skin feel during hot summer days?",
        korean: "더운 여름날 피부가 어떻게 느껴지나요?",
        options: [
            { english: "Dry and tight despite the heat", korean: "더위에도 건조하고 당김", scores: { dry: 2, oily: 0, combination: 0, sensitive: 1, normal: 0 } },
            { english: "Comfortable, stays balanced", korean: "편안하고 균형 잡힌 상태 유지", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Extremely oily and shiny", korean: "매우 기름지고 번들거림", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "T-zone gets very oily, cheeks normal", korean: "T존은 매우 기름지고, 볼은 괜찮음", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Red and irritated from heat/sweat", korean: "열과 땀으로 붉어지고 자극받음", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    },
    {
        english: "How does your skin react to sunscreen in summer?",
        korean: "여름에 선크림 바르면 피부 반응은?",
        options: [
            { english: "Absorbs quickly, still feels dry", korean: "빠르게 흡수되고, 여전히 건조함", scores: { dry: 2, oily: 0, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Sits well, no issues", korean: "잘 맞고, 문제 없음", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Makes skin feel greasy and heavy", korean: "기름지고 무겁게 느껴짐", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Gets oily on forehead, ok elsewhere", korean: "이마는 기름져지고, 다른 곳은 괜찮음", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Causes breakouts or irritation", korean: "트러블이나 자극을 유발함", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    },
    {
        english: "How often do you need to blot oil in summer?",
        korean: "여름에 기름종이를 얼마나 자주 사용하나요?",
        options: [
            { english: "Never, my skin is never oily", korean: "전혀 안 씀, 기름진 적 없음", scores: { dry: 2, oily: 0, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Rarely, once a day at most", korean: "거의 안 씀, 하루에 한 번 정도", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Multiple times throughout the day", korean: "하루 종일 여러 번", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Just for T-zone areas", korean: "T존 부위만", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Avoid touching my face due to sensitivity", korean: "민감해서 얼굴 만지는 걸 피함", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    },
    {
        english: "How does humidity affect your skin?",
        korean: "습도가 피부에 어떤 영향을 주나요?",
        options: [
            { english: "Still feels dehydrated", korean: "여전히 수분 부족 느낌", scores: { dry: 2, oily: 0, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Feels great, skin looks healthy", korean: "좋은 느낌, 피부가 건강해 보임", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Gets even more oily and sticky", korean: "더 기름지고 끈적해짐", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "T-zone suffers, cheeks feel nice", korean: "T존은 힘들고, 볼은 좋음", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Can trigger redness or rashes", korean: "홍조나 발진 유발 가능", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    },
    {
        english: "What happens when you sweat in summer?",
        korean: "여름에 땀 흘리면 어떻게 되나요?",
        options: [
            { english: "Skin still feels dry after sweating", korean: "땀 흘려도 피부는 여전히 건조", scores: { dry: 2, oily: 0, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Normal, washes off easily", korean: "보통, 쉽게 씻겨나감", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Sweat mixes with oil, causes breakouts", korean: "땀이 유분과 섞여 트러블 유발", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Breakouts mainly on forehead/nose", korean: "주로 이마/코에 트러블", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Causes stinging or prickly heat", korean: "따끔거리거나 땀띠 유발", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    },
    {
        english: "What is your biggest summer skin concern?",
        korean: "여름철 가장 큰 피부 고민은?",
        options: [
            { english: "Dehydration and flakiness", korean: "수분 부족과 각질", scores: { dry: 2, oily: 0, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Maintaining current good condition", korean: "현재 좋은 상태 유지하기", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Excess shine and enlarged pores", korean: "과도한 번들거림과 넓은 모공", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Balancing oily and dry areas", korean: "지성/건성 부위 밸런스", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Sun sensitivity and redness", korean: "햇빛 민감성과 홍조", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    },
    {
        english: "How does your skin look by end of summer day?",
        korean: "여름 하루가 끝날 때 피부 상태는?",
        options: [
            { english: "Tight, dull, needs moisture", korean: "당기고, 칙칙하고, 수분 필요", scores: { dry: 2, oily: 0, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Pretty much the same as morning", korean: "아침과 거의 같음", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Very shiny, can see oil on face", korean: "매우 번들거리고, 기름이 보임", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Shiny T-zone, normal cheeks", korean: "T존은 번들, 볼은 보통", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Flushed and uncomfortable", korean: "상기되고 불편함", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    }
];

// Quiz Data - Winter Version
var winterQuizQuestions = [
    {
        english: "How does your skin feel during cold winter days?",
        korean: "추운 겨울날 피부가 어떻게 느껴지나요?",
        options: [
            { english: "Extremely dry, flaky, and tight", korean: "극도로 건조하고, 각질이 일어나고, 당김", scores: { dry: 2, oily: 0, combination: 0, sensitive: 1, normal: 0 } },
            { english: "Slightly drier but manageable", korean: "약간 건조하지만 관리 가능", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Still oily, especially by afternoon", korean: "여전히 기름지고, 특히 오후에", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Cheeks get dry, T-zone stays oily", korean: "볼은 건조하고, T존은 여전히 기름짐", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Red, irritated, and reactive", korean: "붉고, 자극받고, 민감해짐", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    },
    {
        english: "How does indoor heating affect your skin?",
        korean: "실내 난방이 피부에 어떤 영향을 주나요?",
        options: [
            { english: "Makes skin feel parched and cracked", korean: "피부가 바싹 마르고 갈라지는 느낌", scores: { dry: 2, oily: 0, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Slight tightness, nothing major", korean: "약간 당기지만, 심하진 않음", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Does not dry me out much", korean: "별로 건조해지지 않음", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Cheeks feel tight, nose stays oily", korean: "볼은 당기고, 코는 여전히 기름짐", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Triggers redness and discomfort", korean: "홍조와 불편함 유발", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    },
    {
        english: "How many layers of moisturizer do you need in winter?",
        korean: "겨울에 보습제를 몇 겹 바르시나요?",
        options: [
            { english: "Multiple layers plus facial oil", korean: "여러 겹 + 페이셜 오일까지", scores: { dry: 2, oily: 0, combination: 0, sensitive: 0, normal: 0 } },
            { english: "One good cream is enough", korean: "좋은 크림 하나면 충분", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Light moisturizer only, heavy feels greasy", korean: "가벼운 것만, 무거우면 기름져짐", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Heavy on cheeks, light on T-zone", korean: "볼엔 무겁게, T존엔 가볍게", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Gentle, fragrance-free products only", korean: "순하고 무향 제품만", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    },
    {
        english: "How does cold wind affect your skin?",
        korean: "차가운 바람이 피부에 어떤 영향을 주나요?",
        options: [
            { english: "Causes painful dryness and chapping", korean: "고통스러운 건조함과 갈라짐 유발", scores: { dry: 2, oily: 0, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Minor discomfort, bounces back quickly", korean: "약간 불편하지만, 금방 회복됨", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Not much effect, still produces oil", korean: "큰 영향 없음, 여전히 유분 분비", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Cheeks suffer, T-zone is fine", korean: "볼은 힘들고, T존은 괜찮음", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Triggers windburn and redness", korean: "윈드번과 홍조 유발", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    },
    {
        english: "What happens to your pores in winter?",
        korean: "겨울에 모공은 어떻게 변하나요?",
        options: [
            { english: "Almost invisible, skin looks flat", korean: "거의 보이지 않고, 피부가 평평해 보임", scores: { dry: 2, oily: 0, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Stay the same size year-round", korean: "일 년 내내 같은 크기 유지", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Still visible and can get clogged", korean: "여전히 보이고 막힐 수 있음", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Smaller on cheeks, larger on nose", korean: "볼은 작아지고, 코는 크게 유지", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Skin texture becomes uneven", korean: "피부결이 고르지 않게 됨", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    },
    {
        english: "What is your biggest winter skin concern?",
        korean: "겨울철 가장 큰 피부 고민은?",
        options: [
            { english: "Extreme dryness and cracking", korean: "극심한 건조함과 갈라짐", scores: { dry: 2, oily: 0, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Keeping skin healthy and glowing", korean: "피부를 건강하고 윤기있게 유지", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Still dealing with oiliness and acne", korean: "여전히 유분과 여드름 관리", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Different needs for different areas", korean: "부위별로 다른 케어 필요", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Redness and reactive skin", korean: "홍조와 민감 반응", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    },
    {
        english: "How does your morning skincare absorb in winter?",
        korean: "겨울에 아침 스킨케어 흡수는 어떤가요?",
        options: [
            { english: "Absorbs instantly, needs more", korean: "즉시 흡수되고, 더 필요함", scores: { dry: 2, oily: 0, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Absorbs well at normal pace", korean: "적당한 속도로 잘 흡수됨", scores: { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 2 } },
            { english: "Takes forever, sits on skin", korean: "오래 걸리고, 피부 위에 남음", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
            { english: "Quick on cheeks, slow on T-zone", korean: "볼은 빠르고, T존은 느림", scores: { dry: 0, oily: 0, combination: 2, sensitive: 0, normal: 0 } },
            { english: "Some products cause stinging", korean: "일부 제품이 따끔거림 유발", scores: { dry: 0, oily: 0, combination: 0, sensitive: 2, normal: 0 } }
        ]
    }
];

// Skin Type Results Data
var skinTypeResults = {
    dry: {
        emoji: "🏜️",
        english: "Dry Skin",
        korean: "건성 피부",
        description: "Your skin lacks natural oils and moisture, often feeling tight and showing flakiness.",
        tips: [
            "💧 Use gentle, hydrating cleansers",
            "🧴 Layer hydrating toners and essences",
            "🌙 Apply rich cream moisturizers at night",
            "☀️ Never skip sunscreen",
            "🚫 Avoid hot water and harsh exfoliants"
        ],
        products: [
            { name: "COSRX Snail Mucin Essence", brand: "COSRX", emoji: "🐌", link: "#" },
            { name: "Laneige Water Bank Cream", brand: "Laneige", emoji: "💧", link: "#" },
            { name: "Etude SoonJung Toner", brand: "Etude", emoji: "🌿", link: "#" }
        ]
    },
    oily: {
        emoji: "✨",
        english: "Oily Skin",
        korean: "지성 피부",
        description: "Your skin produces excess sebum, often looking shiny and prone to enlarged pores.",
        tips: [
            "🫧 Use gentle foaming cleansers twice daily",
            "💨 Look for lightweight, oil-free moisturizers",
            "🧪 Incorporate BHA/salicylic acid for pores",
            "📝 Use blotting papers during the day",
            "🚫 Do not skip moisturizer"
        ],
        products: [
            { name: "COSRX BHA Blackhead Power Liquid", brand: "COSRX", emoji: "🧪", link: "#" },
            { name: "Innisfree No-Sebum Powder", brand: "Innisfree", emoji: "💨", link: "#" },
            { name: "Some By Mi AHA BHA PHA Toner", brand: "Some By Mi", emoji: "🌟", link: "#" }
        ]
    },
    combination: {
        emoji: "⚖️",
        english: "Combination Skin",
        korean: "복합성 피부",
        description: "Your T-zone is oily while your cheeks are normal to dry.",
        tips: [
            "🎯 Use different products for different zones",
            "🧴 Gel moisturizers work well overall",
            "🔄 Multi-mask: clay on T-zone, hydrating on cheeks",
            "💧 Focus hydration on dry areas",
            "🧪 Use BHA only on oily zones"
        ],
        products: [
            { name: "Klairs Supple Preparation Toner", brand: "Klairs", emoji: "💧", link: "#" },
            { name: "Innisfree Green Tea Seed Serum", brand: "Innisfree", emoji: "🍵", link: "#" },
            { name: "COSRX Oil-Free Moisturizing Lotion", brand: "COSRX", emoji: "🌊", link: "#" }
        ]
    },
    sensitive: {
        emoji: "🌸",
        english: "Sensitive Skin",
        korean: "민감성 피부",
        description: "Your skin easily reacts to products and environmental factors.",
        tips: [
            "🌿 Choose fragrance-free, hypoallergenic products",
            "🧪 Patch test ALL new products",
            "❄️ Use lukewarm water, never hot",
            "🛡️ Look for centella, aloe, and ceramides",
            "🚫 Avoid alcohol and harsh actives"
        ],
        products: [
            { name: "Etude SoonJung 2x Barrier Cream", brand: "Etude", emoji: "🛡️", link: "#" },
            { name: "COSRX Centella Blemish Cream", brand: "COSRX", emoji: "🌿", link: "#" },
            { name: "Pyunkang Yul Essence Toner", brand: "Pyunkang Yul", emoji: "💚", link: "#" }
        ]
    },
    normal: {
        emoji: "😊",
        english: "Normal Skin",
        korean: "중성 피부",
        description: "Congratulations! Your skin is well-balanced with good moisture levels.",
        tips: [
            "✨ Maintain with a simple, consistent routine",
            "☀️ Prioritize sun protection",
            "💧 Stay hydrated inside and out",
            "🔄 Can experiment with various products",
            "😴 Focus on getting enough sleep"
        ],
        products: [
            { name: "Beauty of Joseon Glow Serum", brand: "Beauty of Joseon", emoji: "✨", link: "#" },
            { name: "Round Lab Dokdo Toner", brand: "Round Lab", emoji: "🌊", link: "#" },
            { name: "Isntree Hyaluronic Acid Toner", brand: "Isntree", emoji: "💧", link: "#" }
        ]
    }
};

// ============================================================
// INGREDIENT ANALYZER — DB SWAP INSTRUCTIONS
// ============================================================
// The ONLY function you need to replace when moving to an
// external database or API is: lookupIngredient(rawName)
//
// It must return an object with this shape:
//   { found: true, data: { name, nameKr, category, rating,
//     comedogenic, irritation, description } }
//   OR
//   { found: false, query: "original input string" }
//
// Field reference:
//   name         (string)  — canonical English name
//   nameKr       (string)  — Korean name (optional, can be "")
//   category     (string)  — e.g. "active", "humectant", "emollient",
//                            "soothing", "sunscreen", "preservative",
//                            "fragrance", "surfactant", "base", "ferment"
//   rating       (string)  — "great" | "good" | "average" | "poor" | "bad"
//   comedogenic  (number)  — 0-5 scale
//   irritation   (number)  — 0-5 scale
//   description  (string)  — short benefit/concern summary
//
// To switch to an async API:
//   1. Change lookupIngredient() to return a Promise
//   2. In analyzeIngredients(), wrap the map in Promise.all():
//        var results = await Promise.all(names.map(n => lookupIngredient(n)));
//   3. Mark analyzeIngredients() as async
// ============================================================

var INGREDIENT_DB = [
    // ── Actives ──
    { name: "Niacinamide", nameKr: "나이아신아마이드", category: "active", rating: "great", comedogenic: 0, irritation: 0, description: "Brightens skin, minimizes pores, strengthens skin barrier, and reduces hyperpigmentation." },
    { name: "Vitamin C (Ascorbic Acid)", nameKr: "비타민C", category: "active", rating: "great", comedogenic: 0, irritation: 1, description: "Potent antioxidant that brightens, boosts collagen, and protects against UV damage." },
    { name: "Retinol", nameKr: "레티놀", category: "active", rating: "great", comedogenic: 0, irritation: 2, description: "Gold standard anti-aging ingredient. Speeds cell turnover, reduces wrinkles and dark spots." },
    { name: "Retinal (Retinaldehyde)", nameKr: "레티날", category: "active", rating: "great", comedogenic: 0, irritation: 2, description: "Stronger retinoid that converts directly to retinoic acid. Faster results than retinol." },
    { name: "Salicylic Acid (BHA)", nameKr: "살리실산", category: "active", rating: "great", comedogenic: 0, irritation: 1, description: "Oil-soluble acid that penetrates pores to clear blackheads, whiteheads, and acne." },
    { name: "Glycolic Acid (AHA)", nameKr: "글리콜산", category: "active", rating: "good", comedogenic: 0, irritation: 2, description: "Exfoliates dead skin cells for smoother, brighter skin. Can increase sun sensitivity." },
    { name: "Lactic Acid", nameKr: "젖산", category: "active", rating: "good", comedogenic: 0, irritation: 1, description: "Gentle AHA that exfoliates and hydrates. Good for sensitive skin and beginners." },
    { name: "Mandelic Acid", nameKr: "만델산", category: "active", rating: "good", comedogenic: 0, irritation: 1, description: "Gentle AHA with antibacterial properties. Great for acne-prone and darker skin tones." },
    { name: "Azelaic Acid", nameKr: "아젤라산", category: "active", rating: "great", comedogenic: 0, irritation: 1, description: "Treats acne, rosacea, and hyperpigmentation. Anti-inflammatory and antibacterial." },
    { name: "Tranexamic Acid", nameKr: "트라넥삼산", category: "active", rating: "great", comedogenic: 0, irritation: 0, description: "Targets stubborn hyperpigmentation and melasma. Safe for all skin tones." },
    { name: "Alpha-Arbutin", nameKr: "알파알부틴", category: "active", rating: "great", comedogenic: 0, irritation: 0, description: "Brightening agent that inhibits melanin production. Safer alternative to hydroquinone." },
    { name: "Adenosine", nameKr: "아데노신", category: "active", rating: "good", comedogenic: 0, irritation: 0, description: "Anti-wrinkle ingredient commonly used in K-beauty. Soothes and promotes skin repair." },
    { name: "Bakuchiol", nameKr: "바쿠치올", category: "active", rating: "good", comedogenic: 0, irritation: 0, description: "Plant-based retinol alternative. Anti-aging benefits without irritation or sun sensitivity." },
    { name: "Peptides", nameKr: "펩타이드", category: "active", rating: "good", comedogenic: 0, irritation: 0, description: "Signal skin to produce more collagen. Anti-aging benefits with minimal irritation." },
    { name: "Copper Peptides", nameKr: "구리 펩타이드", category: "active", rating: "good", comedogenic: 0, irritation: 0, description: "Promotes collagen and elastin production, supports wound healing and skin remodeling." },
    { name: "Benzoyl Peroxide", nameKr: "벤조일퍼옥사이드", category: "active", rating: "good", comedogenic: 0, irritation: 2, description: "Kills acne-causing bacteria. Effective but can be drying and irritating." },
    { name: "Kojic Acid", nameKr: "코직산", category: "active", rating: "good", comedogenic: 0, irritation: 1, description: "Brightening agent derived from fungi. Inhibits melanin production for a more even tone." },
    { name: "Ferulic Acid", nameKr: "페룰산", category: "active", rating: "good", comedogenic: 0, irritation: 0, description: "Antioxidant that boosts the efficacy of vitamins C and E. Protects against free radicals." },

    // ── Humectants ──
    { name: "Glycerin", nameKr: "글리세린", category: "humectant", rating: "great", comedogenic: 0, irritation: 0, description: "One of the best moisturizing ingredients. Draws water to skin and strengthens barrier." },
    { name: "Hyaluronic Acid", nameKr: "히알루론산", category: "humectant", rating: "great", comedogenic: 0, irritation: 0, description: "Holds up to 1000x its weight in water. Plumps skin and reduces fine lines." },
    { name: "Panthenol (Vitamin B5)", nameKr: "판테놀", category: "humectant", rating: "great", comedogenic: 0, irritation: 0, description: "Deeply hydrates, soothes irritation, and supports skin barrier repair." },
    { name: "Betaine", nameKr: "베타인", category: "humectant", rating: "good", comedogenic: 0, irritation: 0, description: "Natural amino acid that hydrates and protects against environmental stress." },
    { name: "Beta-Glucan", nameKr: "베타글루칸", category: "humectant", rating: "great", comedogenic: 0, irritation: 0, description: "Powerful hydrator with soothing and anti-aging properties. Stimulates collagen production." },
    { name: "Urea", nameKr: "우레아", category: "humectant", rating: "good", comedogenic: 0, irritation: 1, description: "Hydrates and gently exfoliates. Great for very dry or rough skin." },
    { name: "Sodium Hyaluronate", nameKr: "히알루론산나트륨", category: "humectant", rating: "great", comedogenic: 0, irritation: 0, description: "Smaller form of hyaluronic acid that penetrates deeper into skin for intense hydration." },
    { name: "Propanediol", nameKr: "프로판디올", category: "humectant", rating: "good", comedogenic: 0, irritation: 0, description: "Plant-derived humectant and solvent. Helps other ingredients absorb better." },
    { name: "Butylene Glycol", nameKr: "부틸렌글라이콜", category: "humectant", rating: "good", comedogenic: 1, irritation: 0, description: "Lightweight moisturizer and solvent commonly used in K-beauty formulations." },
    { name: "1,2-Hexanediol", nameKr: "1,2-헥산디올", category: "humectant", rating: "average", comedogenic: 0, irritation: 0, description: "Humectant with mild preservative properties. Common in K-beauty formulations." },

    // ── Emollients & Occlusives ──
    { name: "Squalane", nameKr: "스쿠알란", category: "emollient", rating: "great", comedogenic: 0, irritation: 0, description: "Lightweight oil identical to skin's natural sebum. Moisturizes without clogging pores." },
    { name: "Ceramides", nameKr: "세라마이드", category: "emollient", rating: "great", comedogenic: 0, irritation: 0, description: "Essential lipids that form the skin barrier. Repair and protect against moisture loss." },
    { name: "Shea Butter", nameKr: "시어버터", category: "emollient", rating: "good", comedogenic: 0, irritation: 0, description: "Rich emollient that deeply moisturizes and protects dry skin." },
    { name: "Jojoba Oil", nameKr: "호호바오일", category: "emollient", rating: "good", comedogenic: 2, irritation: 0, description: "Closest oil to skin's natural sebum. Balances oil production and moisturizes." },
    { name: "Cetearyl Alcohol", nameKr: "세테아릴알코올", category: "emollient", rating: "good", comedogenic: 1, irritation: 0, description: "Fatty alcohol (not drying alcohol). Softens and smooths skin texture." },
    { name: "Cetyl Alcohol", nameKr: "세틸알코올", category: "emollient", rating: "good", comedogenic: 1, irritation: 0, description: "Fatty alcohol that acts as an emollient and thickener. Not drying." },
    { name: "Dimethicone", nameKr: "디메치콘", category: "emollient", rating: "good", comedogenic: 1, irritation: 0, description: "Silicone that creates a smooth, protective barrier. Gives products a silky feel." },
    { name: "Petrolatum", nameKr: "페트롤라툼", category: "emollient", rating: "good", comedogenic: 0, irritation: 0, description: "Powerful occlusive that seals in moisture. Effective for very dry skin." },
    { name: "Mineral Oil", nameKr: "미네랄오일", category: "emollient", rating: "average", comedogenic: 2, irritation: 0, description: "Occlusive moisturizer. Effective but some prefer plant-based alternatives." },
    { name: "Rosehip Oil", nameKr: "로즈힙오일", category: "emollient", rating: "good", comedogenic: 1, irritation: 0, description: "Rich in vitamins A and C. Hydrates, brightens, and helps with scarring." },
    { name: "Sunflower Seed Oil", nameKr: "해바라기씨오일", category: "emollient", rating: "good", comedogenic: 0, irritation: 0, description: "Lightweight oil rich in linoleic acid. Helps strengthen skin barrier." },
    { name: "Caprylic/Capric Triglyceride", nameKr: "카프릴릭/카프릭트리글리세라이드", category: "emollient", rating: "good", comedogenic: 1, irritation: 0, description: "Coconut-derived emollient that smooths and softens skin without greasiness." },
    { name: "Stearic Acid", nameKr: "스테아르산", category: "emollient", rating: "average", comedogenic: 2, irritation: 0, description: "Fatty acid used as an emulsifier and texture enhancer. May be mildly comedogenic." },

    // ── Soothing & Botanical ──
    { name: "Centella Asiatica (CICA)", nameKr: "병풀추출물", category: "soothing", rating: "great", comedogenic: 0, irritation: 0, description: "K-beauty star ingredient. Calms inflammation, speeds healing, strengthens barrier." },
    { name: "Madecassoside", nameKr: "마데카소사이드", category: "soothing", rating: "great", comedogenic: 0, irritation: 0, description: "Active compound from Centella. Powerful anti-inflammatory and wound healer." },
    { name: "Aloe Vera", nameKr: "알로에 베라", category: "soothing", rating: "good", comedogenic: 0, irritation: 0, description: "Classic soothing ingredient. Hydrates, calms irritation, and supports healing." },
    { name: "Bisabolol", nameKr: "비사볼올", category: "soothing", rating: "good", comedogenic: 0, irritation: 0, description: "Derived from chamomile. Anti-inflammatory and soothing for sensitive skin." },
    { name: "Green Tea Extract", nameKr: "녹차추출물", category: "soothing", rating: "good", comedogenic: 0, irritation: 0, description: "Rich in EGCG antioxidants. Protects, soothes, and helps control oil production." },
    { name: "Licorice Root Extract", nameKr: "감초추출물", category: "soothing", rating: "good", comedogenic: 0, irritation: 0, description: "Brightens dark spots, calms inflammation, and evens skin tone." },
    { name: "Tea Tree Oil", nameKr: "티트리오일", category: "soothing", rating: "good", comedogenic: 1, irritation: 1, description: "Natural antibacterial and anti-inflammatory. Popular for acne-prone skin." },
    { name: "Mugwort (Artemisia)", nameKr: "쑥 추출물", category: "soothing", rating: "good", comedogenic: 0, irritation: 0, description: "Traditional Korean ingredient that calms sensitive and irritated skin." },
    { name: "Calendula Extract", nameKr: "카렌듈라추출물", category: "soothing", rating: "good", comedogenic: 0, irritation: 0, description: "Gentle anti-inflammatory that soothes and supports wound healing." },
    { name: "Chamomile Extract", nameKr: "카모마일추출물", category: "soothing", rating: "good", comedogenic: 0, irritation: 0, description: "Anti-inflammatory and calming. Good for sensitive and redness-prone skin." },
    { name: "Allantoin", nameKr: "알란토인", category: "soothing", rating: "good", comedogenic: 0, irritation: 0, description: "Soothes irritation and promotes cell regeneration. Very gentle on skin." },
    { name: "Tocopherol (Vitamin E)", nameKr: "토코페롤", category: "soothing", rating: "good", comedogenic: 2, irritation: 0, description: "Antioxidant that protects skin from free radicals and supports barrier function." },

    // ── Sunscreen Filters ──
    { name: "Zinc Oxide", nameKr: "징크옥사이드", category: "sunscreen", rating: "great", comedogenic: 0, irritation: 0, description: "Physical/mineral UV filter. Broad-spectrum protection, gentle on sensitive skin." },
    { name: "Titanium Dioxide", nameKr: "티타늄디옥사이드", category: "sunscreen", rating: "great", comedogenic: 0, irritation: 0, description: "Physical/mineral UV filter. Protects against UVB and some UVA rays." },
    { name: "Ethylhexyl Methoxycinnamate (Octinoxate)", nameKr: "옥티녹세이트", category: "sunscreen", rating: "average", comedogenic: 0, irritation: 1, description: "Chemical UVB filter. Effective but some concerns about hormone disruption." },

    // ── Ferments (K-beauty Specialty) ──
    { name: "Galactomyces Ferment Filtrate", nameKr: "갈락토미세스 발효여과물", category: "ferment", rating: "great", comedogenic: 0, irritation: 0, description: "Brightens, hydrates, and improves skin texture. Star ingredient of many K-beauty essences." },
    { name: "Saccharomyces Ferment Filtrate", nameKr: "사카로미세스 발효여과물", category: "ferment", rating: "good", comedogenic: 0, irritation: 0, description: "Yeast-derived ferment that hydrates and promotes radiant, healthy-looking skin." },
    { name: "Bifida Ferment Lysate", nameKr: "비피다 발효 용해물", category: "ferment", rating: "good", comedogenic: 0, irritation: 0, description: "Probiotic ingredient that strengthens skin barrier and improves elasticity." },
    { name: "Rice Ferment Filtrate (Sake)", nameKr: "쌀 발효 여과물", category: "ferment", rating: "good", comedogenic: 0, irritation: 0, description: "Traditional Asian brightening ingredient. Rich in vitamins and amino acids." },

    // ── K-beauty Staples ──
    { name: "Snail Mucin (Secretion Filtrate)", nameKr: "달팽이 점액 여과물", category: "soothing", rating: "great", comedogenic: 0, irritation: 0, description: "K-beauty hero ingredient. Deeply hydrates, repairs, and promotes healing." },
    { name: "Propolis Extract", nameKr: "프로폴리스 추출물", category: "soothing", rating: "great", comedogenic: 0, irritation: 0, description: "Bee-derived ingredient with antibacterial, anti-inflammatory, and healing properties." },
    { name: "Honey Extract", nameKr: "꿀 추출물", category: "humectant", rating: "good", comedogenic: 0, irritation: 0, description: "Natural humectant with antibacterial properties. Soothes and hydrates skin." },
    { name: "Rice Extract", nameKr: "쌀 추출물", category: "soothing", rating: "good", comedogenic: 0, irritation: 0, description: "Brightens skin and improves texture. Rich in vitamins and minerals." },
    { name: "Ginseng Extract", nameKr: "인삼 추출물", category: "soothing", rating: "good", comedogenic: 0, irritation: 0, description: "Revitalizes skin, boosts circulation, and provides anti-aging benefits." },

    // ── Base / Solvent ──
    { name: "Water", nameKr: "정제수", category: "base", rating: "good", comedogenic: 0, irritation: 0, description: "Universal solvent and base of most skincare formulations." },
    { name: "Ethyl Hexanediol", nameKr: "에틸헥산디올", category: "base", rating: "average", comedogenic: 0, irritation: 1, description: "Solvent and mild preservative booster. Common in K-beauty formulations." },

    // ── Preservatives ──
    { name: "Phenoxyethanol", nameKr: "페녹시에탄올", category: "preservative", rating: "average", comedogenic: 0, irritation: 1, description: "Widely used preservative considered safer than parabens. Generally well tolerated." },
    { name: "Ethylhexylglycerin", nameKr: "에틸헥실글리세린", category: "preservative", rating: "good", comedogenic: 0, irritation: 0, description: "Mild preservative booster and skin-conditioning agent." },
    { name: "Methylparaben", nameKr: "메틸파라벤", category: "preservative", rating: "poor", comedogenic: 0, irritation: 1, description: "Paraben preservative. Some concerns about hormone disruption; widely debated safety." },
    { name: "Propylparaben", nameKr: "프로필파라벤", category: "preservative", rating: "poor", comedogenic: 0, irritation: 1, description: "Paraben preservative. More controversial than methylparaben; some prefer paraben-free." },

    // ── Thickeners / Texture ──
    { name: "Carbomer", nameKr: "카보머", category: "base", rating: "good", comedogenic: 0, irritation: 0, description: "Gel-forming thickener that gives products their texture. Very safe." },
    { name: "Xanthan Gum", nameKr: "잔탄검", category: "base", rating: "good", comedogenic: 0, irritation: 0, description: "Natural thickener and stabilizer derived from bacteria fermentation." },
    { name: "Sodium Polyacrylate", nameKr: "소디움폴리아크릴레이트", category: "base", rating: "average", comedogenic: 0, irritation: 0, description: "Synthetic thickener and texture agent. Holds water and creates gel textures." },

    // ── Emulsifiers ──
    { name: "Polysorbate 20", nameKr: "폴리소르베이트 20", category: "base", rating: "average", comedogenic: 0, irritation: 0, description: "Emulsifier that helps mix oil and water ingredients together." },
    { name: "Polysorbate 60", nameKr: "폴리소르베이트 60", category: "base", rating: "average", comedogenic: 2, irritation: 0, description: "Emulsifier used to stabilize formulations. Mildly comedogenic." },
    { name: "Cetearyl Olivate", nameKr: "세테아릴올리베이트", category: "base", rating: "good", comedogenic: 0, irritation: 0, description: "Olive-derived emulsifier. Gentle and moisturizing." },
    { name: "Sorbitan Olivate", nameKr: "소르비탄올리베이트", category: "base", rating: "good", comedogenic: 0, irritation: 0, description: "Olive-derived emulsifier often paired with cetearyl olivate." },

    // ── Caution / Avoid ──
    { name: "Fragrance (Parfum)", nameKr: "향료", category: "fragrance", rating: "poor", comedogenic: 0, irritation: 3, description: "Common irritant and allergen. Leading cause of cosmetic contact dermatitis." },
    { name: "Denatured Alcohol (Alcohol Denat.)", nameKr: "변성알코올", category: "base", rating: "poor", comedogenic: 0, irritation: 2, description: "Drying alcohol that can damage skin barrier. Especially bad for dry/sensitive skin." },
    { name: "Sodium Lauryl Sulfate (SLS)", nameKr: "소듐라우릴설페이트", category: "surfactant", rating: "bad", comedogenic: 0, irritation: 3, description: "Harsh surfactant that strips skin's natural oils. Known irritant — avoid in leave-on products." },
    { name: "Sodium Laureth Sulfate (SLES)", nameKr: "소듐라우레스설페이트", category: "surfactant", rating: "poor", comedogenic: 0, irritation: 2, description: "Milder than SLS but still a potential irritant. Common in cleansers." },
    { name: "Isopropyl Myristate", nameKr: "이소프로필미리스테이트", category: "emollient", rating: "poor", comedogenic: 5, irritation: 0, description: "Highly comedogenic emollient. Can clog pores and trigger breakouts." },
    { name: "Coconut Oil", nameKr: "코코넛오일", category: "emollient", rating: "average", comedogenic: 4, irritation: 0, description: "Very moisturizing but highly comedogenic. Best for body, risky on face." },
    { name: "Isopropyl Palmitate", nameKr: "이소프로필팔미테이트", category: "emollient", rating: "poor", comedogenic: 4, irritation: 0, description: "Emollient with high comedogenic rating. May trigger breakouts in acne-prone skin." },
    { name: "Formaldehyde Releasers (DMDM Hydantoin)", nameKr: "포름알데히드 방출제", category: "preservative", rating: "bad", comedogenic: 0, irritation: 3, description: "Releases formaldehyde over time. Known irritant and sensitizer — best avoided." },
    { name: "CI 77491 (Iron Oxides)", nameKr: "산화철", category: "base", rating: "good", comedogenic: 0, irritation: 0, description: "Pigment used for color in tinted products. Safe and non-irritating." },

    // ── Amino Acids ──
    { name: "Arginine", nameKr: "아르기닌", category: "humectant", rating: "good", comedogenic: 0, irritation: 0, description: "Amino acid that helps repair skin barrier and maintain hydration." },

    // ── Additional common ingredients ──
    { name: "Centella Asiatica Leaf Water", nameKr: "병풀잎수", category: "soothing", rating: "good", comedogenic: 0, irritation: 0, description: "Water infused with centella. Provides mild soothing and hydrating benefits." },
    { name: "Sodium PCA", nameKr: "소듐PCA", category: "humectant", rating: "good", comedogenic: 0, irritation: 0, description: "Natural moisturizing factor (NMF) component. Excellent hydrator." },
    { name: "Trehalose", nameKr: "트레할로스", category: "humectant", rating: "good", comedogenic: 0, irritation: 0, description: "Sugar-derived humectant that protects cells from dehydration." },
    { name: "Lecithin", nameKr: "레시틴", category: "emollient", rating: "good", comedogenic: 0, irritation: 0, description: "Phospholipid that helps deliver active ingredients and moisturizes." },
    { name: "Ascorbyl Glucoside", nameKr: "아스코르빌글루코사이드", category: "active", rating: "good", comedogenic: 0, irritation: 0, description: "Stable vitamin C derivative. Brightens and provides antioxidant protection." },
    { name: "Ethylhexyl Palmitate", nameKr: "에틸헥실팔미테이트", category: "emollient", rating: "average", comedogenic: 2, irritation: 0, description: "Emollient ester used as a skin-conditioning agent." },
    { name: "Hydrogenated Lecithin", nameKr: "수소화레시틴", category: "emollient", rating: "good", comedogenic: 0, irritation: 0, description: "Stabilized lecithin used as an emulsifier and skin barrier supporter." },
    { name: "EDTA", nameKr: "EDTA", category: "base", rating: "average", comedogenic: 0, irritation: 0, description: "Chelating agent that improves product stability by binding to metal ions." },
    { name: "Triethanolamine", nameKr: "트리에탄올아민", category: "base", rating: "average", comedogenic: 0, irritation: 1, description: "pH adjuster and emulsifier. Generally safe in small concentrations." },
    { name: "BHT", nameKr: "BHT", category: "preservative", rating: "average", comedogenic: 0, irritation: 1, description: "Synthetic antioxidant preservative. Debated safety profile." },
    { name: "Citric Acid", nameKr: "구연산", category: "base", rating: "good", comedogenic: 0, irritation: 0, description: "Used as a pH adjuster. In low concentrations, also provides mild exfoliation." }
];

var INGREDIENT_ALIASES = {
    // Hyaluronic Acid variants
    "sodium hyaluronate": "Hyaluronic Acid",
    "hyaluronate": "Hyaluronic Acid",
    "ha": "Hyaluronic Acid",
    // Vitamin C variants
    "ascorbic acid": "Vitamin C (Ascorbic Acid)",
    "l-ascorbic acid": "Vitamin C (Ascorbic Acid)",
    "ethyl ascorbic acid": "Ascorbyl Glucoside",
    "3-o-ethyl ascorbic acid": "Ascorbyl Glucoside",
    // Retinoids
    "retinaldehyde": "Retinal (Retinaldehyde)",
    "vitamin a": "Retinol",
    // BHA / AHA
    "bha": "Salicylic Acid (BHA)",
    "aha": "Glycolic Acid (AHA)",
    "glycolic acid": "Glycolic Acid (AHA)",
    "salicylic acid": "Salicylic Acid (BHA)",
    // Niacinamide
    "vitamin b3": "Niacinamide",
    "nicotinamide": "Niacinamide",
    // Panthenol
    "panthenol": "Panthenol (Vitamin B5)",
    "dexpanthenol": "Panthenol (Vitamin B5)",
    "d-panthenol": "Panthenol (Vitamin B5)",
    "vitamin b5": "Panthenol (Vitamin B5)",
    "pro-vitamin b5": "Panthenol (Vitamin B5)",
    // CICA
    "centella asiatica": "Centella Asiatica (CICA)",
    "centella asiatica extract": "Centella Asiatica (CICA)",
    "cica": "Centella Asiatica (CICA)",
    "gotu kola": "Centella Asiatica (CICA)",
    // Snail
    "snail secretion filtrate": "Snail Mucin (Secretion Filtrate)",
    "snail mucin": "Snail Mucin (Secretion Filtrate)",
    "snail mucin extract": "Snail Mucin (Secretion Filtrate)",
    // Ceramides
    "ceramide np": "Ceramides",
    "ceramide ap": "Ceramides",
    "ceramide eop": "Ceramides",
    "ceramide ns": "Ceramides",
    "ceramide 3": "Ceramides",
    // Fragrance
    "fragrance": "Fragrance (Parfum)",
    "parfum": "Fragrance (Parfum)",
    // Alcohol
    "alcohol denat": "Denatured Alcohol (Alcohol Denat.)",
    "alcohol denat.": "Denatured Alcohol (Alcohol Denat.)",
    "sd alcohol": "Denatured Alcohol (Alcohol Denat.)",
    // SLS / SLES
    "sls": "Sodium Lauryl Sulfate (SLS)",
    "sodium lauryl sulfate": "Sodium Lauryl Sulfate (SLS)",
    "sles": "Sodium Laureth Sulfate (SLES)",
    "sodium laureth sulfate": "Sodium Laureth Sulfate (SLES)",
    // Ferments
    "galactomyces": "Galactomyces Ferment Filtrate",
    "saccharomyces": "Saccharomyces Ferment Filtrate",
    "bifida lysate": "Bifida Ferment Lysate",
    "bifida ferment lysate": "Bifida Ferment Lysate",
    // Oils
    "cocos nucifera oil": "Coconut Oil",
    "coconut oil": "Coconut Oil",
    "simmondsia chinensis seed oil": "Jojoba Oil",
    "jojoba oil": "Jojoba Oil",
    "helianthus annuus seed oil": "Sunflower Seed Oil",
    "rosa canina fruit oil": "Rosehip Oil",
    "rosehip seed oil": "Rosehip Oil",
    "butyrospermum parkii butter": "Shea Butter",
    "shea butter": "Shea Butter",
    // Aloe
    "aloe barbadensis leaf extract": "Aloe Vera",
    "aloe barbadensis leaf juice": "Aloe Vera",
    "aloe barbadensis": "Aloe Vera",
    // Tea tree
    "melaleuca alternifolia leaf oil": "Tea Tree Oil",
    "tea tree oil": "Tea Tree Oil",
    // Vitamin E
    "tocopherol": "Tocopherol (Vitamin E)",
    "tocopheryl acetate": "Tocopherol (Vitamin E)",
    "vitamin e": "Tocopherol (Vitamin E)",
    // Green tea
    "camellia sinensis leaf extract": "Green Tea Extract",
    "green tea": "Green Tea Extract",
    // Licorice
    "glycyrrhiza glabra root extract": "Licorice Root Extract",
    "licorice root": "Licorice Root Extract",
    // Propolis
    "propolis": "Propolis Extract",
    "propolis extract": "Propolis Extract",
    // Sunscreen
    "octinoxate": "Ethylhexyl Methoxycinnamate (Octinoxate)",
    "ethylhexyl methoxycinnamate": "Ethylhexyl Methoxycinnamate (Octinoxate)",
    // DMDM
    "dmdm hydantoin": "Formaldehyde Releasers (DMDM Hydantoin)",
    // Others
    "aqua": "Water",
    "purified water": "Water",
    "iron oxides": "CI 77491 (Iron Oxides)",
    "disodium edta": "EDTA",
    "disodium edetate": "EDTA"
};

// ========== Ingredient Conflict Data ==========
var INGREDIENT_CONFLICTS = [
    {
        nameA: "Retinol", nameB: "AHA",
        keywordsA: ["retinol", "retinal", "retinaldehyde", "retinoic", "retinoid", "retinyl", "adapalene", "tretinoin", "레티놀"],
        keywordsB: ["glycolic acid", "lactic acid", "mandelic acid", "aha", "alpha hydroxy", "글리콜산"],
        severity: "high",
        message: "Retinol + AHA can cause severe irritation, peeling, and compromise your skin barrier.",
        messageKr: "레티놀 + AHA는 심한 자극, 각질, 피부 장벽 손상을 일으킬 수 있습니다.",
        tip: "Use retinol at night and AHA in the morning, or alternate days."
    },
    {
        nameA: "Retinol", nameB: "BHA",
        keywordsA: ["retinol", "retinal", "retinaldehyde", "retinoic", "retinoid", "retinyl", "adapalene", "tretinoin", "레티놀"],
        keywordsB: ["salicylic acid", "bha", "beta hydroxy", "살리실산"],
        severity: "high",
        message: "Retinol + BHA together can over-exfoliate and irritate skin significantly.",
        messageKr: "레티놀 + BHA는 과도한 각질 제거와 심한 자극을 일으킬 수 있습니다.",
        tip: "Use retinol at night and BHA in the morning, or alternate days."
    },
    {
        nameA: "Retinol", nameB: "Vitamin C",
        keywordsA: ["retinol", "retinal", "retinaldehyde", "retinoic", "retinoid", "retinyl", "adapalene", "tretinoin", "레티놀"],
        keywordsB: ["ascorbic acid", "vitamin c", "l-ascorbic", "비타민c", "아스코르빅"],
        severity: "medium",
        message: "Retinol + Vitamin C (L-ascorbic acid) at the same time can cause irritation. Stable Vit C derivatives are generally okay.",
        messageKr: "레티놀 + 비타민C(순수형)를 동시 사용하면 자극이 생길 수 있습니다. 안정형 비타민C는 보통 괜찮습니다.",
        tip: "Use Vitamin C in the morning and Retinol at night."
    },
    {
        nameA: "Niacinamide", nameB: "Vitamin C",
        keywordsA: ["niacinamide", "nicotinamide", "vitamin b3", "나이아신아마이드"],
        keywordsB: ["ascorbic acid", "l-ascorbic", "vitamin c", "비타민c", "아스코르빅"],
        severity: "low",
        message: "Niacinamide + pure Vitamin C may reduce each other's efficacy and cause flushing in some people. Modern formulations have largely resolved this.",
        messageKr: "나이아신아마이드 + 순수 비타민C는 효과가 감소하거나 홍조가 생길 수 있습니다. 최신 제형에서는 대부분 해결되었습니다.",
        tip: "Generally safe together in modern products. If sensitive, apply at different times."
    },
    {
        nameA: "Benzoyl Peroxide", nameB: "Retinol",
        keywordsA: ["benzoyl peroxide", "벤조일퍼옥사이드"],
        keywordsB: ["retinol", "retinal", "retinaldehyde", "retinoic", "retinoid", "retinyl", "tretinoin", "레티놀"],
        severity: "high",
        message: "Benzoyl Peroxide can deactivate retinol and cause extreme dryness and irritation.",
        messageKr: "벤조일퍼옥사이드는 레티놀을 비활성화시키고 극심한 건조함과 자극을 유발합니다.",
        tip: "Use Benzoyl Peroxide in the morning and Retinol at night. Never layer together."
    },
    {
        nameA: "Benzoyl Peroxide", nameB: "Vitamin C",
        keywordsA: ["benzoyl peroxide", "벤조일퍼옥사이드"],
        keywordsB: ["ascorbic acid", "vitamin c", "l-ascorbic", "비타민c"],
        severity: "high",
        message: "Benzoyl Peroxide oxidizes Vitamin C, rendering both less effective.",
        messageKr: "벤조일퍼옥사이드는 비타민C를 산화시켜 두 성분 모두 효과가 감소합니다.",
        tip: "Use at different times of day. Do not layer."
    },
    {
        nameA: "Vitamin C", nameB: "Direct Acids",
        keywordsA: ["ascorbic acid", "l-ascorbic", "vitamin c", "비타민c"],
        keywordsB: ["glycolic acid", "salicylic acid", "lactic acid", "mandelic acid", "aha", "bha", "글리콜산", "살리실산"],
        severity: "medium",
        message: "Vitamin C + direct acids (AHA/BHA) at overlapping low pH can irritate skin and destabilize Vitamin C.",
        messageKr: "비타민C + 직접산(AHA/BHA)을 동시에 사용하면 피부 자극과 비타민C 불안정화가 생길 수 있습니다.",
        tip: "Use Vitamin C in the morning and acids at night."
    }
];

var STRONG_ACTIVE_NAMES = [
    "retinol", "retinal", "retinaldehyde", "tretinoin", "adapalene",
    "glycolic acid", "salicylic acid", "lactic acid", "mandelic acid",
    "ascorbic acid", "l-ascorbic acid", "vitamin c",
    "benzoyl peroxide", "azelaic acid", "hydroquinone",
    "aha", "bha", "niacinamide"
];

// Build a lowercase lookup map from INGREDIENT_DB for fast exact matching
var _ingredientMap = {};
var _ingredientMapKr = {};
INGREDIENT_DB.forEach(function(entry) {
    _ingredientMap[entry.name.toLowerCase()] = entry;
    if (entry.nameKr) {
        _ingredientMapKr[entry.nameKr.toLowerCase()] = entry;
    }
});

// Clinics Data
var clinicsData = [
    {
        name: "Oracle Dermatology",
        korean: "오라클피부과",
        area: "Gangnam Station",
        areaKr: "강남역",
        rating: 4.8,
        reviews: 324,
        specialties: ["botox", "filler", "laser", "pico", "skinbooster"],
        priceRange: "₩₩",
        popular: "Botox, Rejuran",
        lat: 37.4979,
        lng: 127.0276,
        naverPlaceId: "1100410036",
        englishOk: true
    },
    {
        name: "April31 Plastic Surgery",
        korean: "에이프릴31성형외과",
        area: "Sinnonhyeon",
        areaKr: "신논현",
        rating: 4.7,
        reviews: 512,
        specialties: ["filler", "botox", "lifting", "thread"],
        priceRange: "₩₩₩",
        popular: "Filler, Ulthera, Thread Lift",
        lat: 37.5045,
        lng: 127.0254,
        naverPlaceId: "38453063",
        englishOk: true
    },
    {
        name: "Renewme Skin Clinic",
        korean: "리뉴미피부과",
        area: "Gangnam Station",
        areaKr: "강남역",
        rating: 4.6,
        reviews: 187,
        specialties: ["laser", "skinbooster", "pico", "aquapeel"],
        priceRange: "₩₩",
        popular: "Laser Toning, Skin Booster",
        lat: 37.4968,
        lng: 127.0284,
        naverPlaceId: "1224498562",
        englishOk: false
    },
    {
        name: "Seran Dermatology",
        korean: "세란피부과",
        area: "Cheongdam",
        areaKr: "청담",
        rating: 4.9,
        reviews: 203,
        specialties: ["botox", "filler", "laser", "lifting", "pico"],
        priceRange: "₩₩₩",
        popular: "Premium Botox, Rejuran",
        lat: 37.5200,
        lng: 127.0474,
        naverPlaceId: "1855076137",
        englishOk: true
    },
    {
        name: "Made Young Clinic",
        korean: "메이드영의원",
        area: "Gangnam Station",
        areaKr: "강남역",
        rating: 4.5,
        reviews: 156,
        specialties: ["laser", "skinbooster", "botox", "aquapeel"],
        priceRange: "₩",
        popular: "Affordable Laser, Aqua Peel",
        lat: 37.4982,
        lng: 127.0287,
        naverPlaceId: "1102752374",
        englishOk: false
    },
    {
        name: "Hus-hu Dermatology",
        korean: "허스허피부과",
        area: "Sinsa",
        areaKr: "신사",
        rating: 4.7,
        reviews: 289,
        specialties: ["laser", "skinbooster", "pico", "aquapeel"],
        priceRange: "₩₩",
        popular: "Laser Toning, Skin Booster",
        lat: 37.5160,
        lng: 127.0200,
        naverPlaceId: "1583928504",
        englishOk: true
    },
    {
        name: "Banobagi Plastic Surgery",
        korean: "바노바기성형외과",
        area: "Gangnam",
        areaKr: "강남",
        rating: 4.6,
        reviews: 743,
        specialties: ["botox", "filler", "lifting", "thread"],
        priceRange: "₩₩₩",
        popular: "Botox, Filler, Thread Lift",
        lat: 37.5010,
        lng: 127.0396,
        naverPlaceId: "11592061",
        englishOk: true
    },
    {
        name: "Dermaline",
        korean: "더마라인피부과",
        area: "Gangnam",
        areaKr: "강남",
        rating: 4.8,
        reviews: 412,
        specialties: ["laser", "pico", "skinbooster", "botox"],
        priceRange: "₩₩",
        popular: "Pico Laser, Skin Booster",
        lat: 37.4985,
        lng: 127.0305,
        naverPlaceId: "1178498498",
        englishOk: true
    },
    {
        name: "Cheongdam Star Clinic",
        korean: "청담스타의원",
        area: "Cheongdam",
        areaKr: "청담",
        rating: 4.7,
        reviews: 198,
        specialties: ["botox", "filler", "lifting", "skinbooster"],
        priceRange: "₩₩₩",
        popular: "Premium Botox, Lifting",
        lat: 37.5215,
        lng: 127.0480,
        naverPlaceId: "1100252105",
        englishOk: true
    },
    {
        name: "Yonsei Star Dermatology",
        korean: "연세스타피부과",
        area: "Sinsa",
        areaKr: "신사",
        rating: 4.6,
        reviews: 267,
        specialties: ["laser", "pico", "skinbooster", "aquapeel"],
        priceRange: "₩₩",
        popular: "Pico Laser, Aqua Peel",
        lat: 37.5165,
        lng: 127.0210,
        naverPlaceId: "1947483245",
        englishOk: true
    }
];

// Procedures Data
var proceduresData = [
    { english: "Botox", korean: "보톡스", description: "Relaxes facial muscles to reduce wrinkles.", priceKRW: "₩50,000 - ₩200,000", priceUSD: "$40 - $150", duration: "10-15 min", downtime: "None", lasts: "3-6 months", rank: "#1 Popular", tags: ["Anti-wrinkle", "Prevention", "Quick"] },
    { english: "Rejuran", korean: "리쥬란", description: "Salmon DNA injections for skin regeneration.", priceKRW: "₩150,000 - ₩300,000", priceUSD: "$115 - $230", duration: "30-40 min", downtime: "1-2 days", lasts: "6-12 months", rank: "#2 Popular", tags: ["Regeneration", "Anti-aging"] },
    { english: "Ultherapy", korean: "울쎄라", description: "Non-invasive ultrasound treatment for lifting.", priceKRW: "₩500,000 - ₩2,000,000", priceUSD: "$380 - $1,500", duration: "60-90 min", downtime: "None", lasts: "1-2 years", rank: "#3 Popular", tags: ["Lifting", "Tightening"] },
    { english: "Skin Booster", korean: "물광주사", description: "Micro-injections for glass skin glow.", priceKRW: "₩150,000 - ₩350,000", priceUSD: "$115 - $270", duration: "30-45 min", downtime: "1-3 days", lasts: "4-6 months", rank: "#4 Popular", tags: ["Glass Skin", "Hydration"] },
    { english: "Laser Toning", korean: "레이저토닝", description: "Gentle laser for even skin tone.", priceKRW: "₩50,000 - ₩150,000", priceUSD: "$40 - $115", duration: "15-30 min", downtime: "None", lasts: "Cumulative", rank: "#5 Popular", tags: ["Brightening", "Pores"] },
    { english: "Dermal Filler", korean: "필러", description: "Injectable gel for volume and contouring.", priceKRW: "₩200,000 - ₩500,000", priceUSD: "$150 - $380", duration: "15-30 min", downtime: "1-3 days", lasts: "6-18 months", rank: "#6 Popular", tags: ["Contouring", "Volume"] },
    { english: "Shrink (HIFU)", korean: "쉬링크", description: "High-intensity focused ultrasound for skin tightening. A more affordable alternative to Ultherapy.", priceKRW: "₩100,000 - ₩500,000", priceUSD: "$75 - $380", duration: "30-60 min", downtime: "None", lasts: "6-12 months", rank: "#7 Popular", tags: ["Lifting", "Tightening", "Affordable"] },
    { english: "Pico Laser", korean: "피코레이저", description: "Ultra-short pulse laser for pigmentation, acne scars, and skin rejuvenation.", priceKRW: "₩80,000 - ₩300,000", priceUSD: "$60 - $230", duration: "15-30 min", downtime: "1-3 days", lasts: "Cumulative", rank: "#8 Popular", tags: ["Pigmentation", "Acne Scars", "Brightening"] },
    { english: "Thread Lift", korean: "실리프팅", description: "Dissolvable threads inserted under skin for natural V-line lifting effect.", priceKRW: "₩300,000 - ₩1,500,000", priceUSD: "$230 - $1,150", duration: "30-60 min", downtime: "3-7 days", lasts: "1-2 years", rank: "#9 Popular", tags: ["V-Line", "Lifting", "Contouring"] },
    { english: "Aqua Peel", korean: "아쿠아필", description: "Water-based exfoliation for deep pore cleansing and skin hydration. Great entry-level treatment.", priceKRW: "₩50,000 - ₩150,000", priceUSD: "$40 - $115", duration: "30-45 min", downtime: "None", lasts: "2-4 weeks", rank: "#10 Popular", tags: ["Pores", "Hydration", "Beginner-Friendly"] }
];

// Personal Color Results — 10 types
var personalColorResults = {
    springBright: {
        emoji: "🌸",
        season: "Spring",
        english: "Spring Bright",
        korean: "봄 브라이트",
        subtitle: "Warm & Vivid",
        subtitleKr: "따뜻하고 선명한",
        description: "You radiate warmth and clarity! Your skin glows with warm undertones and you look best in vivid, saturated warm colors that pop.",
        descriptionKr: "따뜻하고 선명한 에너지를 가진 타입입니다. 채도가 높은 따뜻한 컬러가 얼굴을 화사하게 밝혀줍니다.",
        bestColors: [
            { name: "Coral Red", hex: "#FF6B6B" },
            { name: "Tangerine", hex: "#FF9F43" },
            { name: "Warm Yellow", hex: "#FFD700" },
            { name: "Spring Green", hex: "#2ED573" },
            { name: "Turquoise", hex: "#1ABC9C" },
            { name: "Bright Coral", hex: "#FF7F50" }
        ],
        worstColors: [
            { name: "Charcoal", hex: "#333333" },
            { name: "Dusty Mauve", hex: "#B5838D" },
            { name: "Dark Navy", hex: "#1B1464" }
        ],
        tips: [
            "Choose vivid warm colors for maximum impact",
            "선명하고 따뜻한 컬러를 선택하세요",
            "Gold jewelry and bright accessories suit you",
            "골드 주얼리와 밝은 액세서리가 잘 어울려요",
            "Avoid muted or dusty tones that dull your glow"
        ],
        celebs: ["Yoona (SNSD)", "Joy (Red Velvet)"],
        celebsKr: ["윤아 (소녀시대)", "조이 (레드벨벳)"],
        makeup: { foundation: "Warm beige", lip: "Bright coral, orange-red", blush: "Vivid peach", eye: "Warm gold, copper shimmer" }
    },
    springLight: {
        emoji: "🌷",
        season: "Spring",
        english: "Spring Light",
        korean: "봄 라이트",
        subtitle: "Warm & Soft",
        subtitleKr: "따뜻하고 부드러운",
        description: "You have a gentle, luminous warmth. Light and soft warm colors bring out your delicate, fresh complexion beautifully.",
        descriptionKr: "밝고 부드러운 따뜻함을 지닌 타입입니다. 연하고 맑은 웜톤 컬러가 얼굴을 환하게 만들어줍니다.",
        bestColors: [
            { name: "Peach", hex: "#FFDAB9" },
            { name: "Light Coral", hex: "#F08080" },
            { name: "Cream Yellow", hex: "#FFFDD0" },
            { name: "Mint", hex: "#98FB98" },
            { name: "Salmon Pink", hex: "#FA8072" },
            { name: "Ivory", hex: "#FFFFF0" }
        ],
        worstColors: [
            { name: "Black", hex: "#000000" },
            { name: "Dark Burgundy", hex: "#800020" },
            { name: "Deep Brown", hex: "#3E2723" }
        ],
        tips: [
            "Soft pastels with warm bases are your best friends",
            "부드러운 웜 파스텔 톤이 가장 잘 어울려요",
            "Rose gold and light gold jewelry complement you",
            "로즈골드와 라이트골드 주얼리가 잘 어울려요",
            "Avoid heavy dark colors that overpower your lightness"
        ],
        celebs: ["Suzy", "Park Boyoung"],
        celebsKr: ["수지", "박보영"],
        makeup: { foundation: "Light warm beige", lip: "Peach, light coral", blush: "Soft apricot", eye: "Warm brown, champagne" }
    },
    summerBright: {
        emoji: "💎",
        season: "Summer",
        english: "Summer Bright",
        korean: "여름 브라이트",
        subtitle: "Cool & Vivid",
        subtitleKr: "시원하고 선명한",
        description: "You have a cool, clear brilliance. Bright cool-toned colors make you look radiant and fresh.",
        descriptionKr: "차갑고 선명한 빛을 지닌 타입입니다. 채도 높은 쿨톤 컬러가 얼굴을 빛나게 합니다.",
        bestColors: [
            { name: "Hot Pink", hex: "#FF69B4" },
            { name: "Bright Lavender", hex: "#BF5FFF" },
            { name: "Sky Blue", hex: "#5B9BD5" },
            { name: "Berry", hex: "#C04070" },
            { name: "Mint Blue", hex: "#00CED1" },
            { name: "Fuchsia", hex: "#FF00FF" }
        ],
        worstColors: [
            { name: "Mustard", hex: "#FFDB58" },
            { name: "Olive", hex: "#808000" },
            { name: "Warm Orange", hex: "#FF8C00" }
        ],
        tips: [
            "Go for vivid cool hues that add sparkle",
            "선명한 쿨톤 컬러로 화사함을 더하세요",
            "Silver and white gold jewelry work perfectly",
            "실버와 화이트골드 주얼리가 잘 어울려요",
            "Stay away from warm, earthy tones"
        ],
        celebs: ["IU", "Taeyeon (SNSD)"],
        celebsKr: ["아이유", "태연 (소녀시대)"],
        makeup: { foundation: "Cool pink beige", lip: "Bright pink, berry", blush: "Vivid rose", eye: "Silver, blue shimmer" }
    },
    summerLight: {
        emoji: "🌊",
        season: "Summer",
        english: "Summer Light",
        korean: "여름 라이트",
        subtitle: "Cool & Gentle",
        subtitleKr: "시원하고 연한",
        description: "You have a soft, elegant aura with cool undertones. Light pastel cool colors complement your delicate complexion.",
        descriptionKr: "부드럽고 우아한 쿨톤 타입입니다. 연한 파스텔 쿨톤 컬러가 섬세한 피부와 조화를 이룹니다.",
        bestColors: [
            { name: "Lavender", hex: "#E6E6FA" },
            { name: "Powder Blue", hex: "#B0E0E6" },
            { name: "Rose Pink", hex: "#FFB6C1" },
            { name: "Mauve", hex: "#E0B0FF" },
            { name: "Soft Gray", hex: "#C0C0C0" },
            { name: "Baby Blue", hex: "#89CFF0" }
        ],
        worstColors: [
            { name: "Orange", hex: "#FF8C00" },
            { name: "Camel", hex: "#C19A6B" },
            { name: "Warm Brown", hex: "#A0522D" }
        ],
        tips: [
            "Soft cool pastels make you glow effortlessly",
            "부드러운 쿨 파스텔이 자연스러운 화사함을 줘요",
            "Rose gold and silver jewelry suit your elegance",
            "로즈골드와 실버 주얼리가 우아함을 더해줘요",
            "Avoid overly warm or saturated earth tones"
        ],
        celebs: ["Kim Taehee", "Bae Suzy"],
        celebsKr: ["김태희", "배수지"],
        makeup: { foundation: "Light pink beige", lip: "Rose pink, soft mauve", blush: "Soft pink", eye: "Taupe, lavender" }
    },
    summerMute: {
        emoji: "🌿",
        season: "Summer",
        english: "Summer Mute",
        korean: "여름 뮤트",
        subtitle: "Cool & Soft",
        subtitleKr: "시원하고 차분한",
        description: "You have a calm, understated cool beauty. Muted, dusty cool tones bring out your sophisticated, gentle charm.",
        descriptionKr: "차분하고 세련된 쿨톤 타입입니다. 부드럽고 탁한 쿨톤 컬러가 은은한 매력을 이끌어냅니다.",
        bestColors: [
            { name: "Dusty Rose", hex: "#DCAE96" },
            { name: "Sage", hex: "#B2BEB5" },
            { name: "Muted Lilac", hex: "#C8A2C8" },
            { name: "Ash Blue", hex: "#7393B3" },
            { name: "Cocoa", hex: "#D2691E" },
            { name: "Grayish Pink", hex: "#C4A4A4" }
        ],
        worstColors: [
            { name: "Bright Orange", hex: "#FF6600" },
            { name: "Vivid Yellow", hex: "#FFD700" },
            { name: "Neon Green", hex: "#39FF14" }
        ],
        tips: [
            "Muted, dusty tones create harmony with your skin",
            "탁하고 은은한 톤이 피부와 조화를 이뤄요",
            "Avoid overly bright or saturated colors",
            "너무 선명하거나 채도 높은 색은 피하세요",
            "Layering soft neutrals creates your best look"
        ],
        celebs: ["Son Yejin", "Shin Minah"],
        celebsKr: ["손예진", "신민아"],
        makeup: { foundation: "Neutral pink beige", lip: "MLBB rose, dusty pink", blush: "Muted rose", eye: "Taupe, muted plum" }
    },
    fallMute: {
        emoji: "🍂",
        season: "Fall",
        english: "Fall Mute",
        korean: "가을 뮤트",
        subtitle: "Warm & Soft",
        subtitleKr: "따뜻하고 차분한",
        description: "You have a warm, muted elegance. Soft earthy warm tones bring out your naturally understated and sophisticated beauty.",
        descriptionKr: "따뜻하면서 차분한 우아함을 지닌 타입입니다. 부드러운 어스톤이 자연스러운 세련미를 이끌어냅니다.",
        bestColors: [
            { name: "Camel", hex: "#C19A6B" },
            { name: "Warm Beige", hex: "#D2B48C" },
            { name: "Olive", hex: "#808000" },
            { name: "Dusty Coral", hex: "#CD8C8C" },
            { name: "Warm Gray", hex: "#A89F91" },
            { name: "Muted Gold", hex: "#BDB76B" }
        ],
        worstColors: [
            { name: "Bright Fuchsia", hex: "#FF00FF" },
            { name: "Royal Blue", hex: "#4169E1" },
            { name: "Neon Pink", hex: "#FF6EC7" }
        ],
        tips: [
            "Earth tones and muted warm colors are your signature",
            "어스톤과 차분한 웜컬러가 시그니처예요",
            "Antique gold jewelry adds warmth naturally",
            "앤틱 골드 주얼리가 자연스러운 따뜻함을 더해요",
            "Avoid vivid cool-toned or neon colors"
        ],
        celebs: ["Song Hyekyo", "Han Sohee"],
        celebsKr: ["송혜교", "한소희"],
        makeup: { foundation: "Warm beige", lip: "MLBB brown, warm nude", blush: "Peach brown", eye: "Warm brown, khaki" }
    },
    fallDeep: {
        emoji: "🌰",
        season: "Fall",
        english: "Fall Deep",
        korean: "가을 딥",
        subtitle: "Warm & Rich",
        subtitleKr: "따뜻하고 깊은",
        description: "You have a rich, deep warmth. Bold warm earth tones and deep jewel-warm colors bring out your strong, luxurious appeal.",
        descriptionKr: "깊고 풍부한 따뜻함을 지닌 타입입니다. 진한 어스톤과 깊은 웜 컬러가 고급스러운 매력을 강조합니다.",
        bestColors: [
            { name: "Chocolate", hex: "#7B3F00" },
            { name: "Burgundy", hex: "#800020" },
            { name: "Forest Green", hex: "#228B22" },
            { name: "Terracotta", hex: "#E2725B" },
            { name: "Mustard", hex: "#FFDB58" },
            { name: "Rust", hex: "#B7410E" }
        ],
        worstColors: [
            { name: "Pastel Pink", hex: "#FFB6C1" },
            { name: "Baby Blue", hex: "#89CFF0" },
            { name: "Lavender", hex: "#E6E6FA" }
        ],
        tips: [
            "Deep warm tones create a striking, luxurious look",
            "깊은 웜톤이 고급스럽고 강렬한 인상을 만들어요",
            "Bronze and antique gold accessories are ideal",
            "브론즈와 앤틱 골드 액세서리가 이상적이에요",
            "Avoid light pastels that wash you out"
        ],
        celebs: ["Jennie (BLACKPINK)", "HyunA"],
        celebsKr: ["제니 (블랙핑크)", "현아"],
        makeup: { foundation: "Golden beige", lip: "Brick red, burgundy", blush: "Deep peach", eye: "Copper, bronze" }
    },
    fallStrong: {
        emoji: "🔥",
        season: "Fall",
        english: "Fall Strong",
        korean: "가을 스트롱",
        subtitle: "Warm & Bold",
        subtitleKr: "따뜻하고 강렬한",
        description: "You have a powerful warm intensity. Highly saturated warm colors make you look confident and vibrant.",
        descriptionKr: "강렬한 따뜻함을 지닌 타입입니다. 채도가 높은 웜톤이 당당하고 생기 있는 인상을 만듭니다.",
        bestColors: [
            { name: "Pumpkin", hex: "#FF7518" },
            { name: "Burnt Orange", hex: "#CC5500" },
            { name: "Bright Olive", hex: "#6B8E23" },
            { name: "Tomato Red", hex: "#FF6347" },
            { name: "Deep Gold", hex: "#DAA520" },
            { name: "Warm Magenta", hex: "#C71585" }
        ],
        worstColors: [
            { name: "Icy Blue", hex: "#A5F2F3" },
            { name: "Pale Gray", hex: "#D3D3D3" },
            { name: "Cool Pink", hex: "#FF69B4" }
        ],
        tips: [
            "Bold saturated warm colors are your power palette",
            "채도 높은 따뜻한 컬러가 파워 팔레트예요",
            "Statement gold jewelry matches your intensity",
            "임팩트 있는 골드 주얼리가 강렬함과 어울려요",
            "Avoid pale or washed-out cool tones"
        ],
        celebs: ["CL (2NE1)", "Hwasa (Mamamoo)"],
        celebsKr: ["씨엘 (2NE1)", "화사 (마마무)"],
        makeup: { foundation: "Deep warm beige", lip: "Orange-red, warm berry", blush: "Burnt sienna", eye: "Gold, warm olive" }
    },
    winterDeep: {
        emoji: "🌑",
        season: "Winter",
        english: "Winter Deep",
        korean: "겨울 딥",
        subtitle: "Cool & Deep",
        subtitleKr: "시원하고 깊은",
        description: "You have a cool, deep intensity. Rich dark cool-toned colors bring out your dramatic, powerful elegance.",
        descriptionKr: "차갑고 깊은 강렬함을 지닌 타입입니다. 진하고 어두운 쿨톤이 드라마틱한 우아함을 완성합니다.",
        bestColors: [
            { name: "Black", hex: "#000000" },
            { name: "Dark Navy", hex: "#1B1464" },
            { name: "Deep Plum", hex: "#673147" },
            { name: "Emerald", hex: "#006400" },
            { name: "Wine", hex: "#722F37" },
            { name: "Charcoal", hex: "#36454F" }
        ],
        worstColors: [
            { name: "Warm Beige", hex: "#D2B48C" },
            { name: "Camel", hex: "#C19A6B" },
            { name: "Peach", hex: "#FFDAB9" }
        ],
        tips: [
            "Deep, dark cool tones create dramatic impact",
            "깊고 어두운 쿨톤이 드라마틱한 인상을 줘요",
            "Platinum and dark silver jewelry suit you",
            "플래티넘과 다크 실버 주얼리가 어울려요",
            "Avoid warm, muted earth tones"
        ],
        celebs: ["Jun Jihyun", "Kim Soohyun"],
        celebsKr: ["전지현", "김수현"],
        makeup: { foundation: "Cool neutral beige", lip: "Deep berry, wine", blush: "Cool mauve", eye: "Charcoal, deep plum" }
    },
    winterBright: {
        emoji: "❄️",
        season: "Winter",
        english: "Winter Bright",
        korean: "겨울 브라이트",
        subtitle: "Cool & Vivid",
        subtitleKr: "시원하고 선명한",
        description: "You have a striking, high-contrast appearance. Bold vivid cool colors and sharp contrasts make you look powerful and chic.",
        descriptionKr: "선명하고 대비가 강한 외모를 지닌 타입입니다. 강렬한 쿨톤 컬러와 대비가 세련된 매력을 극대화합니다.",
        bestColors: [
            { name: "Pure White", hex: "#FFFFFF" },
            { name: "True Red", hex: "#FF0000" },
            { name: "Royal Blue", hex: "#4169E1" },
            { name: "Emerald", hex: "#50C878" },
            { name: "Fuchsia", hex: "#FF00FF" },
            { name: "Jet Black", hex: "#000000" }
        ],
        worstColors: [
            { name: "Beige", hex: "#F5F5DC" },
            { name: "Warm Orange", hex: "#FF8C00" },
            { name: "Muted Brown", hex: "#A0522D" }
        ],
        tips: [
            "Bold high-contrast outfits look stunning on you",
            "대비가 강한 과감한 스타일이 잘 어울려요",
            "Platinum and silver jewelry enhance your features",
            "플래티넘과 실버 주얼리가 이목구비를 살려줘요",
            "Don't be afraid of pure white and jet black"
        ],
        celebs: ["Jisoo (BLACKPINK)", "Cha Eunwoo"],
        celebsKr: ["지수 (블랙핑크)", "차은우"],
        makeup: { foundation: "Neutral to cool", lip: "True red, bright berry", blush: "Cool pink", eye: "Silver, icy blue" }
    }
};

var fsShapeData = {
    oval: {
        emoji: '🥚', name: 'Oval', korean: '타원형',
        description: 'Balanced proportions, slightly wider at cheekbones. Considered the most versatile shape — most styles work well.',
        tips: [
            '💇 Hair: Almost any hairstyle works! Try long layers or a classic bob.',
            '👓 Glasses: Most frame shapes suit you — experiment freely.',
            '💄 Makeup: Light contouring on cheekbones to enhance your natural balance.',
            '💎 Accessories: Any earring style works — hoops, studs, or dangles.',
            '✂️ Bangs: Side-swept or curtain bangs complement your proportions.'
        ]
    },
    round: {
        emoji: '🟢', name: 'Round', korean: '둥근형',
        description: 'Equal width and length with soft angles. Your full cheeks give a youthful appearance.',
        tips: [
            '💇 Hair: Layered cuts, side parts, and styles with volume on top elongate your face.',
            '👓 Glasses: Angular or rectangular frames add definition.',
            '💄 Makeup: Contour along the sides of your face to create more angles.',
            '💎 Accessories: Long, dangling earrings help elongate visually.',
            '✂️ Bangs: Side-swept bangs or deep side parts work best. Avoid blunt, straight-across bangs.'
        ]
    },
    square: {
        emoji: '🔷', name: 'Square', korean: '사각형',
        description: 'Strong jawline with equal width at forehead, cheeks, and jaw. Your angular features give a bold, striking look.',
        tips: [
            '💇 Hair: Soft waves, layered cuts, or side-parted styles soften angular features.',
            '👓 Glasses: Round or oval frames balance your strong jawline.',
            '💄 Makeup: Contour jaw corners and highlight the center of your face.',
            '💎 Accessories: Round earrings and curved necklaces complement your angles.',
            '✂️ Bangs: Soft, wispy bangs or side-swept styles work great.'
        ]
    },
    diamond: {
        emoji: '💎', name: 'Diamond', korean: '다이아몬드형',
        description: 'Narrow forehead and jaw, widest at cheekbones. Your prominent cheekbones are your standout feature.',
        tips: [
            '💇 Hair: Side-swept bangs and chin-length cuts balance your wide cheekbones.',
            '👓 Glasses: Cat-eye or oval frames highlight your cheekbones beautifully.',
            '💄 Makeup: Highlight forehead and chin, contour under cheekbones for balance.',
            '💎 Accessories: Small studs or short drop earrings work well.',
            '✂️ Bangs: Side-swept or curtain bangs add width to your forehead area.'
        ]
    },
    heart: {
        emoji: '💗', name: 'Heart', korean: '하트형',
        description: 'Wide forehead tapering to a narrow chin. Your face has a naturally sweet, inverted triangle shape.',
        tips: [
            '💇 Hair: Chin-length bobs or styles with volume below the ears balance your shape.',
            '👓 Glasses: Light, rimless frames or bottom-heavy frames work best.',
            '💄 Makeup: Contour temples and highlight chin to create balance.',
            '💎 Accessories: Teardrop or chandelier earrings balance a narrow chin.',
            '✂️ Bangs: Soft, wispy bangs or curtain bangs minimize a wide forehead.'
        ]
    },
    long: {
        emoji: '📏', name: 'Long (Oblong)', korean: '긴형',
        description: 'Longer than wide with a long forehead or chin. Your elegant proportions give a sophisticated look.',
        tips: [
            '💇 Hair: Chin-length bobs, side parts, and horizontal layers add width.',
            '👓 Glasses: Wide, oversized frames or aviators add width to your face.',
            '💄 Makeup: Apply blush horizontally across cheeks. Contour forehead and chin.',
            '💎 Accessories: Wide, chunky earrings add the illusion of width.',
            '✂️ Bangs: Full, straight-across bangs shorten and balance your face beautifully.'
        ]
    }
};

// Page Modal (About, Contact, Privacy)
var pageContent = {
    about: '<h2>About Glowmi</h2>' +
        '<p class="page-subtitle">Glowmi 소개</p>' +
        '<p>Glowmi (Glow + Me) is your personal K-Beauty companion, designed to help beginners navigate the world of Korean skincare and beauty. Whether you are exploring K-Beauty for the first time or planning a trip to Seoul for aesthetic treatments, our goal is to provide clear, accurate, and helpful information in both English and Korean.</p>' +
        '<h3>What We Offer</h3>' +
        '<ul>' +
        '<li><strong>Skin Type Quiz</strong> — An interactive quiz that analyzes your skin characteristics across different seasons to determine your skin type (dry, oily, combination, sensitive, or normal) with personalized K-Beauty product recommendations.</li>' +
        '<li><strong>Personal Color Test</strong> — A diagnostic tool that identifies your seasonal color type (Spring Warm, Summer Cool, Fall Warm, or Winter Cool) and provides your best color palette, styling tips, and makeup shade recommendations.</li>' +
        '<li><strong>Clinic Directory</strong> — A curated list of reputable dermatology clinics in the Gangnam, Sinsa, and Cheongdam areas of Seoul, including specialties, price ranges, ratings, and direct links to Google Maps and Naver Maps.</li>' +
        '<li><strong>Procedure Guide</strong> — Detailed information on the 10 most popular aesthetic procedures in Korea, including Botox, fillers, laser toning, and more, with pricing in both KRW and USD.</li>' +
        '<li><strong>Product Education</strong> — Comprehensive guides to the Korean 10-step skincare routine, popular ingredients, and beginner tips to help you build an effective routine.</li>' +
        '<li><strong>Wellness Content</strong> — Evidence-based information on how diet, sleep, stress, and daily habits affect skin health, featuring traditional Korean superfoods and wellness practices.</li>' +
        '</ul>' +
        '<h3>Our Mission</h3>' +
        '<p>We believe that skincare knowledge should be accessible to everyone. Korean beauty has transformed the global skincare industry with its innovation, affordability, and focus on prevention over correction. Glowmi bridges the language and knowledge gap so that anyone, regardless of background, can benefit from Korean beauty wisdom.</p>' +
        '<h3>Disclaimer</h3>' +
        '<p>The content on this site is for educational and informational purposes only. It is not intended as medical advice. Always consult a licensed dermatologist or healthcare professional before starting any new skincare treatment or aesthetic procedure. Individual results may vary based on skin type, health conditions, and other factors.</p>',

    contact: '<h2>Contact Us</h2>' +
        '<p class="page-subtitle">문의하기</p>' +
        '<p>We value your feedback and are always looking to improve Glowmi. If you have questions, suggestions, corrections, or partnership inquiries, please reach out to us through the following channels:</p>' +
        '<div class="contact-info">' +
        '<div class="contact-item"><strong>Email</strong><p>support@glowmi.co</p></div>' +
        '<div class="contact-item"><strong>Response Time</strong><p>We typically respond within 48 hours during business days.</p></div>' +
        '</div>' +
        '<h3>Feedback</h3>' +
        '<p>Found incorrect information? Have a suggestion for a new feature? We appreciate all feedback that helps us serve the K-Beauty community better. Please include as much detail as possible in your message so we can address your inquiry effectively.</p>' +
        '<h3>Content Corrections</h3>' +
        '<p>We strive for accuracy in all our content, including clinic information, procedure details, and product recommendations. If you notice any outdated or incorrect information, please let us know and we will update it promptly.</p>',

    privacy: '<h2>Privacy Policy</h2>' +
        '<p class="page-subtitle">개인정보처리방침</p>' +
        '<p><strong>Last updated:</strong> February 2026</p>' +
        '<p>Glowmi ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>' +
        '<h3>1. Information We Collect</h3>' +
        '<p><strong>Quiz and Test Data:</strong> When you take our Skin Type Quiz or Personal Color Test, your answers are processed locally in your browser to generate results. We do not store your quiz responses on any server. All quiz data remains on your device and is cleared when you close or refresh the page.</p>' +
        '<p><strong>Automatically Collected Data:</strong> Like most websites, we may collect certain information automatically, including your IP address, browser type, device type, operating system, referring URLs, and pages visited. This data is collected through cookies and similar technologies for analytics purposes.</p>' +
        '<h3>2. How We Use Your Information</h3>' +
        '<p>We use collected information to: (a) provide and improve our services; (b) analyze website traffic and usage patterns; (c) display relevant advertisements through Google AdSense; and (d) ensure the security and functionality of our website.</p>' +
        '<h3>3. Google AdSense and Cookies</h3>' +
        '<p>We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website and other websites on the Internet. Google\'s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and other sites on the Internet. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>.</p>' +
        '<p>Third-party vendors, including Google, use cookies to serve ads based on your prior visits. You can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener">www.aboutads.info</a>.</p>' +
        '<h3>4. Third-Party Links</h3>' +
        '<p>Our website contains links to external websites including Google Maps, Naver Maps, and clinic websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>' +
        '<h3>5. Data Security</h3>' +
        '<p>We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.</p>' +
        '<h3>6. Children\'s Privacy</h3>' +
        '<p>Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.</p>' +
        '<h3>7. Your Rights</h3>' +
        '<p>Depending on your location, you may have the right to: (a) access the personal data we hold about you; (b) request correction or deletion of your data; (c) object to or restrict processing of your data; and (d) data portability. To exercise any of these rights, please contact us at the email address provided on our Contact page.</p>' +
        '<h3>8. Changes to This Policy</h3>' +
        '<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated revision date. Your continued use of the website after any changes constitutes acceptance of the updated policy.</p>' +
        '<h3>9. Contact Us</h3>' +
        '<p>If you have questions about this Privacy Policy or our data practices, please contact us at support@glowmi.co.</p>'
};

// ========== AI Skin Condition Analyzer ==========
var SKIN_CONCERNS = {
    redness: { name: 'Redness', nameKr: '붉은기', emoji: '🔴', description: 'Redness or flushing detected in the skin.' },
    oiliness: { name: 'Oiliness', nameKr: '유분', emoji: '💧', description: 'Excess sebum or oily sheen detected.' },
    dryness: { name: 'Dryness', nameKr: '건조함', emoji: '🏜️', description: 'Skin appears dry or lacking moisture.' },
    darkSpots: { name: 'Dark Spots', nameKr: '색소침착', emoji: '🟤', description: 'Uneven pigmentation or dark patches detected.' },
    texture: { name: 'Texture', nameKr: '피부결', emoji: '🔍', description: 'Uneven skin texture or roughness detected.' }
};

var SKIN_RECOMMENDATIONS = {
    redness: {
        tips: [
            'Use a gentle, fragrance-free cleanser to avoid irritation.',
            'Apply centella asiatica (CICA) products to calm inflammation.',
            'Avoid hot water when washing your face — use lukewarm water.',
            'Consider a green-tinted color corrector for visible redness.'
        ],
        tipsKr: [
            '자극을 피하기 위해 순한 무향 클렌저를 사용하세요.',
            '시카(병풀) 제품으로 염증을 진정시키세요.',
            '세안 시 뜨거운 물 대신 미지근한 물을 사용하세요.',
            '눈에 보이는 붉은기에는 그린 컬러 보정 제품을 고려하세요.'
        ],
        ingredients: ['Centella Asiatica (CICA)', 'Niacinamide', 'Aloe Vera', 'Green Tea Extract', 'Panthenol (Vitamin B5)']
    },
    oiliness: {
        tips: [
            'Use a BHA (salicylic acid) toner to control excess oil.',
            'Choose lightweight, gel-based moisturizers instead of heavy creams.',
            'Do not skip moisturizer — dehydration can cause more oil production.',
            'Use oil-blotting sheets during the day for quick touch-ups.'
        ],
        tipsKr: [
            'BHA(살리실산) 토너로 과도한 유분을 조절하세요.',
            '무거운 크림 대신 가벼운 젤 타입 보습제를 선택하세요.',
            '보습을 건너뛰지 마세요 — 탈수가 오히려 유분 분비를 증가시킵니다.',
            '낮 동안 유분 흡수 시트로 간단히 관리하세요.'
        ],
        ingredients: ['Salicylic Acid (BHA)', 'Niacinamide', 'Green Tea Extract', 'Tea Tree Oil']
    },
    dryness: {
        tips: [
            'Layer hydrating products — toner, essence, then moisturizer.',
            'Use hyaluronic acid serums on damp skin for maximum absorption.',
            'Apply a sleeping mask 2-3 times a week for deep hydration.',
            'Avoid harsh cleansers that strip natural oils.'
        ],
        tipsKr: [
            '보습 제품을 겹겹이 발라주세요 — 토너, 에센스, 보습제 순서로.',
            '히알루론산 세럼은 촉촉한 피부 위에 발라야 흡수가 잘 됩니다.',
            '주 2-3회 수면 마스크를 사용해 깊은 보습을 하세요.',
            '천연 유분을 벗기는 강한 클렌저는 피하세요.'
        ],
        ingredients: ['Hyaluronic Acid', 'Ceramides', 'Squalane', 'Panthenol (Vitamin B5)', 'Snail Mucin (Secretion Filtrate)']
    },
    darkSpots: {
        tips: [
            'Apply Vitamin C serum in the morning for brightening.',
            'Always use sunscreen SPF 50+ to prevent further pigmentation.',
            'Use niacinamide to even out skin tone over time.',
            'Consider products with arbutin or licorice root extract.'
        ],
        tipsKr: [
            '아침에 비타민C 세럼을 발라 미백 효과를 높이세요.',
            '추가 색소침착을 방지하기 위해 SPF 50+ 자외선 차단제를 사용하세요.',
            '나이아신아마이드로 피부톤을 점차 균일하게 만드세요.',
            '알부틴이나 감초 뿌리 추출물이 든 제품을 고려하세요.'
        ],
        ingredients: ['Vitamin C (Ascorbic Acid)', 'Niacinamide', 'Arbutin', 'Licorice Root Extract']
    },
    texture: {
        tips: [
            'Use a gentle AHA (glycolic/lactic acid) exfoliant 2-3 times a week.',
            'Apply retinol at night to promote cell turnover.',
            'Use a hydrating toner to plump and smooth skin surface.',
            'Do not over-exfoliate — give your skin time to recover.'
        ],
        tipsKr: [
            '주 2-3회 순한 AHA(글리콜산/젖산) 각질 제거제를 사용하세요.',
            '밤에 레티놀을 발라 세포 재생을 촉진하세요.',
            '보습 토너로 피부 표면을 매끄럽게 만드세요.',
            '과도한 각질 제거는 피하고 피부 회복 시간을 주세요.'
        ],
        ingredients: ['Glycolic Acid (AHA)', 'Retinol', 'Niacinamide', 'Hyaluronic Acid']
    }
};
