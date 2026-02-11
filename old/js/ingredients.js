// js/ingredients.js — Ingredient analyzer + compatibility checker + OCR scanner

// ========== Ingredient Analyzer ==========
function lookupIngredient(rawName) {
    var query = rawName.trim();
    if (!query) return { found: false, query: rawName };

    var lower = query.toLowerCase();

    // Tier 1: Check aliases first
    if (INGREDIENT_ALIASES[lower]) {
        var canonical = INGREDIENT_ALIASES[lower];
        var entry = _ingredientMap[canonical.toLowerCase()];
        if (entry) return { found: true, data: entry };
    }

    // Tier 2: Exact name match (English)
    if (_ingredientMap[lower]) {
        return { found: true, data: _ingredientMap[lower] };
    }

    // Tier 2.5: Exact Korean name match
    if (_ingredientMapKr[lower]) {
        return { found: true, data: _ingredientMapKr[lower] };
    }

    // Tier 3: Substring match (DB name contained in query, or query contained in DB name)
    for (var i = 0; i < INGREDIENT_DB.length; i++) {
        var dbLower = INGREDIENT_DB[i].name.toLowerCase();
        if (lower.indexOf(dbLower) !== -1 || dbLower.indexOf(lower) !== -1) {
            return { found: true, data: INGREDIENT_DB[i] };
        }
        // Also check Korean name substring match
        if (INGREDIENT_DB[i].nameKr) {
            var krLower = INGREDIENT_DB[i].nameKr.toLowerCase();
            if (lower.indexOf(krLower) !== -1 || krLower.indexOf(lower) !== -1) {
                return { found: true, data: INGREDIENT_DB[i] };
            }
        }
    }

    return { found: false, query: query };
}

function analyzeIngredients() {
    var input = document.getElementById('analyzer-input').value.trim();
    if (!input) return;

    var names = input.split(/,(?![^()]*\))/).map(function(s) { return s.trim(); }).filter(Boolean);
    var results = names.map(function(n) { return lookupIngredient(n); });

    var recognized = results.filter(function(r) { return r.found; });
    var unknown = results.filter(function(r) { return !r.found; });

    var actives = recognized.filter(function(r) {
        return r.data.rating === 'great' && (r.data.category === 'active' || r.data.category === 'ferment' || r.data.category === 'soothing');
    });
    var warnings = recognized.filter(function(r) {
        return r.data.rating === 'poor' || r.data.rating === 'bad';
    });

    renderAnalysisResults(recognized, unknown, actives, warnings);
}

function renderAnalysisResults(recognized, unknown, actives, warnings) {
    var container = document.getElementById('analyzer-results');
    var html = '';

    // Summary stats
    html += '<div class="analyzer-summary">';
    html += '<div class="analyzer-stat"><span class="analyzer-stat-num">' + recognized.length + '</span><span class="analyzer-stat-label">Recognized</span></div>';
    html += '<div class="analyzer-stat"><span class="analyzer-stat-num">' + actives.length + '</span><span class="analyzer-stat-label">Key Actives</span></div>';
    html += '<div class="analyzer-stat"><span class="analyzer-stat-num">' + warnings.length + '</span><span class="analyzer-stat-label">Warnings</span></div>';
    html += '<div class="analyzer-stat"><span class="analyzer-stat-num">' + unknown.length + '</span><span class="analyzer-stat-label">Unknown</span></div>';
    html += '</div>';

    // Key Actives
    if (actives.length > 0) {
        html += '<div class="analyzer-section-title">Key Actives</div>';
        actives.forEach(function(r) {
            html += renderIngredientRow(r.data, 'analyzer-row-active');
        });
    }

    // Warnings
    if (warnings.length > 0) {
        html += '<div class="analyzer-section-title">Warnings</div>';
        warnings.forEach(function(r) {
            html += renderIngredientRow(r.data, 'analyzer-row-warn');
        });
    }

    // Full Breakdown
    if (recognized.length > 0) {
        html += '<div class="analyzer-section-title">Full Breakdown (' + recognized.length + ' ingredients)</div>';
        recognized.forEach(function(r) {
            html += renderIngredientRow(r.data, '');
        });
    }

    // Unknown
    if (unknown.length > 0) {
        html += '<div class="analyzer-section-title">Not Recognized (' + unknown.length + ')</div>';
        html += '<div class="analyzer-unknown-list">';
        unknown.forEach(function(r) {
            html += '<span class="analyzer-unknown-tag">' + r.query + '</span>';
        });
        html += '</div>';
    }

    container.innerHTML = html;
}

