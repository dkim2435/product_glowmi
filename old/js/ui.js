// js/ui.js — Common UI functions

// ========== SNS Share Functions ==========
function shareToTwitter(text) {
    var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
}

function shareToFacebook() {
    var url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://glowmi.org/');
    window.open(url, '_blank', 'noopener,noreferrer');
}

function copyShareLink(text) {
    var copyText = text + '\n\nhttps://glowmi.org/';
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText).then(function() {
            showShareToast('Link copied! 링크가 복사되었습니다!');
        });
    } else {
        var ta = document.createElement('textarea');
        ta.value = copyText;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showShareToast('Link copied! 링크가 복사되었습니다!');
    }
}

function shareNative(title, text) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: 'https://glowmi.org/'
        });
    }
}

function showShareToast(msg) {
    var existing = document.querySelector('.share-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'share-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.classList.add('share-toast-visible'); }, 10);
    setTimeout(function() {
        toast.classList.remove('share-toast-visible');
        setTimeout(function() { toast.remove(); }, 300);
    }, 2500);
}

function buildShareButtons(emoji, english, korean) {
    var shareText = emoji + ' My result: ' + english + '\n' + korean + '\n\nTry free at glowmi.org!';
    var escapedText = shareText.replace(/'/g, "\\'").replace(/\n/g, '\\n');
    var html = '<div class="share-section">' +
        '<p class="share-label">Share Your Result 결과 공유하기</p>' +
        '<div class="share-buttons">' +
        '<button class="share-btn share-btn-x" onclick="shareToTwitter(\'' + escapedText + '\')" title="Share on X">' +
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
        '</button>' +
        '<button class="share-btn share-btn-fb" onclick="shareToFacebook()" title="Share on Facebook">' +
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' +
        '</button>' +
        '<button class="share-btn share-btn-copy" onclick="copyShareLink(\'' + escapedText + '\')" title="Copy Link 링크 복사">' +
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
        '</button>';

    if (navigator.share) {
        html += '<button class="share-btn share-btn-native" onclick="shareNative(\'Glowmi\', \'' + escapedText + '\')" title="Share 공유">' +
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
            '</button>';
    }

    html += '</div></div>';
    return html;
}

function createConfetti() {
    var colors = ['#F4A698', '#C4796A', '#ff9500', '#00bcd4', '#4caf50', '#ffeb3b'];
    var container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    for (var i = 0; i < 50; i++) {
        var c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + '%';
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDelay = Math.random() * 2 + 's';
        c.style.animationDuration = (Math.random() * 2 + 2) + 's';
        c.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
        container.appendChild(c);
    }

    setTimeout(function() { container.remove(); }, 4000);
}

function renderProcedures() {
    var grid = document.getElementById('procedures-grid');
    if (!grid) return;

    var html = '';
    for (var i = 0; i < proceduresData.length; i++) {
        var p = proceduresData[i];
        var tagsHtml = '';
        for (var j = 0; j < p.tags.length; j++) {
            tagsHtml += '<span class="tag">' + p.tags[j] + '</span>';
        }
        html += '<div class="procedure-card' + (i === 0 ? ' procedure-card-top' : '') + '" onclick="toggleProcedure(this)">' +
                '<div class="procedure-header"><div><div class="procedure-title">' + p.english + '</div>' +
                '<div class="procedure-title-korean">' + p.korean + '</div></div>' +
                '<div class="procedure-header-right"><span class="procedure-rank">' + p.rank + '</span>' +
                '<span class="procedure-chevron">&#9660;</span></div></div>' +
                '<div class="procedure-tags">' + tagsHtml + '</div>' +
                '<div class="procedure-body">' +
                '<p class="procedure-description">' + p.description + '</p>' +
                '<div class="procedure-details">' +
                '<div class="detail-item"><div class="detail-label">Price</div><div class="detail-value">' + p.priceKRW + '</div><div class="detail-value-sub">' + p.priceUSD + '</div></div>' +
                '<div class="detail-item"><div class="detail-label">Duration</div><div class="detail-value">' + p.duration + '</div></div>' +
                '<div class="detail-item"><div class="detail-label">Downtime</div><div class="detail-value">' + p.downtime + '</div></div>' +
                '<div class="detail-item"><div class="detail-label">Lasts</div><div class="detail-value">' + p.lasts + '</div></div></div>' +
                '</div></div>';
    }
    grid.innerHTML = html;
}

function toggleProcedure(card) {
    var isOpen = card.classList.contains('open');
    // Close all cards first
    var allCards = document.querySelectorAll('.procedure-card');
    for (var i = 0; i < allCards.length; i++) {
        allCards[i].classList.remove('open');
    }
    // Toggle clicked card
    if (!isOpen) {
        card.classList.add('open');
    }
}

function toggleSubAccordion(el) {
    event.stopPropagation();
    el.classList.toggle('open');
}

function switchRoutineTab(tab, e) {
    var btns = document.querySelectorAll('.routine-tab-btn');
    btns.forEach(function(btn) { btn.classList.remove('active'); });
    if (e && e.target) { e.target.classList.add('active'); }
    document.getElementById('routine-am').classList.toggle('hidden', tab !== 'am');
    document.getElementById('routine-pm').classList.toggle('hidden', tab !== 'pm');
}

function toggleContent(card) {
    var isOpen = card.classList.contains('open');
    // Close sibling cards in same section
    var parent = card.parentElement;
    var siblings = parent.querySelectorAll('.content-card');
    for (var i = 0; i < siblings.length; i++) {
        siblings[i].classList.remove('open');
    }
    if (!isOpen) {
        card.classList.add('open');
    }
}

function switchToHome() {
    var btns = document.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.tab-panel');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
        btns[i].setAttribute('aria-selected', 'false');
    }
    for (var j = 0; j < panels.length; j++) panels[j].classList.add('hidden');
    var aiBtn = document.querySelector('.tab-btn[data-tab="ai"]');
    if (aiBtn) {
        aiBtn.classList.add('active');
        aiBtn.setAttribute('aria-selected', 'true');
    }
    document.getElementById('ai').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupTabs() {
    var btns = document.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.tab-panel');

    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function() {
            var tabId = this.getAttribute('data-tab');
            for (var j = 0; j < btns.length; j++) {
                btns[j].classList.remove('active');
                btns[j].setAttribute('aria-selected', 'false');
            }
            for (var k = 0; k < panels.length; k++) panels[k].classList.add('hidden');
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            document.getElementById(tabId).classList.remove('hidden');
            if (tabId === 'procedures' && !sessionStorage.getItem('proceduresGuideSeen')) {
                document.getElementById('procedures-guide-modal').classList.remove('hidden');
            }
            if (tabId === 'mypage' && typeof loadMyPage === 'function') {
                loadMyPage();
            }
        });
    }
}

