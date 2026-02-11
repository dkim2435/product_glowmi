export const SKIN_CONCERNS = {
    redness: { name: 'Redness', nameKr: '\ubd89\uc740\uae30', emoji: '\ud83d\udd34', description: 'Redness or flushing detected in the skin.' },
    oiliness: { name: 'Oiliness', nameKr: '\uc720\ubd84', emoji: '\ud83d\udca7', description: 'Excess sebum or oily sheen detected.' },
    dryness: { name: 'Dryness', nameKr: '\uac74\uc870\ud568', emoji: '\ud83c\udfdc\ufe0f', description: 'Skin appears dry or lacking moisture.' },
    darkSpots: { name: 'Dark Spots', nameKr: '\uc0c9\uc18c\uce68\ucc29', emoji: '\ud83d\udfe4', description: 'Uneven pigmentation or dark patches detected.' },
    texture: { name: 'Texture', nameKr: '\ud53c\ubd80\uacb0', emoji: '\ud83d\udd0d', description: 'Uneven skin texture or roughness detected.' }
};

export const SKIN_RECOMMENDATIONS = {
    redness: {
        tips: [
            'Use a gentle, fragrance-free cleanser to avoid irritation.',
            'Apply centella asiatica (CICA) products to calm inflammation.',
            'Avoid hot water when washing your face \u2014 use lukewarm water.',
            'Consider a green-tinted color corrector for visible redness.'
        ],
        tipsKr: [
            '\uc790\uadf9\uc744 \ud53c\ud558\uae30 \uc704\ud574 \uc21c\ud55c \ubb34\ud5a5 \ud074\ub80c\uc800\ub97c \uc0ac\uc6a9\ud558\uc138\uc694.',
            '\uc2dc\uce74(\ubcd1\ud480) \uc81c\ud488\uc73c\ub85c \uc5fc\uc99d\uc744 \uc9c4\uc815\uc2dc\ud0a4\uc138\uc694.',
            '\uc138\uc548 \uc2dc \ub728\uac70\uc6b4 \ubb3c \ub300\uc2e0 \ubbf8\uc9c0\uadfc\ud55c \ubb3c\uc744 \uc0ac\uc6a9\ud558\uc138\uc694.',
            '\ub208\uc5d0 \ubcf4\uc774\ub294 \ubd89\uc740\uae30\uc5d0\ub294 \uadf8\ub9b0 \ucef4\ub7ec \ubcf4\uc815 \uc81c\ud488\uc744 \uace0\ub824\ud558\uc138\uc694.'
        ],
        ingredients: ['Centella Asiatica (CICA)', 'Niacinamide', 'Aloe Vera', 'Green Tea Extract', 'Panthenol (Vitamin B5)']
    },
    oiliness: {
        tips: [
            'Use a BHA (salicylic acid) toner to control excess oil.',
            'Choose lightweight, gel-based moisturizers instead of heavy creams.',
            'Do not skip moisturizer \u2014 dehydration can cause more oil production.',
            'Use oil-blotting sheets during the day for quick touch-ups.'
        ],
        tipsKr: [
            'BHA(\uc0b4\ub9ac\uc2e4\uc0b0) \ud1a0\ub108\ub85c \uacfc\ub3c4\ud55c \uc720\ubd84\uc744 \uc870\uc808\ud558\uc138\uc694.',
            '\ubb34\uac70\uc6b4 \ud06c\ub9bc \ub300\uc2e0 \uac00\ubcbc\uc6b4 \uc824 \ud0c0\uc785 \ubcf4\uc2b5\uc81c\ub97c \uc120\ud0dd\ud558\uc138\uc694.',
            '\ubcf4\uc2b5\uc744 \uac74\ub108\ub6f0\uc9c0 \ub9c8\uc138\uc694 \u2014 \ud0c8\uc218\uac00 \uc624\ud788\ub824 \uc720\ubd84 \ubd84\ube44\ub97c \uc99d\uac00\uc2dc\ud0b5\ub2c8\ub2e4.',
            '\ub0ae \ub3d9\uc548 \uc720\ubd84 \ud761\uc218 \uc2dc\ud2b8\ub85c \uac04\ub2e8\ud788 \uad00\ub9ac\ud558\uc138\uc694.'
        ],
        ingredients: ['Salicylic Acid (BHA)', 'Niacinamide', 'Green Tea Extract', 'Tea Tree Oil']
    },
    dryness: {
        tips: [
            'Layer hydrating products \u2014 toner, essence, then moisturizer.',
            'Use hyaluronic acid serums on damp skin for maximum absorption.',
            'Apply a sleeping mask 2-3 times a week for deep hydration.',
            'Avoid harsh cleansers that strip natural oils.'
        ],
        tipsKr: [
            '\ubcf4\uc2b5 \uc81c\ud488\uc744 \uaca9\uaca9\uc774 \ubc1c\ub77c\uc8fc\uc138\uc694 \u2014 \ud1a0\ub108, \uc5d0\uc13c\uc2a4, \ubcf4\uc2b5\uc81c \uc21c\uc11c\ub85c.',
            '\ud788\uc54c\ub8e8\ub860\uc0b0 \uc138\ub7fc\uc740 \ucd09\ucd09\ud55c \ud53c\ubd80 \uc704\uc5d0 \ubc1c\ub77c\uc57c \ud761\uc218\uac00 \uc798 \ub429\ub2c8\ub2e4.',
            '\uc8fc 2-3\ud68c \uc218\uba74 \ub9c8\uc2a4\ud06c\ub97c \uc0ac\uc6a9\ud574 \uae4a\uc740 \ubcf4\uc2b5\uc744 \ud558\uc138\uc694.',
            '\ucc9c\uc5f0 \uc720\ubd84\uc744 \ubc97\uae30\ub294 \uac15\ud55c \ud074\ub80c\uc800\ub294 \ud53c\ud558\uc138\uc694.'
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
            '\uc544\uce68\uc5d0 \ube44\ud0c0\ubbfcC \uc138\ub7fc\uc744 \ubc1c\ub77c \ubbf8\ubc31 \ud6a8\uacfc\ub97c \ub192\uc774\uc138\uc694.',
            '\ucd94\uac00 \uc0c9\uc18c\uce68\ucc29\uc744 \ubc29\uc9c0\ud558\uae30 \uc704\ud574 SPF 50+ \uc790\uc678\uc120 \ucc28\ub2e8\uc81c\ub97c \uc0ac\uc6a9\ud558\uc138\uc694.',
            '\ub098\uc774\uc544\uc2e0\uc544\ub9c8\uc774\ub4dc\ub85c \ud53c\ubd80\ud1a4\uc744 \uc810\ucc28 \uade0\uc77c\ud558\uac8c \ub9cc\ub4dc\uc138\uc694.',
            '\uc54c\ubd80\ud2f4\uc774\ub098 \uac10\ucd08 \ubfcc\ub9ac \ucd94\ucd9c\ubb3c\uc774 \ub4e0 \uc81c\ud488\uc744 \uace0\ub824\ud558\uc138\uc694.'
        ],
        ingredients: ['Vitamin C (Ascorbic Acid)', 'Niacinamide', 'Arbutin', 'Licorice Root Extract']
    },
    texture: {
        tips: [
            'Use a gentle AHA (glycolic/lactic acid) exfoliant 2-3 times a week.',
            'Apply retinol at night to promote cell turnover.',
            'Use a hydrating toner to plump and smooth skin surface.',
            'Do not over-exfoliate \u2014 give your skin time to recover.'
        ],
        tipsKr: [
            '\uc8fc 2-3\ud68c \uc21c\ud55c AHA(\uae00\ub9ac\ucf5c\uc0b0/\uc816\uc0b0) \uac01\uc9c8 \uc81c\uac70\uc81c\ub97c \uc0ac\uc6a9\ud558\uc138\uc694.',
            '\ubc24\uc5d0 \ub808\ud2f0\ub180\uc744 \ubc1c\ub77c \uc138\ud3ec \uc7ac\uc0dd\uc744 \ucd09\uc9c4\ud558\uc138\uc694.',
            '\ubcf4\uc2b5 \ud1a0\ub108\ub85c \ud53c\ubd80 \ud45c\uba74\uc744 \ub9e4\ub04c\ub7fd\uac8c \ub9cc\ub4dc\uc138\uc694.',
            '\uacfc\ub3c4\ud55c \uac01\uc9c8 \uc81c\uac70\ub294 \ud53c\ud558\uace0 \ud53c\ubd80 \ud68c\ubcf5 \uc2dc\uac04\uc744 \uc8fc\uc138\uc694.'
        ],
        ingredients: ['Glycolic Acid (AHA)', 'Retinol', 'Niacinamide', 'Hyaluronic Acid']
    }
};
