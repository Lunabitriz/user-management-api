// Toggle auth form
function toggleAuthForm(form) {
    const loginForm = document.getElementById('login-container');
    const registerForm = document.getElementById('register-container');
    const rememberMe = document.getElementById('remember-me');
    const loginInputs = document.querySelectorAll('.input-login');
    const registerInputs = document.querySelectorAll('.input-register');

    if(form === 'login') {
        loginForm.classList.add('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        registerForm.classList.remove('active');
        registerInputs.forEach(input => input.value = '');
    } else {
        loginForm.classList.add('hidden');
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        registerForm.classList.remove('hidden');
        loginInputs.forEach(input => input.value = '');
        rememberMe.checked = false;

        document.querySelectorAll('.input-error').forEach(msg => {
            msg.innerHTML = '';
        });

        document.querySelectorAll('.input-register').forEach(input => {
            input.style.border = 'var(--input-border)';
        });

        document.getElementById('validation').classList.remove('show');
        document.getElementById('validation').style.display = 'none';
    }
}

document.getElementById('forgot-password').addEventListener('click', () => {
    window.location = 'forgot-password-page.html';
});

document.getElementById('register-password').addEventListener('focus', () => {
    showValidationsHtml('register-password-validations');
    showValidations();
});

activateValidationsListener('register-email', 'register-password', 'register-user-name');

// Login function
async function login() {
    let email = document.getElementById('login-email').value;
    let senha = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me');

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        })

        if(response.ok) {
            showNotification('Login efetuado com sucesso!', 'success');
            const result = await response.json();

            // Saves data to localStorage and the JWT token
            localStorage.setItem('userId', result.user.id);
            localStorage.setItem('userName', result.user.nome);
            localStorage.setItem('userEmail', result.user.email);
            localStorage.setItem('userPhoto', result.user.fotoPerfil);
            localStorage.setItem('access_token', result.access_token);
            localStorage.setItem('rememberMe', rememberMe.checked ? 'active' : 'disabled');
            
            // Clear the input fields
            email = '';
            senha = '';
            
            window.location.href = 'user-account.html';
            
        } else {
            showNotification('Erro ao fazer login!', 'warning');
        }
    } catch(error) {
        showNotification('Erro ao accesar banco de dados!', 'danger');
    }            
}

// Register function
async function register() {
    const email = document.getElementById('register-email').value;
    const nome = document.getElementById('register-user-name').value;
    const senha = document.getElementById('register-password').value;
    
    const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ nome, email, senha })
    });
    
    if(response.ok) {
        showNotification('Usuário cadastrado com sucesso!', 'success');
    } else {
        showNotification('Erro ao cadastrar usuário.', 'danger');
    }
}

function loadUserLoginData() {
    const rememberMeIsActive = localStorage.getItem('rememberMe');
    
    if(rememberMeIsActive === 'active') {
        const userEmail = localStorage.getItem('userEmail');
        document.getElementById('login-email').value = userEmail;
    }

    // Clear localStorage if the "Forgot Password" was accessed
    localStorage.removeItem('enterCode');
    localStorage.removeItem('recoveryEmail');
    localStorage.removeItem('passwordRedefined');
}

loadUserLoginData();