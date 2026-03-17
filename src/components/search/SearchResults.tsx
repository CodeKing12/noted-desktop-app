import { createSignal, For, Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useAppStore } from '../../stores/app-store'
import { SearchIcon } from 'lucide-solid'
import { EmptyState } from '../shared/EmptyState'

const container = css({
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	overflow: 'hidden',
})

const searchBar = css({
	px: '4',
	py: '3',
	borderBottom: '1px solid',
	borderColor: 'border.default',
	flexShrink: 0,
})

const searchInput = css({
	width: '100%',
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
	'&::placeholder': { color: 'fg.muted' },
})

const scrollArea = css({
	flex: 1,
	overflowY: 'auto',
	px: '2',
	py: '1',
})

const resultItem = css({
	px: '3',
	py: '2.5',
	mx: '1',
	mb: '0.5',
	borderRadius: 'md',
	cursor: 'pointer',
	transition: 'all 0.15s',
	_hover: { bg: 'bg.muted' },
})

const resultTitle = css({
	fontSize: 'sm',
	fontWeight: 'medium',
	color: 'fg.default',
	mb: '0.5',
})

const resultSnippet = css({
	fontSize: 'xs',
	color: 'fg.subtle',
	'& mark': {
		bg: 'yellow.3',
		color: 'fg.default',
		borderRadius: 'sm',
		px: '0.5',
	},
})

export function SearchResults() {
	const store = useAppStore()
	const [localQuery, setLocalQuery] = createSignal(store.searchQuery())

	let debounceTimer: ReturnType<typeof setTimeout> | null = null
	function handleInput(value: string) {
		setLocalQuery(value)
		if (debounceTimer) clearTimeout(debounceTimer)
		debounceTimer = setTimeout(() => {
			store.setSearchQuery(value)
		}, 250)
	}

	return (
		<div class={container}>
			<div class={searchBar}>
				<input
					class={searchInput}
					value={localQuery()}
					onInput={(e) => handleInput(e.currentTarget.value)}
					placeholder="Search notes..."
					autofocus
				/>
			</div>
			<div class={scrollArea}>
				<Show
					when={
						store.searchResults() &&
						store.searchResults()!.length > 0
					}
					fallback={
						<Show when={store.searchQuery().trim()}>
							<EmptyState
								icon={SearchIcon}
								title="No results"
								description="Try a different search term"
							/>
						</Show>
					}
				>
					<For each={store.searchResults()}>
						{(result) => (
							<div
								class={resultItem}
								onClick={() => {
									store.setCurrentView('all')
									store.setSelectedNoteId(result.note_id)
								}}
							>
								<div class={resultTitle}>{result.title}</div>
								<div
									class={resultSnippet}
									innerHTML={result.snippet}
								/>
							</div>
						)}
					</For>
				</Show>
			</div>
		</div>
	)
}
