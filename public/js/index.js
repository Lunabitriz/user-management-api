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
            input.style.border = '1px solid #d4d4d4';
        });

        document.getElementById('validation').classList.remove('show');
        document.getElementById('validation').style.display = 'none';
    }
}

const forgotPassword = document.getElementById('forgot-password');
const rememberMe = document.getElementById('remember-me-label');

[forgotPassword, rememberMe].forEach((input) => {
    input.addEventListener('click', () => {
        showNotification('Esta função ainda será implementada!', 'warning')
    })
})


// Show password validations
function showValidations() {
    document.getElementById('validation').classList.add('show');
    document.getElementById('validation').style.display = 'block';
}

document.getElementById('register-password').addEventListener('focus', () => {
    showValidations();
})

// Make the password visible
function passwordVisible() {
    const password = document.getElementById('register-password');
    const notVisibleIcon = document.getElementById('not-visible-icon');
    const visibleIcon = document.getElementById('visible-icon');

    const isVisible = visibleIcon.style.display != 'none';
    
    password.type = isVisible ? 'text' : 'password';
    visibleIcon.style.display = isVisible ? 'none' : 'block';
    notVisibleIcon.style.display = isVisible ? 'block' : 'none';
}

const passwordInput = document.getElementById('register-password');

['keypress', 'blur'].forEach(event => {
    passwordInput.addEventListener(event, validatePassword);
});

document.getElementById('register-email').addEventListener('blur', (event) => {
    validateEmail(event);
});

document.getElementById('register-user-name').addEventListener('blur', (event) => {
    validateUserName(event);
});

// Password validation
function validatePassword(event) {
    const lengthAuth = document.getElementById('lenght');
    const numberAuth = document.getElementById('number');
    const symbolAuth = document.getElementById('symbol');
    const upperCaseAuth = document.getElementById('uppercase');
    const message = document.getElementById('password-message');
    const passwordInput = document.getElementById('register-password');
    
    const value = event.target.value;

    const numberRegex = /\d/.test(value);
    const upperCaseRegex = /[A-Z]/.test(value);
    const symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    numberAuth.classList.toggle('valid', numberRegex);
    symbolAuth.classList.toggle('valid', symbolRegex);
    lengthAuth.classList.toggle('valid', value.length >= 8);
    upperCaseAuth.classList.toggle('valid', upperCaseRegex);

    if(!(value.length >= 8) || !numberRegex || !symbolRegex || !upperCaseRegex) {
        passwordInput.style.border = '1px solid #F3D1CE';                    
        message.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>

            <label class="input-label" for="register-password">
                Digite uma senha válida!
            </label>
        `;
        showValidations();
    } else {
        passwordInput.style.border = '1px solid #85D6A5';
        passwordInput.style.backgroundColor = '#fff';
        document.getElementById('validation').classList.remove('show');
        message.innerHTML = "";
    }
}

// Email validation
function validateEmail(event) {
    const emailInput = document.getElementById('register-email');
    const message = document.getElementById('email-error');

    let value = event.target.value;

    if(!/@/.test(value) || !/\./.test(value)) {
        emailInput.style.border = '1px solid #FF7070';
        message.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>

            <label class="input-label" for="register-email">
                E-mail inválido.
            </label>
        `;           
    } else {
        emailInput.style.border = '1px solid #85D6A5';
        message.innerHTML = '';       
    }
}

// User Name validation
function validateUserName(event) {
    const userNameInput = document.getElementById('register-user-name');
    const message = document.getElementById('user-name-error');

    let value = event.target.value;
    
    if(value.length < 6) {
        userNameInput.style.border = '1px solid #FF7070';
        message.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>

            <label class="input-label" for="register-user-name">
                Mínimo 6 caracteres.
            </label>
        `;           
    } else {
        userNameInput.style.border = '1px solid #85D6A5';
        message.innerHTML = '';    
    }
}

// Login function
async function login() {
    let email = document.getElementById('login-email').value;
    let senha = document.getElementById('login-password').value;

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
    })
    
    if(response.ok) {
        showNotification('Usuário cadastrado com sucesso!', 'success');
    } else {
        showNotification('Erro ao cadastrar usuário.', 'danger');
    }
}