import { createMemo, For, Show, createSignal } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useAppStore } from '../../stores/app-store'
import { TodoItem } from './TodoItem'
import { TodoList } from './TodoList'
import { getTodayDate, isOverdue, isToday } from '../../lib/date-utils'
import { EmptyState } from '../shared/EmptyState'
import { CheckSquareIcon, PlusIcon, XIcon } from 'lucide-solid'

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
	display: 'flex',
	flexDirection: 'column',
	minHeight: '100%',
})

const activeTodosSection = css({})

const completedSection = css({
	mt: 'auto',
	pt: '6',
	borderTop: '1px solid',
	borderTopColor: 'gray.a3',
})

const header = css({
	fontSize: '1.5rem',
	fontWeight: 'bold',
	color: 'fg.default',
	mb: '4',
	letterSpacing: '-0.03em',
})

// ── Tab bar ──

const tabBar = css({
	display: 'flex',
	alignItems: 'center',
	gap: '1',
	mb: '5',
	flexWrap: 'wrap',
})

const tab = css({
	display: 'flex',
	alignItems: 'center',
	gap: '1.5',
	px: '3',
	py: '1.5',
	borderRadius: 'full',
	fontSize: '13px',
	fontWeight: '500',
	cursor: 'pointer',
	color: 'fg.muted',
	transition: 'all 0.15s',
	_hover: { bg: 'gray.a3', color: 'fg.default' },
	'&[data-active="true"]': {
		bg: 'indigo.a2',
		color: 'indigo.11',
	},
})

const tabCount = css({
	fontSize: '11px',
	fontWeight: '600',
	color: 'fg.subtle',
	bg: 'gray.a2',
	borderRadius: 'full',
	px: '1.5',
	minWidth: '20px',
	textAlign: 'center',
	lineHeight: '18px',
	'[data-active="true"] &': {
		bg: 'indigo.a3',
		color: 'indigo.11',
	},
})

const tabDot = css({
	width: '8px',
	height: '8px',
	borderRadius: 'full',
	flexShrink: 0,
})

const addTabBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '7',
	height: '7',
	borderRadius: 'full',
	cursor: 'pointer',
	color: 'fg.subtle',
	borderWidth: '1px',
	borderStyle: 'dashed',
	borderColor: 'gray.a4',
	transition: 'all 0.15s',
	_hover: { bg: 'gray.a2', color: 'fg.default', borderColor: 'gray.a6' },
})

const tabInputWrap = css({
	display: 'flex',
	alignItems: 'center',
	gap: '1',
})

const tabInput = css({
	fontSize: '13px',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'indigo.a5',
	borderRadius: 'full',
	px: '3',
	py: '1',
	bg: 'bg.default',
	color: 'fg.default',
	outline: 'none',
	width: '120px',
	_focus: { borderColor: 'indigo.9', boxShadow: '0 0 0 3px {colors.indigo.a2}' },
})

const deleteTabBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '5',
	height: '5',
	borderRadius: 'full',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.12s',
	_hover: { bg: 'red.a2', color: 'red.11' },
})

