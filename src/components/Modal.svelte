<script lang="ts">
	import { fade } from 'svelte/transition'
	import { store } from '../store.svelte'

	let modal = $state<HTMLDialogElement>()

	$effect(() => {
		if (store.showModal) modal?.showModal()
	})
</script>

{#if store.showModal}
	<dialog transition:fade bind:this={modal}>
		<h2>{store.message}</h2>
		<button onclick={() => (store.showModal = false)}>Play again</button>
	</dialog>
{/if}

<style>
	dialog {
		flex-direction: column;
		min-width: 0;
		width: fit-content;
		min-height: 0;
		height: fit-content;
		backdrop-filter: none;
		background: transparent;
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(0.25rem);
	}
</style>
