function toggleEditOption() {
    const bioDescryption = document.getElementById('bio-descryption');
    const accountOptions = document.getElementById('account-options');
    const profileInfo = document.querySelectorAll('.profile-info');
    const editOptions = document.getElementById('edit-options');

    const isEditing = bioDescryption.classList.toggle('active');
    editOptions.classList.toggle('active', isEditing)
    accountOptions.classList.toggle('active', !isEditing);

    profileInfo.forEach(p => p.style.display = isEditing ? 'none' : 'block');

    document.querySelectorAll('.edit-input').forEach(input => {
        input.value = "";
    });

    resetInfoDisplay();

    if(!isEditing) {
        showNotification('Edição cancelada com sucesso!', 'success');
    }
}

document.querySelectorAll('.theme-box').forEach(theme => {
    theme.addEventListener('click', () => {
        showNotification('Função ainda será implementada', 'warning');
    })
})

function openSettings() {
    document.getElementById('settings').style.display = 'block';
    document.getElementById('container').style.display = 'none';
    document.body.classList.add('shadow-active');
}

document.getElementById('close-settings').addEventListener('click', () => {
    document.getElementById('settings').style.display = 'none';
    document.getElementById('container').style.display = 'block';
    document.body.classList.remove('shadow-active');
});

function resetInfoDisplay() {
    const inputPassword = document.getElementById('new-password');
    const profilePassword = document.getElementById('password-profile');
    const invisibleIcon = document.getElementById('not-visible-icon');
    const visibleIcon = document.getElementById('visible-icon');

    // Reseta os valores ao padrão
    inputPassword.type = 'password';
    visibleIcon.style.display = 'flex';
    invisibleIcon.style.display = 'none';
    profilePassword.innerText = '••••••••';
}

function passwordVisible() {
    const isEditable = document.getElementById('bio-descryption').classList.contains('active');
    const inputPassword = document.getElementById('new-password');
    const profilePassword = document.getElementById('password-profile');
    const invisibleIcon = document.getElementById('not-visible-icon').style;
    const visibleIcon = document.getElementById('visible-icon').style;

    const userPassword = localStorage.getItem('userPassword');

    invisibleIcon.display =     (visibleIcon.display === 'flex') ? 'flex' : 'none';
    visibleIcon.display =       (visibleIcon.display === 'flex') ? 'none' : 'flex';
    inputPassword.type =        (isEditable && visibleIcon.display === 'flex') ? 'password' : 'text';
    profilePassword.innerText = (!isEditable && invisibleIcon.display === 'flex') ? userPassword : '••••••••';
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
                showNotification('Selecione uma imagem, por favor!', 'warning');
                return;
            }

            if(file.size > 5 * 1024 * 1024) {
                showNotification('Selecione uma imagem menor, por favor!', 'warning');
                return;
            }

            // Enviar o arquivo original para o novo endpoint
            await saveProfilePhoto(file);
            
            // Converter para base64 apenas para exibição na tela
            const fileConverted = await convertToBase64(file);
            document.getElementById('profile-image').src = fileConverted;
            localStorage.setItem('userPhoto', fileConverted);
        } catch(error) {
            showNotification('Erro ao processar imagem.', 'danger');
        }
    }
}

async function saveProfilePhoto(file) {
    const userId = parseInt(localStorage.getItem('userId'));

    // Criar FormData para enviar o arquivo
    const formData = new FormData();
    formData.append('foto', file);
    formData.append('id', parseInt(userId));
    
    const response = await fetch('http://localhost:3000/user/upload-foto', {
        method: 'POST',
        body: formData
    });

    if(response.ok) {
        showNotification('Imagem salva no banco com sucesso!', 'success');
    } else {
        showNotification('Erro ao carregar imagem para o banco.', 'danger');
    }
}

[ 'new-name', 'new-email', 'new-password'].forEach(id => {
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

    if(!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
        showNotification('Insira dados válidos para atualizar!', 'warning');
        return;
    }

    const userId = localStorage.getItem('userId');

    const updateData = {
        id: parseInt(userId)
    };

    updateData.nome = newName.trim();
    updateData.email = newEmail.trim();
    updateData.senha = newPassword.trim();

    const response = await fetch('http://localhost:3000/user', {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });

    if(response.ok) {
        showNotification('Usuário atualizado com sucesso!', 'success');
    } else {
        showNotification('Erro ao atualizar usuário.', 'danger');
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

    const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        }
    });

    if(response.ok) {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        
        showNotification('Perfil deletado com sucesso!', 'success');
    } else {
        showNotification('Erro ao deletar seu perfil!', 'danger');
    }
}

async function loadUserData() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userPhoto = localStorage.getItem('userPhoto');

    if(!userId || !userName || !userEmail) {
        showNotification('Usuário não identificado. Direcionando para a tela de login!', 'warning');

        setTimeout(() => {
            window.location = 'index.html';
        }, 500);
    }

    document.getElementById('account-name').innerText = userName
    document.getElementById('name-profile').innerText = userName;
    document.getElementById('email-profile').innerText = userEmail;
    document.getElementById('password-profile').innerText = '••••••••';

    document.getElementById('profile-image').src = userPhoto;
    
    document.getElementById('new-name').placeholder = userName;
    document.getElementById('new-email').placeholder = userEmail;
    document.getElementById('new-password').placeholder = '••••••••';
}

async function logout() {
    const confirmation = confirm('Tem certeza que deseja sair da sua conta?');

    if(confirmation) {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');

        window.location.href = './index.html';
    }
}

loadUserData();
