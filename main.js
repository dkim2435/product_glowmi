const menuCard = document.getElementById('menu-card');
const cardImage = menuCard.querySelector('.card-image');
const cardTag = menuCard.querySelector('.card-tag');
const cardName = menuCard.querySelector('.card-name');
const cardDescription = menuCard.querySelector('.card-description');
const btnSkip = document.getElementById('btn-skip');
const btnRecipe = document.getElementById('btn-recipe');
const modal = document.getElementById('recipe-modal');
const modalClose = document.getElementById('modal-close');
const recipeEmoji = document.getElementById('recipe-emoji');
const recipeTitle = document.getElementById('recipe-title');
const recipeTag = document.getElementById('recipe-tag');
const ingredientsList = document.getElementById('ingredients');
const stepsList = document.getElementById('steps');
const tipEl = document.getElementById('tip');
const likeCount = document.getElementById('like-count');
const dislikeCount = document.getElementById('dislike-count');
const btnLike = document.getElementById('btn-like');
const btnDislike = document.getElementById('btn-dislike');

const koreanMenus = [
    {
        name: '김치찌개', emoji: '🍲', tag: '찌개',
        description: '돼지고기와 김치가 어우러진 얼큰한 찌개',
        ingredients: ['잘 익은 김치 300g', '돼지고기 앞다리살 200g', '두부 1/2모', '대파 1대', '청양고추 2개', '다진 마늘 1큰술'],
        steps: ['김치를 먹기 좋은 크기로 썰어주세요', '돼지고기를 한입 크기로 자릅니다', '냄비에 참기름을 두르고 돼지고기를 볶아주세요', '고기가 익으면 김치를 넣고 함께 볶습니다', '물 2컵을 넣고 끓여주세요', '두부와 대파, 고추를 넣고 5분 더 끓이면 완성!'],
        tip: '김치는 잘 익은 신김치를 사용해야 깊은 맛이 나요. 돼지고기 대신 참치캔을 넣어도 맛있어요!',
        likes: 342, dislikes: 12
    },
    {
        name: '된장찌개', emoji: '🍲', tag: '찌개',
        description: '구수한 된장과 두부, 채소가 들어간 건강식',
        ingredients: ['된장 2큰술', '두부 1/2모', '감자 1개', '호박 1/3개', '양파 1/2개', '청양고추 1개', '대파 1대'],
        steps: ['감자와 호박, 양파를 깍둑 썰어주세요', '냄비에 멸치육수 2컵을 넣고 끓입니다', '된장을 풀어 넣고 감자를 먼저 넣어주세요', '감자가 반쯤 익으면 나머지 재료를 넣습니다', '두부를 넣고 5분 더 끓이면 완성!'],
        tip: '멸치육수 대신 쌀뜨물을 사용하면 더 구수해요!',
        likes: 289, dislikes: 8
    },
    {
        name: '삼겹살', emoji: '🥩', tag: '고기',
        description: '두툼한 삼겹살을 구워 쌈에 싸먹는 맛',
        ingredients: ['삼겹살 500g', '상추', '깻잎', '쌈장', '마늘', '고추'],
        steps: ['삼겹살을 1.5cm 두께로 썰어주세요', '달군 팬에 삼겹살을 올려 구워줍니다', '앞뒤로 노릇하게 구워주세요', '상추와 깻잎에 쌈장, 마늘과 함께 싸먹으면 완성!'],
        tip: '고기를 구울 때 너무 자주 뒤집지 마세요. 육즙이 빠져나가요!',
        likes: 567, dislikes: 15
    },
    {
        name: '불고기', emoji: '🥩', tag: '고기',
        description: '달콤한 양념에 재운 소고기 구이',
        ingredients: ['소고기 불고기용 400g', '배 1/4개', '간장 4큰술', '설탕 2큰술', '다진 마늘 1큰술', '참기름 1큰술', '양파 1개'],
        steps: ['배를 갈아서 양념장을 만들어주세요', '간장, 설탕, 마늘, 참기름을 섞습니다', '소고기에 양념을 넣고 30분 재워주세요', '달군 팬에 양파와 함께 볶아주세요', '고기가 익으면 완성!'],
        tip: '배 대신 키위를 넣으면 고기가 더 부드러워져요!',
        likes: 423, dislikes: 11
    },
    {
        name: '제육볶음', emoji: '🍖', tag: '고기',
        description: '매콤달콤한 양념의 돼지고기 볶음',
        ingredients: ['돼지고기 앞다리살 400g', '고추장 2큰술', '고춧가루 1큰술', '간장 2큰술', '설탕 1큰술', '양파 1개', '대파 1대'],
        steps: ['돼지고기를 먹기 좋게 썰어주세요', '고추장, 고춧가루, 간장, 설탕으로 양념장을 만듭니다', '고기에 양념을 버무려 10분 재워주세요', '달군 팬에 기름을 두르고 고기를 볶습니다', '양파와 대파를 넣고 함께 볶으면 완성!'],
        tip: '양배추나 깻잎을 곁들여 먹으면 더 맛있어요!',
        likes: 398, dislikes: 14
    },
    {
        name: '비빔밥', emoji: '🍚', tag: '밥',
        description: '각종 나물과 고추장의 조화',
        ingredients: ['밥 1공기', '시금치 나물', '콩나물', '당근', '계란 1개', '고추장 2큰술', '참기름 1큰술'],
        steps: ['시금치, 콩나물, 당근을 각각 데쳐서 나물로 만들어주세요', '그릇에 밥을 담고 나물을 올립니다', '계란 프라이를 올려주세요', '고추장과 참기름을 넣고 비벼 드세요!'],
        tip: '돌솥에 하면 누룽지도 먹을 수 있어요!',
        likes: 445, dislikes: 9
    },
    {
        name: '떡볶이', emoji: '🍢', tag: '분식',
        description: '매콤달콤한 고추장 양념의 떡 요리',
        ingredients: ['떡볶이떡 300g', '어묵 2장', '고추장 3큰술', '고춧가루 1큰술', '설탕 2큰술', '간장 1큰술', '대파 1대'],
        steps: ['떡을 물에 불려주세요', '냄비에 물 2컵을 넣고 끓입니다', '고추장, 고춧가루, 설탕, 간장을 넣어 양념을 만들어요', '떡과 어묵을 넣고 끓여주세요', '양념이 졸아들면 대파를 넣고 완성!'],
        tip: '라면사리나 치즈를 추가하면 더 맛있어요!',
        likes: 521, dislikes: 18
    },
    {
        name: '칼국수', emoji: '🍜', tag: '면',
        description: '손으로 썬 면과 시원한 국물',
        ingredients: ['칼국수면 200g', '감자 1개', '호박 1/4개', '양파 1/2개', '멸치 육수 4컵', '다진 마늘 1큰술'],
        steps: ['멸치와 다시마로 육수를 내주세요', '감자, 호박, 양파를 썰어 육수에 넣습니다', '감자가 익으면 면을 넣어주세요', '면이 익으면 다진 마늘을 넣고 완성!'],
        tip: '바지락을 넣으면 시원한 맛이 배가 돼요!',
        likes: 312, dislikes: 7
    },
    {
        name: '삼계탕', emoji: '🍗', tag: '탕',
        description: '인삼과 찹쌀을 넣어 끓인 보양식',
        ingredients: ['영계 1마리', '찹쌀 1/2컵', '인삼 1뿌리', '대추 3개', '마늘 5쪽', '대파 1대'],
        steps: ['영계 뱃속을 깨끗이 씻어주세요', '찹쌀, 인삼, 대추, 마늘을 닭 뱃속에 넣습니다', '냄비에 닭을 넣고 물을 부어주세요', '1시간 정도 푹 끓여주세요', '소금, 후추로 간을 맞추면 완성!'],
        tip: '여름철 복날에 먹으면 기력 회복에 좋아요!',
        likes: 287, dislikes: 11
    },
    {
        name: '해물파전', emoji: '🥞', tag: '전',
        description: '해물과 파가 듬뿍 들어간 전',
        ingredients: ['부침가루 1컵', '쪽파 한 줌', '오징어 1/2마리', '새우 5마리', '홍합 약간', '계란 1개'],
        steps: ['부침가루에 물을 넣어 반죽을 만들어주세요', '오징어와 새우를 손질해서 썰어줍니다', '팬에 기름을 넉넉히 두르고 반죽을 올려요', '쪽파와 해물을 올리고 노릇하게 구워주세요', '뒤집어서 양면을 바삭하게 구우면 완성!'],
        tip: '막걸리와 함께 먹으면 꿀조합이에요!',
        likes: 378, dislikes: 13
    },
    {
        name: '감자탕', emoji: '🍲', tag: '탕',
        description: '돼지 등뼈와 감자를 푹 끓인 탕',
        ingredients: ['돼지 등뼈 1kg', '감자 3개', '우거지', '들깨가루 3큰술', '된장 1큰술', '고춧가루 2큰술'],
        steps: ['등뼈를 찬물에 담가 핏물을 빼주세요', '냄비에 등뼈와 물을 넣고 끓입니다', '된장, 고춧가루로 양념해주세요', '감자와 우거지를 넣고 푹 끓여주세요', '들깨가루를 넣고 한소끔 끓이면 완성!'],
        tip: '밥을 말아먹거나 볶음밥으로 마무리하면 최고!',
        likes: 356, dislikes: 10
    },
    {
        name: '닭갈비', emoji: '🍗', tag: '고기',
        description: '매콤한 양념의 닭고기와 채소 볶음',
        ingredients: ['닭다리살 500g', '고추장 3큰술', '고춧가루 2큰술', '간장 2큰술', '양배추', '고구마', '떡'],
        steps: ['닭고기를 한입 크기로 썰어주세요', '고추장, 고춧가루, 간장으로 양념장을 만듭니다', '닭고기에 양념을 버무려 30분 재워주세요', '팬에 양배추, 고구마를 깔고 닭을 올려요', '뚜껑을 덮고 익히면 완성!'],
        tip: '마지막에 치즈를 올려 녹여먹으면 환상!',
        likes: 489, dislikes: 16
    },
    {
        name: '순두부찌개', emoji: '🍲', tag: '찌개',
        description: '부드러운 순두부와 해물의 조화',
        ingredients: ['순두부 1봉', '바지락 100g', '새우 5마리', '계란 1개', '고춧가루 1큰술', '참기름'],
        steps: ['뚝배기에 참기름을 두르고 고춧가루를 볶아요', '멸치육수를 넣고 끓여주세요', '바지락과 새우를 넣습니다', '순두부를 넣고 끓여주세요', '계란을 톡 깨서 넣으면 완성!'],
        tip: '밥을 말아먹으면 든든한 한 끼가 돼요!',
        likes: 334, dislikes: 9
    },
    {
        name: '잡채', emoji: '🍝', tag: '반찬',
        description: '당면과 채소를 볶아낸 명절 음식',
        ingredients: ['당면 200g', '시금치', '당근', '양파', '표고버섯', '소고기 100g', '간장 3큰술'],
        steps: ['당면을 삶아서 준비해주세요', '채소들을 채썰어 각각 볶아줍니다', '소고기도 양념해서 볶아주세요', '당면에 간장, 설탕으로 간을 합니다', '모든 재료를 섞고 참기름을 넣어 버무리면 완성!'],
        tip: '식어도 맛있어서 도시락 반찬으로 최고예요!',
        likes: 267, dislikes: 6
    },
    {
        name: '육개장', emoji: '🍜', tag: '탕',
        description: '얼큰하고 칼칼한 소고기 국물',
        ingredients: ['소고기 양지 300g', '대파 2대', '고사리', '숙주', '고춧가루 3큰술', '다진 마늘 2큰술'],
        steps: ['양지를 삶아서 육수를 만들어주세요', '고기는 결대로 찢어줍니다', '대파, 고사리, 숙주를 준비해주세요', '육수에 고춧가루, 마늘로 양념합니다', '재료를 넣고 푹 끓이면 완성!'],
        tip: '밥을 말아먹으면 해장으로 최고!',
        likes: 298, dislikes: 8
    }
];

