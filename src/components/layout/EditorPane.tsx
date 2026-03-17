import { Show, createSignal } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useEditorStore } from '../../stores/editor-store'
import { useAppStore } from '../../stores/app-store'
import { NoteHeader } from '../editor/NoteHeader'
import { TipTapEditor } from '../editor/TipTapEditor'
import { PlainTextEditor } from '../editor/PlainTextEditor'
import { TagsBar } from '../editor/TagsBar'
import { EditorToolbar, type ToolbarPosition } from '../editor/EditorToolbar'
import {
	MaximizeIcon,
	MinimizeIcon,
	PenLineIcon,
	PanelTopIcon,
	PanelRightIcon,
	PanelBottomIcon,
	PanelLeftIcon,
} from 'lucide-solid'

const editorContainer = css({
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	overflow: 'hidden',
	bg: 'bg.default',
})

const editorBody = css({
	display: 'flex',
	flex: 1,
	overflow: 'hidden',
})

const editorContent = css({
	flex: 1,
	overflow: 'auto',
})

const contentInner = css({
	width: '100%',
	px: '10',
	py: '6',
})

const emptyContainer = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100%',
	gap: '3',
	animation: 'fade-in 0.4s ease-out',
})

const emptyIconWrap = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '16',
	height: '16',
	borderRadius: 'xl',
	bg: 'gray.a2',
	mb: '2',
})

const emptyIcon = css({
	width: '7',
	height: '7',
	color: 'gray.a6',
	strokeWidth: '1.5',
})

const emptyTitle = css({
	fontSize: '16px',
	fontWeight: '600',
	color: 'fg.default',
	letterSpacing: '-0.02em',
})

const emptyDesc = css({
	fontSize: '14px',
	color: 'fg.muted',
	textAlign: 'center',
	maxWidth: '260px',
	lineHeight: '1.6',
})

const emptyKbd = css({
	display: 'inline-flex',
	alignItems: 'center',
	gap: '1',
	fontSize: '12px',
	color: 'fg.subtle',
	bg: 'gray.a2',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'gray.a4',
	borderRadius: 'md',
	px: '2.5',
	py: '1',
	fontFamily: 'mono',
	mt: '3',
	letterSpacing: '0.02em',
})

const controlsRow = css({
	position: 'absolute',
	top: '3',
	right: '3',
	display: 'flex',
	alignItems: 'center',
	gap: '0.5',
	zIndex: 5,
})

const controlBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '8',
	height: '8',
	borderRadius: 'lg',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.2s',
	opacity: 0.6,
	_hover: { bg: 'gray.a3', color: 'fg.default', opacity: 1 },
})

const controlIconSize = css({ width: '4', height: '4' })

const POSITIONS: ToolbarPosition[] = ['top', 'right', 'bottom', 'left']

function ToolbarPositionIcon(props: { position: ToolbarPosition }) {
	return (
		<>
			<Show when={props.position === 'top'}>
				<PanelTopIcon class={controlIconSize} />
			</Show>
			<Show when={props.position === 'right'}>
				<PanelRightIcon class={controlIconSize} />
			</Show>
			<Show when={props.position === 'bottom'}>
				<PanelBottomIcon class={controlIconSize} />
			</Show>
			<Show when={props.position === 'left'}>
				<PanelLeftIcon class={controlIconSize} />
			</Show>
		</>
	)
}

export function EditorPane() {
	const editorStore = useEditorStore()
	const appStore = useAppStore()

	const [isScrolled, setIsScrolled] = createSignal(false)
	const [toolbarPosition, setToolbarPosition] =
		createSignal<ToolbarPosition>('top')

	function cycleToolbarPosition() {
		const current = toolbarPosition()
		const idx = POSITIONS.indexOf(current)
		setToolbarPosition(POSITIONS[(idx + 1) % POSITIONS.length])
	}

	function handleScroll(e: Event) {
		const target = e.target as HTMLElement
		setIsScrolled(target.scrollTop > 0)
	}

	const isTrash = () => appStore.currentView() === 'trash'
	const isHorizontal = () =>
		toolbarPosition() === 'top' || toolbarPosition() === 'bottom'
	const showToolbar = (note: Note) =>
		note.note_type === 'rich' && !isTrash()

	const nextPositionLabel = () => {
		const current = toolbarPosition()
		const idx = POSITIONS.indexOf(current)
		return POSITIONS[(idx + 1) % POSITIONS.length]
	}

	return (
		<div class={editorContainer} style={{ position: 'relative' }}>
			<Show
				when={editorStore.currentNote()}
				fallback={
					<div class={emptyContainer}>
						<div class={emptyIconWrap}>
							<PenLineIcon class={emptyIcon} />
						</div>
						<p class={emptyTitle}>No note selected</p>
						<p class={emptyDesc}>
							Pick a note from the sidebar, or create a new one to
							start writing.
						</p>
						<span class={emptyKbd}>Ctrl+K to search</span>
					</div>
				}
			>
				{(note) => (
					<>
						{/* Top toolbar */}
						<Show
							when={
								showToolbar(note()) &&
								toolbarPosition() === 'top'
							}
						>
							<EditorToolbar
								scrolled={isScrolled()}
								position="top"
							/>
						</Show>

						{/* Body: left toolbar | content | right toolbar */}
						<div class={editorBody}>
							<Show
								when={
									showToolbar(note()) &&
									toolbarPosition() === 'left'
								}
							>
								<EditorToolbar position="left" />
							</Show>

							<div
								class={editorContent}
								onScroll={handleScroll}
							>
								<div class={contentInner}>
									<NoteHeader
										note={note()}
										readonly={isTrash()}
									/>
									<TagsBar
										noteId={note().id}
										readonly={isTrash()}
									/>
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

							<Show
								when={
									showToolbar(note()) &&
									toolbarPosition() === 'right'
								}
							>
								<EditorToolbar position="right" />
							</Show>
						</div>

						{/* Bottom toolbar */}
						<Show
							when={
								showToolbar(note()) &&
								toolbarPosition() === 'bottom'
							}
						>
							<EditorToolbar position="bottom" />
						</Show>

						{/* Controls: toolbar position + focus mode */}
						<div class={controlsRow}>
							<Show when={showToolbar(note())}>
								<button
									class={controlBtn}
									onClick={cycleToolbarPosition}
									title={`Move toolbar to ${nextPositionLabel()}`}
								>
									<ToolbarPositionIcon
										position={toolbarPosition()}
									/>
								</button>
							</Show>
							<button
								class={controlBtn}
								onClick={() =>
									appStore.setFocusMode(
										!appStore.focusMode()
									)
								}
								title={
									appStore.focusMode()
										? 'Exit focus mode (Ctrl+Shift+F)'
										: 'Focus mode (Ctrl+Shift+F)'
								}
							>
								<Show
									when={appStore.focusMode()}
									fallback={
										<MaximizeIcon
											class={controlIconSize}
										/>
									}
								>
									<MinimizeIcon class={controlIconSize} />
								</Show>
							</button>
						</div>
					</>
				)}
			</Show>
		</div>
	)
}