function closeProceduresGuide() {
    document.getElementById('procedures-guide-modal').classList.add('hidden');
    sessionStorage.setItem('proceduresGuideSeen', '1');
}

function renderClinics(filter) {
    var grid = document.getElementById('clinics-grid');
    if (!grid) return;

    var filtered = clinicsData;
    if (filter && filter !== 'all') {
        filtered = clinicsData.filter(function(c) {
            return c.specialties.indexOf(filter) !== -1;
        });
    }

    var html = '';
    for (var i = 0; i < filtered.length; i++) {
        var c = filtered[i];
        var stars = '';
        for (var s = 0; s < 5; s++) {
            stars += s < Math.floor(c.rating) ? '★' : '☆';
        }

        var googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.korean + ' ' + c.areaKr);
        var naverMapUrl = 'https://map.naver.com/p/search/' + encodeURIComponent(c.korean);

        var googleReviewUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.korean + ' ' + c.areaKr + ' 리뷰');
        var englishBadge = c.englishOk ? '<span class="english-badge">EN</span>' : '';

        html += '<div class="clinic-card">' +
                '<div class="clinic-header">' +
                '<div class="clinic-name">' + c.name + englishBadge + '</div>' +
                '<div class="clinic-name-kr">' + c.korean + '</div>' +
                '</div>' +
                '<div class="clinic-location">📍 ' + c.area + ' ' + c.areaKr + '</div>' +
                '<div class="clinic-rating"><span class="stars">' + stars + '</span> ' + c.rating + ' <a href="' + googleReviewUrl + '" target="_blank" rel="noopener noreferrer" class="review-link" onclick="event.stopPropagation()">(' + c.reviews + ' reviews)</a></div>' +
                '<div class="clinic-popular">✨ ' + c.popular + '</div>' +
                '<div class="clinic-price">' + c.priceRange + '</div>' +
                '<div class="clinic-maps">' +
                '<a href="' + googleMapsUrl + '" target="_blank" rel="noopener noreferrer" class="map-btn google-btn">Google Maps</a>' +
                '<a href="' + naverMapUrl + '" target="_blank" rel="noopener noreferrer" class="map-btn naver-btn">네이버 지도</a>' +
                '</div></div>';
    }
    grid.innerHTML = html;
}

