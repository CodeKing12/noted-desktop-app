import { Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useEditorStore } from '../../stores/editor-store'
import { useAppStore } from '../../stores/app-store'
import { NoteHeader } from '../editor/NoteHeader'
import { TipTapEditor } from '../editor/TipTapEditor'
import { PlainTextEditor } from '../editor/PlainTextEditor'
import { TagsBar } from '../editor/TagsBar'
import { EditorToolbar } from '../editor/EditorToolbar'
import { FileTextIcon, MaximizeIcon, MinimizeIcon } from 'lucide-solid'

const editorContainer = css({
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	overflow: 'hidden',
})

const editorContent = css({
	flex: 1,
	overflow: 'auto',
})

const contentInner = css({
	width: '100%',
	px: '8',
	py: '4',
})

const emptyContainer = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100%',
	gap: '4',
	animation: 'fade-in 0.3s ease-out',
})

const emptyIcon = css({
	width: '14',
	height: '14',
	color: 'gray.a5',
	strokeWidth: '1.25',
})

const emptyTitle = css({
	fontSize: 'md',
	fontWeight: '500',
	color: 'fg.subtle',
	letterSpacing: '-0.01em',
})

const emptyDesc = css({
	fontSize: 'sm',
	color: 'fg.muted',
	textAlign: 'center',
	maxWidth: '280px',
	lineHeight: '1.5',
})

const emptyKbd = css({
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.5',
	fontSize: 'xs',
	color: 'fg.muted',
	bg: 'gray.a2',
	border: '1px solid',
	borderColor: 'gray.a4',
	borderRadius: 'md',
	px: '1.5',
	py: '0.5',
	fontFamily: 'mono',
	mt: '2',
})

const focusToggle = css({
	position: 'absolute',
	top: '3',
	right: '3',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '7',
	height: '7',
	borderRadius: 'md',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.15s',
	zIndex: 5,
	_hover: { bg: 'gray.a3', color: 'fg.default' },
})

export function EditorPane() {
	const editorStore = useEditorStore()
	const appStore = useAppStore()

	const isTrash = () => appStore.currentView() === 'trash'

	return (
		<div class={editorContainer} style={{ position: 'relative' }}>
			<Show
				when={editorStore.currentNote()}
				fallback={
					<div class={emptyContainer}>
						<FileTextIcon class={emptyIcon} />
						<p class={emptyTitle}>No note selected</p>
						<p class={emptyDesc}>
							Select a note from the list or create a new one to start writing
						</p>
						<span class={emptyKbd}>Ctrl+K to search</span>
					</div>
				}
			>
				{(note) => (
					<>
						<Show when={note().note_type === 'rich' && !isTrash()}>
							<EditorToolbar />
						</Show>
						<NoteHeader note={note()} readonly={isTrash()} />
						<TagsBar noteId={note().id} readonly={isTrash()} />
						<div class={editorContent}>
							<div class={contentInner}>
								<Show
									when={note().note_type === 'rich'}
									fallback={
										<PlainTextEditor
											note={note()}
											readonly={isTrash()}
										/>
									}
								>
									<TipTapEditor
										note={note()}
										readonly={isTrash()}
									/>
								</Show>
							</div>
						</div>
						{/* Focus mode toggle */}
						<button
							class={focusToggle}
							onClick={() => appStore.setFocusMode(!appStore.focusMode())}
							title={appStore.focusMode() ? 'Exit focus mode (Ctrl+Shift+F)' : 'Focus mode (Ctrl+Shift+F)'}
						>
							<Show
								when={appStore.focusMode()}
								fallback={<MaximizeIcon class={css({ width: '3.5', height: '3.5' })} />}
							>
								<MinimizeIcon class={css({ width: '3.5', height: '3.5' })} />
							</Show>
						</button>
					</>
				)}
			</Show>
		</div>
	)
}
