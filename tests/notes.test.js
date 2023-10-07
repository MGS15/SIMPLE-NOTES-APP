import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/db.js', () => ({
	insertDB: jest.fn(),
	getDB: jest.fn(),
	setDB: jest.fn()
}));

const { insertDB, getDB, setDB } = await import('../src/db.js')
const { newNote, getAllNotes, removeNote } = await import('../src/notes.js')

beforeEach(() => {
	insertDB.mockClear();
	getDB.mockClear();
	setDB.mockClear();
})

test('newNote inserts data and returns it', async () => {
	const note = {
		tags: ['tag1'],
		content: 'this is a note',
		id: 1
	}
	insertDB.mockResolvedValue(note)

	const result = await newNote(note.content, note.tags)
	expect(result.content).toEqual(note.content)
	expect(result.tags).toEqual(note.tags)
})

test('getAllNotes returns all notes', async () => {
	const db = {
		notes: ['note1', 'note2', 'note3']
	}
	getDB.mockResolvedValue(db)

	const results = await getAllNotes()
	expect(results).toEqual(db.notes)
})

test('removeNote does nothing if id is not found', async () => {
	const db = [
		{id: 1, content: 'note 1'},
		{id: 2, content: 'note 2'},
		{id: 3, content: 'note 3'},
	]
	setDB.mockResolvedValue(db)
	const idToRemove = 4
	const results = await removeNote(idToRemove)
	expect(results).toBeUndefined()
})
