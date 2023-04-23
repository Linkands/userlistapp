import { getUsers } from './fetchUsers.js';

const searchInput = document.querySelector('#search-input');
const addUserForm = document.querySelector('#add-user-form');
const userList = document.querySelector('#user-list');

let users = await getUsers();

const userModificationForm = (name, id) => {
    const form = document.createElement('form');
    form.id = 'modify-user-form';
    form.style.display = 'none';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.required = true;
    nameInput.value = name;

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.textContent = 'Change name';

    form.appendChild(nameInput);
    form.appendChild(saveButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const newName = nameInput.value.trim();
        if (newName) {
            const index = users.findIndex((user) => user.id === id);
            if (index >= 0) {
                users[index].name = newName;
                const element = document
                    .getElementById(id)
                    .querySelector('.user-name');
                element.textContent = newName;
            }
            form.style.display = 'none';
        }
    });

    return form;
};

const addModifyButton = (parent, id) => {
    const modifyButton = document.createElement('button');
    modifyButton.textContent = 'Modify';
    modifyButton.classList.add('modify-button');
    parent.appendChild(modifyButton);

    modifyButton.addEventListener('click', () => {
        const form = parent.parentNode.querySelector('#modify-user-form');
        if (form.style.display === 'none') {
            form.style.display = 'block';
        } else {
            form.style.display = 'none';
        }
    });
};

const addDeleteButton = (parent, id) => {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    parent.appendChild(deleteButton);
    deleteButton.addEventListener('click', () => {
        const index = users.findIndex((user) => user.id === id);
        if (index >= 0) {
            users.splice(index, 1);
            parent.parentNode.remove();
        }
    });
};

const searchUsers = () => {
    const searchTerm = searchInput.value.toLowerCase();
    Array.from(userList.children).forEach((user) => {
        const userName = user.textContent.toLowerCase();
        user.style.display = userName.includes(searchTerm) ? 'grid' : 'none';
    });
};

const addUserToList = (user, firstLoad) => {
    !firstLoad ? users.push(user) : null;

    const listElement = document.createElement('li');
    listElement.id = user.id;

    const userName = document.createElement('div');
    userName.classList.add('user-name');
    userName.textContent = user.name;

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('actions');

    const form = userModificationForm(userName.textContent, user.id);

    userList.appendChild(listElement);
    listElement.appendChild(userName);
    listElement.appendChild(actionsContainer);
    listElement.appendChild(form);

    addModifyButton(actionsContainer, user.id);
    addDeleteButton(actionsContainer, user.id);
};

addUserForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value.trim();
    const newUser = {
        id: Date.now(),
        name: name,
    };
    addUserToList(newUser);
    nameInput.value = '';
});

users.forEach((user) => {
    addUserToList(user, true);
});

searchInput.addEventListener('keyup', searchUsers);
