// js/ai-beauty.js — AI Beauty analysis (Personal Color, Face Shape, Skin Analyzer)

// ===== Common MediaPipe initialization =====

var fsFaceLandmarker = null;

async function waitForMediaPipe(maxWait) {
    var start = Date.now();
    while (!window.FaceLandmarker || !window.FilesetResolver) {
        if (Date.now() - start > maxWait) {
            throw new Error('MediaPipe failed to load. Please refresh and try again.');
        }
        await new Promise(function(r) { setTimeout(r, 200); });
    }
}

async function initFaceLandmarker() {
    if (fsFaceLandmarker) return fsFaceLandmarker;

    await waitForMediaPipe(10000);

    var vision = await window.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
    );

    // Try GPU first, fall back to CPU
    try {
        fsFaceLandmarker = await window.FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
                delegate: 'GPU'
            },
            runningMode: 'IMAGE',
            numFaces: 1
        });
    } catch (gpuErr) {
        console.warn('GPU delegate failed, falling back to CPU:', gpuErr);
        fsFaceLandmarker = await window.FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
                delegate: 'CPU'
            },
            runningMode: 'IMAGE',
            numFaces: 1
        });
    }
    return fsFaceLandmarker;
}

function dist(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function angleBetween(a, b, c) {
    var ab = { x: a.x - b.x, y: a.y - b.y };
    var cb = { x: c.x - b.x, y: c.y - b.y };
    var dot = ab.x * cb.x + ab.y * cb.y;
    var magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
    var magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
    var cosAngle = dot / (magAB * magCB);
    cosAngle = Math.max(-1, Math.min(1, cosAngle));
    return Math.acos(cosAngle) * (180 / Math.PI);
}

// ===== Personal Color Analysis =====

// Personal Color Analysis State
var pcStream = null;
var pcIsMirrored = false;
var pcCapturedImageData = null;
var pcFaceCropData = null;
var pcAnalysisResult = null;

function showPcScreen(screenId) {
    var screens = document.querySelectorAll('#pc-section .pc-screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.add('hidden');
    }
    document.getElementById(screenId).classList.remove('hidden');
}

function showPcError(msg) {
    var el = document.getElementById('pc-cam-error');
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(function() { el.classList.add('hidden'); }, 5000);
}

async function startPCCamera() {
    showPcScreen('pc-camera');
    document.getElementById('pc-camera-controls').classList.remove('hidden');
    document.getElementById('pc-preview-controls').classList.add('hidden');
    document.getElementById('pc-cam-error').classList.add('hidden');
    document.getElementById('pc-face-guide').style.display = '';
    document.getElementById('pc-preview').style.display = 'none';

    var video = document.getElementById('pc-video');
    video.style.display = '';
    pcIsMirrored = true;

    try {
        pcStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        video.srcObject = pcStream;
    } catch (e) {
        stopPCCamera();
        showPcScreen('pc-start');
        var startCard = document.querySelector('#pc-start .pc-start-card');
        var existingErr = startCard.querySelector('.fs-error');
        if (!existingErr) {
            var errP = document.createElement('p');
            errP.className = 'fs-error';
            errP.textContent = 'Camera not available. Please use image upload. 카메라를 사용할 수 없습니다. 이미지 업로드를 이용해주세요.';
            startCard.appendChild(errP);
            setTimeout(function() { errP.remove(); }, 5000);
        }
    }
}

function stopPCCamera() {
    if (pcStream) {
        var tracks = pcStream.getTracks();
        for (var i = 0; i < tracks.length; i++) {
            tracks[i].stop();
        }
        pcStream = null;
    }
}

function capturePCPhoto() {
    var video = document.getElementById('pc-video');
    var canvas = document.getElementById('pc-canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var ctx = canvas.getContext('2d');
    if (pcIsMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    stopPCCamera();
    var dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    var preview = document.getElementById('pc-preview');
    preview.src = dataUrl;
    preview.style.display = '';
    video.style.display = 'none';
    document.getElementById('pc-face-guide').style.display = 'none';
    document.getElementById('pc-camera-controls').classList.add('hidden');
    document.getElementById('pc-preview-controls').classList.remove('hidden');
    pcCapturedImageData = dataUrl;
}

function triggerPCUpload() {
    document.getElementById('pc-file-input').click();
}

function handlePCUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showPcError('Please upload an image file. 이미지 파일을 업로드해주세요.');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showPcError('File is too large (max 10MB). 파일이 너무 큽니다 (최대 10MB).');
        return;
    }

    pcIsMirrored = false;
    var reader = new FileReader();
    reader.onload = function(e) {
        pcCapturedImageData = e.target.result;
        showPcScreen('pc-camera');
        var preview = document.getElementById('pc-preview');
        preview.src = pcCapturedImageData;
        preview.style.display = '';
        document.getElementById('pc-video').style.display = 'none';
        document.getElementById('pc-face-guide').style.display = 'none';
        document.getElementById('pc-camera-controls').classList.add('hidden');
        document.getElementById('pc-preview-controls').classList.remove('hidden');
        document.getElementById('pc-cam-error').classList.add('hidden');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function retakePCPhoto() {
    pcCapturedImageData = null;
    pcFaceCropData = null;
    showPcScreen('pc-start');
    stopPCCamera();
}

function cancelPCCamera() {
    stopPCCamera();
    pcCapturedImageData = null;
    pcFaceCropData = null;
    showPcScreen('pc-start');
}

// Crop face from photo using MediaPipe landmarks (fallback: use original image)
async function cropFaceFromPhoto(imageDataUrl) {
    try {
        var landmarker = await initFaceLandmarker();
        var img = new Image();
        img.src = imageDataUrl;
        await new Promise(function(resolve, reject) {
            img.onload = resolve;
            img.onerror = reject;
        });
        var result = landmarker.detect(img);
        if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
            return imageDataUrl; // fallback
        }
        var lm = result.faceLandmarks[0];
        var minX = 1, minY = 1, maxX = 0, maxY = 0;
        for (var i = 0; i < lm.length; i++) {
            if (lm[i].x < minX) minX = lm[i].x;
            if (lm[i].y < minY) minY = lm[i].y;
            if (lm[i].x > maxX) maxX = lm[i].x;
            if (lm[i].y > maxY) maxY = lm[i].y;
        }
        // Add padding (30%)
        var w = maxX - minX, h = maxY - minY;
        var pad = Math.max(w, h) * 0.3;
        minX = Math.max(0, minX - pad);
        minY = Math.max(0, minY - pad);
        maxX = Math.min(1, maxX + pad);
        maxY = Math.min(1, maxY + pad);
        // Make square
        var cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
        var side = Math.max(maxX - minX, maxY - minY);
        var half = side / 2;
        var sx = Math.max(0, cx - half), sy = Math.max(0, cy - half);
        var ex = Math.min(1, cx + half), ey = Math.min(1, cy + half);
        // Draw cropped face
        var canvas = document.createElement('canvas');
        var cropSize = 300;
        canvas.width = cropSize;
        canvas.height = cropSize;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img,
            sx * img.naturalWidth, sy * img.naturalHeight,
            (ex - sx) * img.naturalWidth, (ey - sy) * img.naturalHeight,
            0, 0, cropSize, cropSize
        );
        return canvas.toDataURL('image/jpeg', 0.9);
    } catch (e) {
        console.warn('Face crop failed, using original image:', e);
        return imageDataUrl;
    }
}

// --- Skin Tone Analysis Functions ---

function sampleSkinRegion(ctx, landmark, imgW, imgH) {
    var px = Math.round(landmark.x * imgW);
    var py = Math.round(landmark.y * imgH);
    var half = 3; // 7x7 region
    var x0 = Math.max(0, px - half);
    var y0 = Math.max(0, py - half);
    var x1 = Math.min(imgW - 1, px + half);
    var y1 = Math.min(imgH - 1, py + half);
    var w = x1 - x0 + 1;
    var h = y1 - y0 + 1;
    if (w < 1 || h < 1) return null;
    var data = ctx.getImageData(x0, y0, w, h).data;
    var totalR = 0, totalG = 0, totalB = 0, count = 0;
    for (var i = 0; i < data.length; i += 4) {
        totalR += data[i];
        totalG += data[i + 1];
        totalB += data[i + 2];
        count++;
    }
    if (count === 0) return null;
    return { r: totalR / count, g: totalG / count, b: totalB / count };
}

function getMedianSkinColor(ctx, landmarks, imgW, imgH) {
    // 11 landmark indices: forehead, cheeks, nose, chin, jawline
    var indices = [10, 67, 297, 116, 345, 234, 454, 6, 152, 172, 397];
    var samples = [];
    for (var i = 0; i < indices.length; i++) {
        var lm = landmarks[indices[i]];
        if (lm) {
            var s = sampleSkinRegion(ctx, lm, imgW, imgH);
            if (s) samples.push(s);
        }
    }
    if (samples.length === 0) return null;
    // Sort by brightness
    samples.sort(function(a, b) {
        return (a.r + a.g + a.b) - (b.r + b.g + b.b);
    });
    // Trim top/bottom 20%
    var trimCount = Math.floor(samples.length * 0.2);
    var trimmed = samples.slice(trimCount, samples.length - trimCount);
    if (trimmed.length === 0) trimmed = samples;
    // Average
    var avgR = 0, avgG = 0, avgB = 0;
    for (var j = 0; j < trimmed.length; j++) {
        avgR += trimmed[j].r;
        avgG += trimmed[j].g;
        avgB += trimmed[j].b;
    }
    return {
        r: Math.round(avgR / trimmed.length),
        g: Math.round(avgG / trimmed.length),
        b: Math.round(avgB / trimmed.length)
    };
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function normalizeWhiteBalance(rgb) {
    var avg = (rgb.r + rgb.g + rgb.b) / 3;
    if (avg < 30 || avg > 240) return rgb;
    var factor = 128 / avg;
    // Gentle correction: blend 30% toward normalized
    var blendFactor = 0.3;
    return {
        r: Math.round(rgb.r + (rgb.r * factor - rgb.r) * blendFactor),
        g: Math.round(rgb.g + (rgb.g * factor - rgb.g) * blendFactor),
        b: Math.round(rgb.b + (rgb.b * factor - rgb.b) * blendFactor)
    };
}

function classifyUndertone(rgb, hsl) {
    // Positive = warm, Negative = cool, range -100 to +100
    var yellowIndex = (rgb.r - rgb.b) / 255;
    var pinkIndex = (rgb.r - rgb.g) / 255;
    var warmth = 0;
    // Yellow dominance indicates warmth
    warmth += yellowIndex * 120;
    // Pink dominance indicates coolness
    warmth -= pinkIndex * 40;
    // Hue analysis
    if (hsl.h >= 15 && hsl.h <= 45) warmth += 20;
    else if (hsl.h >= 0 && hsl.h < 15) warmth -= 15;
    else if (hsl.h > 340) warmth -= 10;
    // Clamp
    warmth = Math.max(-100, Math.min(100, warmth));
    return warmth;
}

function classifyDepth(hsl) {
    // Returns 0~100, higher = lighter
    return hsl.l;
}

function classifyClarity(hsl, rgb) {
    // Returns 0~100
    var chroma = (Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b)) / 255 * 100;
    return hsl.s * 0.6 + chroma * 0.4;
}

function classifyPersonalColor(warmth, depth, clarity) {
    // Scoring for each of 10 types
    var types = {
        springBright:  { undertone: 'warm', depthRange: [45, 70], clarityRange: [50, 100] },
        springLight:   { undertone: 'warm', depthRange: [60, 85], clarityRange: [25, 60] },
        summerBright:  { undertone: 'cool', depthRange: [45, 70], clarityRange: [50, 100] },
        summerLight:   { undertone: 'cool', depthRange: [60, 85], clarityRange: [25, 60] },
        summerMute:    { undertone: 'cool', depthRange: [35, 60], clarityRange: [0, 40] },
        fallMute:      { undertone: 'warm', depthRange: [35, 60], clarityRange: [0, 40] },
        fallDeep:      { undertone: 'warm', depthRange: [15, 45], clarityRange: [25, 60] },
        fallStrong:    { undertone: 'warm', depthRange: [25, 55], clarityRange: [50, 100] },
        winterDeep:    { undertone: 'cool', depthRange: [15, 45], clarityRange: [35, 70] },
        winterBright:  { undertone: 'cool', depthRange: [30, 60], clarityRange: [50, 100] }
    };

    var scores = {};
    var keys = Object.keys(types);
    var totalScore = 0;

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var t = types[key];
        var score = 0;

        // Undertone axis (0~40 pts)
        if (t.undertone === 'warm') {
            score += Math.max(0, warmth) * 0.4; // 0~40
        } else {
            score += Math.max(0, -warmth) * 0.4; // 0~40
        }

        // Depth axis (0~30 pts)
        var depthMid = (t.depthRange[0] + t.depthRange[1]) / 2;
        var depthSpan = (t.depthRange[1] - t.depthRange[0]) / 2;
        var depthDist = Math.abs(depth - depthMid);
        score += Math.max(0, 30 - (depthDist / depthSpan) * 30);

        // Clarity axis (0~30 pts)
        var clarityMid = (t.clarityRange[0] + t.clarityRange[1]) / 2;
        var claritySpan = (t.clarityRange[1] - t.clarityRange[0]) / 2;
        var clarityDist = Math.abs(clarity - clarityMid);
        score += Math.max(0, 30 - (clarityDist / claritySpan) * 30);

        scores[key] = score;
        totalScore += score;
    }

    // Find max
    var maxKey = keys[0];
    var maxScore = 0;
    for (var j = 0; j < keys.length; j++) {
        if (scores[keys[j]] > maxScore) {
            maxScore = scores[keys[j]];
            maxKey = keys[j];
        }
    }

    var confidence = totalScore > 0 ? Math.round((maxScore / totalScore) * 100 * 1.8) : 50;
    confidence = Math.min(confidence, 95);
    confidence = Math.max(confidence, 50);

    return { type: maxKey, confidence: confidence, scores: scores, warmth: warmth, depth: depth, clarity: clarity };
}

