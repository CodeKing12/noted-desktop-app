import { createSignal } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useAppStore } from '../../stores/app-store'

const overlay = css({
	position: 'fixed',
	inset: 0,
	bg: 'rgba(0,0,0,0.4)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 50,
})

const dialog = css({
	bg: 'bg.default',
	borderRadius: 'lg',
	p: '6',
	width: '360px',
	boxShadow: 'lg',
	border: '1px solid',
	borderColor: 'border.default',
})

const inputStyle = css({
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
})

const btnRow = css({
	display: 'flex',
	justifyContent: 'flex-end',
	gap: '2',
	mt: '4',
})

const btn = css({
	px: '4',
	py: '1.5',
	borderRadius: 'md',
	fontSize: 'sm',
	fontWeight: 'medium',
	cursor: 'pointer',
	transition: 'all 0.15s',
})

export function CreateListDialog(props: { onClose: () => void }) {
	const store = useAppStore()
	const [name, setName] = createSignal('')

	async function handleCreate() {
		const n = name().trim()
		if (!n) return
		await window.electronAPI.createList(n)
		store.refetchLists()
		props.onClose()
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') handleCreate()
		if (e.key === 'Escape') props.onClose()
	}

	return (
		<div class={overlay} onClick={props.onClose}>
			<div class={dialog} onClick={(e) => e.stopPropagation()}>
				<h3
					class={css({
						fontSize: 'md',
						fontWeight: 'semibold',
						mb: '4',
						color: 'fg.default',
					})}
				>
					New List
				</h3>
				<input
					class={inputStyle}
					placeholder="List name"
					value={name()}
					onInput={(e) => setName(e.currentTarget.value)}
					onKeyDown={handleKeyDown}
					autofocus
				/>
				<div class={btnRow}>
					<button
						class={`${btn} ${css({ bg: 'bg.muted', color: 'fg.default', _hover: { bg: 'bg.emphasized' } })}`}
						onClick={props.onClose}
					>
						Cancel
					</button>
					<button
						class={`${btn} ${css({ bg: 'colorPalette.solid.bg', color: 'colorPalette.solid.fg', _hover: { bg: 'colorPalette.solid.bg.hover' } })}`}
						onClick={handleCreate}
					>
						Create
					</button>
				</div>
			</div>
		</div>
	)
}
