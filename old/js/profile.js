// js/profile.js — My Page tab UI: dashboard, skin diary, routine management

// ===== My Page State =====
var myPageSection = 'results'; // 'results' | 'diary' | 'routine'
var diaryEntries = [];
var routineData = { am: [], pm: [] };
var activeRoutineType = 'am';

var ROUTINE_CATEGORIES = [
    { key: 'oil_cleanser', label: 'Oil Cleanser', labelKr: '오일 클렌저', emoji: '🫒' },
    { key: 'water_cleanser', label: 'Water Cleanser', labelKr: '폼 클렌저', emoji: '🫧' },
    { key: 'exfoliator', label: 'Exfoliator', labelKr: '각질 제거제', emoji: '🧽' },
    { key: 'toner', label: 'Toner', labelKr: '토너', emoji: '💦' },
    { key: 'essence', label: 'Essence', labelKr: '에센스', emoji: '💎' },
    { key: 'serum', label: 'Serum', labelKr: '세럼', emoji: '🧪' },
    { key: 'sheet_mask', label: 'Sheet Mask', labelKr: '시트 마스크', emoji: '🎭' },
    { key: 'eye_cream', label: 'Eye Cream', labelKr: '아이크림', emoji: '👁️' },
    { key: 'moisturizer', label: 'Moisturizer', labelKr: '보습제', emoji: '🧴' },
    { key: 'sunscreen', label: 'Sunscreen', labelKr: '선크림', emoji: '☀️' },
    { key: 'sleeping_mask', label: 'Sleeping Mask', labelKr: '수면팩', emoji: '🌙' },
    { key: 'other', label: 'Other', labelKr: '기타', emoji: '✨' }
];

// ===== My Page Navigation =====

function switchMyPageSection(section) {
    myPageSection = section;
    var btns = document.querySelectorAll('.mypage-nav-btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
        if (btns[i].getAttribute('data-section') === section) {
            btns[i].classList.add('active');
        }
    }
    document.getElementById('mypage-results').classList.add('hidden');
    document.getElementById('mypage-diary').classList.add('hidden');
    document.getElementById('mypage-routine').classList.add('hidden');
    document.getElementById('mypage-' + section).classList.remove('hidden');

    if (section === 'results') renderMyResults();
    if (section === 'diary') renderDiary();
    if (section === 'routine') renderRoutine();
}

async function loadMyPage() {
    if (!currentUser) return;
    renderMyResults();
}

// ===== My Results Section =====

