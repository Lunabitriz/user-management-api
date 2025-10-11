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

document.getElementById('forgot-password').addEventListener('click', () => {
    window.location = 'forgot-password-page.html';
});

// Show password validations
function showValidations() {
    document.getElementById('validation').classList.add('show');
    document.getElementById('validation').style.display = 'block';
}

document.getElementById('register-password').addEventListener('focus', () => {
    showValidationsHtml('register-password-validations');
    showValidations();
});

// Password Listener Validations
const passwordInput = document.getElementById('register-password');

['keyup', 'blur', 'focus'].forEach(eventType => {
    passwordInput.addEventListener(eventType, (event) => {
        const validationState = validatePassword(event);
        const message = document.getElementById('password-message');

        if(validationState) {
            message.innerHTML = "";
            passwordInput.style.backgroundColor = '#fff';
            passwordInput.style.border = '1px solid #85D6A5';
            document.getElementById('validation').classList.remove('show');
        } else if(!validationState && eventType === 'blur') {
            passwordInput.style.border = '1px solid #FF7070';                    
            message.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>

                <label class="input-label" for="${passwordInput}">
                    Digite uma senha válida!
                </label>
            `;
            showValidations();    
        } else {
            showValidations();   
        }
    });
});

const emailInput = document.getElementById('register-email');

['keyup', 'blur'].forEach(eventType => {
    emailInput.addEventListener(eventType, (event) => {
        const validationState = validateEmail(event);
        const message = document.getElementById('email-error');

        if(validationState) {
            emailInput.style.border = '1px solid #85D6A5';
            message.innerHTML = '';
        } else if(!validationState && eventType === 'blur') {
            emailInput.style.border = '1px solid #FF7070';
            message.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>

                <label class="input-label" for="register-email">
                    E-mail inválido.
                </label>
            `;     
        }
    });
});

const userNameInput = document.getElementById('register-user-name');

['keyup', 'blur'].forEach(eventType => {
    userNameInput.addEventListener(eventType, (event) => {
        const validationState = validateUserName(event);
        const message = document.getElementById('user-name-error');

        if(validationState) {
            userNameInput.style.border = '1px solid #85D6A5';
            message.innerHTML = '';   
        } else if(!validationState && eventType === 'blur') {
            userNameInput.style.border = '1px solid #FF7070';
            message.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>

                <label class="input-label" for="register-user-name">
                    Mínimo 6 caracteres.
                </label>
            `;  
        }
    });
});

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