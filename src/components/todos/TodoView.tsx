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
	animation: 'fade-in 0.2s ease-out',
})

const contentWrap = css({
	maxWidth: '640px',
	width: '100%',
	mx: 'auto',
	px: '8',
	py: '6',
})

const header = css({
	fontSize: '1.5rem',
	fontWeight: 'bold',
	color: 'fg.default',
	mb: '2',
	letterSpacing: '-0.03em',
})

const progressSection = css({
	mb: '6',
})

const progressLabel = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	mb: '2',
})

const progressText = css({
	fontSize: 'sm',
	color: 'fg.muted',
	fontWeight: '500',
})

const progressPercent = css({
	fontSize: 'sm',
	fontWeight: '600',
	color: 'indigo.11',
})

const progressTrack = css({
	height: '6px',
	borderRadius: 'full',
	bg: 'gray.a3',
	overflow: 'hidden',
})

const progressBar = css({
	height: '100%',
	borderRadius: 'full',
	bg: 'indigo.9',
	transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
})

const addRow = css({
	display: 'flex',
	gap: '2',
	mb: '6',
})

const addInputWrap = css({
	flex: 1,
	display: 'flex',
	alignItems: 'center',
	px: '3',
	py: '2',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'gray.a4',
	borderRadius: 'lg',
	bg: 'bg.default',
	transition: 'all 0.15s',
	'&:focus-within': {
		borderColor: 'indigo.a6',
		boxShadow: '0 0 0 3px {colors.indigo.a2}',
	},
})

const addInput = css({
	flex: 1,
	bg: 'transparent',
	color: 'fg.default',
	fontSize: 'sm',
	outline: 'none',
	border: 'none',
	'&::placeholder': { color: 'fg.muted' },
})

const addBtn = css({
	px: '4',
	py: '2',
	borderRadius: 'lg',
	fontSize: 'sm',
	fontWeight: '500',
	cursor: 'pointer',
	bg: 'indigo.9',
	color: 'white',
	transition: 'all 0.15s',
	_hover: { bg: 'indigo.10', transform: 'translateY(-1px)', boxShadow: '0 4px 12px {colors.indigo.a5}' },
	_active: { transform: 'translateY(0)' },
})

export function TodoView() {
	const store = useAppStore()
	const [newTodoText, setNewTodoText] = createSignal('')

	const allTodos = () => store.todos() || []

	const overdue = createMemo(() => {
		return allTodos().filter(
			(t) => !t.is_completed && t.due_date && isOverdue(t.due_date)
		)
	})

	const today = createMemo(() => {
		return allTodos().filter(
			(t) => !t.is_completed && t.due_date && isToday(t.due_date)
		)
	})

	const upcoming = createMemo(() => {
		const todayStr = getTodayDate()
		return allTodos().filter(
			(t) => !t.is_completed && t.due_date && t.due_date > todayStr
		)
	})

	const noDueDate = createMemo(() => {
		return allTodos().filter(
			(t) => !t.is_completed && !t.due_date
		)
	})

	const completed = createMemo(() => {
		return allTodos().filter((t) => t.is_completed)
	})

	const totalCount = () => allTodos().length
	const completedCount = () => completed().length
	const progressPct = () => {
		if (totalCount() === 0) return 0
		return Math.round((completedCount() / totalCount()) * 100)
	}

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

	const hasTodos = () => allTodos().length > 0

	return (
		<div class={container}>
			<div class={contentWrap}>
				<h1 class={header}>To-dos</h1>

				{/* Progress bar */}
				<Show when={hasTodos()}>
					<div class={progressSection}>
						<div class={progressLabel}>
							<span class={progressText}>
								{completedCount()} of {totalCount()} completed
							</span>
							<span class={progressPercent}>{progressPct()}%</span>
						</div>
						<div class={progressTrack}>
							<div
								class={progressBar}
								style={{ width: `${progressPct()}%` }}
							/>
						</div>
					</div>
				</Show>

				<div class={addRow}>
					<div class={addInputWrap}>
						<input
							class={addInput}
							value={newTodoText()}
							onInput={(e) => setNewTodoText(e.currentTarget.value)}
							onKeyDown={handleKeyDown}
							placeholder="Add a new to-do..."
						/>
					</div>
					<button class={addBtn} onClick={handleAddTodo}>
						Add
					</button>
				</div>

				<Show
					when={hasTodos()}
					fallback={
						<EmptyState
							icon={CheckSquareIcon}
							title="All caught up!"
							description="Add your first to-do above to get started"
							hint="Press Enter to add quickly"
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
		</div>
	)
}
