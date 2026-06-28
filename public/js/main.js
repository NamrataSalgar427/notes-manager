// Step 1 — Load notes when page opens
document.addEventListener('DOMContentLoaded', async () => {
    const notesList = document.querySelector('.notes-list');
    
    try {
        // Fetch data from our backend API
        const response = await fetch('/api/notes');
        const notes = await response.json();
        
        // Loop through the notes array and append them to the DOM
        notes.forEach(note => {
            const card = createNoteCard(note);
            notesList.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
});

// Step 2 — Handle form submission
document.getElementById('note-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // stops page from refreshing

    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');
    const notesList = document.querySelector('.notes-list');

    // Gather input data into an object
    const noteData = {
        title: titleInput.value,
        content: contentInput.value
    };

    try {
        // Send a POST request containing the new note object
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });

        if (response.ok) {
            const newNote = await response.json();
            
            // Instantly append the freshly created note card to the list
            const card = createNoteCard(newNote);
            notesList.appendChild(card);

            // Clear out the form inputs for the next note
            titleInput.value = '';
            contentInput.value = '';
        }
    } catch (error) {
        console.error('Error creating note:', error);
    }
});

// Step 3 — Delete a note
async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
        // Send a DELETE request targeting the note's unique ID
        const response = await fetch(`/api/notes/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Find the element on the screen using its data-id attribute and wipe it out
            const cardToRemove = document.querySelector(`[data-id="${id}"]`);
            if (cardToRemove) {
                cardToRemove.remove();
            }
        }
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

// 🛠️ Helper Function: Generates the HTML layout for an individual note card
function createNoteCard(note) {
    const div = document.createElement('div');
    div.classList.add('note-card');
    div.setAttribute('data-id', note.id); // Attach ID so we know which card to delete later

    div.innerHTML = `
        <h3 class="note-card-title">${note.title}</h3>
        <p class="note-card-content">${note.content}</p>
        <button class="delete-btn" onclick="deleteNote('${note.id}')">Delete</button>
    `;

    return div;
}