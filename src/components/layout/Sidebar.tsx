import { For, Show, createSignal, createMemo } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useAppStore } from '../../stores/app-store'
import { useSettingsStore } from '../../stores/settings-store'
import {
	FileTextIcon,
	CalendarIcon,
	CheckSquareIcon,
	Trash2Icon,
	SearchIcon,
	PlusIcon,
	FolderIcon,
	SettingsIcon,
	MoreHorizontalIcon,
	PanelLeftCloseIcon,
	PanelLeftOpenIcon,
	SunIcon,
	MoonIcon,
	PenLineIcon,
} from 'lucide-solid'
import { CreateListDialog } from '../sidebar/CreateListDialog'

const sidebarContainer = css({
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	py: '2',
	userSelect: 'none',
})

const brandRow = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	px: '4',
	py: '3',
	mb: '1',
})

const brandName = css({
	display: 'flex',
	alignItems: 'center',
	gap: '2',
	fontSize: 'md',
	fontWeight: 'bold',
	color: 'fg.default',
	letterSpacing: '-0.02em',
})

const brandIcon = css({
	width: '5',
	height: '5',
	color: 'indigo.9',
})

const collapseBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '6',
	height: '6',
	borderRadius: 'md',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.15s',
	_hover: { bg: 'bg.muted', color: 'fg.default' },
})

const sectionLabel = css({
	px: '4',
	py: '1.5',
	fontSize: '10px',
	fontWeight: 'bold',
	color: 'fg.subtle',
	textTransform: 'uppercase',
	letterSpacing: '0.08em',
})

const navItem = css({
	display: 'flex',
	alignItems: 'center',
	gap: '2.5',
	px: '3',
	py: '1.5',
	mx: '2',
	borderRadius: 'lg',
	fontSize: 'sm',
	cursor: 'pointer',
	color: 'fg.muted',
	transition: 'all 0.15s ease',
	position: 'relative',
	_hover: { bg: 'gray.a3', color: 'fg.default' },
	'&[data-active="true"]': {
		bg: 'indigo.a3',
		color: 'indigo.11',
		fontWeight: '500',
	},
})

const navItemCollapsed = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	py: '2',
	mx: '1',
	borderRadius: 'lg',
	cursor: 'pointer',
	color: 'fg.muted',
	transition: 'all 0.15s ease',
	_hover: { bg: 'gray.a3', color: 'fg.default' },
	'&[data-active="true"]': {
		bg: 'indigo.a3',
		color: 'indigo.11',
	},
})

const iconStyle = css({
	width: '4',
	height: '4',
	flexShrink: 0,
})

const badge = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	minWidth: '18px',
	height: '18px',
	borderRadius: 'full',
	fontSize: '10px',
	fontWeight: '600',
	bg: 'gray.a3',
	color: 'fg.muted',
	px: '1',
	ml: 'auto',
	'&[data-accent="true"]': {
		bg: 'indigo.a3',
		color: 'indigo.11',
	},
})

const listSection = css({
	flex: 1,
	overflowY: 'auto',
	overflowX: 'hidden',
})

const bottomSection = css({
	borderTop: '1px solid',
	borderColor: 'gray.a3',
	pt: '2',
	mt: '2',
})

const addListBtn = css({
	display: 'flex',
	alignItems: 'center',
	gap: '2.5',
	px: '3',
	py: '1.5',
	mx: '2',
	borderRadius: 'lg',
	fontSize: 'sm',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.15s',
	_hover: { bg: 'gray.a3', color: 'fg.default' },
})

const listItemContainer = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: '1',
	pr: '2',
	'&:hover .list-actions': {
		opacity: 1,
	},
})

const listActions = css({
	opacity: 0,
	transition: 'opacity 0.15s',
	cursor: 'pointer',
	color: 'fg.subtle',
	_hover: { color: 'fg.default' },
	padding: '1',
	borderRadius: 'sm',
})

const bottomRow = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '0.5',
	px: '2',
	py: '1',
})

const bottomBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '7',
	height: '7',
	borderRadius: 'md',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.15s',
	_hover: { bg: 'gray.a3', color: 'fg.default' },
})

