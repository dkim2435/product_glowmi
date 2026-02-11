// js/quiz.js — Quiz logic

// App State
var currentQuestion = 0;
var scores = { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 };
var selectedSeason = null;
var quizQuestions = summerQuizQuestions;
var quizLastType = null;

// Season Selection
function selectSeason(season) {
    selectedSeason = season;
    quizQuestions = (season === 'summer') ? summerQuizQuestions : winterQuizQuestions;

    var icon = (season === 'summer') ? '☀️' : '❄️';
    var title = (season === 'summer') ? 'Summer Skin Quiz' : 'Winter Skin Quiz';
    var subtitle = (season === 'summer') ? '여름 피부 퀴즈' : '겨울 피부 퀴즈';

    document.getElementById('season-quiz-icon').textContent = icon;
    document.getElementById('season-quiz-title').textContent = title;
    document.getElementById('season-quiz-subtitle').textContent = subtitle;

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
    renderQuestion();
}

function renderQuestion() {
    var q = quizQuestions[currentQuestion];
    var progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-text').textContent = (currentQuestion + 1) + ' / ' + quizQuestions.length;

    var html = '<p class="question-text">' + q.english + '</p>' +
               '<p class="question-text-korean">' + q.korean + '</p>' +
               '<div class="options-list">';

    for (var i = 0; i < q.options.length; i++) {
        html += '<button class="option-btn" onclick="selectOption(' + i + ')">' +
                '<span class="english">' + q.options[i].english + '</span>' +
                '<span class="korean">' + q.options[i].korean + '</span></button>';
    }
    html += '</div>';
    document.getElementById('question-container').innerHTML = html;
}

function selectOption(idx) {
    var q = quizQuestions[currentQuestion];
    var s = q.options[idx].scores;
    scores.dry += s.dry;
    scores.oily += s.oily;
    scores.combination += s.combination;
    scores.sensitive += s.sensitive;
    scores.normal += s.normal;

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

    var maxType = 'normal';
    var maxScore = 0;
    for (var type in scores) {
        if (scores[type] > maxScore) {
            maxScore = scores[type];
            maxType = type;
        }
    }

    quizLastType = maxType;
    var r = skinTypeResults[maxType];
    var seasonBadge = (selectedSeason === 'summer') ? '☀️ Summer Result' : '❄️ Winter Result';
    var seasonTip = (selectedSeason === 'summer')
        ? '☀️ Summer tip: Use lightweight products and reapply sunscreen!'
        : '❄️ Winter tip: Layer hydrating products and use occlusive creams!';

    var tipsHtml = '';
    for (var i = 0; i < r.tips.length; i++) {
        tipsHtml += '<li>' + r.tips[i] + '</li>';
    }

    var productsHtml = '';
    for (var j = 0; j < r.products.length; j++) {
        var p = r.products[j];
        productsHtml += '<div class="product-item"><span class="product-emoji">' + p.emoji + '</span>' +
                        '<div class="product-info"><span class="product-name">' + p.name + '</span>' +
                        '<span class="product-brand">' + p.brand + '</span></div></div>';
    }

    document.getElementById('result-content').innerHTML =
        '<div class="result-emoji">' + r.emoji + '</div>' +
        '<h2 class="result-type">' + r.english + '</h2>' +
        '<p class="result-type-korean">' + r.korean + '</p>' +
        '<div class="season-badge">' + seasonBadge + '</div>' +
        '<div class="result-description"><h4>About Your Skin</h4><p>' + r.description + '</p>' +
        '<div class="season-tip">' + seasonTip + '</div>' +
        '<h4>Care Tips</h4><ul>' + tipsHtml + '</ul></div>' +
        '<div class="recommended-products"><h4>🛒 Recommended Products</h4>' + productsHtml + '</div>' +
        '<button class="save-result-btn' + (currentUser ? '' : ' hidden') + '" onclick="saveQuizResultClick()">💾 Save My Result 결과 저장하기</button>' +
        '<button class="secondary-btn" onclick="retakeQuiz()">Retake Quiz 다시하기</button>';

    document.getElementById('result-content').classList.add('animated');
    createConfetti();
}

function saveQuizResultClick() {
    if (quizLastType) saveQuizResult(quizLastType, selectedSeason, scores);
}

function retakeQuiz() {
    quizLastType = null;
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-season-select').classList.remove('hidden');
    document.getElementById('result-content').classList.remove('animated');
}
