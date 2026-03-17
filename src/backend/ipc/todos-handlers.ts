import { ipcMain } from 'electron'
import {
	fetchAllTodos,
	fetchTodosByNote,
	createTodo,
	updateTodo,
	deleteTodo,
	rolloverTodos,
} from '../database/todo-operations.js'

export function registerTodosHandlers() {
	ipcMain.handle('todos:fetch-all', () => fetchAllTodos())
	ipcMain.handle('todos:fetch-by-note', (_, noteId: string) =>
		fetchTodosByNote(noteId)
	)
	ipcMain.handle('todos:create', (_, data) => createTodo(data))
	ipcMain.handle('todos:update', (_, id: string, data) =>
		updateTodo(id, data)
	)
	ipcMain.handle('todos:delete', (_, id: string) => deleteTodo(id))
	ipcMain.handle('todos:rollover', (_, fromDate: string, toDate: string) =>
		rolloverTodos(fromDate, toDate)
	)
}
