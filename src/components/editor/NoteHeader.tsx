import { createSignal, Show } from 'solid-js'
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
	borderBottom: '1px solid',
	borderColor: 'border.default',
	flexShrink: 0,
})

const titleInput = css({
	flex: 1,
	fontSize: 'lg',
	fontWeight: 'semibold',
	color: 'fg.default',
	bg: 'transparent',
	border: 'none',
	outline: 'none',
	padding: 0,
	'&::placeholder': { color: 'fg.muted' },
})

const actionBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '7',
	height: '7',
	borderRadius: 'md',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.15s',
	_hover: { bg: 'bg.muted', color: 'fg.default' },
})

const iconSize = css({ width: '4', height: '4' })

const savingIndicator = css({
	fontSize: 'xs',
	color: 'fg.muted',
	flexShrink: 0,
})

export function NoteHeader(props: { note: Note; readonly?: boolean }) {
	const editorStore = useEditorStore()
	const appStore = useAppStore()
	const [localTitle, setLocalTitle] = createSignal(props.note.title)

	// Update local title when note changes
	let prevNoteId = props.note.id
	const checkNoteChange = () => {
		if (props.note.id !== prevNoteId) {
			setLocalTitle(props.note.title)
			prevNoteId = props.note.id
		}
	}
	// We check on each render
	checkNoteChange()

	let titleTimeout: ReturnType<typeof setTimeout> | null = null

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
				<span class={savingIndicator}>Saving...</span>
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