// ── Progress + add ──

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
	const [selectedListId, setSelectedListId] = createSignal<string | null>(null)
	const [showNewList, setShowNewList] = createSignal(false)
	const [newListName, setNewListName] = createSignal('')

	const allTodos = () => store.todos() || []
	const allTodoLists = () => store.todoLists() || []

	// Filter todos by selected list
	const filteredTodos = createMemo(() => {
		const listId = selectedListId()
		if (listId === null) return allTodos() // "All" tab
		return allTodos().filter((t) => t.todo_list_id === listId)
	})

	const overdue = createMemo(() =>
		filteredTodos().filter(
			(t) => !t.is_completed && t.due_date && isOverdue(t.due_date)
		)
	)

	const today = createMemo(() =>
		filteredTodos().filter(
			(t) => !t.is_completed && t.due_date && isToday(t.due_date)
		)
	)

	const upcoming = createMemo(() => {
		const todayStr = getTodayDate()
		return filteredTodos().filter(
			(t) => !t.is_completed && t.due_date && t.due_date > todayStr
		)
	})

	const noDueDate = createMemo(() =>
		filteredTodos().filter((t) => !t.is_completed && !t.due_date)
	)

	const completed = createMemo(() =>
		filteredTodos().filter((t) => t.is_completed)
	)

	const totalCount = () => filteredTodos().length
	const completedCount = () => completed().length
	const progressPct = () => {
		if (totalCount() === 0) return 0
		return Math.round((completedCount() / totalCount()) * 100)
	}

	// Count per list (for tab badges)
	const countForList = (listId: string | null) => {
		if (listId === null) return allTodos().filter((t) => !t.is_completed).length
		return allTodos().filter((t) => t.todo_list_id === listId && !t.is_completed).length
	}

	async function handleAddTodo() {
		const text = newTodoText().trim()
		if (!text) return
		await window.electronAPI.createTodo({
			text,
			due_date: getTodayDate(),
			todo_list_id: selectedListId(),
		})
		setNewTodoText('')
		store.refetchTodos()
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') handleAddTodo()
	}

	async function handleCreateList() {
		const name = newListName().trim()
		if (!name) {
			setShowNewList(false)
			return
		}
		const list = await window.electronAPI.createTodoList(name)
		store.refetchTodoLists()
		setSelectedListId(list.id)
		setNewListName('')
		setShowNewList(false)
	}

	function handleListInputKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') handleCreateList()
		if (e.key === 'Escape') {
			setShowNewList(false)
			setNewListName('')
		}
	}

	async function handleDeleteList(listId: string) {
		await window.electronAPI.deleteTodoList(listId)
		store.refetchTodoLists()
		if (selectedListId() === listId) {
			setSelectedListId(null)
		}
	}

	const hasTodos = () => filteredTodos().length > 0

	return (
		<div class={container}>
			<div class={contentWrap}>
				<h1 class={header}>To-dos</h1>

				{/* Tab bar */}
				<div class={tabBar}>
					<div
						class={tab}
						data-active={selectedListId() === null}
						onClick={() => setSelectedListId(null)}
					>
						All
						<span class={tabCount}>
							{countForList(null)}
						</span>
					</div>
					<For each={allTodoLists()}>
						{(list) => (
							<div
								class={tab}
								data-active={selectedListId() === list.id}
								onClick={() => setSelectedListId(list.id)}
							>
								<div
									class={tabDot}
									style={{ background: `var(--colors-${list.color}-9)` }}
								/>
								{list.name}
								<span class={tabCount}>
									{countForList(list.id)}
								</span>
								<div
									class={deleteTabBtn}
									onClick={(e) => {
										e.stopPropagation()
										handleDeleteList(list.id)
									}}
									title={`Delete "${list.name}"`}
								>
									<XIcon class={css({ width: '3', height: '3' })} />
								</div>
							</div>
						)}
					</For>
					<Show
						when={showNewList()}
						fallback={
							<button
								class={addTabBtn}
								onClick={() => setShowNewList(true)}
								title="New list"
							>
								<PlusIcon class={css({ width: '3.5', height: '3.5' })} />
							</button>
						}
					>
						<div class={tabInputWrap}>
							<input
								class={tabInput}
								value={newListName()}
								onInput={(e) => setNewListName(e.currentTarget.value)}
								onKeyDown={handleListInputKeyDown}
								onBlur={handleCreateList}
								placeholder="List name"
								autofocus
							/>
						</div>
					</Show>
				</div>

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
					<div class={activeTodosSection}>
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
					</div>
					<Show when={completed().length > 0}>
						<div class={completedSection}>
							<TodoList title="Completed" variant="muted">
								<For each={completed()}>
									{(todo) => <TodoItem todo={todo} />}
								</For>
							</TodoList>
						</div>
					</Show>
				</Show>
			</div>
		</div>
	)
}