function analyzeSkinTone(ctx, landmarks, imgW, imgH) {
    var rawRgb = getMedianSkinColor(ctx, landmarks, imgW, imgH);
    if (!rawRgb) return null;
    var rgb = normalizeWhiteBalance(rawRgb);
    var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    var warmth = classifyUndertone(rgb, hsl);
    var depth = classifyDepth(hsl);
    var clarity = classifyClarity(hsl, rgb);
    var result = classifyPersonalColor(warmth, depth, clarity);
    result.skinRgb = rawRgb;
    return result;
}

// Start AI color analysis after photo is captured
async function startColorAnalysis() {
    document.getElementById('pc-preview-controls').classList.add('hidden');
    showPcScreen('pc-analyzing');

    try {
        // Load image
        var img = new Image();
        img.src = pcCapturedImageData;
        await new Promise(function(resolve, reject) {
            img.onload = resolve;
            img.onerror = reject;
        });

        // Init face landmarker
        var landmarker = await initFaceLandmarker();
        var result = landmarker.detect(img);

        if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
            showPcScreen('pc-camera');
            document.getElementById('pc-preview-controls').classList.remove('hidden');
            showPcError('No face detected. Please try again with a clearer photo. 얼굴이 감지되지 않았습니다. 더 선명한 사진으로 다시 시도해주세요.');
            return;
        }

        var landmarks = result.faceLandmarks[0];

        // Draw to canvas for pixel access
        var canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Analyze skin tone
        var analysis = analyzeSkinTone(ctx, landmarks, canvas.width, canvas.height);
        if (!analysis) {
            showPcScreen('pc-camera');
            document.getElementById('pc-preview-controls').classList.remove('hidden');
            showPcError('Could not analyze skin tone. Please try another photo. 피부톤 분석에 실패했습니다. 다른 사진으로 시도해주세요.');
            return;
        }

        // Crop face for result display
        pcFaceCropData = await cropFaceFromPhoto(pcCapturedImageData);
        pcAnalysisResult = analysis;

        // Brief delay for UX
        setTimeout(function() {
            showPCResult();
        }, 1500);

    } catch (e) {
        console.error('Color analysis failed:', e);
        showPcScreen('pc-camera');
        document.getElementById('pc-preview-controls').classList.remove('hidden');
        showPcError('Analysis failed. Please try again. 분석에 실패했습니다. 다시 시도해주세요.');
    }
}

