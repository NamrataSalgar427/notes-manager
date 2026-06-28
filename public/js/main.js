document.addEventListener('DOMContentLoaded', async () => {
    const notesList = document.querySelector('.notes-list');

    // Show loading message while fetching
    notesList.innerHTML = '<p class="loading-msg">Loading your notes...</p>';

    try {
        const response = await fetch('/api/notes');
        const notes = await response.json();

        // Clear loading message
        notesList.innerHTML = '<h2>Your Notes</h2>';

        if (notes.length === 0) {
            // Show empty state message
            notesList.innerHTML += '<p class="empty-msg">No notes yet. Create your first note above!</p>';
        } else {
            notes.forEach(note => {
                const card = createNoteCard(note);
                notesList.appendChild(card);
            });
            updateNoteCount();
        }

    } catch (error) {
        console.error('Error fetching notes:', error);
        notesList.innerHTML = '<p class="error-msg">Failed to load notes. Please refresh.</p>';
    }
});

// Step 2 — Handle form submission
document.getElementById('note-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');
    const notesList = document.querySelector('.notes-list');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Disable button while saving
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    const noteData = {
        title: titleInput.value.trim(),
        content: contentInput.value.trim()
    };

    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData)
        });

        if (response.ok) {
            const newNote = await response.json();
            
            // Remove empty state message if it exists
            const emptyMsg = notesList.querySelector('.empty-msg');
            if (emptyMsg) emptyMsg.remove();

            const card = createNoteCard(newNote);
            notesList.appendChild(card);

            updateNoteCount();

            titleInput.value = '';
            contentInput.value = '';

            // Show success feedback
            submitBtn.textContent = 'Saved!';
            submitBtn.style.background = '#22c55e';

            // Reset button after 2 seconds
            setTimeout(() => {
                submitBtn.textContent = 'Save Note';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 2000);

        } else {
            throw new Error('Server returned an error');
        }

    } catch (error) {
        console.error('Error creating note:', error);
        submitBtn.textContent = 'Failed — Try Again';
        submitBtn.style.background = '#ef4444';

        setTimeout(() => {
            submitBtn.textContent = 'Save Note';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 2000);
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
                updateNoteCount();
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
    div.setAttribute('data-id', note.id);

    // Format the date nicely
    const date = new Date(note.createdAt);
    const formattedDate = date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    div.innerHTML = `
        <h3 class="note-card-title">${note.title}</h3>
        <p class="note-card-content">${note.content}</p>
        <p class="note-card-date">📅 ${formattedDate}</p>
        <button class="delete-btn" onclick="deleteNote('${note.id}')">🗑️ Delete</button>
    `;
    return div;
}

function updateNoteCount() {
    const cards = document.querySelectorAll('.note-card');
    const h2 = document.querySelector('.notes-list h2');
    
    console.log('Cards found:', cards.length); // ← temporary debug line
    console.log('H2 found:', h2);              // ← temporary debug line
    
    if (h2) {
        h2.textContent = `Your Notes (${cards.length})`;
    }
}