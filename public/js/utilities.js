// Function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');

    document.querySelectorAll('.alert-notification').forEach(notif => {
        notif.classList.add('hidden');
        notif.classList.remove('show');
    });

    notification.className = `
        fixed
        shadow
        font-semibold
        bg-white gap-2 p-2
        flex items-center justify-between
        alert-notification fade show
    `;

    notification.style.cssText = `top: 20px; right: 20px;`;

    // Vou melhorar
    const icons = {
        info: 'info',
        danger: 'error',
        success: 'success',
        warning: 'warning'
    };
    
    const iconImage = icons[type];
    const color = getColorByType(type);
    
    notification.style.borderLeft = `4px solid ${color}`;
    notification.innerHTML = `
        <img src="imgs/pop-ups-arts/${iconImage}-icon.jpg" alt="${type} icon" style="width: 70px;">

        <div class="flex items-center justify-between gap-2 w-full">
            <p class="m-0 font-semibold">${message}</p>

            <button type="button" class="btn-close-notification mr-2 text-black py-2 px-4 rounded-md shadow-sm" aria-label="Close">
                X
            </button>
        </div>
    `;

    // Function to hide notification
    function hideNotification() {
        notification.classList.add('hide');
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }

    // Add the created notification in the body 
    document.body.appendChild(notification);

    // Listener to close notification
    const closeBtn = notification.querySelector('.btn-close-notification');
    closeBtn.addEventListener('click', () => hideNotification());

    setTimeout(() => {
        if(notification && notification.parentNode) hideNotification();
    }, 5000);
}

// Show messages pop-ups 
function showMessagePopUp(tipo, titulo, message) {
    const container = document.getElementById('pop-up-container');
    document.getElementById('overflow').classList.add('active');

    let color = getColorByType(tipo);

    container.innerHTML = `        
        <div class="max-w-md mx-auto bg-white rounded-2xl flex flex-col items-center justify-center gap-2 px-12 py-12" style="width: 348px;">
            <div class="email-ilustration w-full flex flex-col items-center justify-center">
                <img src="./imgs/pop-ups-arts/${tipo}-icon.jpg" alt="${tipo} icon" class="mb-4">
            </div>

            <div class="header-form text-center">
                <h3>${titulo}</h3>
                <p class="mb-3">
                    ${message}
                </p>
            </div>

            <button onclick="hidePopUp()" id="popup-confirm-btn" class="btn text-white w-full" style="background-color: ${color};">
                Confirm
            </button>
        </div>
    `;
}

