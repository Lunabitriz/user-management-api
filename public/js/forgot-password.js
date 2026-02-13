// Function to frist validation: email
async function confirmMail() {
    const emailInput = document.getElementById('recovery-email').value.trim().toLowerCase();

    let sendTo = document.getElementById('send-to-mail');
    showLoadingSpinner('enter-email-container');

    try {
        const response = await fetch('http://localhost:3000/user/forgot-password', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ email: emailInput })
        });

        if(response.ok) {
            // Go to next validation
            sendTo.innerText = emailInput;            
            localStorage.setItem('recoveryEmail', emailInput);

            populateCodeInputs();
            handleContainersVisibility();
        } else {
            showNotification('No account found with this email. Please try again.', 'warning');
            hideLoadingSpinner('enter-email-container');
        }
    } catch(error) {
        console.log('Erro: ', error);
    }
}

// Function to populate the code container
function populateCodeInputs() {
    const inputsContainer = document.getElementById('input-item-forgot');
    const inputIds = ['forgot-code-1', 'forgot-code-2', 'forgot-code-3', 'forgot-code-4'];

    document.getElementById('send-to-mail').innerText = localStorage.getItem('recoveryEmail');
    
    if(!inputsContainer.innerHTML) {
        inputIds.forEach(inputId => {
            const input = document.createElement('input');

            input.type         = 'text';
            input.id           = inputId;
            input.pattern      = '[0-9]*';
            input.inputMode    = 'numeric';
            input.className    = 'input-forgot';
            input.maxLength    = 1;
            input.autocomplete = 'off';
            input.setAttribute('aria-label', 'Validation code');
    
            inputsContainer.appendChild(input);
        });
    } 

    return inputsContainer.querySelectorAll('.input-forgot');
}

// Function to create  navigation through code fields
const inputs = populateCodeInputs();

inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        const next = inputs[index + 1];
        if(input.value && next) 
            next.focus();
    });

    input.addEventListener('keydown', (event) => {
        if(event.key === 'Backspace' && !input.value && index > 0) {
            const prev = inputs[index - 1];
            prev.focus();
            prev.value = '';
        }
    });

    if(input.id === 'forgot-code-4') {
        input.addEventListener('input', () => {
            confirmSendCode();
        })
    }
});

// Function to show code validation time
function timerToExpires() {
    const expiresText = document.getElementById('expires-in');
    const maxMinutes = 10;

    let sec = localStorage.getItem('currentSeconds') || 59;
    let min = localStorage.getItem('currentMinutes') || (maxMinutes - 1);

    if(min > 0) expiresText.innerText = `${min}:${sec}`;
    if(localStorage.getItem('enterCode')) return;

    setInterval(() => {
        if(min <= 0) {
            expiresText.innerText = 'Expired!';
            showNotification('Code expired! Redirecting to login...', 'warning');
            goToInitialPage();
            return;
        }

        sec--;

        sec = (sec >= 10) ? sec : ('0' + sec);
        localStorage.setItem('currentMinutes', min);
        localStorage.setItem('currentSeconds', sec);

        expiresText.innerText = `${min}:${sec}`;
        
        if(sec == 0) {
            sec = 59;
            min--;
        }
    }, 1000);
}

// Function to second validation: code received
async function confirmSendCode() {
    const codeInputs = populateCodeInputs();
    let userCode = '';

    codeInputs.forEach(code => {
        if(!code.value) {
            showNotification('Please fill in all fields correctly.', 'danger');
            return;
        }
        userCode += code.value;
    });

    // const userCode = enterCode1 + enterCode2 + enterCode3 + enterCode4;
    const email = localStorage.getItem('recoveryEmail');
    if(!email) return;

    try {
        const response = await fetch('http://localhost:3000/user/verify-send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, code: userCode })
        });

        if(response.ok) {
            localStorage.setItem('enterCode', userCode);
            handleContainersVisibility();
        } else {
            showNotification('Invalid code. Check your email and try again.', 'danger');
        }
    } catch(error) {
        console.error(error);
    }
}

// Function to redefine password
async function confirmNewPassword() {
    const newPassword        = document.getElementById('new-password-redefine').value;
    const confirmNewPassword = document.getElementById('confirm-password-redefine').value;

    if(!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
        showNotification('Error redefine password! Enter valid data', 'warning');
        return;
    }

    const email = localStorage.getItem('recoveryEmail');
    if(!email) return;

    try {
        const response = await fetch('http://localhost:3000/user/redefine-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha: newPassword })
        });

        if(response.ok) {
            localStorage.setItem('passwordRedefined', 'true');
            handleContainersVisibility();
        }
    } catch(error) {
        console.error(error);
    }
}