function renderIngredientRow(data, extraClass) {
    var meta = [];
    if (data.category) meta.push(data.category);
    if (data.comedogenic > 0) meta.push('comedogenic: ' + data.comedogenic + '/5');
    if (data.irritation > 0) meta.push('irritation: ' + data.irritation + '/5');

    var html = '<div class="analyzer-row ' + extraClass + '">';
    html += '<span class="analyzer-badge rating-' + data.rating + '">' + data.rating + '</span>';
    html += '<div class="analyzer-row-info">';
    html += '<div class="analyzer-row-name">' + data.name;
    if (data.nameKr) html += '<span class="analyzer-row-name-kr">' + data.nameKr + '</span>';
    html += '</div>';
    if (meta.length > 0) html += '<div class="analyzer-row-meta">' + meta.join(' · ') + '</div>';
    html += '<div class="analyzer-row-desc">' + data.description + '</div>';
    html += '</div></div>';
    return html;
}

function clearAnalyzer() {
    document.getElementById('analyzer-input').value = '';
    document.getElementById('analyzer-results').innerHTML = '';
}

// ========== Product Compatibility Checker ==========
function parseIngredientList(text) {
    if (!text.trim()) return [];
    return text.split(/,(?![^()]*\))/).map(function(s) { return s.trim(); }).filter(Boolean);
}

function findConflicts(listA, listB) {
    var conflicts = [];
    var allTextA = listA.join(' ').toLowerCase();
    var allTextB = listB.join(' ').toLowerCase();

    for (var i = 0; i < INGREDIENT_CONFLICTS.length; i++) {
        var rule = INGREDIENT_CONFLICTS[i];
        var matchA_inA = false, matchB_inB = false;
        var matchA_inB = false, matchB_inA = false;
        var matchedIngA = '', matchedIngB = '';

        // Check if A-keywords appear in product A and B-keywords in product B
        for (var j = 0; j < rule.keywordsA.length; j++) {
            if (allTextA.indexOf(rule.keywordsA[j]) !== -1) { matchA_inA = true; matchedIngA = rule.keywordsA[j]; break; }
        }
        for (var k = 0; k < rule.keywordsB.length; k++) {
            if (allTextB.indexOf(rule.keywordsB[k]) !== -1) { matchB_inB = true; matchedIngB = rule.keywordsB[k]; break; }
        }

        // Also check reverse direction (A-keywords in B, B-keywords in A)
        if (!matchA_inA || !matchB_inB) {
            for (var j2 = 0; j2 < rule.keywordsA.length; j2++) {
                if (allTextB.indexOf(rule.keywordsA[j2]) !== -1) { matchA_inB = true; matchedIngA = rule.keywordsA[j2]; break; }
            }
            for (var k2 = 0; k2 < rule.keywordsB.length; k2++) {
                if (allTextA.indexOf(rule.keywordsB[k2]) !== -1) { matchB_inA = true; matchedIngB = rule.keywordsB[k2]; break; }
            }
        }

        if ((matchA_inA && matchB_inB) || (matchA_inB && matchB_inA)) {
            conflicts.push({
                rule: rule,
                ingredientA: matchedIngA,
                ingredientB: matchedIngB
            });
        }
    }
    return conflicts;
}

function countStrongActives(listA, listB) {
    var combined = listA.concat(listB).join(' ').toLowerCase();
    var count = 0;
    var found = [];
    for (var i = 0; i < STRONG_ACTIVE_NAMES.length; i++) {
        if (combined.indexOf(STRONG_ACTIVE_NAMES[i]) !== -1) {
            count++;
            found.push(STRONG_ACTIVE_NAMES[i]);
        }
    }
    return { count: count, names: found };
}

function checkCompatibility() {
    var inputA = document.getElementById('compat-input-a').value.trim();
    var inputB = document.getElementById('compat-input-b').value.trim();
    if (!inputA || !inputB) return;

    var listA = parseIngredientList(inputA);
    var listB = parseIngredientList(inputB);
    var conflicts = findConflicts(listA, listB);
    var actives = countStrongActives(listA, listB);

    renderCompatibilityResults(conflicts, actives, listA.length, listB.length);
}