let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;

function getRatings(menuName) {
    const saved = localStorage.getItem(`rating_${menuName}`);
    if (saved) {
        return JSON.parse(saved);
    }
    const menu = koreanMenus.find(m => m.name === menuName);
    return { likes: menu.likes, dislikes: menu.dislikes, voted: null };
}

function saveRating(menuName, type) {
    const ratings = getRatings(menuName);
    if (ratings.voted) return;

    if (type === 'like') {
        ratings.likes++;
    } else {
        ratings.dislikes++;
    }
    ratings.voted = type;
    localStorage.setItem(`rating_${menuName}`, JSON.stringify(ratings));
    updateRatingDisplay(menuName);
}

function updateRatingDisplay(menuName) {
    const ratings = getRatings(menuName);
    likeCount.textContent = ratings.likes;
    dislikeCount.textContent = ratings.dislikes;

    btnLike.disabled = !!ratings.voted;
    btnDislike.disabled = !!ratings.voted;

    btnLike.classList.toggle('voted', ratings.voted === 'like');
    btnDislike.classList.toggle('voted', ratings.voted === 'dislike');
}

function displayMenu(index) {
    const menu = koreanMenus[index % koreanMenus.length];
    cardImage.setAttribute('data-emoji', menu.emoji);
    cardTag.textContent = menu.tag;
    cardName.textContent = menu.name;
    cardDescription.textContent = menu.description;
    menuCard.style.transform = '';
    menuCard.classList.remove('swipe-left', 'swipe-right');
}