function filterClinics(filter, e) {
    var btns = document.querySelectorAll('.clinic-filter .filter-btn');
    btns.forEach(function(btn) { btn.classList.remove('active'); });
    if (e && e.target) {
        e.target.classList.add('active');
    }
    renderClinics(filter);
}

function switchSubTab(tabId, e) {
    var btns = document.querySelectorAll('.sub-tab-btn');
    var panels = document.querySelectorAll('.sub-tab-panel');

    btns.forEach(function(btn) { btn.classList.remove('active'); });
    panels.forEach(function(panel) { panel.classList.add('hidden'); });

    if (e && e.target) {
        e.target.classList.add('active');
    }
    document.getElementById(tabId).classList.remove('hidden');
}

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
        '<p><strong>Quiz and Test Data:</strong> When you take our Skin Type Quiz or Personal Color Test, your answers are processed locally in your browser to generate results. If you are not logged in, we do not store your quiz responses on any server. All quiz data remains on your device and is cleared when you close or refresh the page.</p>' +
        '<p><strong>Account Data:</strong> If you choose to sign in with Google, we store your Google profile name and avatar to personalize your experience. We also store your analysis results, skin diary entries, and skincare routines on Supabase (our database provider) so you can access them across sessions. This data is tied to your account and protected by row-level security policies.</p>' +
        '<p><strong>Automatically Collected Data:</strong> Like most websites, we may collect certain information automatically, including your IP address, browser type, device type, operating system, referring URLs, and pages visited. This data is collected through cookies and similar technologies for analytics purposes.</p>' +
        '<h3>2. How We Use Your Information</h3>' +
        '<p>We use collected information to: (a) provide and improve our services; (b) save your analysis results and skin diary for your personal use; (c) analyze website traffic and usage patterns; (d) display relevant advertisements through Google AdSense; and (e) ensure the security and functionality of our website.</p>' +
        '<h3>3. Google Sign-In</h3>' +
        '<p>We use Google OAuth via Supabase for authentication. When you sign in, we receive your public profile information (name, email, profile photo) from Google. We do not access your Google contacts, drive, or any other data. You can revoke access at any time through your Google Account settings.</p>' +
        '<h3>4. Data Storage and Security</h3>' +
        '<p>Account data is stored on Supabase with row-level security (RLS), meaning only you can access your own data. All data is transmitted over HTTPS. AI photo analysis continues to run entirely on your device — photos are never uploaded to any server, even when logged in.</p>' +
        '<h3>5. Data Deletion</h3>' +
        '<p>You can delete all your data at any time using the "Delete All My Data" button on the My Page tab or in the user dropdown menu. This permanently removes your profile, analysis results, diary entries, and routines from our database.</p>' +
        '<h3>6. Google AdSense and Cookies</h3>' +
        '<p>We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website and other websites on the Internet. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>.</p>' +
        '<h3>7. Third-Party Links</h3>' +
        '<p>Our website contains links to external websites including Google Maps, Naver Maps, and clinic websites. We are not responsible for the privacy practices or content of these external sites.</p>' +
        '<h3>8. Children\'s Privacy</h3>' +
        '<p>Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.</p>' +
        '<h3>9. Your Rights</h3>' +
        '<p>Depending on your location, you may have the right to: (a) access the personal data we hold about you; (b) request correction or deletion of your data; (c) object to or restrict processing of your data; and (d) data portability. To exercise any of these rights, please contact us at support@glowmi.co or use the in-app data deletion feature.</p>' +
        '<h3>10. Changes to This Policy</h3>' +
        '<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated revision date.</p>' +
        '<h3>11. Contact Us</h3>' +
        '<p>If you have questions about this Privacy Policy or our data practices, please contact us at support@glowmi.co.</p>'
};

function openPage(page) {
    document.getElementById('page-modal-body').innerHTML = pageContent[page];
    document.getElementById('page-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closePage() {
    document.getElementById('page-modal').classList.add('hidden');
    document.body.style.overflow = '';
}
