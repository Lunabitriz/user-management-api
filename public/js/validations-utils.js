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

    return !(value.length >= 8) || !numberRegex || !symbolRegex || !upperCaseRegex ? 1 : 0;
}

// Email Validation
function validateEmail(event) {
    let value = event.target.value;

    return !/@/.test(value) || !/\./.test(value) ? 1 : 0;
}

// User Name Validation
function validateUserName(event) {
    let value = event.target.value;

    return value.length < 6 ? 1 : 0;
}

// Save functions in global scope
window.validatePassword = validatePassword;
window.validateUserName = validateUserName;
window.validateEmail = validateEmail;