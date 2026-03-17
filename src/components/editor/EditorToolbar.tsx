import { css } from '../../../styled-system/css'
import { getEditorInstance } from './TipTapEditor'
import {
	BoldIcon,
	ItalicIcon,
	UnderlineIcon,
	StrikethroughIcon,
	HighlighterIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	ListIcon,
	ListOrderedIcon,
	ListChecksIcon,
	CodeIcon,
	QuoteIcon,
	MinusIcon,
} from 'lucide-solid'

const toolbarStyle = css({
	display: 'flex',
	alignItems: 'center',
	gap: '0.5',
	px: '4',
	py: '1.5',
	borderBottom: '1px solid',
	borderBottomColor: 'gray.a3',
	flexWrap: 'wrap',
	flexShrink: 0,
})

const toolBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '7',
	height: '7',
	borderRadius: 'md',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.12s',
	_hover: { bg: 'gray.a3', color: 'fg.default' },
	'&[data-active="true"]': {
		bg: 'indigo.a3',
		color: 'indigo.11',
	},
})

const divider = css({
	width: '1px',
	height: '5',
	bg: 'gray.a3',
	mx: '1',
})

const iconSize = css({ width: '3.5', height: '3.5' })

export function EditorToolbar() {
	function cmd(action: () => void) {
		return (e: MouseEvent) => {
			e.preventDefault()
			action()
		}
	}

	const e = () => getEditorInstance()

	return (
		<div class={toolbarStyle}>
			<button
				class={toolBtn}
				onMouseDown={cmd(() => e()?.chain().focus().toggleBold().run())}
				title="Bold (Ctrl+B)"
			>
				<BoldIcon class={iconSize} />
			</button>
			<button
				class={toolBtn}
				onMouseDown={cmd(() => e()?.chain().focus().toggleItalic().run())}
				title="Italic (Ctrl+I)"
			>
				<ItalicIcon class={iconSize} />
			</button>
			<button
				class={toolBtn}
				onMouseDown={cmd(() => e()?.chain().focus().toggleUnderline().run())}
				title="Underline (Ctrl+U)"
			>
				<UnderlineIcon class={iconSize} />
			</button>
			<button
				class={toolBtn}
				onMouseDown={cmd(() => e()?.chain().focus().toggleStrike().run())}
				title="Strikethrough"
			>
				<StrikethroughIcon class={iconSize} />
			</button>
			<button
				class={toolBtn}
				onMouseDown={cmd(() => e()?.chain().focus().toggleHighlight().run())}
				title="Highlight"
			>
				<HighlighterIcon class={iconSize} />
			</button>

			<div class={divider} />

			<button
				class={toolBtn}
				onMouseDown={cmd(() =>
					e()?.chain().focus().toggleHeading({ level: 1 }).run()
				)}
				title="Heading 1"
			>
				<Heading1Icon class={iconSize} />
			</button>
			<button
				class={toolBtn}
				onMouseDown={cmd(() =>
					e()?.chain().focus().toggleHeading({ level: 2 }).run()
				)}
				title="Heading 2"
			>
				<Heading2Icon class={iconSize} />
			</button>
			<button
				class={toolBtn}
				onMouseDown={cmd(() =>
					e()?.chain().focus().toggleHeading({ level: 3 }).run()
				)}
				title="Heading 3"
			>
				<Heading3Icon class={iconSize} />
			</button>

			<div class={divider} />

			<button
				class={toolBtn}
				onMouseDown={cmd(() =>
					e()?.chain().focus().toggleBulletList().run()
				)}
				title="Bullet List"
			>
				<ListIcon class={iconSize} />
			</button>
			<button
				class={toolBtn}
				onMouseDown={cmd(() =>
					e()?.chain().focus().toggleOrderedList().run()
				)}
				title="Ordered List"
			>
				<ListOrderedIcon class={iconSize} />
			</button>
			<button
				class={toolBtn}
				onMouseDown={cmd(() =>
					e()?.chain().focus().toggleTaskList().run()
				)}
				title="Task List"
			>
				<ListChecksIcon class={iconSize} />
			</button>

			<div class={divider} />

			<button
				class={toolBtn}
				onMouseDown={cmd(() =>
					e()?.chain().focus().toggleCodeBlock().run()
				)}
				title="Code Block"
			>
				<CodeIcon class={iconSize} />
			</button>
			<button
				class={toolBtn}
				onMouseDown={cmd(() =>
					e()?.chain().focus().toggleBlockquote().run()
				)}
				title="Blockquote"
			>
				<QuoteIcon class={iconSize} />
			</button>
			<button
				class={toolBtn}
				onMouseDown={cmd(() =>
					e()?.chain().focus().setHorizontalRule().run()
				)}
				title="Horizontal Rule"
			>
				<MinusIcon class={iconSize} />
			</button>
		</div>
	)
}
