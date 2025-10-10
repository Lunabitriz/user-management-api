// Email Validations
document.getElementById('recovery-email').addEventListener('blur', (event) => {
    validateEmail(event);
});

function validateEmail(event) {
    const emailInput = document.getElementById('recovery-email');
    const message = document.getElementById( 'email-error');

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


// Function to frist validation: email
async function confirmMail() {
    const emailInput = document.getElementById('recovery-email').value.trim();
    const enterEmailContainer = document.getElementById('enter-email-container');
    const codeContainer = document.getElementById('code-container');

    let sendTo = document.getElementById('send-to-mail');

    try {
        const response = await fetch('http://localhost:3000/user/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput })
        });
        alert(emailInput);

        if(response.ok) {
            // Vai para a próxima validação
            sendTo.innerText = emailInput;

            const data = await response.json();
            
            localStorage.setItem('codeReceived', data.hashedCode);
            localStorage.setItem('recoveryEmail', emailInput);

            codeContainer.classList.remove('d-none');
            enterEmailContainer.style.display = 'none';
            showNotification('ok', 'success')
        } else {
            showNotification('Não foi possível encontrar um usuário com esse email. Tente novamente.', 'warning');
            console.log(response)
        }
    } catch(error) {
        console.log('Erro: ', error);
    }
}

// Function to second validation: code received
async function confirmSendCode() {
    const codeContainer = document.getElementById('code-container');
    const newPasswordContainer = document.getElementById('new-password-container');

    const enterCode1 = document.getElementById('forgor-code-1').value.trim();
    const enterCode2 = document.getElementById('forgor-code-2').value.trim();
    const enterCode3 = document.getElementById('forgor-code-3').value.trim();
    const enterCode4 = document.getElementById('forgor-code-4').value.trim();

    if(!enterCode1 || !enterCode2 || !enterCode3 || !enterCode4) {
        alert('Preencha os campos corretamente!');
        return;
    }

    const userCode = enterCode1 + enterCode2 + enterCode3 + enterCode4;
    const email = localStorage.getItem('recoveryEmail');

    try {
        const response = await fetch('http://localhost:3000/user/verify-send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, code: userCode })
        });

        if(response.ok) {
            alert('Código validado com sucesso!');
            codeContainer.classList.add('d-none');
            newPasswordContainer.classList.remove('d-none');
            localStorage.setItem('enterCode', userCode);
        }
    } catch(error) {
        console.error(error);
    }
}

async function confirmNewPassword() {
    const confirmContainer = document.getElementById('confirm-container');
    const newPasswordContainer = document.getElementById('new-password-container');
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    const newPassword = document.getElementById('new-password').value;

    if(!newPassword || !confirmNewPassword) {
        alert('Preencha os campos obrigatórios!');
        return;
    }

    if(newPassword !== confirmNewPassword) {
        alert('As senhas devem ser iguais!');
        return;
    }

    const email = localStorage.getItem('recoveryEmail');

    try {
        const response = await fetch('http://localhost:3000/user/redefine-password', {
           method: 'PUT',
           headers: {
            'Content-Type': 'application/json'
           },
           body: JSON.stringify({ email, senha: newPassword })
        });

        if(response.ok) {
            alert('Senha redefinida com sucesso!');
            newPasswordContainer.classList.add('d-none');
            confirmContainer.classList.remove('d-none');
            localStorage.setItem('passwordRedefined', 'true');
        }
    } catch(error) {
        console.error(error);
    }
}

function goToInitialPage() {
    setTimeout(() => {
        window.location = 'index.html';
    }, 2000);
}

function handleContainersVisibility() {
    if(localStorage.getItem('recoveryEmail')) {
        document.getElementById('enter-email-container').classList.add('d-none');
        document.getElementById('code-container').classList.remove('d-none');
    }
    if(localStorage.getItem('enterCode')) {
        document.getElementById('code-container').classList.add('d-none');
        document.getElementById('new-password-container').classList.remove('d-none');
    }
    if(localStorage.getItem('passwordRedefined')) {
        document.getElementById('new-password-container').classList.add('d-none');
        document.getElementById('confirm-container').classList.remove('d-none');
    }
}

handleContainersVisibility();