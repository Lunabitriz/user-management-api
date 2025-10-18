// --------------- User account page Scripts ---------------
function toggleEditOption() {
    const bioDescryption = document.getElementById('bio-descryption');
    const visibilityIcon = document.getElementById('new-password-label');
    const accountOptions = document.getElementById('account-options');
    const profileInfo = document.querySelectorAll('.profile-info');
    const editOptions = document.getElementById('edit-options');

    const isEditing = bioDescryption.classList.toggle('active');
    accountOptions.classList.toggle('active', !isEditing);
    editOptions.classList.toggle('active', isEditing)
    
    profileInfo.forEach(p => p.style.display = isEditing ? 'none' : 'block');
    visibilityIcon.style.display = isEditing ? 'flex' : 'none';
    showValidationsHtml('profile-edit-password-validations');

    document.querySelectorAll('.edit-input').forEach(input => {
        input.value = "";
    });

    document.querySelectorAll('.edit-input-error').forEach(msg => {
        msg.innerHTML = '';
    });

    document.querySelectorAll('.edit-input').forEach(input => {
        input.style.border = 'var(--input-border)';
    });

    resetInfoDisplay();
}

// Listener to toggle editing options
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const editProfileBtn = document.getElementById('edit-profile-btn');
if(cancelEditBtn && editProfileBtn) {
    [cancelEditBtn, editProfileBtn].forEach(btn => {
        btn.addEventListener('click', () => toggleEditOption());
    });
}

// Function to open settings 
function openSettings() {
    document.getElementById('settings').style.display = 'block';
    document.getElementById('container').style.display = 'none';
    document.body.classList.add('shadow-active');
    renderThemes();
}

// Function to close settings 
function closeSettings() {
    document.getElementById('settings').style.display = 'none';
    document.getElementById('container').style.display = 'block';
    document.getElementById('themes-section').innerHTML = '';
    document.body.classList.remove('shadow-active');
}

// Listener to close settings 
const closeSettingsBtn = document.getElementById('close-settings');
if(closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
        closeSettings();
    });
}

// Listener to open settings
const openSettingsBtn = document.getElementById('open-settings-btn');
if(openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () =>  openSettings());
}

// Function to render themes
async function renderThemes() {
    const themesContainer = document.getElementById('themes-section');
    const pageThemes = ['Sunset', 'East Blue', 'Kuma', 'Dark Mode', 'Dark Mode', 'Dark Mode'];

    const themesHtml = pageThemes.map(theme => {        
        const themeDefined = theme == 'Dark Mode' ? 'inactive' : '';
        const themeFormated = theme.toLowerCase().replace(' ', '-');

        const themeImage = theme == 'Dark Mode' 
            ? 'profile-img-default'
            : `profile-cover-themes/${themeFormated}-cover`;

        return `
            <div class="theme-box ${themeDefined}" data-theme="${themeFormated}-theme">
                <div class="theme-image">
                    <img src="imgs/${themeImage}.jpg" alt="Theme Image">
                </div>

                <div class="theme-header flex items-center">
                    <div class="circle-theme rounded-full"></div>
                    <h4 class="mb-0">${theme}</h4>
                </div>
            </div>
        `
    }).join('');

    themesContainer.innerHTML = `
        <div class="header-settings">
            <h3>Select Theme</h3>
            <p class="mb-4">
                🌿 Personalize your workspace to make it more comfortable!
            </p>
        </div>

        <div class="flex justify-between flex-wrap gap-6">
            <!-- Themes Options -->
            ${themesHtml}
            <button id="save-selected-theme" class="fade-in btn">
                Save Theme
            </button>
        </div>
    `;

    // Function to switch selected themes
    const themes = document.querySelectorAll('.theme-box');
    themes.forEach(theme => {
        theme.addEventListener('click', () => {
            themes.forEach(t => t.classList.remove('selected'));
            theme.classList.add('selected');
        });
    });
    
    // Make the selected theme starts active
    const themeSaved = (localStorage.getItem('theme') + '-theme');
    themes.forEach(theme => {
        theme.getAttribute('data-theme') == themeSaved 
            ? theme.classList.add('selected')
            : theme.classList.remove('selected');
    });

    // Function to save and load the selected theme
    const selectedTheme = document.getElementById('save-selected-theme');
    if(selectedTheme) {
        selectedTheme.addEventListener('click', () => {
            const themeSelected = document.querySelector('.theme-box.selected');
            const theme = themeSelected.getAttribute('data-theme');
            const themeFormated = theme.slice(0, theme.indexOf('-theme'));

            saveTheme(themeFormated);

            document.documentElement.setAttribute('data-theme', themeFormated);
            localStorage.setItem('theme', themeFormated);
            closeSettings();
        });
    }
}

