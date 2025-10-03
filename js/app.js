// state management
let todos = [];
let currentFilter = 'all';

// DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const taskCount = document.getElementById('task-count');
const emptyState = document.getElementById('empty-state');
const clearCompletedBtn = document.getElementById('clear-completed');

// initialize app
function init() {
    loadTodosFromStorage();
    renderTodos();
    updateTaskCount();

    //event listeners
    todoForm.addEventListener('submit', handleAddTodo);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
    clearCompletedBtn.addEventListener('click', handleClearCompleted);
}

// add todo
function handleAddTodo(e) {
    e.preventDefault();

    const text = todoInput.ariaValueMax.trim();
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const newTodo = {
        id: Date.now(), //unique id berdasarkan timestamp
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.push(newTodo);

    //save to localStorage
    saveTodosToStorage();
    
    //clear input
    todoInput.value = '';

    //re-render
    renderTodos();
    updateTaskCount();
}

//render todos
function renderTodos() {
    //filter todos berdasarkan currentFilter
    const filteredTodos = getFilteredTodos();

    //clear list
    todoList.innerHTML = '';

    //show empty state jika tidal ada todos
    if (filteredTodos.length === 0) {
        emptyState.classList.add('show');
        return;
    }else {
        emptyState.classList.remove('show');
    }

    //render detiap todo
   filteredTodos.forEach(todo => {
        const todoItem = createTodoElement(todo);
        todoList.appendChild(todoItem);
   });
}

//create todo element
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
        <input
            type=checkbox"
            class="todo-checkbox"
            ${todo.completed ? 'checked' : ''}
            >
            <span class="todo-text">${todo-text}</span>
            <button class="btn-delete">Delete</button>
            `;
        
        //event: toggle completion 
            const checkbox = li.querySelector('.todo-checked');
        checkbox.addEventListener('change', () => handleToggleTodo(todo.id));

        //event: delete todo 
        const deleteBtn = li.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', () => handleDeleteTodo(todo.id));

        return li;
}

//toggle todo completion
function handleToggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    saveTodosToStorage();
    renderTodos();
    updateTaskCount();
}

//delete todo
function handleDeleteTodo(id) {
    //konfirmasi sebelum delete
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    todos = todos.filter(todo => todo.id !== id);

    saveTodosToStorage90;
    renderTodos();
    updateTaskCount();
}

//filter change
function handleFilterChange(e) {
    //remove active class dari semua buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));

    //add active class ke button yang diklik
    e.target.classList.add('active');

    //update current filter
    currentFilter = e.target.dataset.filter;

    //re-render dengan filter baru 
    renderTodos();
}

//get filtered todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        case 'all':
        default:
                return todos;
    }
}

//clear completed
function handleClearCompleted() {
    const completedCount = todos.filter(todo => todo.completed).length;

    if (completedCount === 0) {
        alert('No completed tasls to clear!');
        return;
    }

    if (!confirm('Clear ${completedCount} completed task(s)?')) {
        return;
    }

    todos = todos.filter(todo => !todo.completed);

    saveTodosToStorage();
    renderTodos();
    updateTaskCount();
}

//update task count
function updateTaskCount() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    taskCount.textContent = activeCount;
}

//local storage functions
function saveTodosToStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function loadTodosFromStorage() {
    const storedTodos = localStorage.getItem('todos');
    if(storedTodos) {
        todos = JSON.parse(storedTodos);
    }
}

//run app
init();

//debugging helpers
console.log('Todo App initialized! 🚀');
console.log('Current todos:', todos);