// Listener to confirm mail
const confirmMailBtn = document.getElementById('confirm-mail-btn');
if(confirmMailBtn) {
    confirmMailBtn.addEventListener('click', () => confirmMail());
}

// Listener to confirm send code
const confirmSendCodeBtn = document.getElementById('confirm-send-code-btn');
if(confirmSendCodeBtn) {
    confirmSendCodeBtn.addEventListener('click', () => confirmSendCode());
}

// Listener to confirm password
const confirmPasswordBtn = document.getElementById('confirm-password-btn');
if(confirmPasswordBtn) {
    confirmPasswordBtn.addEventListener('click', () => confirmNewPassword());
}

// Listener to confirmation button
const confirmRedefination = document.getElementById('confirm-btn');
if(confirmRedefination) {
    confirmRedefination.addEventListener('click', () => goToInitialPage());
}

// Function to hide all validations containers 
function hideValidationsContainers() {
    const popUpsActives = document.querySelectorAll('.forgot-container');

    popUpsActives.forEach(popUp => {
        popUp.classList.remove('active');
    });
}

// Function to alternate containers visibility
function handleContainersVisibility() {
    const enterCodeExists      = localStorage.getItem('enterCode');
    const recoveryEmailExists  = localStorage.getItem('recoveryEmail');
    const passwordRedefined    = localStorage.getItem('passwordRedefined');

    const codeContainer        = document.getElementById('code-container');
    const confirmContainer     = document.getElementById('confirm-container');
    const enterEmailContainer  = document.getElementById('enter-email-container');
    const newPasswordContainer = document.getElementById('new-password-container');

    if(!recoveryEmailExists) {
        enterEmailContainer.classList.add('active');
        enterEmailContainer.classList.remove('hidden');
        return;
    }

    hideValidationsContainers();

    if(recoveryEmailExists && !enterCodeExists) {
        codeContainer.classList.add('active');
        codeContainer.classList.remove('hidden');
        showNotification('Email sent successfully!', 'success');
        timerToExpires();
        return;
    }
    if(enterCodeExists && !passwordRedefined) {
        newPasswordContainer.classList.add('active');
        newPasswordContainer.classList.remove('hidden');
        showNotification('Code verified successfully!', 'success');
        return;
    }
    if(passwordRedefined) {
        confirmContainer.classList.add('active');
        confirmContainer.classList.remove('hidden');
        showNotification('Password reset successfully! Redirecting to login...', 'success');
        return;
    }
}

// Show password validations - vou otimizar!
function showValidations() {
    document.getElementById('validation').classList.add('show');
    document.getElementById('validation').style.display = 'block';
}

// Function to show new password validations
document.getElementById('new-password-redefine').addEventListener('focus', () => {
    showValidationsHtml('redefine-password-validations');
    showValidations();
});

const confirmPassowordInput = document.getElementById('confirm-password-redefine');

// Listener to accompany password validations
['keyup', 'blur', 'focus'].forEach(eventType => {
    confirmPassowordInput.addEventListener(eventType, (event) => {
        const newPassowordInput = document.getElementById('new-password-redefine').value.trim();
        const message           = document.getElementById('confirm-password-message');

        let inputValue   = event.target.value;
        let errorMessage = (!newPassowordInput) ? 'Please fill in the first field.' : 'Passwords must match.'
        
        const isValidPassword = !newPassowordInput || inputValue !== newPassowordInput;

        if(event.key === 'Enter') confirmNewPassword();

        if(!isValidPassword) {
            message.innerHTML = "";
            confirmPassowordInput.style.backgroundColor = '#fff';
            confirmPassowordInput.style.border = '1px solid #85D6A5';
        } else {
            confirmPassowordInput.style.border = '1px solid #FF7070';                    
            message.innerHTML = getErrorMensage(errorMessage, confirmPassowordInput);
        }
    });
});

// Function to redirects user to login/register page
function goToInitialPage() {
    setTimeout(() => {
        window.location = 'index.html';
    }, 1600);
}

handleContainersVisibility();
activateValidationsListener('recovery-email', 'new-password-redefine', null);