// Function to try saves the selected theme in database
async function saveTheme(selectedTheme) {
    const userId = localStorage.getItem('userId');
    if(!userId || !selectedTheme) return;

    const userUpdated = {
        id: parseInt(userId)
    };

    userUpdated.accountTheme = selectedTheme ?? 'sunset';

    try {
        const response = await authenticatedFetch('http://localhost:3000/user', {
            method: 'PUT',
            body: JSON.stringify(userUpdated)
        });

        if(response.ok) {
            showMessagePopUp('success', 'Update Successful', 'Theme saved successfully!');
        } else {
            showMessagePopUp('error', 'Save Error', 'Failed to upload theme to the database.');
        }
    } catch(error) {
        console.error('Erro: ', error);
    }
}

// Listener to show password validations
const newPassword = document.getElementById('new-password');
if(newPassword) {
    newPassword.addEventListener('click', () => {
        document.getElementById('validation').classList.add('show');
        document.getElementById('validation').style.display = 'block';
    });
}

// Show pop-up for save edited changes
const saveChangesBtn = document.getElementById('save-changes-btn');
if(saveChangesBtn) {
    saveChangesBtn.addEventListener('click', () => {
        showConfirmationPopUP(
            'edit', 
            'Save Changes?', 
            'Are you sure you want to update your information?',
            'Save Changes'
        );
    });
}

// Show pop-up for account remove
const removeAccountBtn = document.getElementById('remove-account-btn');
if(removeAccountBtn) {
    removeAccountBtn.addEventListener('click', () => {
        showConfirmationPopUP(
            'delete', 
            'Delete Account?', 
            'Are you sure you want to delete your account? <br><strong>This action is permanent and cannot be undone.</strong>', 
            'Delete Account'
        ); 
    });
}

// Show pop-up for logout
const logoutBtn = document.getElementById('logout-btn');
if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        showConfirmationPopUP(
            'logout',
            'Sign Out?',
            'Are you sure you want to sign out?',
            'Sign Out'
        );
    });
}

// Function for hidden pop-up
function hidePopUp() {
    document.getElementById('pop-up-container').innerHTML = "";
    document.getElementById('overflow').classList.remove('active');
}

// Function to reset the profile infos to default
function resetInfoDisplay() {
    const inputPassword = document.getElementById('new-password');
    const invisibleIcon = document.getElementById('not-visible-icon');
    const visibleIcon = document.getElementById('visible-icon');

    // Resets values to default
    inputPassword.type = 'password';
    visibleIcon.style.display = 'flex';
    invisibleIcon.style.display = 'none';
}

// Function to convert images to base 64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileRead = new FileReader();                
        fileRead.onload = () => resolve(fileRead.result);
        fileRead.onerror = reject;
        fileRead.readAsDataURL(file);
    });
}

// Listener to manipulate select file
const selectFileInput = document.getElementById('select-file-input');
if(selectFileInput) {
    selectFileInput.addEventListener('change', (event) => manipulateFile(event));
} 

// Function to manipulate the select file 
async function manipulateFile(event) {
    const file = event.target.files[0];

    if(file) {
        try {
            if(!file.type.startsWith('image/')) {
                showMessagePopUp('error', 'Invalid File', 'Please select an image.');
                return;
            }

            if(file.size > 5 * 1024 * 1024) {
                showMessagePopUp('error', 'Upload Error', 'Please choose a smaller image.');
                return;
            }

            // Envia o arquivo original para o novo endpoint
            await saveProfilePhoto(file);
            
            // Converte para base64 apenas para exibição na tela
            const fileConverted = await convertToBase64(file);
            document.getElementById('profile-image').src = fileConverted;
            localStorage.setItem('userPhoto', fileConverted);
        } catch(error) {
            showMessagePopUp('error', 'Processing Error', 'Please try again later.');
        }
    }
}

// Function to save profile photo
async function saveProfilePhoto(file) {
    const userId = parseInt(localStorage.getItem('userId'));

    // Cria FormData para enviar o arquivo
    const formData = new FormData();
    formData.append('foto', file);
    formData.append('id', parseInt(userId));
    
    const response = await fetch('http://localhost:3000/user/upload-foto', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
    });

    if(response.ok) {    
        showMessagePopUp('success', 'Update Successful', 'Image saved successfully!');
    } else {
        showMessagePopUp('error', 'Save Error', 'Failed to upload image to the database.');
    }
}