function showPCResult() {
    showPcScreen('pc-result');

    var analysis = pcAnalysisResult;
    var typeKey = analysis.type;
    var r = personalColorResults[typeKey];

    var seasonColors = {
        Spring: '#FF7F50', Summer: '#B0E0E6', Fall: '#E2725B', Winter: '#4169E1'
    };
    var badgeColor = seasonColors[r.season] || '#888';

    // Confidence
    var confidenceHtml = '<div class="fs-confidence">Confidence ' + analysis.confidence + '%</div>';

    // Detected skin swatch
    var skinRgb = analysis.skinRgb;
    var skinHex = '#' +
        ('0' + skinRgb.r.toString(16)).slice(-2) +
        ('0' + skinRgb.g.toString(16)).slice(-2) +
        ('0' + skinRgb.b.toString(16)).slice(-2);
    var skinSwatchHtml = '<div class="pc-skin-swatch">' +
        '<div class="pc-skin-circle" style="background:' + skinHex + ';"></div>' +
        '<span>Detected Skin Tone &#47; 감지된 피부톤</span>' +
        '</div>';

    // 3 axis bars
    var warmthPct = (analysis.warmth + 100) / 200 * 100; // -100~100 → 0~100%
    var depthPct = analysis.depth; // 0~100 (higher=lighter)
    var clarityPct = analysis.clarity; // 0~100 (higher=brighter)

    var axisHtml = '<div class="pc-axis-section">' +
        '<div class="pc-axis-row"><span class="pc-axis-label">Cool</span>' +
        '<div class="pc-axis-bar"><div class="pc-axis-fill" style="width:' + warmthPct + '%;background:linear-gradient(90deg,#5B9BD5,#FF7F50);"></div></div>' +
        '<span class="pc-axis-label">Warm</span></div>' +
        '<div class="pc-axis-row"><span class="pc-axis-label">Deep</span>' +
        '<div class="pc-axis-bar"><div class="pc-axis-fill" style="width:' + depthPct + '%;background:linear-gradient(90deg,#4A4A4A,#FFEAA7);"></div></div>' +
        '<span class="pc-axis-label">Light</span></div>' +
        '<div class="pc-axis-row"><span class="pc-axis-label">Mute</span>' +
        '<div class="pc-axis-bar"><div class="pc-axis-fill" style="width:' + clarityPct + '%;background:linear-gradient(90deg,#B2BEB5,#FF69B4);"></div></div>' +
        '<span class="pc-axis-label">Bright</span></div>' +
        '</div>';

    // Best Colors
    var bestColorsHtml = '<div class="color-palette">';
    for (var i = 0; i < r.bestColors.length; i++) {
        var c = r.bestColors[i];
        bestColorsHtml += '<div class="color-swatch">' +
            '<div class="swatch-circle" style="background:' + c.hex + ';' + (c.hex === '#FFFFFF' ? 'border:2px solid #ddd;' : '') + '"></div>' +
            '<span class="swatch-name">' + c.name + '</span></div>';
    }
    bestColorsHtml += '</div>';

    // Worst Colors
    var worstColorsHtml = '<div class="worst-colors"><h4>Colors to Avoid 피해야 할 컬러</h4><div class="color-palette">';
    for (var j = 0; j < r.worstColors.length; j++) {
        var w = r.worstColors[j];
        worstColorsHtml += '<div class="color-swatch">' +
            '<div class="swatch-circle" style="background:' + w.hex + ';"></div>' +
            '<span class="swatch-name">' + w.name + '</span></div>';
    }
    worstColorsHtml += '</div></div>';

    // Tips
    var tipsHtml = '';
    for (var k = 0; k < r.tips.length; k++) {
        tipsHtml += '<li>' + r.tips[k] + '</li>';
    }

    // Makeup
    var makeupHtml = '<div class="makeup-guide"><h4>Makeup Guide 메이크업 가이드</h4>' +
        '<div class="makeup-season"><strong>Foundation 파운데이션</strong><p>' + r.makeup.foundation + '</p></div>' +
        '<div class="makeup-season"><strong>Lip 립</strong><p>' + r.makeup.lip + '</p></div>' +
        '<div class="makeup-season"><strong>Blush 블러셔</strong><p>' + r.makeup.blush + '</p></div>' +
        '<div class="makeup-season"><strong>Eye Shadow 아이섀도</strong><p>' + r.makeup.eye + '</p></div>' +
        '</div>';

    // Celebs
    var celebsHtml = '<div class="celeb-section"><h4>Celebrity References 참고 셀럽</h4>';
    for (var m = 0; m < r.celebs.length; m++) {
        celebsHtml += '<span class="celeb-item">' + r.celebs[m] + '</span>';
    }
    if (r.celebsKr) {
        for (var n = 0; n < r.celebsKr.length; n++) {
            celebsHtml += '<span class="celeb-item">' + r.celebsKr[n] + '</span>';
        }
    }
    celebsHtml += '</div>';

    // All 10 types reference grid
    var allTypesHtml = '<div class="pc-all-types"><h4>All 10 Types 전체 10가지 타입</h4><div class="fs-ref-grid">';
    var typeKeys = Object.keys(personalColorResults);
    for (var t = 0; t < typeKeys.length; t++) {
        var tk = typeKeys[t];
        var td = personalColorResults[tk];
        var isActive = tk === typeKey ? ' fs-ref-active' : '';
        allTypesHtml += '<div class="fs-ref-item' + isActive + '">' +
            '<span class="face-shape-icon">' + td.emoji + '</span>' +
            '<div><strong>' + td.english + ' ' + td.korean + '</strong>' +
            '<p>' + td.subtitle + ' / ' + td.subtitleKr + '</p></div></div>';
    }
    allTypesHtml += '</div></div>';

    document.getElementById('pc-result-content').innerHTML =
        '<div class="result-emoji">' + r.emoji + '</div>' +
        '<h2 class="result-type">' + r.english + '</h2>' +
        '<p class="result-type-korean">' + r.korean + '</p>' +
        '<div class="season-result-badge" style="background:' + badgeColor + ';">' + r.season + ' ' + r.subtitle + '</div>' +
        confidenceHtml +
        skinSwatchHtml +
        axisHtml +
        '<div class="result-description">' +
        '<h4>About Your Colors</h4>' +
        '<p>' + r.description + '</p>' +
        '<p class="korean">' + r.descriptionKr + '</p>' +
        '<h4>Best Colors 베스트 컬러</h4>' + bestColorsHtml +
        worstColorsHtml +
        '<h4>Styling Tips 스타일링 팁</h4><ul>' + tipsHtml + '</ul>' +
        makeupHtml +
        celebsHtml +
        '</div>' +
        allTypesHtml +
        buildShareButtons(r.emoji, r.english, r.korean) +
        '<button class="secondary-btn" onclick="retakePersonalColor()">Retake Test 다시하기</button>';

    document.getElementById('pc-result-content').classList.add('animated');
    createConfetti();
}

