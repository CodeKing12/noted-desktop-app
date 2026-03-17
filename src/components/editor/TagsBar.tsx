import { createSignal, createResource, For, Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useAppStore } from '../../stores/app-store'
import { PlusIcon, XIcon } from 'lucide-solid'

const barStyle = css({
	display: 'flex',
	alignItems: 'center',
	gap: '1.5',
	px: '8',
	py: '1.5',
	flexWrap: 'wrap',
	flexShrink: 0,
})

const tagChip = css({
	display: 'flex',
	alignItems: 'center',
	gap: '1',
	px: '2',
	py: '0.5',
	borderRadius: 'full',
	fontSize: 'xs',
	bg: 'bg.muted',
	color: 'fg.default',
})

const removeBtn = css({
	display: 'flex',
	alignItems: 'center',
	cursor: 'pointer',
	color: 'fg.subtle',
	_hover: { color: 'fg.default' },
})

const addTagBtn = css({
	display: 'flex',
	alignItems: 'center',
	gap: '0.5',
	px: '2',
	py: '0.5',
	borderRadius: 'full',
	fontSize: 'xs',
	cursor: 'pointer',
	color: 'fg.subtle',
	border: '1px dashed',
	borderColor: 'border.default',
	transition: 'all 0.15s',
	_hover: { bg: 'bg.muted', color: 'fg.default' },
})

const tagInput = css({
	fontSize: 'xs',
	border: '1px solid',
	borderColor: 'border.default',
	borderRadius: 'full',
	px: '2',
	py: '0.5',
	bg: 'bg.default',
	color: 'fg.default',
	outline: 'none',
	width: '100px',
	_focus: { borderColor: 'colorPalette.solid.bg' },
})

export function TagsBar(props: { noteId: string; readonly?: boolean }) {
	const appStore = useAppStore()
	const [showInput, setShowInput] = createSignal(false)
	const [inputValue, setInputValue] = createSignal('')

	const [tags, { refetch: refetchTags }] = createResource(
		() => props.noteId,
		async (noteId: string) => {
			return window.electronAPI.fetchTagsForNote(noteId)
		}
	)

	async function handleAddTag() {
		const name = inputValue().trim()
		if (!name) {
			setShowInput(false)
			return
		}

		// Find or create the tag
		const allTags = await window.electronAPI.fetchAllTags()
		let tag = allTags.find(
			(t: Tag) => t.name.toLowerCase() === name.toLowerCase()
		)
		if (!tag) {
			tag = await window.electronAPI.createTag(name)
			appStore.refetchTags()
		}

		await window.electronAPI.addTagToNote(props.noteId, tag.id)
		refetchTags()
		setInputValue('')
		setShowInput(false)
	}

	async function handleRemoveTag(tagId: string) {
		await window.electronAPI.removeTagFromNote(props.noteId, tagId)
		refetchTags()
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') handleAddTag()
		if (e.key === 'Escape') {
			setShowInput(false)
			setInputValue('')
		}
	}

	return (
		<div class={barStyle}>
			<For each={tags()}>
				{(tag) => (
					<span class={tagChip}>
						{tag.name}
						<Show when={!props.readonly}>
							<span
								class={removeBtn}
								onClick={() => handleRemoveTag(tag.id)}
							>
								<XIcon
									class={css({ width: '3', height: '3' })}
								/>
							</span>
						</Show>
					</span>
				)}
			</For>
			<Show when={!props.readonly}>
				<Show
					when={showInput()}
					fallback={
						<button
							class={addTagBtn}
							onClick={() => setShowInput(true)}
						>
							<PlusIcon
								class={css({ width: '3', height: '3' })}
							/>
							Tag
						</button>
					}
				>
					<input
						class={tagInput}
						value={inputValue()}
						onInput={(e) => setInputValue(e.currentTarget.value)}
						onKeyDown={handleKeyDown}
						onBlur={handleAddTag}
						placeholder="Tag name"
						autofocus
					/>
				</Show>
			</Show>
		</div>
	)
}