// Listener to inputs autocomplete
['new-name', 'new-email'].forEach(id => {
    const input = document.getElementById(id);
    if(!input) return;

    input.addEventListener('keydown', (event) => {
        if((event.key === 'Backspace' || event.key === 'Tab') && input.value.length <= 0) {
            input.value = input.placeholder;
            event.preventDefault();
        }
    })
});

// Function to save profile changes
async function saveChanges() {
    const newName = document.getElementById('new-name').value;
    const newEmail = document.getElementById('new-email').value;
    const newPassword = document.getElementById('new-password').value;

    if(!newName.trim() && !newEmail.trim() && !newPassword.trim()) {
        showMessagePopUp('error', 'Update Error', 'Please enter valid data to update.')
        return;
    }

    const userId = localStorage.getItem('userId');

    const updateData = {
        id: parseInt(userId)
    };

    updateData.nome = newName.trim() || null;
    updateData.email = newEmail.trim() || null;
    updateData.senha = newPassword.trim() || null;

    const response = await authenticatedFetch('http://localhost:3000/user', {
        method: 'PUT',
        body: JSON.stringify(updateData)
    });

    if(response.ok) {
        showMessagePopUp('success', 'Data Updated', 'User information updated successfully.');
        
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        
        localStorage.setItem('userName', (updateData.nome) ? updateData.nome : userName);
        localStorage.setItem('userEmail', (updateData.email) ? updateData.email : userEmail);
        loadUserData();
    } else {
        showMessagePopUp('error', 'Update Error', 'Failed to save user changes to the database.');
    }
}

// Function to remove account
async function removeAccount() {
    const userId = localStorage.getItem('userId');
    
    if(!userId) {
        showNotification('User not identified. Please log in again.', 'warning');
        return;
    }

    const response = await authenticatedFetch(`http://localhost:3000/user/${userId}`, {
        method: 'DELETE'
    });

    if(response.ok) {
        showNotification('Account deleted successfully. Redirecting to home...', 'success');
        logout();
    } else {
        showNotification('Failed to delete your account!', 'danger');
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
        
        showNotification('Session expired. Please log in again.', 'warning');
        
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

// Function to load registred user informations
async function loadUserData() {
    // Verify if user is autenticate
    if(!isAuthenticated()) {
        showNotification('User not authenticated. Redirecting to login page...', 'warning');

        setTimeout(() => {
            window.location = 'index.html';
        }, 650);

        return;
    }

    const userId = localStorage.getItem('userId');

    try {
        const response = await authenticatedFetch(`http://localhost:3000/user/${userId}`, {
            method: 'GET'
        });

        if(response.ok) {
            console.log('Sucesso ao acessar dados do usuário!');
            const userData = await response.json();

            const userName = userData.nome;
            const userEmail = userData.email;
            const userPhoto = userData.fotoPerfil;
            const selectedTheme = userData.accountTheme;

            // Show informations in profile data fields
            document.getElementById('account-name').innerText = userName;
            document.getElementById('name-profile').innerText = userName;
            document.getElementById('email-profile').innerText = userEmail;
            document.getElementById('password-profile').innerText = '••••••••';

            // Load profile photo if is exists            
            document.getElementById('profile-image').src = (userPhoto == null) 
                                                            ? './imgs/profile-img-default.jpg' 
                                                            : userPhoto;
                            
            // Show the profile data in placeholders 
            document.getElementById('new-name').placeholder = userName;
            document.getElementById('new-email').placeholder = userEmail;
            document.getElementById('new-password').placeholder = '••••••••';

            // Load Themes
            document.documentElement.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('userTheme', selectedTheme);
        }
    } catch(error) {
        console.log('Erro: ', error);
    }
}

// Function to logout
function logout() {
    const rememberMeActive = localStorage.getItem('rememberMe');

    if(rememberMeActive === 'disabled') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhoto');
        localStorage.removeItem('userTheme');
    }
    
    window.location.href = 'index.html';
}

// --------------- Index page Scripts ---------------
// Toggle auth form
function toggleAuthForm(form) {
    const rememberMe = document.getElementById('remember-me');
    const loginForm = document.getElementById('login-container');
    const registerForm = document.getElementById('register-container');
    const registerInputs = document.querySelectorAll('.input-register');
    const loginInputs = document.querySelectorAll('.input-login');

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

        clearRegisterForm();

        const validationsContainer = document.getElementById('validation');
        if(!validationsContainer) return;

        validationsContainer.classList.remove('show');
        validationsContainer.style.display = 'none';
    }
}