function retakePersonalColor() {
    document.getElementById('pc-result-content').classList.remove('animated');
    pcCapturedImageData = null;
    pcFaceCropData = null;
    pcAnalysisResult = null;
    showPcScreen('pc-start');
}

// ===== Face Shape Detector =====

var fsStream = null;
var fsIsMirrored = false;
var fsCapturedImageData = null;

function showFsScreen(screenId) {
    var screens = document.querySelectorAll('#fs-section .fs-screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.add('hidden');
    }
    document.getElementById(screenId).classList.remove('hidden');
}

function showFsError(msg) {
    var el = document.getElementById('fs-error');
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(function() { el.classList.add('hidden'); }, 5000);
}

async function startFaceCamera() {
    showFsScreen('fs-camera');
    document.getElementById('fs-camera-controls').classList.remove('hidden');
    document.getElementById('fs-preview-controls').classList.add('hidden');
    document.getElementById('fs-loading').classList.add('hidden');
    document.getElementById('fs-error').classList.add('hidden');
    document.getElementById('fs-face-guide').style.display = '';
    document.getElementById('fs-preview').style.display = 'none';

    var video = document.getElementById('fs-video');
    video.style.display = '';
    fsIsMirrored = true;

    try {
        fsStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        video.srcObject = fsStream;
    } catch (e) {
        stopFsCamera();
        showFsScreen('fs-start');
        showFsError('Camera access denied. Please use image upload instead. 카메라 접근이 거부되었습니다. 이미지 업로드를 이용해주세요.');
        // Show error on start screen too
        var startCard = document.querySelector('#fs-start .pc-start-card');
        var existingErr = startCard.querySelector('.fs-error');
        if (!existingErr) {
            var errP = document.createElement('p');
            errP.className = 'fs-error';
            errP.textContent = 'Camera not available. Please use image upload. 카메라를 사용할 수 없습니다. 이미지 업로드를 이용해주세요.';
            startCard.appendChild(errP);
            setTimeout(function() { errP.remove(); }, 5000);
        }
    }
}

