document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notes-container');
    const noteForm = document.getElementById('note-form')
    const btnGuardar = document.getElementById('btnGuardar');
    const noteIdInput = document.getElementById('note-id');
    const recipientNameInput = document.getElementById('recipient-name');
    const messageTextInput = document.getElementById('message-text');

    // Cargar notas del LocalStorage
    loadNotes();

    // Manejar el envío del formulario
    btnGuardar.addEventListener('click', function (e) {
        e.preventDefault();

        const id = noteIdInput.value;
        const title = recipientNameInput.value;
        const text = messageTextInput.value;

        if (id) {
            // Editar nota existente
            editNote(id, title, text);
        } else {
            // Crear nueva nota
            createNote(title, text);
        }

        noteForm.reset();
        noteIdInput.value = '';
        var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
        modal.hide();
    });

    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notesContainer.innerHTML = '';

        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'card mt-4';
            noteElement.style = 'width:20rem; text-align: center; display:flex; margin: auto; padding-bottom: 10px;';
            noteElement.innerHTML = `
                <div class="titulo-icono" style="justify-content: space-between; display: flex; text-align: center; margin: 4px;">
                    <div></div>
                    <h5 class="card-title">${note.title}</h5>
                    <span class="material-symbols-outlined" style="cursor: pointer;" onclick="deleteNote('${note.id}')">
                        delete
                    </span>
                </div>
                <p class="card-text">${note.text}</p>
            `;
            noteElement.addEventListener('click', () => {
                openEditModal(note.id);
            });
            notesContainer.appendChild(noteElement);
        });
    }

    function createNote(title, text) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const newNote = {
            id: Date.now().toString(),
            title,
            text
        };
        notes.unshift(newNote); // Insertar al inicio para que aparezcan más recientes primero
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }

    window.deleteNote = function (id) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes = notes.filter(note => note.id !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    };

    function openEditModal(id) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const note = notes.find(note => note.id === id);
        if (note) {
            noteIdInput.value = note.id;
            recipientNameInput.value = note.title;
            messageTextInput.value = note.text;
            new bootstrap.Modal(document.getElementById('exampleModal')).show();
        }
    }

    function editNote(id, title, text) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const noteIndex = notes.findIndex(note => note.id === id);
        if (noteIndex > -1) {
            notes[noteIndex] = { id, title, text };
            localStorage.setItem('notes', JSON.stringify(notes));
            loadNotes();
        }
    }
});