async function renderMyResults() {
    var container = document.getElementById('mypage-results-content');
    if (!container) return;
    container.innerHTML = '<p class="mypage-loading">Loading... 불러오는 중...</p>';

    var data = await loadAnalysisResults();
    if (!data) {
        container.innerHTML = '<div class="mypage-empty">' +
            '<p>No saved results yet. 저장된 결과가 없습니다.</p>' +
            '<p class="mypage-empty-hint">Use AI Beauty tools and save your results! AI 뷰티 분석 후 결과를 저장해보세요!</p>' +
            '</div>';
        return;
    }

    var html = '<div class="mypage-results-grid">';

    // Personal Color card
    if (data.pc_type) {
        var pcData = personalColorResults[data.pc_type];
        if (pcData) {
            html += '<div class="mypage-result-card">' +
                '<div class="mypage-card-icon">' + pcData.emoji + '</div>' +
                '<div class="mypage-card-title">Personal Color 퍼스널컬러</div>' +
                '<div class="mypage-card-value">' + pcData.english + '</div>' +
                '<div class="mypage-card-sub">' + pcData.korean + '</div>' +
                '<div class="mypage-card-meta">Confidence: ' + data.pc_confidence + '%</div>' +
                '</div>';
        }
    }

    // Face Shape card
    if (data.fs_shape) {
        var fsData = fsShapeData[data.fs_shape];
        if (fsData) {
            html += '<div class="mypage-result-card">' +
                '<div class="mypage-card-icon">' + fsData.emoji + '</div>' +
                '<div class="mypage-card-title">Face Shape 얼굴형</div>' +
                '<div class="mypage-card-value">' + fsData.name + '</div>' +
                '<div class="mypage-card-sub">' + fsData.korean + '</div>' +
                '<div class="mypage-card-meta">Confidence: ' + data.fs_confidence + '%</div>' +
                '</div>';
        }
    }

    // Skin Score card
    if (data.skin_overall_score) {
        var gradeText = '';
        if (data.skin_overall_score >= 80) gradeText = 'Excellent 우수';
        else if (data.skin_overall_score >= 60) gradeText = 'Good 양호';
        else if (data.skin_overall_score >= 40) gradeText = 'Fair 보통';
        else gradeText = 'Needs Care 관리필요';

        html += '<div class="mypage-result-card">' +
            '<div class="mypage-card-icon">🔬</div>' +
            '<div class="mypage-card-title">Skin Score 피부 점수</div>' +
            '<div class="mypage-card-value">' + data.skin_overall_score + ' / 100</div>' +
            '<div class="mypage-card-sub">' + gradeText + '</div>' +
            '</div>';
    }

    // Quiz Result card
    if (data.quiz_type) {
        var quizData = skinTypeResults[data.quiz_type];
        if (quizData) {
            html += '<div class="mypage-result-card">' +
                '<div class="mypage-card-icon">' + quizData.emoji + '</div>' +
                '<div class="mypage-card-title">Skin Type 피부타입</div>' +
                '<div class="mypage-card-value">' + quizData.english + '</div>' +
                '<div class="mypage-card-sub">' + quizData.korean + '</div>' +
                (data.quiz_season ? '<div class="mypage-card-meta">' + (data.quiz_season === 'summer' ? '☀️ Summer' : '❄️ Winter') + '</div>' : '') +
                '</div>';
        }
    }

    html += '</div>';

    // Check if there are any results
    if (!data.pc_type && !data.fs_shape && !data.skin_overall_score && !data.quiz_type) {
        html = '<div class="mypage-empty">' +
            '<p>No saved results yet. 저장된 결과가 없습니다.</p>' +
            '<p class="mypage-empty-hint">Use AI Beauty tools and save your results! AI 뷰티 분석 후 결과를 저장해보세요!</p>' +
            '</div>';
    }

    container.innerHTML = html;
}

// ===== Skin Diary Section =====

async function renderDiary() {
    var container = document.getElementById('mypage-diary-content');
    if (!container) return;
    container.innerHTML = '<p class="mypage-loading">Loading... 불러오는 중...</p>';

    diaryEntries = await loadDiaryEntries(14);

    var html = '';

    // Today's entry form
    html += buildDiaryForm();

    // Timeline
    html += '<div class="diary-timeline-section">';
    html += '<h4>Recent Entries 최근 일지</h4>';
    if (diaryEntries.length === 0) {
        html += '<p class="mypage-empty-hint">No entries yet. Start tracking today! 아직 일지가 없습니다. 오늘부터 시작해보세요!</p>';
    } else {
        html += '<div class="diary-timeline">';
        for (var i = 0; i < diaryEntries.length; i++) {
            html += buildDiaryCard(diaryEntries[i]);
        }
        html += '</div>';

        // Trend chart
        if (diaryEntries.length >= 2) {
            html += '<div class="diary-chart-section">';
            html += '<h4>Trend 트렌드</h4>';
            html += '<canvas id="diary-trend-canvas" width="600" height="200"></canvas>';
            html += '</div>';
        }
    }
    html += '</div>';

    container.innerHTML = html;

    // Draw chart if needed
    if (diaryEntries.length >= 2) {
        setTimeout(function() { drawDiaryTrendChart(); }, 100);
    }
}

