const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const clearButton = document.querySelector(".clear-button");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
clearButton.addEventListener("click", clearTodos);

function addTodo(event) {
    event.preventDefault();
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    const newTodo = document.createElement("li");
    const trimmed=todoInput.value.trim();
    newTodo.innerText = trimmed; 
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    

    saveLocalTodos(todoInput.value);
    
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></li>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-edit"></li>';
    editButton.classList.add("edit-btn");
    todoDiv.appendChild(editButton);

    editButton.addEventListener("click", editTodo);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></li>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    if(trimmed){
        todoList.appendChild(todoDiv);
    }
    
    todoInput.value = "";
}

function editTodo(e) {
    const item = e.target;

    if(item.classList[0] === "edit-btn") {
        const todo = item.parentElement;
        const todoItem = todo.querySelector(".todo-item");

        // Create a new input element for editing
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.classList.add("edit-input");
        newInput.value = todoItem.innerText;

        // Replace the existing todo item with the new input element
        todo.replaceChild(newInput, todoItem);

        // Focus the new input element
        newInput.focus();

        // Add an event listener to handle when the user finishes editing
        newInput.addEventListener("keydown", function(e) {
            if(e.key === "Enter") {
                // Update the todo item text and replace the input element with the updated todo item
                todoItem.innerText = newInput.value;
                todo.replaceChild(todoItem, newInput);

                // Update the todo item in local storage
                let todos;
                if(localStorage.getItem("todos") === null) {
                    todos = [];
                } else {
                    todos = JSON.parse(localStorage.getItem("todos"));
                }
                const todoIndex = todos.indexOf(item.parentElement.children[0].innerText);
                todos[todoIndex] = newInput.value;
                localStorage.setItem("todos", JSON.stringify(todos));
            }
        });
    }
}

function deleteCheck(e) {
    const item = e.target;

    if(item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        todo.classList.add("slide");

        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function() {
            todo.remove();
        });
    }

    if(item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}

function saveLocalTodos(todo) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function(todo) {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        const newTodo = document.createElement("li");
        newTodo.innerText = todo;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);

        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check-circle"></li>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);

        const editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fas fa-edit"></li>';
        editButton.classList.add("edit-btn");
        todoDiv.appendChild(editButton);
    
        editButton.addEventListener("click", editTodo);
    
        const trashButton = document.createElement("button");
        trashButton.innerHTML = '<i class="fas fa-trash"></li>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);

        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function clearTodos() {
    // Clear all to-dos from the DOM
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }

    // Clear all to-dos from local storage
    localStorage.removeItem("todos");
}
