<script lang="ts">
	import { fade } from 'svelte/transition';
	import { message, showModal } from '../routes/+page.svelte';
</script>

<div transition:fade class="overlay">
	<div class="modal">
		<h2>{$message}</h2>
		<button on:click={() => ($showModal = false)}>Play again</button>
	</div>
</div>

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal {
		display: grid;
		place-content: center;
		padding: 1rem;
		border-radius: 0.5rem;
	}
</style>
