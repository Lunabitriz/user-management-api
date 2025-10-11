// Function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');

    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if(notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Make the password visible
function passwordVisible(idPassword, idContainer) {
    const password = document.getElementById(idPassword);
    const notVisibleIcon = document.querySelector(`#${idContainer} .not-visible-icon`);
    const visibleIcon = document.querySelector(`#${idContainer} .visible-icon`);

    const isVisible = visibleIcon.style.display != 'none';
    
    password.type = isVisible ? 'text' : 'password';
    visibleIcon.style.display = isVisible ? 'none' : 'block';
    notVisibleIcon.style.display = isVisible ? 'block' : 'none';
}

// Password validation
function validatePassword(event) {
    const lengthAuth = document.getElementById('lenght');
    const numberAuth = document.getElementById('number');
    const symbolAuth = document.getElementById('symbol');
    const upperCaseAuth = document.getElementById('uppercase');
    
    const value = event.target.value;

    const numberRegex = /\d/.test(value);
    const upperCaseRegex = /[A-Z]/.test(value);
    const symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    numberAuth.classList.toggle('valid', numberRegex);
    symbolAuth.classList.toggle('valid', symbolRegex);
    lengthAuth.classList.toggle('valid', value.length >= 8);
    upperCaseAuth.classList.toggle('valid', upperCaseRegex);

    return !(value.length >= 8) || !numberRegex || !symbolRegex || !upperCaseRegex ? 0 : 1;
}

// Show the password validation list   
function showValidationsHtml(containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <ul id="validation" class="p-0">
            <li id="lenght" class="default">
                <i class="fa-solid fa-lock"></i> At least 8 characters
            </li>
            <li id="number" class="default">
                <i class="fa-solid fa-lock"></i> At least 1 number
            </li>
            <li id="uppercase" class="default">
                <i class="fa-solid fa-lock"></i> At least 1 uppercase letter
            </li>
            <li id="symbol" class="default">
                <i class="fa-solid fa-lock"></i> At least 1 symbol (e.g. !, @, #, $, %...)
            </li>
        </ul>
    `;
}

// Show password validations
function showValidations() {
    document.getElementById('validation').classList.add('show');
    document.getElementById('validation').style.display = 'block';
}

// Show password visibility icons
document.querySelectorAll('.password-label').forEach(label => {
    label.innerHTML = `
        <i id="visible-icon" class="visible-icon fa-solid fa-eye"></i>
        <i id="not-visible-icon" class="not-visible-icon fa-solid fa-eye-slash" style="display: none;"></i>
    `;
})

// Email Validation
function validateEmail(event) {
    let value = event.target.value;
    const idealEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return !idealEmailFormat.test(value) ? 0 : 1;
}

// User Name Validation
function validateUserName(event) {
    let value = event.target.value;

    return value.length < 6 ? 0 : 1;
}

// Password Confirm Validation
function validatePassworConfirmation(valueConfirmation, password) {
    return (!password || valueConfirmation !== password) ? 0 : 1;
}

// Return a custom error message
function getErrorMensage(message, inputId) {
    return `
        <i class="fa-solid fa-circle-exclamation"></i>

        <label class="input-label" for="${inputId}">
            ${message} 
        </label>
    `;
}

// Show messages pop-ups 
function showMessagePopUp(tipo, titulo, message) {
    const container = document.getElementById('pop-up-container');
    document.getElementById('overflow').classList.add('active');

    let color = '';

    if(tipo === 'error') {
        color = '#FF5C5C';
    } else if(tipo === 'error-database') {
        color = '#3b97e3';
    } else {
        color = '#5da271';
    }

    container.innerHTML = `        
        <div class="container bg-white rounded-4 d-flex flex-column align-items-center justify-content-center gap-2 px-5 py-5" style="width: 348px;">
            <div class="email-ilustration w-100 d-flex flex-column align-items-center justify-content-center">
                <img src="./imgs/pop-ups-arts/${tipo}-icon.jpg" alt="${tipo} icon" class="mb-3">
            </div>

            <div class="header-form text-center">
                <h3>${titulo}</h3>
                <p class="mb-0">
                    ${message}
                </p>
            </div>

            <button onclick="hidePopUp()" id="popup-confirm-btn" class="btn text-white my-2 w-100" style="background-color: ${color};">
                Confirmar
            </button>
        </div>
    `;
}

// Show confirm or cancel pop-ups
function showConfirmationPopUP(tipo, titulo, message, ctaBtn) {
    const container = document.getElementById('pop-up-container');

    document.getElementById('overflow').classList.add('active');
    let popUpColor = (tipo != 'delete') ? '#F37913' : '#FF5C5C';
    
    container.innerHTML = `
         <div class="container bg-white rounded-4 d-flex flex-column align-items-center justify-content-center gap-2 px-5 py-5" style="width: 420px;">
            <div class="${tipo}-ilustration">
                <img src="./imgs/pop-ups-arts/${tipo}-icon.jpg" alt="${tipo} image" width="193px">
            </div>
            <div class="header-form text-center">
                <h3 class="text-center">${titulo}</h3>
                <p class="mb-0 text-center">
                    ${message}
                </p>
            </div>
            <div class="d-flex justify-content-between w-100 gap-2 my-2">
                <button id="popup-cancel-btn" class="btn-popup-confirm btn btn-light w-100">
                    Cancelar
                </button>

                <button class="btn-popup-confirm btn text-white w-100" style="background-color: ${popUpColor};">
                    ${ctaBtn}
                </button>
            </div>
         </div>
    `;

    document.querySelectorAll("#pop-up-container .btn-popup-confirm").forEach(btn => {
        btn.addEventListener('click', () => {
            handleConfirmationOptions(tipo, btn.id);
        });
    })
}

// Utilitie function to handle pop-up options
function handleConfirmationOptions(tipo, btnValue) {
    if(btnValue === 'popup-cancel-btn') {
        hidePopUp();
        return;
    }

    if(tipo == 'edit') {
        saveChanges();
    } else if(tipo == 'logout') {
        logout();
    } else if(tipo == 'delete'){
        removeAccount();
    }
}

// Validations Listener
function activateValidationsListener(emailInputId, passwordInputId, userNameInputId) {
    const emailInput = document.getElementById(emailInputId) || '';
    const passwordInput = document.getElementById(passwordInputId);
    const userNameInput = document.getElementById(userNameInputId);

    // Password Listener Validation
    ['keyup', 'blur', 'focus'].forEach(eventType => {
        if(!passwordInput) return;

        passwordInput.addEventListener(eventType, (event) => {
            const validationState = validatePassword(event);
            const message = document.getElementById('password-message');

            if(validationState) {
                message.innerHTML = "";
                passwordInput.style.backgroundColor = '#fff';
                passwordInput.style.border = '1px solid #85D6A5';
                document.getElementById('validation').classList.remove('show');
                document.getElementById('validation').style.display = 'none';
            } else if(!validationState && eventType === 'blur') {
                passwordInput.style.border = '1px solid #FF7070';                    
                message.innerHTML = getErrorMensage('Please enter a valid password.', passwordInput);
                showValidations();    
            } else {
                showValidations();   
            }
        });
    });

    // Email Listener Validation
    ['keyup', 'blur'].forEach(eventType => {
        if(!emailInput) return;

        emailInput.addEventListener(eventType, (event) => {
            const validationState = validateEmail(event);
            const message = document.getElementById('email-error');

            if(validationState) {
                emailInput.style.border = '1px solid #85D6A5';
                message.innerHTML = '';
            } else if(!validationState && eventType === 'blur') {
                emailInput.style.border = '1px solid #FF7070';
                message.innerHTML = getErrorMensage('Invalid email address.', emailInput);
            }
        });
    });

    // User Name Listener Validation
    ['keyup', 'blur'].forEach(eventType => {
        if(!userNameInput) return;

        userNameInput.addEventListener(eventType, (event) => {
            const validationState = validateUserName(event);
            const message = document.getElementById('user-name-error');

            if(validationState) {
                userNameInput.style.border = '1px solid #85D6A5';
                message.innerHTML = '';   
            } else if(!validationState && eventType === 'blur') {
                userNameInput.style.border = '1px solid #FF7070';
                message.innerHTML = getErrorMensage('Minimum of 6 characters.', userNameInput);
            }
        });
    });
}

// Save functions in global scope
window.validateEmail = validateEmail;
window.passwordVisible = passwordVisible;
window.showValidations = showValidations;
window.showMessagePopUp = showMessagePopUp;
window.validatePassword = validatePassword;
window.validateUserName = validateUserName;
window.showNotification = showNotification;
window.showValidationsHtml = showValidationsHtml;
window.showConfirmationPopUP = showConfirmationPopUP;
window.handleConfirmationOptions = handleConfirmationOptions;
window.activateValidationsListener = activateValidationsListener;