export function Sidebar() {
	const store = useAppStore()
	const settingsStore = useSettingsStore()
	const [showCreateList, setShowCreateList] = createSignal(false)

	const collapsed = () => store.sidebarCollapsed()

	const isActive = (view: string) => {
		const current = store.currentView()
		if (typeof current === 'string') return current === view
		return false
	}

	const isListActive = (listId: string) => {
		const current = store.currentView()
		return typeof current === 'object' && current.type === 'list' && current.listId === listId
	}

	const todayCount = createMemo(() => {
		const todayStr = new Date().toISOString().split('T')[0]
		return (store.todos() || []).filter(
			(t) => !t.is_completed && t.due_date && t.due_date === todayStr
		).length
	})

	const todoCount = createMemo(() => {
		return (store.todos() || []).filter((t) => !t.is_completed).length
	})

	function handleNavClick(view: 'all' | 'today' | 'todos' | 'trash' | 'search') {
		store.setCurrentView(view)
		store.setSelectedNoteId(null)
	}

	function handleListClick(listId: string) {
		store.setCurrentView({ type: 'list', listId })
		store.setSelectedNoteId(null)
	}

	async function handleDeleteList(e: Event, listId: string) {
		e.stopPropagation()
		await window.electronAPI.deleteList(listId)
		store.refetchLists()
		if (isListActive(listId)) {
			store.setCurrentView('all')
		}
	}

	// Collapsed sidebar
	if (collapsed()) {
		return (
			<div class={sidebarContainer}>
				<div class={css({ display: 'flex', justifyContent: 'center', py: '3', mb: '1' })}>
					<button
						class={collapseBtn}
						onClick={() => store.setSidebarCollapsed(false)}
						title="Expand sidebar"
					>
						<PanelLeftOpenIcon class={iconStyle} />
					</button>
				</div>

				<div
					class={navItemCollapsed}
					data-active={isActive('search')}
					onClick={() => store.setCommandPaletteOpen(true)}
					title="Search"
				>
					<SearchIcon class={iconStyle} />
				</div>
				<div
					class={navItemCollapsed}
					data-active={isActive('today')}
					onClick={() => handleNavClick('today')}
					title="Today"
				>
					<CalendarIcon class={iconStyle} />
				</div>
				<div
					class={navItemCollapsed}
					data-active={isActive('all')}
					onClick={() => handleNavClick('all')}
					title="All Notes"
				>
					<FileTextIcon class={iconStyle} />
				</div>
				<div
					class={navItemCollapsed}
					data-active={isActive('todos')}
					onClick={() => handleNavClick('todos')}
					title="To-dos"
				>
					<CheckSquareIcon class={iconStyle} />
				</div>

				<div class={css({ flex: 1 })} />

				<div class={bottomSection}>
					<div
						class={navItemCollapsed}
						data-active={isActive('trash')}
						onClick={() => handleNavClick('trash')}
						title="Trash"
					>
						<Trash2Icon class={iconStyle} />
					</div>
					<div
						class={navItemCollapsed}
						onClick={() => settingsStore.setShowSettingsDialog(true)}
						title="Settings"
					>
						<SettingsIcon class={iconStyle} />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div class={sidebarContainer}>
			<div class={css({ display: 'flex', justifyContent: 'flex-end', px: '2', pt: '1', mb: '1' })}>
				<button
					class={collapseBtn}
					onClick={() => store.setSidebarCollapsed(true)}
					title="Collapse sidebar (Ctrl+B)"
				>
					<PanelLeftCloseIcon class={css({ width: '3.5', height: '3.5' })} />
				</button>
			</div>

			{/* Search */}
			<div
				class={navItem}
				data-active={isActive('search')}
				onClick={() => store.setCommandPaletteOpen(true)}
			>
				<SearchIcon class={iconStyle} />
				<span>Search</span>
				<span class={css({ ml: 'auto', fontSize: '10px', color: 'fg.subtle', fontFamily: 'mono' })}>
					Ctrl+K
				</span>
			</div>

			{/* Main nav */}
			<div class={css({ mb: '2', mt: '1' })}>
				<div
					class={navItem}
					data-active={isActive('today')}
					onClick={() => handleNavClick('today')}
				>
					<CalendarIcon class={iconStyle} />
					<span>Today</span>
					<Show when={todayCount() > 0}>
						<span class={badge} data-accent="true">{todayCount()}</span>
					</Show>
				</div>
				<div
					class={navItem}
					data-active={isActive('all')}
					onClick={() => handleNavClick('all')}
				>
					<FileTextIcon class={iconStyle} />
					<span>All Notes</span>
					<Show when={(store.notes() || []).length > 0}>
						<span class={badge}>{(store.notes() || []).length}</span>
					</Show>
				</div>
				<div
					class={navItem}
					data-active={isActive('todos')}
					onClick={() => handleNavClick('todos')}
				>
					<CheckSquareIcon class={iconStyle} />
					<span>To-dos</span>
					<Show when={todoCount() > 0}>
						<span class={badge} data-accent="true">{todoCount()}</span>
					</Show>
				</div>
			</div>

			{/* Lists */}
			<div class={listSection}>
				<div class={sectionLabel}>Lists</div>
				<For each={store.lists()}>
					{(list) => (
						<div class={listItemContainer}>
							<div
								class={navItem}
								style={{ flex: 1 }}
								data-active={isListActive(list.id)}
								onClick={() => handleListClick(list.id)}
							>
								<FolderIcon class={iconStyle} />
								<span
									class={css({
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									})}
								>
									{list.name}
								</span>
							</div>
							<div
								class={`list-actions ${listActions}`}
								onClick={(e) => handleDeleteList(e, list.id)}
							>
								<MoreHorizontalIcon
									class={css({ width: '3.5', height: '3.5' })}
								/>
							</div>
						</div>
					)}
				</For>
				<div
					class={addListBtn}
					onClick={() => setShowCreateList(true)}
				>
					<PlusIcon class={iconStyle} />
					<span>New List</span>
				</div>
			</div>

			{/* Bottom */}
			<div class={bottomSection}>
				<div
					class={navItem}
					data-active={isActive('trash')}
					onClick={() => handleNavClick('trash')}
				>
					<Trash2Icon class={iconStyle} />
					<span>Trash</span>
				</div>
				<div class={bottomRow}>
					<button
						class={bottomBtn}
						onClick={() => settingsStore.setShowSettingsDialog(true)}
						title="Settings"
					>
						<SettingsIcon class={css({ width: '3.5', height: '3.5' })} />
					</button>
					<button
						class={bottomBtn}
						onClick={() => window.electronAPI.darkModeToggle()}
						title="Toggle theme"
					>
						<SunIcon class={css({ width: '3.5', height: '3.5' })} />
					</button>
				</div>
			</div>

			<Show when={showCreateList()}>
				<CreateListDialog onClose={() => setShowCreateList(false)} />
			</Show>
		</div>
	)
}
