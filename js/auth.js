// js/auth.js — Google login/logout, auth state management, header UI toggle

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
        showShareToast('Service unavailable. Please try later. 서비스를 사용할 수 없습니다.');
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
            showShareToast('Login failed. Please try again. 로그인에 실패했습니다.');
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
    // Show logged-in header UI
    var loginBtn = document.getElementById('header-login-btn');
    var userMenu = document.getElementById('header-user-menu');
    var avatar = document.getElementById('header-user-avatar');
    var displayName = document.getElementById('header-user-name');

    if (loginBtn) loginBtn.classList.add('hidden');
    if (userMenu) userMenu.classList.remove('hidden');

    var meta = user.user_metadata || {};
    if (avatar && meta.avatar_url) {
        avatar.src = meta.avatar_url;
        avatar.style.display = '';
    }
    if (displayName) {
        displayName.textContent = meta.full_name || meta.name || 'User';
    }

    // Show My Page tab
    var myPageBtn = document.getElementById('tab-mypage');
    if (myPageBtn) myPageBtn.classList.remove('hidden');

    // Show all save buttons
    var saveBtns = document.querySelectorAll('.save-result-btn');
    for (var i = 0; i < saveBtns.length; i++) {
        saveBtns[i].classList.remove('hidden');
    }
}

function onLogout() {
    // Show login button, hide user menu
    var loginBtn = document.getElementById('header-login-btn');
    var userMenu = document.getElementById('header-user-menu');

    if (loginBtn) loginBtn.classList.remove('hidden');
    if (userMenu) userMenu.classList.add('hidden');

    // Hide My Page tab
    var myPageBtn = document.getElementById('tab-mypage');
    if (myPageBtn) myPageBtn.classList.add('hidden');

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
        saveBtns[i].classList.add('hidden');
    }
}

function toggleUserDropdown() {
    var dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    var dropdown = document.getElementById('user-dropdown');
    var userMenu = document.getElementById('header-user-menu');
    if (dropdown && userMenu && !userMenu.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});