function buildDiaryForm() {
    var today = new Date().toISOString().split('T')[0];
    var todayEntry = null;
    for (var i = 0; i < diaryEntries.length; i++) {
        if (diaryEntries[i].entry_date === today) {
            todayEntry = diaryEntries[i];
            break;
        }
    }

    var html = '<div class="diary-form">';
    html += '<h4>Today\'s Entry 오늘의 기록</h4>';
    html += '<p class="diary-form-date">' + today + '</p>';

    // Overall condition
    html += '<div class="diary-field">';
    html += '<label>Overall Condition 전체 컨디션</label>';
    html += '<div class="diary-emoji-btns">';
    var conditions = [
        { value: 'good', emoji: '😊', label: 'Good 좋음' },
        { value: 'normal', emoji: '😐', label: 'Normal 보통' },
        { value: 'bad', emoji: '😫', label: 'Bad 나쁨' }
    ];
    for (var c = 0; c < conditions.length; c++) {
        var sel = todayEntry && todayEntry.overall_condition === conditions[c].value ? ' diary-btn-selected' : '';
        html += '<button class="diary-emoji-btn' + sel + '" data-field="overall_condition" data-value="' + conditions[c].value + '" onclick="selectDiaryOption(this)">' +
            '<span class="diary-emoji">' + conditions[c].emoji + '</span>' +
            '<span class="diary-btn-label">' + conditions[c].label + '</span></button>';
    }
    html += '</div></div>';

    // Sleep hours
    html += '<div class="diary-field">';
    html += '<label>Sleep 수면 시간</label>';
    html += '<div class="diary-pill-btns">';
    var sleepOpts = ['<4h', '5-6h', '7-8h', '9h+'];
    for (var s = 0; s < sleepOpts.length; s++) {
        var sSel = todayEntry && todayEntry.sleep_hours === sleepOpts[s] ? ' diary-pill-selected' : '';
        html += '<button class="diary-pill-btn' + sSel + '" data-field="sleep_hours" data-value="' + sleepOpts[s] + '" onclick="selectDiaryOption(this)">' + sleepOpts[s] + '</button>';
    }
    html += '</div></div>';

    // Stress level
    html += '<div class="diary-field">';
    html += '<label>Stress 스트레스</label>';
    html += '<div class="diary-emoji-btns">';
    var stressOpts = [
        { value: 'low', emoji: '😊', label: 'Low 낮음' },
        { value: 'medium', emoji: '😐', label: 'Medium 보통' },
        { value: 'high', emoji: '😫', label: 'High 높음' }
    ];
    for (var st = 0; st < stressOpts.length; st++) {
        var stSel = todayEntry && todayEntry.stress_level === stressOpts[st].value ? ' diary-btn-selected' : '';
        html += '<button class="diary-emoji-btn' + stSel + '" data-field="stress_level" data-value="' + stressOpts[st].value + '" onclick="selectDiaryOption(this)">' +
            '<span class="diary-emoji">' + stressOpts[st].emoji + '</span>' +
            '<span class="diary-btn-label">' + stressOpts[st].label + '</span></button>';
    }
    html += '</div></div>';

    // Water intake
    html += '<div class="diary-field">';
    html += '<label>Water Intake 수분 섭취</label>';
    html += '<div class="diary-pill-btns">';
    var waterOpts = [
        { value: 'low', label: 'Low 적음' },
        { value: 'normal', label: 'Normal 보통' },
        { value: 'high', label: 'High 많음' }
    ];
    for (var w = 0; w < waterOpts.length; w++) {
        var wSel = todayEntry && todayEntry.water_intake === waterOpts[w].value ? ' diary-pill-selected' : '';
        html += '<button class="diary-pill-btn' + wSel + '" data-field="water_intake" data-value="' + waterOpts[w].value + '" onclick="selectDiaryOption(this)">' + waterOpts[w].label + '</button>';
    }
    html += '</div></div>';

    // Notes
    html += '<div class="diary-field">';
    html += '<label>Notes 메모</label>';
    html += '<textarea id="diary-notes" class="diary-textarea" placeholder="How is your skin today? 오늘 피부 상태는 어떤가요?" rows="3">' + (todayEntry && todayEntry.notes ? todayEntry.notes : '') + '</textarea>';
    html += '</div>';

    // Save button
    html += '<button class="primary-btn diary-save-btn" onclick="saveTodayDiary()">Save Entry 저장하기</button>';
    html += '</div>';

    return html;
}

