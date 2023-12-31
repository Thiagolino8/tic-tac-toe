<script lang="ts">
	import { store } from '../store.svelte'

	import Play, { PlayType } from './Play.svelte'

	type Board = [[PlayType, PlayType, PlayType], [PlayType, PlayType, PlayType], [PlayType, PlayType, PlayType]]

	let turn = $state(PlayType.PLAYER)
	let onintroend = $state(() => {})

	const initialBoard: Board = [
		[PlayType.NONE, PlayType.NONE, PlayType.NONE],
		[PlayType.NONE, PlayType.NONE, PlayType.NONE],
		[PlayType.NONE, PlayType.NONE, PlayType.NONE],
	]

	let plays = $state(structuredClone(initialBoard))

	$effect(() => {
		if (!store.showModal) {
			plays = structuredClone(initialBoard)
			turn = PlayType.PLAYER
		}
	})

	const endGame = () => {
		turn = PlayType.NONE
		store.showModal = true
	}

	const check = (currentTurn: PlayType, resume: VoidFunction) => {
		store.message = currentTurn === PlayType.PLAYER ? 'You win!' : 'You lose!'
		if (
			plays.some((row) => row.every((play) => play === currentTurn)) ||
			plays.some((_, col) => plays.every((row) => row[col] === currentTurn)) ||
			plays.every((play, i) => play[i] === currentTurn) ||
			plays.every((play, i) => play[plays.length - 1 - i] === currentTurn)
		)
			return endGame()
		else if (plays.every((row) => row.every((play) => play !== PlayType.NONE))) {
			store.message = 'Draw!'
			return endGame()
		}
		resume()
	}

	const computer = () => {
		turn = PlayType.COMPUTER
		const row = ~~(Math.random() * plays.length)
		const col = ~~(Math.random() * plays.length)
		const tableRow = plays[row]
		if (tableRow?.[col] === PlayType.NONE) {
			tableRow[col] = PlayType.COMPUTER
			onintroend = () => {
				check(PlayType.COMPUTER, () => {
					turn = PlayType.PLAYER
				})
			}
		} else {
			computer()
		}
	}

	const choose = (row: number, col: number) => {
		const tableRow = plays[row]
		if (turn === PlayType.PLAYER && tableRow?.[col] === PlayType.NONE) {
			turn = PlayType.NONE
			tableRow[col] = PlayType.PLAYER
			onintroend = () => {
				check(PlayType.PLAYER, computer)
			}
		}
	}
</script>

<section>
	{#each plays as row, i}
		{#each row as play, j}
			<Play {play} {onintroend} onclick={() => choose(i, j)} />
		{/each}
	{/each}
</section>

<style>
	section {
		background-color: #2c3e50;
		display: grid;
		padding: 1rem;
		border-radius: 0.5rem;
		place-content: center;
		grid: repeat(3, 5rem) / repeat(3, 5rem);
		gap: 1em;
	}
</style>
