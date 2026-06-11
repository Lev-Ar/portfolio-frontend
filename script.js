// Адрес нашего запущенного бэкенда
const API_URL = 'http://localhost:5000/api/projects';

// Функция, которая запрашивает проекты у бэкенда
async function loadProjects() {
    const projectsList = document.getElementById('projects-list');
    
    try {
        const response = await fetch(API_URL);
        const projects = await response.json(); 
        
        projectsList.innerHTML = '';
        
        if (projects.length === 0) {
            projectsList.innerHTML = '<p>В базе данных пока нет проектов. Самое время открыть админку!</p>';
            return;
        }
        
        // РЕНДЕРИМ КАРТОЧКИ, ЕСЛИ ДАННЫЕ ЕСТЬ
        projects.forEach(project => {
            // Создаем красивый блок для каждого проекта
            const card = document.createElement('div');
            card.style.cssText = `
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 8px;
                padding: 20px;
                width: 300px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            `;
            
            // Если ссылки на картинку нет, используем заглушку
            const imgUrl = project.image_url || 'https://unsplash.com';

            card.innerHTML = `
                <img src="${imgUrl}" alt="${project.title}" style="width:100%; height:180px; object-fit:cover; border-radius:4px; margin-bottom:15px;">
                <h3 style="color:#00ffcc; margin:0 0 10px 0;">${project.title}</h3>
                <p style="color:#ccc; font-size:14px; line-height:1.5; min-height:60px;">${project.description || 'Без описания'}</p>
                <div style="display:flex; gap:10px; margin-top:15px;">
                    ${project.figma_url ? `<a href="${project.figma_url}" target="_blank" style="color:#ff007f; text-decoration:none; font-size:14px; font-weight:bold;">Figma →</a>` : ''}
                    ${project.live_url ? `<a href="${project.live_url}" target="_blank" style="color:#00ffcc; text-decoration:none; font-size:14px; font-weight:bold;">Сайт →</a>` : ''}
                    <button onclick="deleteProject(${project.id}, event)" class="delete-btn">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    Удалить
</button>
                </div>
            `;
            
            projectsList.appendChild(card);
        });
        
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        projectsList.innerHTML = '<p style="color: red;">Не удалось соединиться с бэкендом :(</p>';
    }
}


// Запускаем функцию при загрузке страницы
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