function renderCompatibilityResults(conflicts, actives, countA, countB) {
    var container = document.getElementById('compat-results');
    var html = '';

    // Summary
    var highCount = conflicts.filter(function(c) { return c.rule.severity === 'high'; }).length;
    var medCount = conflicts.filter(function(c) { return c.rule.severity === 'medium'; }).length;
    var lowCount = conflicts.filter(function(c) { return c.rule.severity === 'low'; }).length;

    var overallClass, overallEmoji, overallText, overallTextKr;
    if (highCount > 0) {
        overallClass = 'compat-summary-bad';
        overallEmoji = '⚠️';
        overallText = 'Conflicts detected — use caution!';
        overallTextKr = '충돌 감지 — 주의가 필요합니다!';
    } else if (medCount > 0) {
        overallClass = 'compat-summary-warn';
        overallEmoji = '⚡';
        overallText = 'Some ingredients may interact — check tips below.';
        overallTextKr = '일부 성분이 상호작용할 수 있습니다 — 아래 팁을 확인하세요.';
    } else {
        overallClass = 'compat-summary-good';
        overallEmoji = '✅';
        overallText = 'No major conflicts found — these products look compatible!';
        overallTextKr = '주요 충돌이 없습니다 — 이 제품들은 함께 사용 가능합니다!';
    }

    html += '<div class="compat-summary ' + overallClass + '">';
    html += '<span class="compat-summary-emoji">' + overallEmoji + '</span>';
    html += '<div><strong>' + overallText + '</strong><br><span class="compat-summary-kr">' + overallTextKr + '</span></div>';
    html += '</div>';

    // Stats bar
    html += '<div class="compat-stats">';
    html += '<span class="compat-stat">Product A: ' + countA + ' ingredients</span>';
    html += '<span class="compat-stat">Product B: ' + countB + ' ingredients</span>';
    if (highCount > 0) html += '<span class="compat-stat compat-stat-high">' + highCount + ' high risk</span>';
    if (medCount > 0) html += '<span class="compat-stat compat-stat-med">' + medCount + ' medium</span>';
    if (lowCount > 0) html += '<span class="compat-stat compat-stat-low">' + lowCount + ' low</span>';
    html += '</div>';

    // Active stacking warning
    if (actives.count >= 3) {
        html += '<div class="compat-active-warning">';
        html += '<strong>⚠️ Active Stacking Warning 활성 성분 과다 경고</strong>';
        html += '<p>' + actives.count + ' strong actives detected across both products: <em>' + actives.names.join(', ') + '</em>. ';
        html += 'Using too many actives at once can compromise your skin barrier.</p>';
        html += '<p class="compat-summary-kr">두 제품에 ' + actives.count + '개의 강력한 활성 성분이 포함되어 있습니다. 동시에 너무 많은 활성 성분을 사용하면 피부 장벽이 손상될 수 있습니다.</p>';
        html += '</div>';
    }

    // Conflict cards
    if (conflicts.length > 0) {
        html += '<div class="compat-conflicts">';
        for (var i = 0; i < conflicts.length; i++) {
            html += renderConflictCard(conflicts[i]);
        }
        html += '</div>';
    }

    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderConflictCard(conflict) {
    var rule = conflict.rule;
    var severityLabel = rule.severity === 'high' ? '🔴 High Risk' : rule.severity === 'medium' ? '🟡 Medium' : '🟢 Low';
    var severityClass = 'compat-card-' + rule.severity;

    var html = '<div class="compat-conflict-card ' + severityClass + '">';
    html += '<div class="compat-card-header">';
    html += '<span class="compat-severity">' + severityLabel + '</span>';
    html += '<strong>' + rule.nameA + ' + ' + rule.nameB + '</strong>';
    html += '</div>';
    html += '<p class="compat-card-msg">' + rule.message + '</p>';
    html += '<p class="compat-card-msg-kr">' + rule.messageKr + '</p>';
    html += '<p class="compat-card-tip">💡 <strong>Tip:</strong> ' + rule.tip + '</p>';
    html += '</div>';
    return html;
}

function clearCompatibility() {
    document.getElementById('compat-input-a').value = '';
    document.getElementById('compat-input-b').value = '';
    document.getElementById('compat-results').innerHTML = '';
}

// ========== Ingredient Label Scanner (inline in Analyzer) ==========
var iaStream = null;
var iaCapturedImageData = null;

function showIaError(msg) {
    var el = document.getElementById('ia-cam-error');
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(function() { el.classList.add('hidden'); }, 5000);
}

function stopIACamera() {
    if (iaStream) {
        var tracks = iaStream.getTracks();
        for (var i = 0; i < tracks.length; i++) { tracks[i].stop(); }
        iaStream = null;
    }
}

async function openIACamera() {
    var area = document.getElementById('ia-scan-area');
    area.classList.remove('hidden');
    document.getElementById('ia-camera-controls').classList.remove('hidden');
    document.getElementById('ia-preview-controls').classList.add('hidden');
    document.getElementById('ia-cam-error').classList.add('hidden');
    document.getElementById('ia-scan-guide').style.display = '';
    document.getElementById('ia-preview').style.display = 'none';

    var video = document.getElementById('ia-video');
    video.style.display = '';

    try {
        iaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } }
        });
        video.srcObject = iaStream;
        area.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {
        stopIACamera();
        area.classList.add('hidden');
        showIaError('Camera not available. Use Upload Label instead. 카메라를 사용할 수 없습니다.');
    }
}

