// переписати всі функції на async/await з index-second з використанням try/catch

async function getStudents() {
    try {
        const response = await fetch('http://localhost:3000/students');
        const students = await response.json();
        console.log('Сервер повернув студентів:', students);

        const table = document.querySelector('#students-table');
        let tbody = table.querySelector('tbody');

        if (!tbody) {
            tbody = document.createElement('tbody');
            table.appendChild(tbody);
        }

        tbody.innerHTML = '';   

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.course}</td>
                <td>${student.skills.join(', ')}</td>
                <td>${student.email}</td>
                <td>${student.isEnrolled ? 'Записаний' : 'Не записаний'}</td>
                <td>
                    <button class="update-button" data-id="${student.id}">Оновити</button>
                    <button class="delete-button" data-id="${student.id}">Видалити</button>
                </td>
            `;
            tbody.appendChild(row);
        })
    } catch (error) {
        console.error(error);
    }
}
async function addStudent(studentData) {
    try {
        const response = await fetch('http://localhost:3000/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        });
        if (!response.ok) {
            throw new Error('Не вдалося додати студента');
        }
        console.log('Студента успішно додано');
        await getStudents();
    } catch (error) {
        console.error(error);
    }
}


async function updateStudent(studentId, updatedData) {
    try {
        const response = await fetch(`http://localhost:3000/students/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            throw new Error('Не вдалося оновити студента');
        }
        console.log('Студента успішно оновлено');
        await getStudents();
    } catch (error) {
        console.error(error);
    }
}

async function deleteStudent(studentId) {
    try {
        const response = await fetch(`http://localhost:3000/students/${studentId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Не вдалося видалити студента');
        }
        console.log('Студента успішно видалено');
        await getStudents();
    } catch (error) {
        console.error(error);
    }
}
// Обробник події для кнопки "Отримати студентів".
document.querySelector('#get-students-btn').addEventListener('click', () => {
    getStudents();
});
// Обробник події для кнопок "Оновити" і "Видалити"
document.querySelector('#students-table').addEventListener('click', event => {
    if (event.target.classList.contains('update-button')) {
        const studentId = event.target.dataset.id;
        // Потрібно зібрати нові дані для студента
        const updatedData = {
            name: prompt('Введіть нове ім\'я:'),
            age: prompt('Введіть новий вік:'),
            course: prompt('Введіть новий курс:'),
            skills: prompt('Введіть нові навички через кому:').split(',').map(skill => skill.trim()),
            email: prompt('Введіть новий email:'),
            isEnrolled: confirm('Студент записаний?'),
        };
        updateStudent(studentId, updatedData);
    } else if (event.target.classList.contains('delete-button')) {
        const studentId = event.target.dataset.id;
        deleteStudent(studentId);
    }
});



