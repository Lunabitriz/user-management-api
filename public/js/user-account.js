function toggleEditOption() {
    const bioDescryption = document.getElementById('bio-descryption');
    const visibilityIcon = document.getElementById('password-visibility');
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

    resetInfoDisplay();
}

// Function to switch selected themes
const themes = document.querySelectorAll('.theme-box');

themes.forEach(theme => {
    theme.addEventListener('click', () => {
        themes.forEach(t => t.classList.remove('selected'));
        theme.classList.add('selected');
    })
});

// Function to save and load the selected theme
document.getElementById('save-selected-theme').addEventListener('click', () => {
    const themeSelected = document.querySelector('.theme-box.selected');
    const theme = themeSelected.getAttribute('data-theme');
    
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme)
    closeSettings();
});

// Function to open settings 
function openSettings() {
    document.getElementById('settings').style.display = 'block';
    document.getElementById('container').style.display = 'none';
    document.body.classList.add('shadow-active');
}

// Function to close settings 
function closeSettings() {
    document.getElementById('container').style.display = 'block';
    document.getElementById('settings').style.display = 'none';
    document.body.classList.remove('shadow-active');
}

document.getElementById('close-settings').addEventListener('click', () => {
    closeSettings();
});

document.getElementById('new-password').addEventListener('click', () => {
    document.getElementById('validation').classList.add('show');
    document.getElementById('validation').style.display = 'block';
});

// Make the password visible
function passwordVisible() {
    const password = document.getElementById('new-password');
    const visibleIcon = document.getElementById('visible-icon');
    const notVisibleIcon = document.getElementById('not-visible-icon');

    const isVisible = visibleIcon.style.display != 'none';
    
    password.type = isVisible ? 'text' : 'password';
    visibleIcon.style.display = isVisible ? 'none' : 'block';
    notVisibleIcon.style.display = isVisible ? 'block' : 'none';
}

// Show messages pop-ups 
function showMessagePopUp(tipo, titulo, message) {
    const container = document.getElementById('pop-up-container');
    document.getElementById('overflow').classList.add('active');

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

            <button onclick="hidePopUp()" id="popup-confirm-btn" class="btn text-white my-2 w-100" style="background-color: #FF5C5C;">
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

// Show pop-up for save edited changes
document.getElementById('save-changes-btn').addEventListener('click', () => {
    showConfirmationPopUP(
        'edit', 
        'Salvar alterações?', 
        'Tem certeza que deseja atualizar seus dados?',
        'Salvar alterações'
    );
});

// Show pop-up for account remove
document.getElementById('remove-account-btn').addEventListener('click', () => {
    showConfirmationPopUP(
        'delete', 
        'Excluir Perfil?', 
        'Tem certeza que deseja excluir a sua conta?<strong>Esta ação é permanente e não pode ser desfeita.</strong>', 
        'Excluir perfil'
    ); 
});

// Show pop-up for logout
document.getElementById('logout-btn').addEventListener('click', () => {
    showConfirmationPopUP(
        'logout',
        'Sair do Perfil?',
        'Tem certeza que deseja sair da sua conta?',
        'Sair do Perfil'
    );
});

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

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileRead = new FileReader();                
        fileRead.onload = () => resolve(fileRead.result);
        fileRead.onerror = reject;
        fileRead.readAsDataURL(file);
    });
}

async function manipulateFile(event) {
    const file = event.target.files[0];

    if(file) {
        try {
            if(!file.type.startsWith('image/')) {
                showMessagePopUp('error', 'Arquivo Inválido', 'Selecione uma imagem, por favor!');
                return;
            }

            if(file.size > 5 * 1024 * 1024) {
                showMessagePopUp('error', 'Erro ao Carregar', 'Selecione uma imagem menor, por favor!');
                return;
            }

            // Envia o arquivo original para o novo endpoint
            await saveProfilePhoto(file);
            
            // Converte para base64 apenas para exibição na tela
            const fileConverted = await convertToBase64(file);
            document.getElementById('profile-image').src = fileConverted;
            localStorage.setItem('userPhoto', fileConverted);
        } catch(error) {
            showMessagePopUp('error', 'Erro ao Processar', 'Tente novamente mais tarde, por favor|');
        }
    }
}

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
        showMessagePopUp('success', 'Sucesso ao Atualizar', 'Imagem salva com sucesso!');
    } else {
        showMessagePopUp('error', 'Erro ao Salvar', 'Erro ao carregar imagem para o banco');
        // showNotification('Erro ao carregar imagem para o banco.', 'danger');
    }
}

[ 'new-name', 'new-email'].forEach(id => {
    const input = document.getElementById(id);

    input.addEventListener('keydown', (event) => {
        if((event.key === 'Backspace' || event.key === 'Tab') && input.value.length <= 0) {
            input.value = input.placeholder;
            event.preventDefault();
        }
    })
})

async function saveChanges() {
    const newName = document.getElementById('new-name').value;
    const newEmail = document.getElementById('new-email').value;
    const newPassword = document.getElementById('new-password').value;

    if(!newName.trim() && !newEmail.trim() && !newPassword.trim()) {
        showMessagePopUp('error', 'Erro ao Atualizar', 'Insira dados válidos para atualizar!')
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
        showMessagePopUp('success', 'Dados Atualizados!', 'Usuário atualizado com sucesso!');
        
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        
        localStorage.setItem('userName', (updateData.nome) ? updateData.nome : userName);
        localStorage.setItem('userEmail', (updateData.email) ? updateData.email : userEmail);
        loadUserData();
        
    } else {
        showMessagePopUp('error', 'Erro ao Atualizar', 'Erro ao salvar as alterações do usuário no banco de dados.');
    }
}

async function removeAccount() {
    const confirmation = confirm('Tem certeza que deseja excluir sua conta?');

    if(!confirmation) {
        return;
    }

    const userId = localStorage.getItem('userId');
    
    if(!userId) {
        showNotification('Usuário não identificado. Faça login novamente!', 'warning');
        return;
    }

    const response = await authenticatedFetch(`http://localhost:3000/user/${userId}`, {
        method: 'DELETE'
    });

    if(response.ok) {
        showNotification('Conta excluída com sucesso!', 'success');
        logout();
    } else {
        showNotification('Erro ao deletar sua conta!', 'danger');
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

async function loadUserData() {
    // Verifica se o usuário está autenticado
    if(!isAuthenticated()) {
        showNotification('Usuário não autenticado. Direcionando para a tela de login!', 'warning');

        setTimeout(() => {
            window.location = 'index.html';
        }, 650);

        return;
    }

    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userPhoto = localStorage.getItem('userPhoto');

    document.getElementById('account-name').innerText = userName
    document.getElementById('name-profile').innerText = userName;
    document.getElementById('email-profile').innerText = userEmail;
    document.getElementById('password-profile').innerText = '••••••••';

    if(!!userPhoto) document.getElementById('profile-image').src = userPhoto;
    
    document.getElementById('new-name').placeholder = userName;
    document.getElementById('new-email').placeholder = userEmail;
    document.getElementById('new-password').placeholder = '••••••••';

    // Load Themes
    const selectedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', selectedTheme);
}

// Função para fazer logout
function logout() {
    const rememberMeActive = localStorage.getItem('rememberMe');

    if(rememberMeActive === 'disabled') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhoto');
    }
    
    window.location.href = 'index.html';
}

loadUserData();