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

            codeContainer.classList.remove('d-none');
            enterEmailContainer.classList.add('d-none');

            localStorage.setItem('recoveryEmail', emailInput);
            showNotification('ok', 'success')
        } else {
            showNotification('Não foi possível encontrar um usuário com esse email. Tente novamente.', 'warning');
            console.log(response)
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