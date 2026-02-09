// Quiz Data - Summer Version
const summerQuizQuestions = [
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
        english: "What's your biggest summer skin concern?",
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
const winterQuizQuestions = [
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
            { english: "Doesn't dry me out much", korean: "별로 건조해지지 않음", scores: { dry: 0, oily: 2, combination: 0, sensitive: 0, normal: 0 } },
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
        english: "What's your biggest winter skin concern?",
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
const skinTypeResults = {
    dry: {
        emoji: "🏜️",
        english: "Dry Skin",
        korean: "건성 피부",
        description: "Your skin lacks natural oils and moisture, often feeling tight and showing flakiness. It may be prone to fine lines and rough texture.",
        tips: [
            "💧 Use gentle, hydrating cleansers (avoid foaming)",
            "🧴 Layer hydrating toners and essences",
            "🌙 Apply rich cream moisturizers, especially at night",
            "☀️ Never skip sunscreen (look for hydrating formulas)",
            "🚫 Avoid hot water and harsh exfoliants"
        ],
        products: [
            { name: "COSRX Snail Mucin Essence", brand: "COSRX", emoji: "🐌", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000151510" },
            { name: "Laneige Water Bank Cream", brand: "Laneige", emoji: "💧", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000174432" },
            { name: "Etude SoonJung Toner", brand: "Etude", emoji: "🌿", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000138713" }
        ]
    },
    oily: {
        emoji: "✨",
        english: "Oily Skin",
        korean: "지성 피부",
        description: "Your skin produces excess sebum, often looking shiny and prone to enlarged pores and breakouts. The good news? Oily skin tends to age slower!",
        tips: [
            "🫧 Use gentle foaming cleansers twice daily",
            "💨 Look for lightweight, oil-free moisturizers",
            "🧪 Incorporate BHA/salicylic acid for pores",
            "📝 Use blotting papers during the day",
            "🚫 Don't skip moisturizer - dehydration increases oil"
        ],
        products: [
            { name: "COSRX BHA Blackhead Power Liquid", brand: "COSRX", emoji: "🧪", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000151509" },
            { name: "Innisfree No-Sebum Powder", brand: "Innisfree", emoji: "💨", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000174726" },
            { name: "Some By Mi AHA BHA PHA Toner", brand: "Some By Mi", emoji: "🌟", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000117282" }
        ]
    },
    combination: {
        emoji: "⚖️",
        english: "Combination Skin",
        korean: "복합성 피부",
        description: "Your T-zone (forehead, nose, chin) is oily while your cheeks are normal to dry. This is the most common skin type and requires balanced care.",
        tips: [
            "🎯 Use different products for different zones",
            "🧴 Gel moisturizers work well overall",
            "🔄 Multi-mask: clay on T-zone, hydrating on cheeks",
            "💧 Focus hydration on dry areas",
            "🧪 Use BHA only on oily zones"
        ],
        products: [
            { name: "Klairs Supple Preparation Toner", brand: "Klairs", emoji: "💧", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000120761" },
            { name: "Innisfree Green Tea Seed Serum", brand: "Innisfree", emoji: "🍵", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000174716" },
            { name: "COSRX Oil-Free Moisturizing Lotion", brand: "COSRX", emoji: "🌊", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000151512" }
        ]
    },
    sensitive: {
        emoji: "🌸",
        english: "Sensitive Skin",
        korean: "민감성 피부",
        description: "Your skin easily reacts to products and environmental factors, often becoming red, itchy, or irritated. It needs extra gentle care and soothing ingredients.",
        tips: [
            "🌿 Choose fragrance-free, hypoallergenic products",
            "🧪 Patch test ALL new products for 24-48 hours",
            "❄️ Use lukewarm water, never hot",
            "🛡️ Look for centella, aloe, and ceramides",
            "🚫 Avoid alcohol, essential oils, and harsh actives"
        ],
        products: [
            { name: "Etude SoonJung 2x Barrier Cream", brand: "Etude", emoji: "🛡️", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000138714" },
            { name: "COSRX Centella Blemish Cream", brand: "COSRX", emoji: "🌿", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000151516" },
            { name: "Pyunkang Yul Essence Toner", brand: "Pyunkang Yul", emoji: "💚", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000117547" }
        ]
    },
    normal: {
        emoji: "😊",
        english: "Normal Skin",
        korean: "중성 피부",
        description: "Congratulations! Your skin is well-balanced with good moisture levels, small pores, and few imperfections. Focus on maintenance and prevention.",
        tips: [
            "✨ Maintain with a simple, consistent routine",
            "☀️ Prioritize sun protection for anti-aging",
            "💧 Stay hydrated inside and out",
            "🔄 Can experiment with various products",
            "😴 Focus on getting enough sleep"
        ],
        products: [
            { name: "Beauty of Joseon Glow Serum", brand: "Beauty of Joseon", emoji: "✨", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000175238" },
            { name: "Round Lab Dokdo Toner", brand: "Round Lab", emoji: "🌊", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000155498" },
            { name: "Isntree Hyaluronic Acid Toner", brand: "Isntree", emoji: "💧", link: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000159684" }
        ]
    }
};

// Procedures Data
const proceduresData = [
    {
        english: "Botox",
        korean: "보톡스",
        description: "Relaxes facial muscles to reduce wrinkles and prevent new ones from forming. Most popular for forehead lines, crow's feet, and frown lines.",
        priceKRW: "₩50,000 - ₩200,000",
        priceUSD: "$40 - $150",
        duration: "10-15 min",
        downtime: "None",
        lasts: "3-6 months",
        rank: "#1 Popular",
        tags: ["Anti-wrinkle", "Prevention", "Quick"]
    },
    {
        english: "Rejuran",
        korean: "리쥬란",
        description: "Salmon DNA injections that promote skin regeneration, improve elasticity, and reduce fine lines. A Korean favorite for natural skin improvement.",
        priceKRW: "₩150,000 - ₩300,000",
        priceUSD: "$115 - $230",
        duration: "30-40 min",
        downtime: "1-2 days",
        lasts: "6-12 months",
        rank: "#2 Popular",
        tags: ["Regeneration", "Anti-aging", "K-Beauty Exclusive"]
    },
    {
        english: "Ultherapy",
        korean: "울쎄라",
        description: "Non-invasive ultrasound treatment that lifts and tightens skin by stimulating collagen production deep within the skin layers.",
        priceKRW: "₩500,000 - ₩2,000,000",
        priceUSD: "$380 - $1,500",
        duration: "60-90 min",
        downtime: "None to minimal",
        lasts: "1-2 years",
        rank: "#3 Popular",
        tags: ["Lifting", "Tightening", "Non-invasive"]
    },
    {
        english: "Skin Booster",
        korean: "물광주사",
        description: "Micro-injections of hyaluronic acid for intense hydration, giving skin a dewy 'glass skin' glow that Koreans love.",
        priceKRW: "₩150,000 - ₩350,000",
        priceUSD: "$115 - $270",
        duration: "30-45 min",
        downtime: "1-3 days",
        lasts: "4-6 months",
        rank: "#4 Popular",
        tags: ["Glass Skin", "Hydration", "Glow"]
    },
    {
        english: "Laser Toning",
        korean: "레이저토닝",
        description: "Gentle laser treatment that evens out skin tone, reduces pigmentation, and minimizes pores. Popular for maintaining clear skin.",
        priceKRW: "₩50,000 - ₩150,000",
        priceUSD: "$40 - $115",
        duration: "15-30 min",
        downtime: "None",
        lasts: "Cumulative",
        rank: "#5 Popular",
        tags: ["Brightening", "Pores", "Maintenance"]
    },
    {
        english: "Dermal Filler",
        korean: "필러",
        description: "Injectable gel that adds volume, contours facial features, and fills in wrinkles. Common areas include nose, chin, lips, and under-eyes.",
        priceKRW: "₩200,000 - ₩500,000",
        priceUSD: "$150 - $380",
        duration: "15-30 min",
        downtime: "1-3 days",
        lasts: "6-18 months",
        rank: "#6 Popular",
        tags: ["Contouring", "Volume", "Instant Results"]
    }
];

// App State
var currentQuestion = 0;
var scores = { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 };
var selectedSeason = null;
var quizQuestions = summerQuizQuestions;

// Global Functions for onclick handlers
function selectSeason(season) {
    selectedSeason = season;

    // Set the quiz questions based on season
    if (season === 'summer') {
        quizQuestions = summerQuizQuestions;
        document.getElementById('season-quiz-icon').textContent = '☀️';
        document.getElementById('season-quiz-title').textContent = 'Summer Skin Quiz';
        document.getElementById('season-quiz-subtitle').textContent = '여름 피부 퀴즈';
        document.getElementById('season-quiz-desc').textContent = 'Answer 7 questions about your summer skin to get personalized hot-weather skincare recommendations!';
        document.getElementById('season-quiz-desc-kr').textContent = '여름 피부에 대한 7가지 질문에 답하고 더운 날씨용 맞춤 스킨케어 추천을 받아보세요!';
    } else {
        quizQuestions = winterQuizQuestions;
        document.getElementById('season-quiz-icon').textContent = '❄️';
        document.getElementById('season-quiz-title').textContent = 'Winter Skin Quiz';
        document.getElementById('season-quiz-subtitle').textContent = '겨울 피부 퀴즈';
        document.getElementById('season-quiz-desc').textContent = 'Answer 7 questions about your winter skin to get personalized cold-weather skincare recommendations!';
        document.getElementById('season-quiz-desc-kr').textContent = '겨울 피부에 대한 7가지 질문에 답하고 추운 날씨용 맞춤 스킨케어 추천을 받아보세요!';
    }

    // Show quiz start screen
    document.getElementById('quiz-season-select').classList.add('hidden');
    document.getElementById('quiz-start').classList.remove('hidden');
}

function backToSeasonSelect() {
    document.getElementById('quiz-start').classList.add('hidden');
    document.getElementById('quiz-season-select').classList.remove('hidden');
}

function startQuiz() {
    currentQuestion = 0;
    scores = { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 };

    document.getElementById('quiz-start').classList.add('hidden');
    document.getElementById('quiz-questions').classList.remove('hidden');
    document.getElementById('quiz-result').classList.add('hidden');

    renderQuestion();
}

function renderQuestion() {
    var question = quizQuestions[currentQuestion];
    var progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-text').textContent = (currentQuestion + 1) + ' / ' + quizQuestions.length;

    var optionsHTML = question.options.map(function(option, index) {
        return '<button class="option-btn" onclick="selectOption(' + index + ')">' +
            '<span class="english">' + option.english + '</span>' +
            '<span class="korean">' + option.korean + '</span>' +
        '</button>';
    }).join('');

    document.getElementById('question-container').innerHTML =
        '<p class="question-text">' + question.english + '</p>' +
        '<p class="question-text-korean">' + question.korean + '</p>' +
        '<div class="options-list">' + optionsHTML + '</div>';
}

function selectOption(optionIndex) {
    var question = quizQuestions[currentQuestion];
    var selectedScores = question.options[optionIndex].scores;

    // Add scores
    Object.keys(selectedScores).forEach(function(type) {
        scores[type] += selectedScores[type];
    });

    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {
        renderQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('quiz-questions').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');

    // Find highest score
    var skinType = Object.keys(scores).reduce(function(a, b) {
        return scores[a] > scores[b] ? a : b;
    });
    var result = skinTypeResults[skinType];

    // Season-specific tip
    var seasonTip = selectedSeason === 'summer'
        ? '☀️ Summer tip: Use lightweight, gel-based products and reapply sunscreen!'
        : '❄️ Winter tip: Layer hydrating products and use occlusive creams at night!';

    var tipsHTML = result.tips.map(function(tip) {
        return '<li>' + tip + '</li>';
    }).join('');

    var productsHTML = result.products.map(function(product) {
        return '<a href="' + product.link + '" target="_blank" rel="noopener noreferrer" class="product-item">' +
            '<span class="product-emoji">' + product.emoji + '</span>' +
            '<div class="product-info">' +
                '<span class="product-name">' + product.name + '</span>' +
                '<span class="product-brand">' + product.brand + '</span>' +
            '</div>' +
            '<span class="product-arrow">→</span>' +
        '</a>';
    }).join('');

    var seasonBadge = selectedSeason === 'summer' ? '☀️ Summer Result' : '❄️ Winter Result';

    document.getElementById('result-content').innerHTML =
        '<div class="result-emoji">' + result.emoji + '</div>' +
        '<h2 class="result-type">' + result.english + '</h2>' +
        '<p class="result-type-korean">' + result.korean + '</p>' +
        '<div class="season-badge">' + seasonBadge + '</div>' +
        '<div class="result-description">' +
            '<h4>About Your Skin</h4>' +
            '<p>' + result.description + '</p>' +
            '<div class="season-tip">' + seasonTip + '</div>' +
            '<h4>Care Tips</h4>' +
            '<ul>' + tipsHTML + '</ul>' +
        '</div>' +
        '<div class="recommended-products">' +
            '<h4>🛒 Recommended Products (Olive Young)</h4>' +
            productsHTML +
        '</div>' +
        buildShareButtons(result.emoji, result.english, result.korean) +
        '<button class="secondary-btn" onclick="retakeQuiz()">Retake Quiz 다시하기</button>';

    // Add animation class
    document.getElementById('result-content').classList.add('animated');

    // Create confetti effect
    createConfetti();
}

function retakeQuiz() {
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-season-select').classList.remove('hidden');
    document.getElementById('result-content').classList.remove('animated');
}

// Confetti Animation
function createConfetti() {
    var colors = ['#ff6b9d', '#c44569', '#ff9500', '#00bcd4', '#4caf50', '#ffeb3b'];
    var container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    for (var i = 0; i < 50; i++) {
        var confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

        // Random shapes
        var shapes = ['50%', '0%'];
        confetti.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];

        container.appendChild(confetti);
    }

    // Remove confetti after animation
    setTimeout(function() {
        container.remove();
    }, 4000);
}

// Tab Navigation
function setupTabs() {
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var tabId = btn.dataset.tab;

            // Update button states
            tabBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            // Update panel visibility
            tabPanels.forEach(function(panel) {
                panel.classList.add('hidden');
                if (panel.id === tabId) {
                    panel.classList.remove('hidden');
                }
            });
        });
    });
}

// Procedures Functions
function renderProcedures() {
    var proceduresGrid = document.getElementById('procedures-grid');
    if (!proceduresGrid) return;

    proceduresGrid.innerHTML = proceduresData.map(function(procedure) {
        var tagsHTML = procedure.tags.map(function(tag) {
            return '<span class="tag">' + tag + '</span>';
        }).join('');

        return '<div class="procedure-card">' +
            '<div class="procedure-header">' +
                '<div>' +
                    '<div class="procedure-title">' + procedure.english + '</div>' +
                    '<div class="procedure-title-korean">' + procedure.korean + '</div>' +
                '</div>' +
                '<span class="procedure-rank">' + procedure.rank + '</span>' +
            '</div>' +
            '<p class="procedure-description">' + procedure.description + '</p>' +
            '<div class="procedure-details">' +
                '<div class="detail-item">' +
                    '<div class="detail-label">Price</div>' +
                    '<div class="detail-value">' + procedure.priceKRW + '</div>' +
                    '<div class="detail-value-sub">' + procedure.priceUSD + '</div>' +
                '</div>' +
                '<div class="detail-item">' +
                    '<div class="detail-label">Duration</div>' +
                    '<div class="detail-value">' + procedure.duration + '</div>' +
                '</div>' +
                '<div class="detail-item">' +
                    '<div class="detail-label">Downtime</div>' +
                    '<div class="detail-value">' + procedure.downtime + '</div>' +
                '</div>' +
                '<div class="detail-item">' +
                    '<div class="detail-label">Lasts</div>' +
                    '<div class="detail-value">' + procedure.lasts + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="procedure-tags">' + tagsHTML + '</div>' +
        '</div>';
    }).join('');
}

// Initialize App
function init() {
    setupTabs();
    renderProcedures();
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
