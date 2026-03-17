import { For, Show, createSignal } from 'solid-js'
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
} from 'lucide-solid'
import { CreateListDialog } from '../sidebar/CreateListDialog'

const sidebarContainer = css({
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	py: '2',
	userSelect: 'none',
})

const sectionLabel = css({
	px: '4',
	py: '1.5',
	fontSize: 'xs',
	fontWeight: 'semibold',
	color: 'fg.subtle',
	textTransform: 'uppercase',
	letterSpacing: '0.05em',
})

const navItem = css({
	display: 'flex',
	alignItems: 'center',
	gap: '2.5',
	px: '4',
	py: '1.5',
	mx: '2',
	borderRadius: 'md',
	fontSize: 'sm',
	cursor: 'pointer',
	color: 'fg.default',
	transition: 'all 0.15s',
	_hover: { bg: 'bg.muted' },
	'&[data-active="true"]': {
		bg: 'colorPalette.subtle.bg',
		color: 'colorPalette.text',
		fontWeight: 'medium',
	},
})

const iconStyle = css({
	width: '4',
	height: '4',
	flexShrink: 0,
})

const listSection = css({
	flex: 1,
	overflowY: 'auto',
	overflowX: 'hidden',
})

const bottomSection = css({
	borderTop: '1px solid',
	borderColor: 'border.default',
	pt: '2',
	mt: '2',
})

const addListBtn = css({
	display: 'flex',
	alignItems: 'center',
	gap: '2.5',
	px: '4',
	py: '1.5',
	mx: '2',
	borderRadius: 'md',
	fontSize: 'sm',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.15s',
	_hover: { bg: 'bg.muted', color: 'fg.default' },
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

export function Sidebar() {
	const store = useAppStore()
	const settingsStore = useSettingsStore()
	const [showCreateList, setShowCreateList] = createSignal(false)

	const isActive = (view: string) => {
		const current = store.currentView()
		if (typeof current === 'string') return current === view
		return false
	}

	const isListActive = (listId: string) => {
		const current = store.currentView()
		return typeof current === 'object' && current.type === 'list' && current.listId === listId
	}

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

	return (
		<div class={sidebarContainer}>
			<div class={css({ px: '4', py: '3', mb: '1' })}>
				<h1
					class={css({
						fontSize: 'md',
						fontWeight: 'bold',
						color: 'fg.default',
						letterSpacing: '-0.01em',
					})}
				>
					Notes
				</h1>
			</div>

			{/* Search */}
			<div
				class={navItem}
				data-active={isActive('search')}
				onClick={() => handleNavClick('search')}
			>
				<SearchIcon class={iconStyle} />
				<span>Search</span>
			</div>

			{/* Main nav */}
			<div class={css({ mb: '2' })}>
				<div
					class={navItem}
					data-active={isActive('today')}
					onClick={() => handleNavClick('today')}
				>
					<CalendarIcon class={iconStyle} />
					<span>Today</span>
				</div>
				<div
					class={navItem}
					data-active={isActive('all')}
					onClick={() => handleNavClick('all')}
				>
					<FileTextIcon class={iconStyle} />
					<span>All Notes</span>
				</div>
				<div
					class={navItem}
					data-active={isActive('todos')}
					onClick={() => handleNavClick('todos')}
				>
					<CheckSquareIcon class={iconStyle} />
					<span>To-dos</span>
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
				<div
					class={navItem}
					onClick={() => settingsStore.setShowSettingsDialog(true)}
				>
					<SettingsIcon class={iconStyle} />
					<span>Settings</span>
				</div>
			</div>

			<Show when={showCreateList()}>
				<CreateListDialog onClose={() => setShowCreateList(false)} />
			</Show>
		</div>
	)
}