function selectDiaryOption(btn) {
    var field = btn.getAttribute('data-field');
    var siblings = btn.parentElement.querySelectorAll('button');
    for (var i = 0; i < siblings.length; i++) {
        siblings[i].classList.remove('diary-btn-selected');
        siblings[i].classList.remove('diary-pill-selected');
    }
    var isEmoji = btn.classList.contains('diary-emoji-btn');
    btn.classList.add(isEmoji ? 'diary-btn-selected' : 'diary-pill-selected');
}

async function saveTodayDiary() {
    var today = new Date().toISOString().split('T')[0];
    var entry = { entry_date: today };

    // Get selected values
    var fields = ['overall_condition', 'sleep_hours', 'stress_level', 'water_intake'];
    for (var i = 0; i < fields.length; i++) {
        var selected = document.querySelector('.diary-form [data-field="' + fields[i] + '"].diary-btn-selected, .diary-form [data-field="' + fields[i] + '"].diary-pill-selected');
        if (selected) {
            entry[fields[i]] = selected.getAttribute('data-value');
        }
    }

    var notesEl = document.getElementById('diary-notes');
    if (notesEl && notesEl.value.trim()) {
        entry.notes = notesEl.value.trim();
    }

    await saveDiaryEntry(entry);
    renderDiary();
}

function buildDiaryCard(entry) {
    var condEmoji = { good: '😊', normal: '😐', bad: '😫' };
    var stressEmoji = { low: '😊', medium: '😐', high: '😫' };

    var html = '<div class="diary-card">';
    html += '<div class="diary-card-date">' + entry.entry_date + '</div>';
    html += '<div class="diary-card-row">';
    if (entry.overall_condition) {
        html += '<span class="diary-tag">' + (condEmoji[entry.overall_condition] || '') + ' ' + entry.overall_condition + '</span>';
    }
    if (entry.sleep_hours) {
        html += '<span class="diary-tag">💤 ' + entry.sleep_hours + '</span>';
    }
    if (entry.stress_level) {
        html += '<span class="diary-tag">' + (stressEmoji[entry.stress_level] || '') + ' stress</span>';
    }
    if (entry.water_intake) {
        html += '<span class="diary-tag">💧 ' + entry.water_intake + '</span>';
    }
    html += '</div>';

    if (entry.ai_overall_score) {
        html += '<div class="diary-card-ai">AI Score: ' + entry.ai_overall_score + '/100</div>';
    }

    if (entry.notes) {
        html += '<div class="diary-card-notes">' + entry.notes + '</div>';
    }

    html += '<button class="diary-delete-btn" onclick="confirmDeleteDiary(\'' + entry.id + '\')" title="Delete 삭제">&times;</button>';
    html += '</div>';
    return html;
}

async function confirmDeleteDiary(entryId) {
    if (confirm('Delete this entry? 이 일지를 삭제하시겠습니까?')) {
        await deleteDiaryEntry(entryId);
        renderDiary();
    }
}