// Show confirm or cancel pop-ups
function showConfirmationPopUP(tipo, titulo, message, ctaBtn) {
    const container = document.getElementById('pop-up-container');

    document.getElementById('overflow').classList.add('active');
    const popUpColor = getColorByType(tipo);
    
    container.innerHTML = `
        <div class="container bg-white rounded-2xl flex flex-col items-center justify-center gap-2 px-12 py-12" style="width: 420px;">
            <div class="${tipo}-ilustration">
                <img src="./imgs/pop-ups-arts/${tipo}-icon.jpg" alt="${tipo} image" width="193px">
            </div>
            <div class="header-form text-center">
                <h3 class="text-center">${titulo}</h3>
                <p class="mb-0 text-center">
                    ${message}
                </p>
            </div>
            <div class="flex justify-between w-full gap-2 mt-2">
                <button id="popup-cancel-btn" class="btn btn-popup-confirm w-full">
                    Cancelar
                </button>

                <button class="btn btn-popup-confirm text-white w-full" style="background-color: ${popUpColor};">
                    ${ctaBtn}
                </button>
            </div>
        </div>
    `;

    // Listener to close pop-up if confirmed
    document.querySelectorAll("#pop-up-container .btn-popup-confirm").forEach(btn => {
        btn.addEventListener('click', () => {
            handleConfirmationOptions(tipo, btn.id);
        });
    });
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

// Return a custom error message
function getErrorMensage(message, inputId) {
    return `
        <i class="fa-solid fa-circle-exclamation"></i>

        <label class="input-label" for="${inputId}">
            ${message} 
        </label>
    `;
}

// Function to get color by type defined
function getColorByType(type) {
    const colorByType = {
        'error': '#FF5C5C',
        'danger': '#FF5C5C',
        'delete': '#FF5C5C',

        'info': '#3b97e3',
        'error-database': '#3b97e3',

        'warning': '#F37913',
        'logout': '#F37913',
        'edit': '#F37913',
    };
    
    return colorByType[type] || '#5da271';
}

// Inputs configurations
const inputsConfig = {
    login: [
        {
            id: 'login-email',
            type: 'text',
            placeholder: 'Your email',
            icon: 'imgs/user.png',
            iconAlt: 'User icon',
            autocomplete: 'username'
        },
        {
            id: 'login-password',
            type: 'password',
            placeholder: 'Your password',
            icon: 'imgs/lock.png',
            iconAlt: 'Lock icon',
            autocomplete: 'current-password',
            showPasswordToggle: true
        }
    ],
    register: [
        {
            id: 'register-user-name',
            type: 'text',
            placeholder: 'Username',
            icon: 'imgs/user.png',
            iconAlt: 'User icon',
            errorId: 'user-name-error',
            iconId: 'user-name-img'
        },
        {
            id: 'register-email',
            type: 'email',
            placeholder: 'Enter your email',
            icon: 'imgs/email.png',
            iconAlt: 'Email icon',
            iconClass: 'top-4',
            errorId: 'email-error',
            iconId: 'email-img'
        },
        {
            id: 'register-password',
            type: 'password',
            placeholder: 'Create a password',
            icon: 'imgs/lock.png',
            iconAlt: 'Lock icon',
            autocomplete: 'off',
            iconId: 'password-img',
            errorId: 'password-message',
            validationsId: 'register-password-validations',
            showPasswordToggle: true,
        },
        {
            id: 'confirm-register-password',
            type: 'password',
            placeholder: 'Confirm password',
            icon: 'imgs/lock.png',
            iconAlt: 'Lock icon',
            autocomplete: 'off',
            errorId: 'confirm-password-message',
            iconId: 'confirm-password-img',
            showPasswordToggle: true,
        }
    ],
    // edit: [
    //     {
    //         id: 'new-name',
    //         type: 'text',
    //         placeholder: 'Confirm password',
    //         icon: 'imgs/lock.png',
    //         iconAlt: 'Lock icon',
    //         autocomplete: 'off',
    //         errorId: 'confirm-password-message',
    //         iconId: 'confirm-password-img',
    //         showPasswordToggle: true,
    //     }
    // ]
};

function generateInputs(inputType) {
    const {
        id,
        type,
        icon,
        iconAlt,
        placeholder,
        iconId = '',
        errorId = '',
        autocomplete = '',
        validationsId = '',
        showPasswordToggle = false,
        inputClass = 'input-login'
    } = inputType;

    const containerId = showPasswordToggle ? `${id}-container` : '';
    const containerClass = showPasswordToggle ? 'input-item relative' : 'input-item';

    return `
        <div ${containerId ? `id="${containerId}"` : ''} class="${containerClass}">
            ${errorId ? `<div id="${errorId}" class="input-error"></div>` : ''}

            <input 
                type="${type}" 
                id="${id}" 
                class="${inputClass}"
                autocomplete="${autocomplete}"
                placeholder="${placeholder}"
            >
            <img 
                ${iconId ? `id="${iconId}"` : ''}
                class="input-icon" src="${icon}" alt="${iconAlt}"
            >

            ${showPasswordToggle ? `<label id="${id + '-label'}" class="password-label"></label>` : ''}

            ${validationsId ? `<div id="${validationsId}"></div>` : ''}
        </div>
    `;
}

function getInputsByType(inputType) {
    const inputs = inputsConfig[inputType];
    if(!inputs) return;

    const inputClass = inputType === 'register' 
                       ? 'input-register' 
                       : 'input-login';
    
    return inputs.map(input => 
        generateInputs({ ...input, inputClass })
    ).join('\n');
}

function renderInputs(formType, containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;

    container.innerHTML = getInputsByType(formType);
    
    // Adicionar ícones de visualizar senha após criar os elementos
    addPasswordToggleIcons();
    setupPasswordToggleListeners();
}

document.addEventListener('DOMContentLoaded', () => {
    renderInputs('login', 'login-inputs-container');
    renderInputs('register', 'register-inputs-container');

    // Listener to show register password validations
    const registerPassword = document.getElementById('register-password');
    if(registerPassword) {
        document.getElementById('register-password').addEventListener('focus', () => {
            showValidationsHtml('register-password-validations');
            showValidations();
        });
    }

    // Listener to login
    const submitLoginBtn = document.getElementById('submit-login');
    if(submitLoginBtn) {
        submitLoginBtn.addEventListener('click', login);
    }

    // Listener to register
    const submitRegisterButton = document.getElementById('submit-register');
    if(submitRegisterButton) {
        submitRegisterButton.addEventListener('click', register);
    }

    // Listener to accompany password validations
    const confirmRegisterPassword = document.getElementById('confirm-register-password');
    if(confirmRegisterPassword) {
        ['keyup', 'blur', 'focus'].forEach(eventType => {
            confirmRegisterPassword.addEventListener(eventType, (event) => {
                const newPassowordInput = document.getElementById('register-password').value.trim();
                const message = document.getElementById('confirm-password-message');

                let inputValue = event.target.value;
                let errorMessage = (!newPassowordInput) ? 'Please fill in the first field.' : 'Passwords must match.'
                
                const isValidPassword = !newPassowordInput || inputValue !== newPassowordInput;

                if(!isValidPassword) {
                    message.innerHTML = "";
                    confirmRegisterPassword.style.backgroundColor = '#fff';
                    confirmRegisterPassword.style.border = '1px solid #85D6A5';
                } else {
                    confirmRegisterPassword.style.border = '1px solid #FF7070';                    
                    message.innerHTML = getErrorMensage(errorMessage, confirmRegisterPassword);
                }
            });
        });
    }

    // Listener to create shortcut for direct login with "Enter"
    const loginPassword = document.getElementById('login-password');
    if(confirmRegisterPassword && loginPassword) {
        [confirmRegisterPassword, loginPassword].forEach(input => {
            input.addEventListener('keypress', (event) => {
                if(event.key === 'Enter') login();
            });
        });
    }
    
    // Create password register validations
    showValidationsHtml('register-password-validations');
    activateValidationsListener('register-email', 'register-password', 'register-user-name');
    activateValidationsListener('new-email', 'new-password', 'new-name');
})

// Function to show the loading spinner
function showLoadingSpinner(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;

    // Create the spinner element
    const spinner = document.createElement('div');
    spinner.id = `${containerId}-spinner`;
    spinner.className = 'loading-container flex-col justify-center items-center gap-2 absolute mb-3';
    spinner.style.bottom = '4px';

    spinner.innerHTML = `
        <div class="loading-spinner active rounded-full"></div>
        <div class="flex" style="gap: 2px">
            <p class="loading-text">Processing</p> <span id="load-points"></span>
        </div>
    `;

    // Add the created element in "container"
    container.appendChild(spinner);

    // Activates and displays the spinner in the container
    setTimeout(() => {
        document.getElementById(`${containerId}-spinner`).classList.add('active');
    }, 600);

    // Activates the spinner type effect
    typeEffect('...', 'load-points');
}

// Function to typing effect on text
function typeEffect(text, textFieldId) {
    const textField = document.getElementById(textFieldId);
    let index = 0;

    const typingInterval = setInterval(() => {
        if(index < text.length) {
            textField.innerText += text[index];
            index++;
        } else {
            clearInterval(typingInterval);
            setTimeout(() => {
                textField.innerText = '';
                typeEffect(text, textFieldId);
            }, 100);
        }
    }, 980);
}

// Function to hide the loading spinner
function hideLoadingSpinner(containerId) {
    const spinner = document.getElementById(containerId + '-spinner');
    if(!spinner) return;

    document.getElementById(containerId).removeChild(spinner);
}

// Make the password visible
function passwordVisible(inputId, containerId) {
    const password = document.getElementById(inputId);
    const visibleIcon = document.getElementById(`${inputId}-visible-icon`);
    const notVisibleIcon = document.getElementById(`${inputId}-not-visible-icon`);
    
    if(!password || !visibleIcon || !notVisibleIcon) return;

    const isPasswordVisible = password.type === 'text';
    
    password.type = isPasswordVisible ? 'password' : 'text';
    visibleIcon.style.display = isPasswordVisible ? 'block' : 'none';
    notVisibleIcon.style.display = isPasswordVisible ? 'none' : 'block';
}

// Show password validations
function showValidations() {
    const validations = document.getElementById('validation');
    if(!validations) return;

    validations.classList.add('show');
    validations.style.display = 'block';
}

// Show the password validation list   
function showValidationsHtml(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    
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

// Função para adicionar ícones de visualizar senha
function addPasswordToggleIcons() {
    document.querySelectorAll('.password-label').forEach(label => {
        const inputId = label.id.replace('-label', '');
        label.innerHTML = `
            <i id="${inputId}-visible-icon" class="visible-icon fa-solid fa-eye"></i>
            <i id="${inputId}-not-visible-icon" class="not-visible-icon fa-solid fa-eye-slash" style="display: none;"></i>
        `;
    });
}

// Função para configurar listeners de toggle de senha
function setupPasswordToggleListeners() {
    document.querySelectorAll('.password-label').forEach(label => {
        label.addEventListener('click', () => {
            const inputId = label.id.replace('-label', '');
            passwordVisible(inputId, inputId + '-container');
        });
    });
}

// Password validation
function validatePassword(event) {
    const lengthAuth = document.getElementById('lenght');
    const numberAuth = document.getElementById('number');
    const symbolAuth = document.getElementById('symbol');
    const upperCaseAuth = document.getElementById('uppercase');

    if(!lengthAuth || !numberAuth || !symbolAuth || !upperCaseAuth) return;
    
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

// Password Confirm Validation
function validatePassworConfirmation(valueConfirmation, password) {
    return (!password || valueConfirmation !== password) ? 0 : 1;
}

// Email Validation
function validateEmail(event) {
    if(!event) return;

    let value = event.target;
    const idealEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return !idealEmailFormat.test(value) ? 0 : 1;
}

// User Name Validation
function validateUserName(event) {
    if(!event) return;
    let value = event.target.value;

    return value.length < 6 ? 0 : 1;
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
            const validations = document.getElementById('validation');

            if(!message) return;

            if(validationState) {
                message.innerHTML = "";
                passwordInput.style.backgroundColor = '#fff';
                passwordInput.style.border = '1px solid #85D6A5';
                if(validations) {
                    validations.classList.remove('show');
                    validations.style.display = 'none';
                }
            } else if(!validationState && eventType === 'blur') {
                passwordInput.style.border = '1px solid #FF7070';                    
                message.innerHTML = getErrorMensage('Please enter a valid password.', passwordInput.id);
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

            if(!message) return;

            if(validationState) {
                emailInput.style.border = '1px solid #85D6A5';
                message.innerHTML = '';
            } else if(!validationState && eventType === 'blur') {
                emailInput.style.border = '1px solid #FF7070';
                message.innerHTML = getErrorMensage('Invalid email address.', emailInput.id);
            }
        });
    });

    // User Name Listener Validation
    ['keyup', 'blur'].forEach(eventType => {
        if(!userNameInput) return;

        userNameInput.addEventListener(eventType, (event) => {
            const validationState = validateUserName(event);
            const message = document.getElementById('user-name-error');

            if(!message) return;

            if(validationState) {
                userNameInput.style.border = '1px solid #85D6A5';
                message.innerHTML = '';   
            } else if(!validationState && eventType === 'blur') {
                userNameInput.style.border = '1px solid #FF7070';
                message.innerHTML = getErrorMensage('Minimum of 6 characters.', userNameInput.id);
            }
        });
    });
}

const functions = [
    activateValidationsListener, validateEmail, passwordVisible,
    showValidations, showMessagePopUp, validatePassword,
    validateUserName, showNotification, hideLoadingSpinner,
    showLoadingSpinner, showValidationsHtml, showConfirmationPopUP,
    handleConfirmationOptions, renderInputs, addPasswordToggleIcons,
    setupPasswordToggleListeners
];

// Save functions in global scope
functions.forEach(func => window.func = func);