// Function to reset inputs in the Register form
function clearRegisterForm() {
    document.querySelectorAll('.input-register').forEach(input => {
        input.style.border = 'var(--input-border)';
    });

    document.querySelectorAll('.input-register').forEach(input => {
        input.value = '';
    });

    document.querySelectorAll('.input-error').forEach(msg => {
        msg.innerHTML = '';
    });
}

// Listener to toggle auth form
const loginToggleBtn = document.getElementById('login-toggle-btn');
const registerToggleBtn = document.getElementById('register-toggle-btn');
if(loginToggleBtn && registerToggleBtn) {
    [loginToggleBtn, registerToggleBtn].forEach((toggleBtn) => {
        toggleBtn.addEventListener('click', () => toggleAuthForm(toggleBtn.id.split('-')[0]));
    });
}

// Listener to redirect the user to forgot password page
const forgotBtn = document.getElementById('forgot-password');
if(forgotBtn) {
    forgotBtn.addEventListener('click', () => {
        window.location = 'forgot-password-page.html';
    });
}

// Listener to show register password validations
const registerPassword = document.getElementById('register-password');
if(registerPassword) {
    document.getElementById('register-password').addEventListener('focus', () => {
        showValidationsHtml('register-password-validations');
        showValidations();
    });
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
if(registerPassword && loginPassword) {
    [registerPassword, loginPassword].forEach(input => {
        input.addEventListener('keypress', (event) => {
            if(event.key === 'Enter') login();
        });
    });
}

// Listener to login
const submitLoginBtn = document.getElementById('submit-login');
if(submitLoginBtn) {
    submitLoginBtn.addEventListener('click', () => login());
}

// Listener to register
const submitRegisterButton = document.getElementById('submit-register');
if(submitRegisterButton) {
    submitRegisterButton.addEventListener('click', () => register());
}

// Function to save User ID + User access token
function savesUserData(result) {
    localStorage.setItem('userId', result.user.id);
    localStorage.setItem('access_token', result.access_token);
}

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
        });

        if(response.ok) {
            showNotification('Login successful!', 'success');
            const result = await response.json();

            // Saves data to localStorage and the JWT token
            savesUserData(result);
            localStorage.setItem('rememberMe', rememberMe.checked ? 'active' : 'disabled');
            
            // Clear the input fields
            email = '';
            senha = '';
            
            // Redirects to the user's account page
            window.location.href = 'user-account.html';
        } else {
            showNotification('Login failed! Please check your credentials', 'warning');
        }
    } catch(error) {
        showNotification('Database access error!', 'danger');
        console.log(error);
    }            
}

// Register function
async function register() {
    const email = document.getElementById('register-email').value;
    const nome = document.getElementById('register-user-name').value;
    const senha = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-register-password').value;

    const isPasswordMismatch = senha !== confirmPassword;
    const inputsAreNotFilled = !email || !nome || !senha || !confirmPassword;

    if(inputsAreNotFilled || isPasswordMismatch) {
        showNotification('Error registering! Enter valid data', 'warning');
        return;
    };
    
    const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ nome, email, senha })
    });
    
    if(response.ok) {
        showNotification('Account created successfully. Redirecting to your profile...', 'success');
        const result = await response.json();

        savesUserData(result);
        clearRegisterForm();

        window.location.href = 'user-account.html';
    } else {
        showNotification('Failed to create account.', 'danger');
    }
}

// load user login data
function loadUserLoginData() {
    const rememberMeIsActive = localStorage.getItem('rememberMe');
    
    if(rememberMeIsActive === 'active') {
        const userEmail = localStorage.getItem('userEmail');
        document.getElementById('login-email').value = userEmail;
    }

    // Clear localStorage if the "Forgot Password" was accessed
    localStorage.removeItem('enterCode');
    localStorage.removeItem('recoveryEmail');
    localStorage.removeItem('currentSeconds');
    localStorage.removeItem('currentMinutes');
    localStorage.removeItem('passwordRedefined');
}

// Initializations
if(window.location.href.endsWith('user-account.html')) {
    activateValidationsListener('new-email', 'new-password', 'new-name');
    loadUserData();
} else if(window.location.href.endsWith('index.html')) {
    activateValidationsListener('register-email', 'register-password', 'register-user-name');
    loadUserLoginData();
}