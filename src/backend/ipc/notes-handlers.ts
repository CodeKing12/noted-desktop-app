import { ipcMain } from 'electron'
import {
	fetchAllNotes,
	fetchNoteById,
	fetchNotesByList,
	fetchTrashedNotes,
	fetchDailyNote,
	createNote,
	updateNote,
	trashNote,
	restoreNote,
	deleteNotePermanently,
} from '../database/note-operations.js'

export function registerNotesHandlers() {
	ipcMain.handle('notes:fetch-all', () => fetchAllNotes())
	ipcMain.handle('notes:fetch', (_, id: string) => fetchNoteById(id))
	ipcMain.handle('notes:fetch-by-list', (_, listId: string) =>
		fetchNotesByList(listId)
	)
	ipcMain.handle('notes:fetch-trashed', () => fetchTrashedNotes())
	ipcMain.handle('notes:fetch-daily', (_, date: string) =>
		fetchDailyNote(date)
	)
	ipcMain.handle('notes:create', (_, data) => createNote(data))
	ipcMain.handle('notes:update', (_, id: string, data) =>
		updateNote(id, data)
	)
	ipcMain.handle('notes:trash', (_, id: string) => trashNote(id))
	ipcMain.handle('notes:restore', (_, id: string) => restoreNote(id))
	ipcMain.handle('notes:delete-permanently', (_, id: string) =>
		deleteNotePermanently(id)
	)
}
