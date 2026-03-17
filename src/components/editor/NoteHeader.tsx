import { createSignal, createEffect, on, Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useEditorStore } from '../../stores/editor-store'
import { useAppStore } from '../../stores/app-store'
import {
	PinIcon,
	PinOffIcon,
	Trash2Icon,
	RotateCcwIcon,
	XIcon,
} from 'lucide-solid'

const headerStyle = css({
	display: 'flex',
	alignItems: 'center',
	gap: '2',
	px: '8',
	py: '3',
	flexShrink: 0,
})

const titleInput = css({
	flex: 1,
	fontSize: '1.125rem',
	fontWeight: '600',
	color: 'fg.default',
	bg: 'transparent',
	border: 'none',
	outline: 'none',
	padding: 0,
	letterSpacing: '-0.02em',
	'&::placeholder': { color: 'fg.muted' },
})

const actionBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '7',
	height: '7',
	borderRadius: 'lg',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.15s',
	_hover: { bg: 'gray.a3', color: 'fg.default' },
})

const iconSize = css({ width: '4', height: '4' })

const saveIndicator = css({
	display: 'flex',
	alignItems: 'center',
	gap: '1.5',
	flexShrink: 0,
	animation: 'fade-in 0.2s ease',
})

const saveDot = css({
	width: '6px',
	height: '6px',
	borderRadius: 'full',
	bg: 'indigo.9',
	animation: 'save-pulse 1s ease-in-out infinite',
})

const saveText = css({
	fontSize: '11px',
	color: 'fg.muted',
	fontWeight: '500',
})

export function NoteHeader(props: { note: Note; readonly?: boolean }) {
	const editorStore = useEditorStore()
	const appStore = useAppStore()
	const [localTitle, setLocalTitle] = createSignal(props.note.title)
	let titleTimeout: ReturnType<typeof setTimeout> | null = null

	// Update local title when note changes
	createEffect(
		on(
			() => props.note.id,
			() => {
				if (titleTimeout) {
					clearTimeout(titleTimeout)
					titleTimeout = null
				}
				setLocalTitle(props.note.title)
			},
			{ defer: true }
		)
	)

	function handleTitleChange(value: string) {
		setLocalTitle(value)
		if (titleTimeout) clearTimeout(titleTimeout)
		titleTimeout = setTimeout(() => {
			editorStore.saveNote({ title: value || 'Untitled' })
		}, 300)
	}

	async function handlePin() {
		await window.electronAPI.updateNote(props.note.id, {
			is_pinned: !props.note.is_pinned,
		})
		appStore.refetchNotes()
		editorStore.loadNote(props.note.id)
	}

	async function handleTrash() {
		await window.electronAPI.trashNote(props.note.id)
		appStore.refetchNotes()
		appStore.setSelectedNoteId(null)
	}

	async function handleRestore() {
		await window.electronAPI.restoreNote(props.note.id)
		appStore.refetchNotes()
		appStore.setSelectedNoteId(null)
	}

	async function handleDeletePermanently() {
		await window.electronAPI.deleteNotePermanently(props.note.id)
		appStore.refetchNotes()
		appStore.setSelectedNoteId(null)
	}

	return (
		<div class={headerStyle}>
			<input
				class={titleInput}
				value={localTitle()}
				onInput={(e) => handleTitleChange(e.currentTarget.value)}
				placeholder="Untitled"
				disabled={props.readonly}
			/>
			<Show when={editorStore.isSaving()}>
				<div class={saveIndicator}>
					<div class={saveDot} />
					<span class={saveText}>Saving</span>
				</div>
			</Show>
			<Show
				when={!props.readonly}
				fallback={
					<>
						<button
							class={actionBtn}
							onClick={handleRestore}
							title="Restore"
						>
							<RotateCcwIcon class={iconSize} />
						</button>
						<button
							class={actionBtn}
							onClick={handleDeletePermanently}
							title="Delete permanently"
						>
							<XIcon class={iconSize} />
						</button>
					</>
				}
			>
				<button class={actionBtn} onClick={handlePin} title="Pin/Unpin">
					<Show
						when={props.note.is_pinned}
						fallback={<PinIcon class={iconSize} />}
					>
						<PinOffIcon class={iconSize} />
					</Show>
				</button>
				<button class={actionBtn} onClick={handleTrash} title="Delete">
					<Trash2Icon class={iconSize} />
				</button>
			</Show>
		</div>
	)
}
