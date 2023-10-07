import fs from 'node:fs/promises'

const DB_PATH = new URL('../db.json', import.meta.url).pathname
export const getDB = async () => {
	const db = await fs.readFile(DB_PATH, 'utf-8')
	return JSON.parse(db)
}

export const setDB = async (db) => {
	await fs.writeFile(DB_PATH, JSON.stringify(db, null, 4))
	return db
}

export const insertDB = async (note) => {
	const db = await getDB()
	db.notes.push(note)
	await setDB(db)
	return db
}