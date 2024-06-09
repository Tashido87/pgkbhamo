document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const auth = urlParams.get('auth');
    
    if (!auth) {
        window.location.href = 'index.html';
    }
});

function redirectTo(page) {
    window.location.href = page;
}

function confirmLogout() {
    if (confirm("Do you really want to log out?")) {
        window.location.href = 'index.html';
    }
}
