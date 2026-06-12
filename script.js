// Адрес бэкенда (исправлено!)
const API_URL = 'https://my-portfolio-api-mtb2.onrender.com/api';

// Загрузка проектов
async function loadProjects() {
    const projectsList = document.getElementById('projects-list');
    
    try {
        const response = await fetch(`${API_URL}/projects`); // ← ИСПРАВЛЕНО
        const projects = await response.json();
        
        projectsList.innerHTML = '';
        
        if (projects.length === 0) {
            projectsList.innerHTML = '<p>В базе данных пока нет проектов.</p>';
            return;
        }
        
        projects.forEach(project => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 8px;
                padding: 20px;
                width: 300px;
            `;
            
            const imgUrl = project.image_url || 'https://via.placeholder.com/300x180?text=No+Image';
            
            card.innerHTML = `
                <img src="${imgUrl}" alt="${project.title}" style="width:100%; height:180px; object-fit:cover; border-radius:4px; margin-bottom:15px;">
                <h3 style="color:#00ffcc;">${project.title}</h3>
                <p style="color:#ccc;">${project.description || 'Без описания'}</p>
                <div style="display:flex; gap:10px; margin-top:15px;">
                    ${project.figma_url ? `<a href="${project.figma_url}" target="_blank" style="color:#ff007f;">Figma →</a>` : ''}
                    ${project.live_url ? `<a href="${project.live_url}" target="_blank" style="color:#00ffcc;">Сайт →</a>` : ''}
                    <button onclick="deleteProject(${project.id})" class="delete-btn">Удалить</button>
                </div>
            `;
            
            projectsList.appendChild(card);
        });
        
    } catch (error) {
        console.error("Ошибка:", error);
        projectsList.innerHTML = '<p style="color: red;">Не удалось соединиться с бэкендом :(</p>';
    }
}

// Отправка формы
const adminForm = document.getElementById('admin-form');
adminForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('figma_url', document.getElementById('figma_url').value);
    formData.append('live_url', document.getElementById('live_url').value);
    
    const fileInput = document.getElementById('image_file');
    if (fileInput.files.length > 0) {
        formData.append('image', fileInput.files[0]);
    }

    try {
        const response = await fetch(`${API_URL}/projects`, { // ← ИСПРАВЛЕНО
            method: 'POST',
            body: formData 
        });

        if (response.ok) {
            alert('Проект успешно добавлен!');
            adminForm.reset();
            loadProjects();
        } else {
            const errorData = await response.json();
            alert('Ошибка: ' + (errorData.error || 'Что-то пошло не так'));
        }
    } catch (error) {
        console.error("Ошибка:", error);
        alert('Не удалось связаться с сервером');
    }
});

// Удаление проекта
async function deleteProject(id) {
    if (!confirm('Удалить проект?')) return;

    try {
        const response = await fetch(`${API_URL}/projects/${id}`, { // ← ИСПРАВЛЕНО
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Проект удален!');
            loadProjects();
        } else {
            alert('Не удалось удалить');
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Загружаем проекты при старте
loadProjects();

// Находим форму в HTML
// Находим форму в HTML
const adminForm = document.getElementById('admin-form');

// Слушаем событие отправки формы
adminForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    // Создаем специальный объект FormData для отправки файлов
    const formData = new FormData();
    
    // Запихиваем в него все наши текстовые поля
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('figma_url', document.getElementById('figma_url').value);
    formData.append('live_url', document.getElementById('live_url').value);
    
    // Забираем сам файл, который выбрал пользователь в поле <input type="file">
    const fileInput = document.getElementById('image_file');
    if (fileInput.files.length > 0) {
        formData.append('image', fileInput.files[0]); // Имя 'image' должно строго совпадать с upload.single('image') на бэкенде
    }

    try {
        // Отправляем POST-запрос на бэкенд
        const response = await fetch(API_URL, {
            method: 'POST',
            // ВАЖНО: 'Content-Type' здесь указывать НЕ НАДО! Браузер сам выставит multipart/form-data
            body: formData 
        });

        if (response.ok) {
            alert('Проект с реальным скриншотом успешно сохранен в SQL и облако!');
            adminForm.reset(); // Очищаем форму
            loadProjects(); // Перезагружаем карточки на экране
        } else {
            const errorData = await response.json();
            alert('Ошибка сервера: ' + (errorData.error || 'Что-то пошло не так...'));
        }

    } catch (error) {
        console.error("Ошибка отправки формы:", error);
        alert('Не удалось связаться с сервером для отправки файла.');
    }
});
// Функция удаления проекта
async function deleteProject(id) {
    if (!confirm('Вы точно хотите удалить этот проект?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE' // Отправляем специальный DELETE метод
        });

        if (response.ok) {
            alert('Проект удален!');
            loadProjects(); // Перезагружаем список на экране
        } else {
            alert('Не удалось удалить проект');
        }
    } catch (error) {
        console.error("Ошибка удаления:", error);
    }
}

