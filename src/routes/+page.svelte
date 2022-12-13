<script lang="ts" context="module">
  import '@picocss/pico'
	import { writable } from 'svelte/store';
	export const showModal = writable(false);
	export const message = writable('');
</script>

<script lang="ts">
	import Board from '../components/Board.svelte';
	import Modal from '../components/Modal.svelte';
</script>

<Board />
{#if $showModal}
	<Modal />
{/if}