function showRecipe() {
    const menu = koreanMenus[currentIndex % koreanMenus.length];
    recipeEmoji.textContent = menu.emoji;
    recipeTitle.textContent = menu.name;
    recipeTag.textContent = menu.tag;

    ingredientsList.innerHTML = menu.ingredients.map(i => `<li>${i}</li>`).join('');
    stepsList.innerHTML = menu.steps.map(s => `<li>${s}</li>`).join('');
    tipEl.textContent = menu.tip;

    updateRatingDisplay(menu.name);
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

function nextMenu() {
    menuCard.classList.add('swipe-left');
    setTimeout(() => {
        currentIndex++;
        displayMenu(currentIndex);
    }, 400);
}

function handleSwipe(direction) {
    if (direction === 'left') {
        nextMenu();
    } else if (direction === 'right') {
        menuCard.classList.add('swipe-right');
        setTimeout(() => {
            showRecipe();
            menuCard.classList.remove('swipe-right');
        }, 400);
    }
}

// Touch events
menuCard.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    menuCard.classList.add('swiping');
});

menuCard.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    const rotation = diffX * 0.1;
    menuCard.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
});

menuCard.addEventListener('touchend', () => {
    isDragging = false;
    menuCard.classList.remove('swiping');
    const diffX = currentX - startX;

    if (diffX < -100) {
        handleSwipe('left');
    } else if (diffX > 100) {
        handleSwipe('right');
    } else {
        menuCard.style.transform = '';
    }
    startX = 0;
    currentX = 0;
});

// Mouse events
menuCard.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    menuCard.classList.add('swiping');
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    const diffX = currentX - startX;
    const rotation = diffX * 0.1;
    menuCard.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
});

document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    menuCard.classList.remove('swiping');
    const diffX = currentX - startX;

    if (diffX < -100) {
        handleSwipe('left');
    } else if (diffX > 100) {
        handleSwipe('right');
    } else {
        menuCard.style.transform = '';
    }
    startX = 0;
    currentX = 0;
});

// Button events
btnSkip.addEventListener('click', nextMenu);
btnRecipe.addEventListener('click', showRecipe);
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

btnLike.addEventListener('click', () => {
    const menu = koreanMenus[currentIndex % koreanMenus.length];
    saveRating(menu.name, 'like');
});

btnDislike.addEventListener('click', () => {
    const menu = koreanMenus[currentIndex % koreanMenus.length];
    saveRating(menu.name, 'dislike');
});

// Initialize
displayMenu(currentIndex);