function stopFsCamera() {
    if (fsStream) {
        var tracks = fsStream.getTracks();
        for (var i = 0; i < tracks.length; i++) {
            tracks[i].stop();
        }
        fsStream = null;
    }
}

function captureFacePhoto() {
    var video = document.getElementById('fs-video');
    var canvas = document.getElementById('fs-canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var ctx = canvas.getContext('2d');
    if (fsIsMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    stopFsCamera();
    var dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    var preview = document.getElementById('fs-preview');
    preview.src = dataUrl;
    preview.style.display = '';
    video.style.display = 'none';
    document.getElementById('fs-face-guide').style.display = 'none';
    document.getElementById('fs-camera-controls').classList.add('hidden');
    document.getElementById('fs-preview-controls').classList.remove('hidden');
    fsCapturedImageData = dataUrl;
}

function triggerFaceUpload() {
    document.getElementById('fs-file-input').click();
}

function handleFaceUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showFsError('Please upload an image file. 이미지 파일을 업로드해주세요.');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showFsError('File is too large (max 10MB). 파일이 너무 큽니다 (최대 10MB).');
        return;
    }

    fsIsMirrored = false;
    var reader = new FileReader();
    reader.onload = function(e) {
        fsCapturedImageData = e.target.result;
        showFsScreen('fs-camera');
        var preview = document.getElementById('fs-preview');
        preview.src = fsCapturedImageData;
        preview.style.display = '';
        document.getElementById('fs-video').style.display = 'none';
        document.getElementById('fs-face-guide').style.display = 'none';
        document.getElementById('fs-camera-controls').classList.add('hidden');
        document.getElementById('fs-preview-controls').classList.remove('hidden');
        document.getElementById('fs-loading').classList.add('hidden');
        document.getElementById('fs-error').classList.add('hidden');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function retakeFacePhoto() {
    fsCapturedImageData = null;
    showFsScreen('fs-start');
    stopFsCamera();
}

function cancelFaceDetection() {
    stopFsCamera();
    fsCapturedImageData = null;
    showFsScreen('fs-start');
}

async function analyzeFaceShape() {
    document.getElementById('fs-preview-controls').classList.add('hidden');
    document.getElementById('fs-loading').classList.remove('hidden');
    document.getElementById('fs-error').classList.add('hidden');

    try {
        var landmarker = await initFaceLandmarker();

        var img = new Image();
        img.src = fsCapturedImageData;
        await new Promise(function(resolve, reject) {
            img.onload = resolve;
            img.onerror = reject;
        });

        var result = landmarker.detect(img);

        if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
            document.getElementById('fs-loading').classList.add('hidden');
            document.getElementById('fs-preview-controls').classList.remove('hidden');
            showFsError('No face detected. Please try again with a clearer photo. 얼굴이 감지되지 않았습니다. 더 선명한 사진으로 다시 시도해주세요.');
            return;
        }

        var landmarks = result.faceLandmarks[0];
        var shape = classifyFaceShape(landmarks);
        showFsResult(shape);
    } catch (e) {
        document.getElementById('fs-loading').classList.add('hidden');
        document.getElementById('fs-preview-controls').classList.remove('hidden');
        console.error('Face analysis error:', e);
        var msg = (e.message && e.message.indexOf('MediaPipe') !== -1)
            ? 'AI model is loading. Please wait a moment and try again. AI 모델을 불러오는 중입니다. 잠시 후 다시 시도해주세요.'
            : 'Analysis failed. Please try again. 분석에 실패했습니다. 다시 시도해주세요.';
        showFsError(msg);
    }
}

function classifyFaceShape(landmarks) {
    // Key landmark indices (MediaPipe 468 points)
    // Forehead top: 10, Chin bottom: 152
    // Left face: 234, Right face: 454
    // Left forehead: 67, Right forehead: 297
    // Left jaw: 172, Right jaw: 397
    // Left cheek: 116, Right cheek: 345
    // Jaw angle left: 132, Jaw angle right: 361

    var p = landmarks;
    var faceHeight = dist(p[10], p[152]);
    var faceWidth = dist(p[234], p[454]);
    var foreheadWidth = dist(p[67], p[297]);
    var jawWidth = dist(p[172], p[397]);
    var cheekWidth = dist(p[116], p[345]);

    // Jaw angle (how angular the jaw is)
    var jawLeft = p[132];
    var jawRight = p[361];
    var chin = p[152];
    var jawAngleLeft = angleBetween(p[234], jawLeft, chin);
    var jawAngleRight = angleBetween(p[454], jawRight, chin);
    var avgJawAngle = (jawAngleLeft + jawAngleRight) / 2;

    // Ratios
    var lengthWidthRatio = faceHeight / faceWidth;
    var foreheadJawRatio = foreheadWidth / jawWidth;
    var cheekFaceRatio = cheekWidth / faceWidth;

    // Scoring system
    var scores = { oval: 0, round: 0, square: 0, diamond: 0, heart: 0, long: 0 };

    // Length/width ratio analysis
    if (lengthWidthRatio > 1.55) {
        scores.long += 35;
        scores.oval += 10;
    } else if (lengthWidthRatio > 1.35) {
        scores.oval += 30;
        scores.diamond += 15;
        scores.heart += 10;
    } else if (lengthWidthRatio > 1.15) {
        scores.oval += 15;
        scores.square += 20;
        scores.round += 15;
    } else {
        scores.round += 35;
        scores.square += 15;
    }

    // Forehead/jaw ratio analysis
    if (foreheadJawRatio > 1.25) {
        scores.heart += 30;
        scores.diamond += 10;
    } else if (foreheadJawRatio > 1.05) {
        scores.oval += 15;
        scores.heart += 15;
    } else if (foreheadJawRatio > 0.9) {
        scores.square += 20;
        scores.round += 15;
        scores.oval += 10;
    } else {
        scores.square += 15;
        scores.round += 10;
    }

    // Cheekbone prominence
    if (cheekFaceRatio > 0.95) {
        scores.diamond += 25;
        scores.round += 10;
    } else if (cheekFaceRatio > 0.85) {
        scores.oval += 15;
        scores.round += 10;
    } else {
        scores.long += 10;
        scores.square += 5;
    }

    // Jaw angle analysis
    if (avgJawAngle > 155) {
        scores.square += 25;
    } else if (avgJawAngle > 140) {
        scores.square += 15;
        scores.oval += 10;
    } else if (avgJawAngle > 120) {
        scores.oval += 15;
        scores.round += 10;
    } else {
        scores.heart += 15;
        scores.diamond += 10;
    }

    // Find the highest score
    var maxShape = 'oval';
    var maxScore = 0;
    var totalScore = 0;
    var keys = Object.keys(scores);
    for (var i = 0; i < keys.length; i++) {
        totalScore += scores[keys[i]];
        if (scores[keys[i]] > maxScore) {
            maxScore = scores[keys[i]];
            maxShape = keys[i];
        }
    }

    var confidence = Math.min(Math.round((maxScore / totalScore) * 100 * 1.5), 95);
    confidence = Math.max(confidence, 55);

    return { shape: maxShape, confidence: confidence, scores: scores };
}

function showFsResult(result) {
    var data = fsShapeData[result.shape];
    var tipsHtml = '';
    for (var i = 0; i < data.tips.length; i++) {
        tipsHtml += '<li>' + data.tips[i] + '</li>';
    }

    // Build all shapes reference grid
    var shapesRefHtml = '<div class="fs-ref-grid">';
    var shapeKeys = Object.keys(fsShapeData);
    for (var j = 0; j < shapeKeys.length; j++) {
        var s = fsShapeData[shapeKeys[j]];
        var isActive = shapeKeys[j] === result.shape ? ' fs-ref-active' : '';
        shapesRefHtml += '<div class="fs-ref-item' + isActive + '">' +
            '<span class="face-shape-icon">' + s.emoji + '</span>' +
            '<strong>' + s.name + ' ' + s.korean + '</strong>' +
            '<p>' + s.description + '</p></div>';
    }
    shapesRefHtml += '</div>';

    document.getElementById('fs-result-content').innerHTML =
        '<div class="result-emoji">' + data.emoji + '</div>' +
        '<h2 class="result-type">' + data.name + ' Face</h2>' +
        '<p class="result-type-korean">' + data.korean + '</p>' +
        '<div class="fs-confidence">Confidence 신뢰도: ' + result.confidence + '%</div>' +
        '<div class="result-description"><h4>About Your Face Shape</h4><p>' + data.description + '</p>' +
        '<h4>Styling Tips 스타일링 팁</h4><ul>' + tipsHtml + '</ul></div>' +
        '<div class="fs-ref-section"><h4>All Face Shapes 전체 얼굴형 가이드</h4>' + shapesRefHtml + '</div>' +
        buildShareButtons(data.emoji, data.name, data.korean) +
        '<div class="fs-result-buttons">' +
        '<button class="primary-btn" onclick="retryFaceShape()">🔄 Try Again 다시하기</button>' +
        '</div>';

    showFsScreen('fs-result');
    document.getElementById('fs-result-content').classList.add('animated');
    createConfetti();
}

function retryFaceShape() {
    fsCapturedImageData = null;
    document.getElementById('fs-result-content').classList.remove('animated');
    showFsScreen('fs-start');
}

// ===== Skin Condition Analyzer =====

var skinStream = null;
var skinIsMirrored = false;
var skinCapturedImageData = null;

function showSkinScreen(screenId) {
    var screens = document.querySelectorAll('#skin-section .skin-screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.add('hidden');
    }
    document.getElementById(screenId).classList.remove('hidden');
}

function showSkinError(msg) {
    var el = document.getElementById('skin-error');
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(function() { el.classList.add('hidden'); }, 5000);
}

function stopSkinCamera() {
    if (skinStream) {
        var tracks = skinStream.getTracks();
        for (var i = 0; i < tracks.length; i++) { tracks[i].stop(); }
        skinStream = null;
    }
}

async function startSkinCamera() {
    showSkinScreen('skin-camera');
    document.getElementById('skin-camera-controls').classList.remove('hidden');
    document.getElementById('skin-preview-controls').classList.add('hidden');
    document.getElementById('skin-loading').classList.add('hidden');
    document.getElementById('skin-error').classList.add('hidden');
    document.getElementById('skin-face-guide').style.display = '';
    document.getElementById('skin-preview').style.display = 'none';

    var video = document.getElementById('skin-video');
    video.style.display = '';
    skinIsMirrored = true;

    try {
        skinStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        video.srcObject = skinStream;
    } catch (e) {
        stopSkinCamera();
        showSkinScreen('skin-start');
        showSkinError('Camera access denied. Please use image upload instead. 카메라 접근이 거부되었습니다.');
    }
}

function captureSkinPhoto() {
    var video = document.getElementById('skin-video');
    var canvas = document.getElementById('skin-canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var ctx = canvas.getContext('2d');
    if (skinIsMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    stopSkinCamera();
    var dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    var preview = document.getElementById('skin-preview');
    preview.src = dataUrl;
    preview.style.display = '';
    video.style.display = 'none';
    document.getElementById('skin-face-guide').style.display = 'none';
    document.getElementById('skin-camera-controls').classList.add('hidden');
    document.getElementById('skin-preview-controls').classList.remove('hidden');
    skinCapturedImageData = dataUrl;
}

function triggerSkinUpload() {
    document.getElementById('skin-file-input').click();
}

function handleSkinUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showSkinError('Please upload an image file. 이미지 파일을 업로드해주세요.');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showSkinError('File is too large (max 10MB). 파일이 너무 큽니다 (최대 10MB).');
        return;
    }

    skinIsMirrored = false;
    var reader = new FileReader();
    reader.onload = function(e) {
        skinCapturedImageData = e.target.result;
        showSkinScreen('skin-camera');
        var preview = document.getElementById('skin-preview');
        preview.src = skinCapturedImageData;
        preview.style.display = '';
        document.getElementById('skin-video').style.display = 'none';
        document.getElementById('skin-face-guide').style.display = 'none';
        document.getElementById('skin-camera-controls').classList.add('hidden');
        document.getElementById('skin-preview-controls').classList.remove('hidden');
        document.getElementById('skin-loading').classList.add('hidden');
        document.getElementById('skin-error').classList.add('hidden');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function retakeSkinPhoto() {
    skinCapturedImageData = null;
    showSkinScreen('skin-start');
    stopSkinCamera();
}

function cancelSkinCamera() {
    stopSkinCamera();
    skinCapturedImageData = null;
    showSkinScreen('skin-start');
}

async function analyzeSkinCondition() {
    document.getElementById('skin-preview-controls').classList.add('hidden');
    document.getElementById('skin-loading').classList.remove('hidden');
    document.getElementById('skin-error').classList.add('hidden');

    try {
        // Use face landmarker to detect face region
        var landmarker = await initFaceLandmarker();

        var img = new Image();
        img.src = skinCapturedImageData;
        await new Promise(function(resolve, reject) {
            img.onload = resolve;
            img.onerror = reject;
        });

        var result = landmarker.detect(img);

        if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
            document.getElementById('skin-loading').classList.add('hidden');
            document.getElementById('skin-preview-controls').classList.remove('hidden');
            showSkinError('No face detected. Please try again with a clearer photo. 얼굴이 감지되지 않았습니다.');
            return;
        }

        var landmarks = result.faceLandmarks[0];

        // Draw image on a temporary canvas for pixel analysis
        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        var ctx = tempCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var scores = analyzeSkinPixels(ctx, landmarks, img.width, img.height);
        showSkinResult(scores);

    } catch (e) {
        document.getElementById('skin-loading').classList.add('hidden');
        document.getElementById('skin-preview-controls').classList.remove('hidden');
        console.error('Skin analysis error:', e);
        var msg = (e.message && e.message.indexOf('MediaPipe') !== -1)
            ? 'AI model is loading. Please wait and try again. AI 모델을 불러오는 중입니다.'
            : 'Analysis failed. Please try again. 분석에 실패했습니다.';
        showSkinError(msg);
    }
}

function analyzeSkinPixels(ctx, landmarks, imgW, imgH) {
    // Get face bounding box from landmarks
    var minX = 1, maxX = 0, minY = 1, maxY = 0;
    for (var i = 0; i < landmarks.length; i++) {
        if (landmarks[i].x < minX) minX = landmarks[i].x;
        if (landmarks[i].x > maxX) maxX = landmarks[i].x;
        if (landmarks[i].y < minY) minY = landmarks[i].y;
        if (landmarks[i].y > maxY) maxY = landmarks[i].y;
    }

    // Convert normalized coords to pixel coords with padding
    var pad = 0.02;
    var x1 = Math.max(0, Math.floor((minX - pad) * imgW));
    var y1 = Math.max(0, Math.floor((minY - pad) * imgH));
    var x2 = Math.min(imgW, Math.ceil((maxX + pad) * imgW));
    var y2 = Math.min(imgH, Math.ceil((maxY + pad) * imgH));
    var w = x2 - x1;
    var h = y2 - y1;

    if (w < 10 || h < 10) {
        return { redness: 30, oiliness: 25, dryness: 35, darkSpots: 20, texture: 30 };
    }

    var imageData = ctx.getImageData(x1, y1, w, h);
    var pixels = imageData.data;
    var totalPixels = w * h;

    // Analyze pixel data
    var totalR = 0, totalG = 0, totalB = 0;
    var highRedCount = 0;
    var brightCount = 0;
    var darkCount = 0;
    var varianceSum = 0;
    var luminanceValues = [];

    for (var p = 0; p < pixels.length; p += 4) {
        var r = pixels[p];
        var g = pixels[p + 1];
        var b = pixels[p + 2];

        totalR += r;
        totalG += g;
        totalB += b;

        var luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        luminanceValues.push(luminance);

        // Redness: R channel dominance
        if (r > g + 30 && r > b + 30 && r > 120) highRedCount++;

        // Brightness (oiliness indicator — shiny areas)
        if (luminance > 200) brightCount++;

        // Dark areas (dark spots)
        if (luminance < 80) darkCount++;
    }

    var avgR = totalR / totalPixels;
    var avgG = totalG / totalPixels;
    var avgB = totalB / totalPixels;
    var avgLum = luminanceValues.reduce(function(a, b) { return a + b; }, 0) / totalPixels;

    // Texture: variance of luminance in a grid (roughness indicator)
    var gridSize = 8;
    var blockW = Math.floor(w / gridSize);
    var blockH = Math.floor(h / gridSize);
    var blockAverages = [];

    if (blockW > 0 && blockH > 0) {
        for (var gy = 0; gy < gridSize; gy++) {
            for (var gx = 0; gx < gridSize; gx++) {
                var sum = 0;
                var count = 0;
                for (var by = 0; by < blockH; by++) {
                    for (var bx = 0; bx < blockW; bx++) {
                        var idx = ((gy * blockH + by) * w + (gx * blockW + bx));
                        if (idx < luminanceValues.length) {
                            sum += luminanceValues[idx];
                            count++;
                        }
                    }
                }
                if (count > 0) blockAverages.push(sum / count);
            }
        }

        if (blockAverages.length > 1) {
            var blockMean = blockAverages.reduce(function(a, b) { return a + b; }, 0) / blockAverages.length;
            for (var v = 0; v < blockAverages.length; v++) {
                varianceSum += Math.pow(blockAverages[v] - blockMean, 2);
            }
            varianceSum = Math.sqrt(varianceSum / blockAverages.length);
        }
    }

    // Compute scores (0-100, higher = more concern)
    var rednessRatio = highRedCount / totalPixels;
    var rednessScore = Math.min(100, Math.round(rednessRatio * 500 + (avgR - avgG) * 1.5));
    rednessScore = Math.max(5, Math.min(95, rednessScore));

    var brightnessRatio = brightCount / totalPixels;
    var oilinessScore = Math.min(100, Math.round(brightnessRatio * 400 + (avgLum > 160 ? (avgLum - 160) * 0.8 : 0)));
    oilinessScore = Math.max(5, Math.min(95, oilinessScore));

    var drynessScore = Math.max(5, Math.min(95, Math.round(100 - oilinessScore * 0.5 - (avgLum > 130 ? 20 : 0) + varianceSum * 0.5)));

    var darkRatio = darkCount / totalPixels;
    var darkSpotsScore = Math.min(100, Math.round(darkRatio * 600 + Math.abs(avgR - avgG) * 0.5));
    darkSpotsScore = Math.max(5, Math.min(95, darkSpotsScore));

    var textureScore = Math.min(100, Math.round(varianceSum * 3));
    textureScore = Math.max(5, Math.min(95, textureScore));

    return {
        redness: rednessScore,
        oiliness: oilinessScore,
        dryness: drynessScore,
        darkSpots: darkSpotsScore,
        texture: textureScore
    };
}

function showSkinResult(scores) {
    // Compute overall skin score (inverse of average concern)
    var avgConcern = (scores.redness + scores.oiliness + scores.dryness + scores.darkSpots + scores.texture) / 5;
    var overallScore = Math.round(100 - avgConcern * 0.6);
    overallScore = Math.max(10, Math.min(95, overallScore));

    var grade, gradeClass;
    if (overallScore >= 80) { grade = 'Excellent 우수'; gradeClass = 'skin-grade-excellent'; }
    else if (overallScore >= 60) { grade = 'Good 양호'; gradeClass = 'skin-grade-good'; }
    else if (overallScore >= 40) { grade = 'Fair 보통'; gradeClass = 'skin-grade-fair'; }
    else { grade = 'Needs Care 관리필요'; gradeClass = 'skin-grade-care'; }

    // Find top 2 concerns
    var concernKeys = Object.keys(scores);
    concernKeys.sort(function(a, b) { return scores[b] - scores[a]; });
    var topConcerns = concernKeys.slice(0, 2);

    // Build HTML
    var html = '';

    // Overall score
    html += '<div class="skin-overall">';
    html += '<div class="skin-score-circle">';
    html += '<span class="skin-score-number">' + overallScore + '</span>';
    html += '<span class="skin-score-label">/ 100</span>';
    html += '</div>';
    html += '<div class="skin-grade ' + gradeClass + '">' + grade + '</div>';
    html += '<p class="skin-overall-desc">Your overall skin health score based on AI pixel analysis.</p>';
    html += '<p class="skin-overall-desc-kr">AI 픽셀 분석 기반 전체 피부 건강 점수입니다.</p>';
    html += '</div>';

    // Score bars
    html += '<div class="skin-scores">';
    html += '<h4>Skin Concern Scores 피부 고민 점수</h4>';
    for (var i = 0; i < concernKeys.length; i++) {
        var key = concernKeys[i];
        var concern = SKIN_CONCERNS[key];
        var score = scores[key];
        var barClass = score >= 60 ? 'skin-bar-high' : score >= 35 ? 'skin-bar-med' : 'skin-bar-low';
        html += '<div class="skin-score-row">';
        html += '<div class="skin-score-label-row"><span>' + concern.emoji + ' ' + concern.name + ' <span class="skin-score-kr">' + concern.nameKr + '</span></span><span class="skin-score-value">' + score + '</span></div>';
        html += '<div class="skin-bar-track"><div class="skin-bar-fill ' + barClass + '" style="width:' + score + '%"></div></div>';
        html += '</div>';
    }
    html += '</div>';

    // Top concerns with recommendations
    html += '<div class="skin-recommendations">';
    html += '<h4>Personalized Recommendations 맞춤 추천</h4>';
    for (var j = 0; j < topConcerns.length; j++) {
        var cKey = topConcerns[j];
        var cData = SKIN_CONCERNS[cKey];
        var rec = SKIN_RECOMMENDATIONS[cKey];

        html += '<div class="skin-rec-card">';
        html += '<div class="skin-rec-header">' + cData.emoji + ' <strong>' + cData.name + ' ' + cData.nameKr + '</strong> — Score: ' + scores[cKey] + '</div>';
        html += '<p class="skin-rec-desc">' + cData.description + '</p>';

        // Tips
        html += '<div class="skin-rec-tips"><strong>Tips 팁:</strong><ul>';
        for (var t = 0; t < rec.tips.length; t++) {
            html += '<li>' + rec.tips[t] + '<br><span class="skin-tip-kr">' + rec.tipsKr[t] + '</span></li>';
        }
        html += '</ul></div>';

        // Recommended ingredients
        html += '<div class="skin-rec-ingredients"><strong>Key Ingredients 핵심 성분:</strong><div class="skin-ingredient-tags">';
        for (var k = 0; k < rec.ingredients.length; k++) {
            var lookup = lookupIngredient(rec.ingredients[k]);
            var tagClass = lookup.found ? 'skin-ing-tag-found' : 'skin-ing-tag';
            html += '<span class="' + tagClass + '">' + rec.ingredients[k] + '</span>';
        }
        html += '</div></div>';

        html += '</div>';
    }
    html += '</div>';

    // Share buttons
    var skinShareSummary = 'Skin Score ' + overallScore + '/100 (' + grade + ')';
    html += buildShareButtons('🔬', skinShareSummary, 'AI 피부 분석 결과');

    // Retry button
    html += '<div class="fs-result-buttons">';
    html += '<button class="primary-btn" onclick="retrySkinAnalysis()">🔄 Try Again 다시하기</button>';
    html += '</div>';

    document.getElementById('skin-result-content').innerHTML = html;
    showSkinScreen('skin-result');
    document.getElementById('skin-result-content').classList.add('animated');
    createConfetti();
}

function retrySkinAnalysis() {
    skinCapturedImageData = null;
    document.getElementById('skin-result-content').classList.remove('animated');
    showSkinScreen('skin-start');
}