function drawDiaryTrendChart() {
    var canvas = document.getElementById('diary-trend-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 200 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '200px';
    ctx.scale(dpr, dpr);

    var w = rect.width;
    var h = 200;
    var pad = { top: 20, right: 20, bottom: 30, left: 40 };

    // Sort entries by date ascending
    var sorted = diaryEntries.slice().sort(function(a, b) {
        return a.entry_date.localeCompare(b.entry_date);
    });

    // Map condition to numeric value
    var condMap = { good: 3, normal: 2, bad: 1 };
    var points = [];
    for (var i = 0; i < sorted.length; i++) {
        if (sorted[i].overall_condition) {
            points.push({
                date: sorted[i].entry_date.slice(5), // MM-DD
                value: condMap[sorted[i].overall_condition] || 2
            });
        }
    }

    if (points.length < 2) return;

    ctx.clearRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (var g = 1; g <= 3; g++) {
        var gy = pad.top + (h - pad.top - pad.bottom) * (1 - (g - 1) / 2);
        ctx.beginPath();
        ctx.moveTo(pad.left, gy);
        ctx.lineTo(w - pad.right, gy);
        ctx.stroke();
    }

    // Y axis labels
    ctx.fillStyle = '#888';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    var yLabels = ['😫', '😐', '😊'];
    for (var yl = 0; yl < yLabels.length; yl++) {
        var yy = pad.top + (h - pad.top - pad.bottom) * (1 - yl / 2);
        ctx.fillText(yLabels[yl], pad.left - 6, yy + 4);
    }

    // Draw line
    var plotW = w - pad.left - pad.right;
    var plotH = h - pad.top - pad.bottom;

    ctx.strokeStyle = '#F4A698';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    for (var p = 0; p < points.length; p++) {
        var px = pad.left + (p / (points.length - 1)) * plotW;
        var py = pad.top + plotH * (1 - (points[p].value - 1) / 2);
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw dots
    for (var d = 0; d < points.length; d++) {
        var dx = pad.left + (d / (points.length - 1)) * plotW;
        var dy = pad.top + plotH * (1 - (points[d].value - 1) / 2);
        ctx.beginPath();
        ctx.arc(dx, dy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#F4A698';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Date label
        ctx.fillStyle = '#888';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(points[d].date, dx, h - 8);
    }
}

// ===== Routine Section =====

async function renderRoutine() {
    var container = document.getElementById('mypage-routine-content');
    if (!container) return;
    container.innerHTML = '<p class="mypage-loading">Loading... 불러오는 중...</p>';

    var routines = await loadRoutines();
    routineData = { am: [], pm: [] };
    for (var i = 0; i < routines.length; i++) {
        if (routines[i].routine_type === 'am') routineData.am = routines[i].steps || [];
        if (routines[i].routine_type === 'pm') routineData.pm = routines[i].steps || [];
    }

    var html = '';

    // AM/PM toggle
    html += '<div class="routine-type-toggle">';
    html += '<button class="routine-toggle-btn' + (activeRoutineType === 'am' ? ' active' : '') + '" onclick="switchRoutineType(\'am\')">☀️ Morning AM</button>';
    html += '<button class="routine-toggle-btn' + (activeRoutineType === 'pm' ? ' active' : '') + '" onclick="switchRoutineType(\'pm\')">🌙 Evening PM</button>';
    html += '</div>';

    // Steps list
    html += '<div id="routine-steps-list">';
    html += buildRoutineStepsList(activeRoutineType);
    html += '</div>';

    // Add step
    html += '<div class="routine-add-section">';
    html += '<h4>Add Step 단계 추가</h4>';
    html += '<div class="routine-add-form">';
    html += '<select id="routine-category" class="routine-select">';
    for (var c = 0; c < ROUTINE_CATEGORIES.length; c++) {
        var cat = ROUTINE_CATEGORIES[c];
        html += '<option value="' + cat.key + '">' + cat.emoji + ' ' + cat.label + ' ' + cat.labelKr + '</option>';
    }
    html += '</select>';
    html += '<input type="text" id="routine-product-name" class="routine-input" placeholder="Product name 제품명">';
    html += '<input type="text" id="routine-product-brand" class="routine-input" placeholder="Brand 브랜드 (optional)">';
    html += '<button class="primary-btn routine-add-btn" onclick="addRoutineStep()">Add 추가</button>';
    html += '</div>';
    html += '</div>';

    container.innerHTML = html;
}

function switchRoutineType(type) {
    activeRoutineType = type;
    var btns = document.querySelectorAll('.routine-toggle-btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
    }
    var activeBtn = document.querySelector('.routine-toggle-btn:nth-child(' + (type === 'am' ? '1' : '2') + ')');
    if (activeBtn) activeBtn.classList.add('active');

    var list = document.getElementById('routine-steps-list');
    if (list) list.innerHTML = buildRoutineStepsList(type);
}

function buildRoutineStepsList(type) {
    var steps = routineData[type] || [];
    if (steps.length === 0) {
        return '<div class="mypage-empty-hint">No steps added yet. 아직 추가된 단계가 없습니다.</div>';
    }

    var html = '<div class="routine-steps">';
    for (var i = 0; i < steps.length; i++) {
        var step = steps[i];
        var cat = getCategoryByKey(step.category);
        html += '<div class="routine-step-item" data-index="' + i + '">';
        html += '<span class="routine-step-num">' + (i + 1) + '</span>';
        html += '<span class="routine-step-emoji">' + (cat ? cat.emoji : '✨') + '</span>';
        html += '<div class="routine-step-info">';
        html += '<span class="routine-step-name">' + (step.name || '') + '</span>';
        if (step.brand) html += '<span class="routine-step-brand">' + step.brand + '</span>';
        html += '<span class="routine-step-cat">' + (cat ? cat.label : step.category) + '</span>';
        html += '</div>';
        html += '<div class="routine-step-actions">';
        if (i > 0) html += '<button class="routine-action-btn" onclick="moveRoutineStep(' + i + ', -1)" title="Move up">↑</button>';
        if (i < steps.length - 1) html += '<button class="routine-action-btn" onclick="moveRoutineStep(' + i + ', 1)" title="Move down">↓</button>';
        html += '<button class="routine-action-btn routine-delete" onclick="removeRoutineStep(' + i + ')" title="Delete 삭제">&times;</button>';
        html += '</div>';
        html += '</div>';
    }
    html += '</div>';
    return html;
}

function getCategoryByKey(key) {
    for (var i = 0; i < ROUTINE_CATEGORIES.length; i++) {
        if (ROUTINE_CATEGORIES[i].key === key) return ROUTINE_CATEGORIES[i];
    }
    return null;
}

async function addRoutineStep() {
    var categoryEl = document.getElementById('routine-category');
    var nameEl = document.getElementById('routine-product-name');
    var brandEl = document.getElementById('routine-product-brand');

    var name = nameEl ? nameEl.value.trim() : '';
    if (!name) {
        showShareToast('Please enter a product name. 제품명을 입력해주세요.');
        return;
    }

    var step = {
        category: categoryEl ? categoryEl.value : 'other',
        name: name,
        brand: brandEl ? brandEl.value.trim() : ''
    };

    routineData[activeRoutineType].push(step);
    await saveRoutine(activeRoutineType, routineData[activeRoutineType]);

    if (nameEl) nameEl.value = '';
    if (brandEl) brandEl.value = '';

    var list = document.getElementById('routine-steps-list');
    if (list) list.innerHTML = buildRoutineStepsList(activeRoutineType);
}

async function removeRoutineStep(index) {
    routineData[activeRoutineType].splice(index, 1);
    await saveRoutine(activeRoutineType, routineData[activeRoutineType]);

    var list = document.getElementById('routine-steps-list');
    if (list) list.innerHTML = buildRoutineStepsList(activeRoutineType);
}

async function moveRoutineStep(index, direction) {
    var steps = routineData[activeRoutineType];
    var newIndex = index + direction;
    if (newIndex < 0 || newIndex >= steps.length) return;

    var temp = steps[index];
    steps[index] = steps[newIndex];
    steps[newIndex] = temp;

    await saveRoutine(activeRoutineType, steps);

    var list = document.getElementById('routine-steps-list');
    if (list) list.innerHTML = buildRoutineStepsList(activeRoutineType);
}

// ===== Delete All Data =====

function confirmDeleteAllData() {
    if (confirm('Are you sure you want to delete ALL your data? This cannot be undone.\n\n정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        deleteAllUserData();
    }
}
