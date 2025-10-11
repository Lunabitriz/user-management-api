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

function showValidationsHtml(containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <ul id="validation" class="p-0">
            <li id="lenght" class="default">
                <i class="fa-solid fa-lock"></i> Pelo menos 8 caracteres
            </li>
            <li id="number" class="default">
                <i class="fa-solid fa-lock"></i> Pelo menos 1 número
            </li>
            <li id="uppercase" class="default">
                <i class="fa-solid fa-lock"></i> Pelo menos 1 letra maiúscula
            </li>
            <li id="symbol" class="default">
                <i class="fa-solid fa-lock"></i> Pelo menos 1 símbolo (ex: !, @, #, $, %...)
            </li>
        </ul>
    `;
}

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

// Save functions in global scope
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.validateUserName = validate
UserName;
window.showValidationsHtml = showValidationsHtml;
window.showNotification = showNotification;
window.passwordVisible = passwordVisible;