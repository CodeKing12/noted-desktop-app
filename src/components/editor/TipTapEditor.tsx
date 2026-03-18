import { onMount, onCleanup, createEffect, on } from 'solid-js'
import { css } from '../../../styled-system/css'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { useEditorStore } from '../../stores/editor-store'
import { debounce } from '../../lib/debounce'
import { tiptapToPlaintext } from '../../lib/tiptap-to-plaintext'

const editorWrap = css({
	minHeight: '200px',
	flex: 1,
	mt: '2',
	'& .tiptap': {
		outline: 'none',
		minHeight: '200px',
	},
	'& .tiptap p.is-editor-empty:first-child::before': {
		content: 'attr(data-placeholder)',
		color: 'gray.a5',
		float: 'left',
		pointerEvents: 'none',
		height: 0,
	},
})

// Store editor instance globally so toolbar can access it
let currentEditor: Editor | null = null
export function getEditorInstance(): Editor | null {
	return currentEditor
}

// Store cursor positions per note ID
const cursorPositions = new Map<string, { from: number; to: number }>()

export function TipTapEditor(props: { note: Note; readonly?: boolean }) {
	let containerRef: HTMLDivElement | undefined
	let editor: Editor | null = null
	const editorStore = useEditorStore()
	let isUpdatingContent = false

	const debouncedSave = debounce(async (jsonContent: string) => {
		const plainText = tiptapToPlaintext(jsonContent)
		await editorStore.saveNote({
			content: jsonContent,
			content_plain: plainText,
		})
	}, 500)

	onMount(() => {
		editor = new Editor({
			element: containerRef!,
			extensions: [
				StarterKit.configure({
					heading: { levels: [1, 2, 3] },
				}),
				TaskList,
				TaskItem.configure({ nested: true }),
				Placeholder.configure({ placeholder: 'Start writing...' }),
				Underline,
				Highlight.configure({ multicolor: false }),
			],
			content: parseContent(props.note.content),
			editable: !props.readonly,
			onUpdate: ({ editor: ed }) => {
				if (isUpdatingContent) return
				editorStore.setLivePreview(ed.getText().slice(0, 160))
				const json = JSON.stringify(ed.getJSON())
				debouncedSave(json)
			},
		})
		currentEditor = editor

		// Prevent task checkboxes from stealing editor focus/cursor
		containerRef!.addEventListener('mousedown', (e) => {
			const target = e.target as HTMLElement
			if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {
				e.preventDefault()
				// Toggle the checkbox via TipTap's command instead
				const pos = editor?.view.posAtDOM(target, 0)
				if (pos != null && editor) {
					const resolved = editor.state.doc.resolve(pos)
					const node = resolved.nodeAfter ?? resolved.parent
					if (node?.type.name === 'taskItem') {
						editor.chain()
							.command(({ tr }) => {
								tr.setNodeMarkup(resolved.before(resolved.depth), undefined, {
									...node.attrs,
									checked: !node.attrs.checked,
								})
								return true
							})
							.run()
					}
				}
			}
		})
	})

	// When the note changes (different note selected), update editor content
	let previousNoteId: string | null = null
	createEffect(
		on(
			() => props.note.id,
			(newId) => {
				if (editor) {
					// Save cursor position for the previous note
					if (previousNoteId) {
						const { from, to } = editor.state.selection
						cursorPositions.set(previousNoteId, { from, to })
					}

					debouncedSave.cancel()
					isUpdatingContent = true
					const content = parseContent(props.note.content)
					editor.commands.setContent(content)
					editor.setEditable(!props.readonly)
					isUpdatingContent = false

					// Restore cursor position for the new note (skip for new notes — title gets focus)
					if (!editorStore.isNewNote()) {
						const saved = cursorPositions.get(newId)
						requestAnimationFrame(() => {
							if (editor) {
								if (saved) {
									const docSize = editor.state.doc.content.size
									const from = Math.min(saved.from, docSize)
									const to = Math.min(saved.to, docSize)
									editor.commands.setTextSelection({ from, to })
								} else {
									editor.commands.setTextSelection(editor.state.doc.content.size)
								}
								editor.commands.focus()
							}
						})
					}
				}
				previousNoteId = newId
			},
			{ defer: true }
		)
	)

	createEffect(
		on(
			() => props.readonly,
			(readonly) => {
				if (editor) {
					editor.setEditable(!readonly)
				}
			}
		)
	)

	onCleanup(() => {
		if (editor) {
			editor.destroy()
			currentEditor = null
		}
	})

	return <div ref={containerRef} class={editorWrap} />
}

function parseContent(content: string | null): Record<string, unknown> | string {
	if (!content) return ''
	try {
		return JSON.parse(content)
	} catch {
		return content
	}
}
