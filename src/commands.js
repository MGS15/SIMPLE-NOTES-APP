import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { findNotes, getAllNotes, newNote, removeAllNotes, removeNote } from './notes.js'
import { start } from './server.js';

const listNotes = notes => {
	notes.forEach(({id, content, tags}) => {
		console.log('id	:', id)
		console.log('tags	:', tags)
		console.log('content	:', content)
		console.log('\n')
	});
}

yargs(hideBin(process.argv)).command(
	'new <note>', 'Create new note', (yargs) => {
		return yargs.positional(
			'note', {
				type: 'string',
				description: 'The content of the note to create.'
			})
	}, async (argv) => {
		const tags = argv.tags ? argv.tags.split(',') : []
		const note = await newNote(argv.note, tags)
		console.log('New note added!', note)
	}
).option(
	'tags', {
		alias: 't',
		type: 'string',
		description: 'Tags to add to the note.'
	}
).command(
	'all', 'Get all notes.', () => { }, async (argv) => {
		const notes = await getAllNotes()
		listNotes(notes)
	}
).command(
	'find <filter>', 'Get matching notes.', (yargs) => {
		return yargs.positional('id', {
			describe: "The search term to filter notes by, will be applied to note.content",
			type: 'string'
		})
	}, async (argv) => {
		const matches = await findNotes(argv.filter)
		listNotes(matches)
	}
).command(
	'remove <id>', 'Remove a note by id.', (yargs) => {
		return yargs.positional('id', {
			type: 'number',
			description: 'The id of the note you want to remove.'
		})
	}, async (argv) => {
		const id = await removeNote(argv.id)
		console.log(id)
	}
).command(
	'web [port]', 'Launch website to see notes.', (yargs) => {
		return yargs.positional('port', {
			describe: 'Port to bind on.',
			default: 5000,
			type: 'number'
		})
	}, async (argv) => {
		const notes = await getAllNotes()
		start(notes, argv.port)
	}
).command('clean', 'Remove all notes', () => { }, async (argv) => {
	await removeAllNotes()
	console.log("Database was reseted!")
}).demandCommand(1).parse()
