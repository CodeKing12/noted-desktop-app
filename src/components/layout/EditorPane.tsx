import { Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useEditorStore } from '../../stores/editor-store'
import { useAppStore } from '../../stores/app-store'
import { NoteHeader } from '../editor/NoteHeader'
import { TipTapEditor } from '../editor/TipTapEditor'
import { PlainTextEditor } from '../editor/PlainTextEditor'
import { TagsBar } from '../editor/TagsBar'
import { EditorToolbar } from '../editor/EditorToolbar'
import { EmptyState } from '../shared/EmptyState'
import { FileTextIcon } from 'lucide-solid'

const editorContainer = css({
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	overflow: 'hidden',
})

const editorContent = css({
	flex: 1,
	overflow: 'auto',
	px: '8',
	py: '4',
})

const emptyContainer = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100%',
})

export function EditorPane() {
	const editorStore = useEditorStore()
	const appStore = useAppStore()

	const isTrash = () => appStore.currentView() === 'trash'

	return (
		<div class={editorContainer}>
			<Show
				when={editorStore.currentNote()}
				fallback={
					<div class={emptyContainer}>
						<EmptyState
							icon={FileTextIcon}
							title="No note selected"
							description="Select a note from the list or create a new one"
						/>
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
					</>
				)}
			</Show>
		</div>
	)
}