function captureIAPhoto() {
    var video = document.getElementById('ia-video');
    var canvas = document.getElementById('ia-canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    stopIACamera();
    var dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    var preview = document.getElementById('ia-preview');
    preview.src = dataUrl;
    preview.style.display = '';
    video.style.display = 'none';
    document.getElementById('ia-scan-guide').style.display = 'none';
    document.getElementById('ia-camera-controls').classList.add('hidden');
    document.getElementById('ia-preview-controls').classList.remove('hidden');
    iaCapturedImageData = dataUrl;
}

function triggerIAUpload() {
    document.getElementById('ia-file-input').click();
}

function handleIAUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) return;

    var reader = new FileReader();
    reader.onload = function(e) {
        iaCapturedImageData = e.target.result;
        // Show preview inline
        var area = document.getElementById('ia-scan-area');
        area.classList.remove('hidden');
        var preview = document.getElementById('ia-preview');
        preview.src = iaCapturedImageData;
        preview.style.display = '';
        document.getElementById('ia-video').style.display = 'none';
        document.getElementById('ia-scan-guide').style.display = 'none';
        document.getElementById('ia-camera-controls').classList.add('hidden');
        document.getElementById('ia-preview-controls').classList.remove('hidden');
        area.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function retakeIAPhoto() {
    iaCapturedImageData = null;
    stopIACamera();
    document.getElementById('ia-scan-area').classList.add('hidden');
}

function closeIACamera() {
    stopIACamera();
    iaCapturedImageData = null;
    document.getElementById('ia-scan-area').classList.add('hidden');
}

function parseOCRText(text) {
    var normalized = text.replace(/[\r\n\t]+/g, ', ').replace(/\s{2,}/g, ' ');
    var parts = normalized.split(/[,;/·•|]+/);
    var names = [];
    for (var i = 0; i < parts.length; i++) {
        var cleaned = parts[i].trim()
            .replace(/^\d+[\.\)]\s*/, '')
            .replace(/\(\d+%?\)/g, '')
            .replace(/[^\w\s\-\(\)가-힣ㄱ-ㅎㅏ-ㅣéèêëàâäùûüôöîïçñ]/g, '')
            .trim();
        if (cleaned.length >= 3 && cleaned.length <= 80) {
            names.push(cleaned);
        }
    }
    return names;
}

async function scanIngredients() {
    if (!iaCapturedImageData) return;

    // Hide camera area, show progress inline
    document.getElementById('ia-scan-area').classList.add('hidden');
    var progressArea = document.getElementById('ia-scan-progress');
    var statusEl = document.getElementById('ia-scan-status');
    var progressFill = document.getElementById('ia-progress-fill');
    progressArea.classList.remove('hidden');
    statusEl.textContent = 'Initializing OCR...';
    progressFill.style.width = '10%';

    try {
        var result = await Tesseract.recognize(iaCapturedImageData, 'eng+kor', {
            logger: function(m) {
                if (m.status === 'recognizing text') {
                    var pct = Math.round(m.progress * 100);
                    progressFill.style.width = Math.max(10, pct) + '%';
                    statusEl.textContent = 'Scanning... ' + pct + '%';
                }
            }
        });

        progressArea.classList.add('hidden');
        var ocrText = result.data.text;

        if (!ocrText || ocrText.trim().length < 5) {
            showIaError('Could not read text. Try a clearer photo. 텍스트를 읽을 수 없습니다.');
            return;
        }

        // Parse and fill the textarea so user can review/edit
        var ingredientNames = parseOCRText(ocrText);
        var textarea = document.getElementById('analyzer-input');
        textarea.value = ingredientNames.join(', ');
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Auto-analyze
        iaCapturedImageData = null;
        analyzeIngredients();

    } catch (err) {
        progressArea.classList.add('hidden');
        showIaError('Scan failed: ' + err.message);
    }
}
