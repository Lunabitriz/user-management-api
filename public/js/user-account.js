function toggleEditOption() {
    const bioDescryption = document.getElementById('bio-descryption');
    const accountOptions = document.getElementById('account-options');
    const editOptions = document.getElementById('edit-options');
    const profileInfo = document.querySelectorAll('.profile-info');

    const isEditing = bioDescryption.classList.toggle('active');
    editOptions.classList.toggle('active', isEditing)
    accountOptions.classList.toggle('active', !isEditing);

    profileInfo.forEach(p => p.style.display = isEditing ? 'none' : 'block');

    document.querySelectorAll('.edit-input').forEach(input => {
        input.value = "";
    });
}

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
                alert('Selecione uma imagem, por favor!');
                return;
            }

            if(file.size > 5 * 1024 * 1024) {
                alert('Selecione uma imagem menor, por favor!');
                return;
            }

            // Enviar o arquivo original para o novo endpoint
            await saveProfilePhoto(file);
            
            // Converter para base64 apenas para exibição na tela
            const fileConverted = await convertToBase64(file);
            document.getElementById('profile-image').src = fileConverted;
            localStorage.setItem('userPhoto', fileConverted);
        } catch(error) {
            alert('Erro ao processar imagem.');
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
        alert('Imagem salva no banco com sucesso!');
    } else {
        alert('Erro ao carregar imagem para o banco.');
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
        alert('Insira dados válidos para atualizar!');
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
        alert('Usuário atualizado com sucesso!');
    } else {
        alert('Erro ao atualizar usuário.');
    }
}

async function removeAccount() {
    const confirmation = confirm('Tem certeza que deseja excluir sua conta?');

    if(!confirmation) {
        return;
    }

    const userId = localStorage.getItem('userId');
    
    if(!userId) {
        alert('Usuário não identificado. Faça login novamente!');
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
        
        showNotification('Perfil deletado com sucesso!');
    } else {
        showNotification('Erro ao deletar seu perfil!');
    }
}

async function loadUserData() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userPhoto = localStorage.getItem('userPhoto');

    if(!userId || !userName || !userEmail) {
        alert('Usuário não identificado. Direcionando para a tela de login!');

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