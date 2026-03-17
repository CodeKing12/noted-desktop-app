import type { JSX } from 'solid-js'
import { css } from '../../../styled-system/css'

const sectionStyle = css({
	mb: '4',
})

const titleStyle = css({
	fontSize: 'xs',
	fontWeight: 'semibold',
	textTransform: 'uppercase',
	letterSpacing: '0.05em',
	color: 'fg.subtle',
	mb: '1.5',
	px: '3',
	'&[data-variant="danger"]': { color: 'red.text' },
	'&[data-variant="muted"]': { color: 'fg.muted' },
})

export function TodoList(props: {
	title: string
	variant?: 'danger' | 'muted'
	children: JSX.Element
}) {
	return (
		<div class={sectionStyle}>
			<div class={titleStyle} data-variant={props.variant}>
				{props.title}
			</div>
			{props.children}
		</div>
	)
}
