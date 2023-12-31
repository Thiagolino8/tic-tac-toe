<script lang="ts" context="module">
	export const enum PlayType {
		CROSS = 'cross',
		CIRCLE = 'circle',
		EMPTY = 'empty'
	}
</script>

<script lang="ts">
	import type { EventHandler, MouseEventHandler } from 'svelte/elements';

	import { draw } from 'svelte/transition';

	let {
		play = PlayType.EMPTY,
		onclick,
		onintroend
	} = $props<{
		play: PlayType;
		onclick: MouseEventHandler<HTMLButtonElement>;
		onintroend: EventHandler<CustomEvent<null>, SVGPathElement>;
	}>();
	const color = $derived(play === PlayType.CROSS ? '#6366f1' : '#ef4444');
</script>

<button style:--color={color} {onclick}>
	{#if play === PlayType.CROSS}
		<svg viewBox="0 0 24 24">
			<path
				transition:draw
				{onintroend}
				fill="none"
				stroke="currentColor"
				fill-rule="evenodd"
				d="M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z"
			/>
		</svg>
	{:else if play === PlayType.CIRCLE}
		<svg viewBox="0 0 32 32">
			<path
				transition:draw
				{onintroend}
				fill="none"
				stroke="currentColor"
				d="M 16 4 C 9.382813 4 4 9.382813 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 10.464844 10.464844 6 16 6 Z"
			/>
		</svg>
	{/if}
</button>

<style>
	button {
		margin: 0;
		padding: 0;
		grid-area: span 1;
		background-color: #34495e;
		border: none;
		border-radius: 0.5rem;
	}

	svg {
		color: var(--color);
		height: 100%;
		aspect-ratio: 1;
	}
</style>
