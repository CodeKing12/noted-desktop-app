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
	'& .tiptap': {
		outline: 'none',
		minHeight: '200px',
	},
	'& .tiptap p.is-editor-empty:first-child::before': {
		content: 'attr(data-placeholder)',
		color: 'fg.muted',
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

export function TipTapEditor(props: { note: Note; readonly?: boolean }) {
	let containerRef: HTMLDivElement | undefined
	let editor: Editor | null = null
	const editorStore = useEditorStore()

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
				const json = JSON.stringify(ed.getJSON())
				debouncedSave(json)
			},
		})
		currentEditor = editor
	})

	// When the note changes (different note selected), update editor content
	createEffect(
		on(
			() => props.note.id,
			() => {
				if (editor) {
					const content = parseContent(props.note.content)
					editor.commands.setContent(content)
					editor.setEditable(!props.readonly)
				}
			}
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
