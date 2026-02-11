// js/auth.js — Google login/logout, auth state management, nav UI toggle

var currentUser = null;

function initAuth() {
    if (!supabase) return;

    supabase.auth.onAuthStateChange(function(event, session) {
        if (session && session.user) {
            currentUser = session.user;
            onLoginSuccess(session.user);
        } else {
            currentUser = null;
            onLogout();
        }
    });

    // Check existing session
    supabase.auth.getSession().then(function(result) {
        if (result.data.session) {
            currentUser = result.data.session.user;
            onLoginSuccess(currentUser);
        }
    });
}

async function loginWithGoogle() {
    if (!supabase) {
        showShareToast('Service unavailable. 서비스를 사용할 수 없습니다.');
        return;
    }
    try {
        var result = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + window.location.pathname
            }
        });
        if (result.error) {
            showShareToast('Login failed. 로그인에 실패했습니다.');
            console.error('Login error:', result.error);
        }
    } catch (e) {
        showShareToast('Login failed. 로그인에 실패했습니다.');
        console.error('Login exception:', e);
    }
}

async function logout() {
    if (!supabase) return;
    try {
        await supabase.auth.signOut();
    } catch (e) {
        console.error('Logout error:', e);
    }
    currentUser = null;
    onLogout();
}

function onLoginSuccess(user) {
    var loginBtn = document.getElementById('nav-login-btn');
    var userMenu = document.getElementById('nav-user-menu');
    var avatar = document.getElementById('header-user-avatar');
    var myPageBtn = document.getElementById('tab-mypage');

    // Hide login button, show avatar
    if (loginBtn) loginBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = '';

    var meta = user.user_metadata || {};
    if (avatar && meta.avatar_url) {
        avatar.src = meta.avatar_url;
    }

    // Show My Page tab
    if (myPageBtn) myPageBtn.style.display = '';

    // Show all save buttons
    var saveBtns = document.querySelectorAll('.save-result-btn');
    for (var i = 0; i < saveBtns.length; i++) {
        saveBtns[i].style.display = '';
    }
}

function onLogout() {
    var loginBtn = document.getElementById('nav-login-btn');
    var userMenu = document.getElementById('nav-user-menu');
    var myPageBtn = document.getElementById('tab-mypage');
    var dropdown = document.getElementById('user-dropdown');

    // Show login button, hide avatar
    if (loginBtn) loginBtn.style.display = '';
    if (userMenu) userMenu.style.display = 'none';
    if (dropdown) dropdown.style.display = 'none';

    // Hide My Page tab
    if (myPageBtn) myPageBtn.style.display = 'none';

    // If currently on My Page tab, switch to AI tab
    if (myPageBtn && myPageBtn.classList.contains('active')) {
        switchToHome();
    }

    // Hide My Page panel
    var myPagePanel = document.getElementById('mypage');
    if (myPagePanel) myPagePanel.classList.add('hidden');

    // Hide all save buttons
    var saveBtns = document.querySelectorAll('.save-result-btn');
    for (var i = 0; i < saveBtns.length; i++) {
        saveBtns[i].style.display = 'none';
    }
}

function toggleUserDropdown() {
    var dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        var isHidden = dropdown.style.display === 'none';
        dropdown.style.display = isHidden ? '' : 'none';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    var dropdown = document.getElementById('user-dropdown');
    var userMenu = document.getElementById('nav-user-menu');
    if (dropdown && userMenu && !userMenu.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});
