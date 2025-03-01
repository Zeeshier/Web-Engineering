// API endpoint - using relative URL
const API_URL = '';

// Elements
const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const statusEl = document.getElementById('status');

// Show status message
function showStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.style.display = 'block';
    
    if (isError) {
        statusEl.classList.add('error');
    } else {
        statusEl.classList.remove('error');
    }
    
    // Hide the status after 3 seconds
    setTimeout(() => {
        statusEl.style.opacity = '0';
        statusEl.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            statusEl.style.display = 'none';
            statusEl.style.opacity = '1';
            statusEl.style.transform = 'translateY(0)';
        }, 300);
    }, 3000);
}

// Format date in a more readable way
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    // Today
    if (diffDays === 0) {
        if (diffHours === 0) {
            if (diffMins === 0) {
                return 'Just now';
            }
            return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        }
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Yesterday
    if (diffDays === 1) {
        return 'Yesterday';
    }
    
    // Within last week
    if (diffDays < 7) {
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
    
    // Format date more explicitly
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

// Fetch all todos
async function fetchTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const todos = await response.json();
        
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            todoList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h3>No tasks yet</h3>
                    <p>Add your first task using the form above</p>
                </div>
            `;
            return;
        }
        
        // Sort todos by created date (newest first)
        todos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        todos.forEach(todo => {
            const formattedDate = formatDate(todo.created_at);
            
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="todo-content">
                    <div class="todo-title">${todo.title}</div>
                    ${todo.description ? `<div class="todo-description">${todo.description}</div>` : ''}
                    <div class="todo-created">Created: ${formattedDate}</div>
                </div>
                <div class="todo-actions">
                    <button class="toggle-btn ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                        ${todo.completed ? 'Completed' : 'Mark Complete'}
                    </button>
                    <button class="delete-btn" data-id="${todo.id}">Delete</button>
                </div>
            `;
            
            todoList.appendChild(li);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.toggle-btn').forEach(button => {
            button.addEventListener('click', toggleTodo);
        });
        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', deleteTodo);
        });
        
    } catch (error) {
        showStatus('Failed to fetch todos: ' + error.message, true);
    }
}

// Add new todo
async function addTodo(e) {
    e.preventDefault();
    
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (!title) {
        showStatus('Please enter a task title', true);
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description: description || null
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        titleInput.value = '';
        descriptionInput.value = '';
        
        showStatus('Task added successfully');
        fetchTodos();
        
    } catch (error) {
        showStatus('Failed to add task: ' + error.message, true);
    }
}

// Toggle todo completion status
async function toggleTodo(e) {
    const todoId = e.target.dataset.id;
    
    try {
        const response = await fetch(`${API_URL}/todos/${todoId}/toggle`, {
            method: 'PUT'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const todo = await response.json();
        showStatus(`Task marked as ${todo.completed ? 'complete' : 'incomplete'}`);
        fetchTodos();
        
    } catch (error) {
        showStatus('Failed to update task: ' + error.message, true);
    }
}

// Delete todo
async function deleteTodo(e) {
    const todoId = e.target.dataset.id;
    
    try {
        const response = await fetch(`${API_URL}/todos/${todoId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        showStatus('Task deleted successfully');
        fetchTodos();
        
    } catch (error) {
        showStatus('Failed to delete task: ' + error.message, true);
    }
}

// Event listeners
todoForm.addEventListener('submit', addTodo);

// Initial fetch
fetchTodos();

// Add animation to form submit button
const submitButton = document.querySelector('#todo-form button');
submitButton.addEventListener('mousedown', () => {
    submitButton.style.transform = 'scale(0.98)';
});
submitButton.addEventListener('mouseup', () => {
    submitButton.style.transform = 'scale(1)';
});