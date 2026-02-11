// js/app.js — Initialization

document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    renderProcedures();
    renderClinics('all');
    initAuth();
});

function switchToMyPage() {
    var btns = document.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.tab-panel');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
        btns[i].setAttribute('aria-selected', 'false');
    }
    for (var j = 0; j < panels.length; j++) panels[j].classList.add('hidden');
    var myPageBtn = document.getElementById('tab-mypage');
    if (myPageBtn) {
        myPageBtn.classList.add('active');
        myPageBtn.setAttribute('aria-selected', 'true');
    }
    document.getElementById('mypage').classList.remove('hidden');
    loadMyPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
