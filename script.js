document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const pendingTasksList = document.getElementById('pending-tasks-list');
    const completedTasksList = document.getElementById('completed-tasks-list');

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || { pending: [], completed: [] };

    // Function to save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to create a new task
    function createTask(taskName, isCompleted = false) {
        return {
            id: Date.now().toString(),
            name: taskName,
            completed: isCompleted,
            dateCreated: new Date().toLocaleString(),
            dateCompleted: null
        };
    }

    // Function to render tasks
    function renderTasks() {
        // Clear current lists
        pendingTasksList.innerHTML = '';
        completedTasksList.innerHTML = '';

        tasks.pending.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
                <div>
                    <button class="complete-button">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
                </div>
                <small>Created: ${task.dateCreated}</small>
            `;
            li.dataset.taskId = task.id;

            const completeButton = li.querySelector('.complete-button');
            completeButton.addEventListener('click', () => {
                toggleCompletion(task.id);
                renderTasks();
            });

            const editButton = li.querySelector('.edit-button');
            editButton.addEventListener('click', () => {
                const newName = prompt('Edit task', task.name);
                if (newName && newName.trim() !== '') {
                    editTask(task.id, newName.trim());
                    renderTasks();
                }
            });

            const deleteButton = li.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => {
                deleteTask(task.id);
                renderTasks();
            });

            pendingTasksList.appendChild(li);
        });

        tasks.completed.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="completed">${task.name}</span>
                <div>
                    <button class="delete-button">Delete</button>
                </div>
                <small>Created: ${task.dateCreated}, Completed: ${task.dateCompleted}</small>
            `;
            li.dataset.taskId = task.id;

            const deleteButton = li.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => {
                deleteTask(task.id);
                renderTasks();
            });

            completedTasksList.appendChild(li);
        });

        saveTasks();
    }

    // Function to add a new task
    todoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskName = todoInput.value.trim();
        if (taskName !== '') {
            tasks.pending.push(createTask(taskName));
            todoInput.value = '';
            renderTasks();
        }
    });

    // Function to toggle completion of a task
    function toggleCompletion(taskId) {
        const task = tasks.pending.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                task.dateCompleted = new Date().toLocaleString();
                tasks.completed.push(task);
            } else {
                task.dateCompleted = null;
                tasks.completed = tasks.completed.filter(t => t.id !== task.id);
            }
            tasks.pending = tasks.pending.filter(t => t.id !== task.id);
            saveTasks();
        }
    }

    // Function to edit a task
    function editTask(taskId, newName) {
        const task = tasks.pending.find(task => task.id === taskId);
        if (task) {
            task.name = newName;
            saveTasks();
        }
    }

    // Function to delete a task
    function deleteTask(taskId) {
        tasks.pending = tasks.pending.filter(task => task.id !== taskId);
        tasks.completed = tasks.completed.filter(task => task.id !== taskId);
        saveTasks();
    }

    // Initial render of tasks
    renderTasks();
});
