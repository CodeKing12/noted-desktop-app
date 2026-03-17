import { createMemo, For, Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useAppStore } from '../../stores/app-store'
import { TodoItem } from './TodoItem'
import { TodoList } from './TodoList'
import { getTodayDate, isOverdue, isToday } from '../../lib/date-utils'
import { EmptyState } from '../shared/EmptyState'
import { CheckSquareIcon } from 'lucide-solid'
import { createSignal } from 'solid-js'

const container = css({
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	overflow: 'auto',
	px: '8',
	py: '6',
})

const header = css({
	fontSize: 'xl',
	fontWeight: 'bold',
	color: 'fg.default',
	mb: '6',
})

const addRow = css({
	display: 'flex',
	gap: '2',
	mb: '6',
})

const addInput = css({
	flex: 1,
	px: '3',
	py: '2',
	border: '1px solid',
	borderColor: 'border.default',
	borderRadius: 'md',
	bg: 'bg.default',
	color: 'fg.default',
	fontSize: 'sm',
	outline: 'none',
	_focus: { borderColor: 'colorPalette.solid.bg' },
})

const addBtn = css({
	px: '4',
	py: '2',
	borderRadius: 'md',
	fontSize: 'sm',
	fontWeight: 'medium',
	cursor: 'pointer',
	bg: 'colorPalette.solid.bg',
	color: 'colorPalette.solid.fg',
	_hover: { bg: 'colorPalette.solid.bg.hover' },
})

export function TodoView() {
	const store = useAppStore()
	const [newTodoText, setNewTodoText] = createSignal('')

	const overdue = createMemo(() => {
		return (store.todos() || []).filter(
			(t) => !t.is_completed && t.due_date && isOverdue(t.due_date)
		)
	})

	const today = createMemo(() => {
		return (store.todos() || []).filter(
			(t) => !t.is_completed && t.due_date && isToday(t.due_date)
		)
	})

	const upcoming = createMemo(() => {
		const todayStr = getTodayDate()
		return (store.todos() || []).filter(
			(t) => !t.is_completed && t.due_date && t.due_date > todayStr
		)
	})

	const noDueDate = createMemo(() => {
		return (store.todos() || []).filter(
			(t) => !t.is_completed && !t.due_date
		)
	})

	const completed = createMemo(() => {
		return (store.todos() || []).filter((t) => t.is_completed)
	})

	async function handleAddTodo() {
		const text = newTodoText().trim()
		if (!text) return
		await window.electronAPI.createTodo({
			text,
			due_date: getTodayDate(),
		})
		setNewTodoText('')
		store.refetchTodos()
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') handleAddTodo()
	}

	const hasTodos = () => (store.todos() || []).length > 0

	return (
		<div class={container}>
			<h1 class={header}>To-dos</h1>

			<div class={addRow}>
				<input
					class={addInput}
					value={newTodoText()}
					onInput={(e) => setNewTodoText(e.currentTarget.value)}
					onKeyDown={handleKeyDown}
					placeholder="Add a new to-do..."
				/>
				<button class={addBtn} onClick={handleAddTodo}>
					Add
				</button>
			</div>

			<Show
				when={hasTodos()}
				fallback={
					<EmptyState
						icon={CheckSquareIcon}
						title="No to-dos yet"
						description="Add your first to-do above"
					/>
				}
			>
				<Show when={overdue().length > 0}>
					<TodoList title="Overdue" variant="danger">
						<For each={overdue()}>
							{(todo) => <TodoItem todo={todo} />}
						</For>
					</TodoList>
				</Show>
				<Show when={today().length > 0}>
					<TodoList title="Today">
						<For each={today()}>
							{(todo) => <TodoItem todo={todo} />}
						</For>
					</TodoList>
				</Show>
				<Show when={upcoming().length > 0}>
					<TodoList title="Upcoming">
						<For each={upcoming()}>
							{(todo) => <TodoItem todo={todo} />}
						</For>
					</TodoList>
				</Show>
				<Show when={noDueDate().length > 0}>
					<TodoList title="No Due Date">
						<For each={noDueDate()}>
							{(todo) => <TodoItem todo={todo} />}
						</For>
					</TodoList>
				</Show>
				<Show when={completed().length > 0}>
					<TodoList title="Completed" variant="muted">
						<For each={completed()}>
							{(todo) => <TodoItem todo={todo} />}
						</For>
					</TodoList>
				</Show>
			</Show>
		</div>
	)
}
