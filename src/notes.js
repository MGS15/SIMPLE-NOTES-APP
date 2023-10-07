import { insertDB, getDB, setDB } from './db.js'

export const newNote = async (note, tags) => {	
	const newNote  = {
		tags,
		content: note,
		id: Date.now(),
	}
	await insertDB(newNote)
	return newNote
}

export const getAllNotes = async () => {
	const { notes } = await getDB() // Distructering
	return notes
}

export const findNotes = async (filter) => {
	const notes = await getAllNotes()
	return notes.filter(note => {
		return note.content.toLowerCase().includes(filter.toLowerCase())
	})
}

export const removeNote = async (id) => {
	const notes = await getAllNotes()
	const match = notes.find(note => note.id === id)
	if (match)
	{
		const newNotes = notes.filter(note => note.id !== id)
		await setDB({notes: newNotes})
		return id
	}
}

export const removeAllNotes = async () => setDB({notes: []})
