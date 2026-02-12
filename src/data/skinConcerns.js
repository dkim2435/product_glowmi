export const SKIN_CONCERNS = {
    redness: { name: 'Redness', nameKr: '붉은기', emoji: '🔴', description: 'Redness or flushing detected in the skin.', descriptionKr: '피부에 붉은기나 홍조가 감지되었습니다.' },
    oiliness: { name: 'Oiliness', nameKr: '유분', emoji: '💧', description: 'Excess sebum or oily sheen detected.', descriptionKr: '과도한 피지나 유분기가 감지되었습니다.' },
    dryness: { name: 'Dryness', nameKr: '건조함', emoji: '🏜️', description: 'Skin appears dry or lacking moisture.', descriptionKr: '피부가 건조하거나 수분이 부족해 보입니다.' },
    darkSpots: { name: 'Dark Spots', nameKr: '색소침착', emoji: '🟤', description: 'Uneven pigmentation or dark patches detected.', descriptionKr: '불균일한 색소침착이나 다크스팟이 감지되었습니다.' },
    texture: { name: 'Texture', nameKr: '피부결', emoji: '🔍', description: 'Uneven skin texture or roughness detected.', descriptionKr: '피부결이 고르지 않거나 거칠음이 감지되었습니다.' }
};

export const SKIN_RECOMMENDATIONS = {
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
            '보습 토너로 피부 표면을 매끈럽게 만드세요.',
            '과도한 각질 제거는 피하고 피부 회복 시간을 주세요.'
        ],
        ingredients: ['Glycolic Acid (AHA)', 'Retinol', 'Niacinamide', 'Hyaluronic Acid']
    }
};
