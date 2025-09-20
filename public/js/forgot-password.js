// Email Validations
document.getElementById('recovery-email').addEventListener('blur', (event) => {
    validateEmail(event);
});

function validateEmail(event) {
    const emailInput = document.getElementById('recovery-email');
    const message = document.getElementById('email-error');

    let value = event.target.value;

    if(!/@/.test(value) || !/\./.test(value)) {
        emailInput.style.border = '1px solid #FF7070';
        message.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>

            <label class="input-label" for="recovery-email">
                E-mail inválido.
            </label>
        `;
    } else {
        emailInput.style.border = '1px solid #85D6A5';
        message.innerHTML = '';
    }
}

// Função para fazer requisições autenticadas
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('access_token');
    
    if(!token) {
        throw new Error('Token de acesso não encontrado. Faça login novamente.');
    }

    const defaultOptions = {
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    };

    const mergedOptions = { ...defaultOptions, ...options };
    const response = await fetch(url, mergedOptions);
    
    // Remove os dados do localstorage quando o token estiver expirado ou inválido
    if(response.status === 401) {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhoto');
        localStorage.removeItem('access_token');
        
        showNotification('Sessão expirada. Faça login novamente.', 'warning');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
        throw new Error('Token expirado');
    }
    
    return response;
}

// Função para verificar se o usuário está autenticado
function isAuthenticated() {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('userId');
    
    return !!(token && userId);
}

async function confirmMail() {
    const emailInput = document.getElementById('recovery-email').value;
    const enterEmailContainer = document.getElementById('enter-email-container');
    const codeContainer = document.getElementById('code-container');
    let sendTo = document.getElementById('send-to-mail');

    try {
        const response = await fetch(`http://localhost:3000/user/${emailInput}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        })

        if(response.ok) {
            // Vai para a próxima validação
            sendTo.innerText = emailInput;
            codeContainer.classList.remove('d-none');
            enterEmailContainer.classList.add('d-none');
            localStorage.setItem('recoveryEmail', emailInput);
            showNotification('ok', 'success')
        } else {
            showNotification('Não foi possível encontrar um usuário com esse email. Tente novamente.', 'warning');
        }
    } catch(error) {
        console.log('Erro: ', error);
    }
}

function confirmSendCode() {
    const codeContainer = document.getElementById('code-container');
    const newPasswordContainer = document.getElementById('new-password-container');

    // Vou terminar essa parte da função
    const isValidCode = true;

    if(isValidCode) {
        codeContainer.classList.add('d-none');
        newPasswordContainer.classList.remove('d-none');
    }
}

function generateRamdomCode() {
    // Vou melhorar posteriormente kkkkk
    let code = '';

    for(let i = 0; i < 4; i++) {
        let number = Math.floor(Math.random() * 10) + 0;
        code += number.toString();
    }
    return code;
}

const { response } = require('express');
// Module do nodemailer
const nodemailer = require('nodemailer');

// Send the generated code to email
function sendMailToUser() {
    const userEmail = localStorage.getItem('recoveryEmail');

    try {
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'lunabitriz@gmail.com',
                pass: 'pxxtoiucwvuputra'
            }
        });

        transport.sendMail({
            from: 'User Management <lunabitriz@gmail.com>',
            to: `${userEmail}`,
            subject: 'Email para redefinição de senha - User Management',
            html: `<h1>Hi, Dev!</h1> <p>Your validation code is: <strong>${generateRamdomCode()}</strong></p>`,
            text: `Hi, Dev! Your validation code is: ${generateRamdomCode()}`
        });
    } catch(error) {
        console.log('Erro ao enviar o email: ', error.message);
    }
}

function confirmNewPassword() {
    const newPasswordContainer = document.getElementById('new-password-container');
    const confirmContainer = document.getElementById('confirm-container');

    const isValidCode = true;

    if(isValidCode) {
        newPasswordContainer.classList.add('d-none');
        confirmContainer.classList.remove('d-none');
    }
}

function goToInitialPage() {
    setTimeout(() => {
        window.location = 'index.html';
    }, 2000);
}

// Password Validations
// const passwordInput = document.getElementById('register-password');

// ['keypress', 'blur'].forEach(event => {
//     passwordInput.addEventListener(event, validatePassword);
// });