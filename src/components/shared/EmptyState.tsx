import { css } from '../../../styled-system/css'
import type { Component } from 'solid-js'

const container = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	py: '12',
	px: '4',
	textAlign: 'center',
})

const iconStyle = css({
	width: '10',
	height: '10',
	color: 'fg.muted',
	mb: '3',
})

const titleStyle = css({
	fontSize: 'sm',
	fontWeight: 'medium',
	color: 'fg.subtle',
	mb: '1',
})

const descStyle = css({
	fontSize: 'xs',
	color: 'fg.muted',
})

export function EmptyState(props: {
	icon: Component<{ class?: string }>
	title: string
	description: string
}) {
	return (
		<div class={container}>
			<props.icon class={iconStyle} />
			<p class={titleStyle}>{props.title}</p>
			<p class={descStyle}>{props.description}</p>
		</div>
	)
}
