<script lang="ts">
	import { store } from '../store.svelte'

	import Play, { PlayType } from './Play.svelte'

	type Board = [[PlayType, PlayType, PlayType], [PlayType, PlayType, PlayType], [PlayType, PlayType, PlayType]]

	let turn = $state<PlayType>(PlayType.PLAYER)
	let onintroend = $state(() => {})

	const initialBoard: Board = [
		[PlayType.NONE, PlayType.NONE, PlayType.NONE],
		[PlayType.NONE, PlayType.NONE, PlayType.NONE],
		[PlayType.NONE, PlayType.NONE, PlayType.NONE],
	]

	let board = $state(initialBoard)

	$effect(() => {
		if (!store.showModal) {
			board = initialBoard
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
			board.some((row) => row.every((play) => play === currentTurn)) ||
			board.some((_, col) => board.every((row) => row[col] === currentTurn)) ||
			board.every((play, i) => play[i] === currentTurn) ||
			board.every((play, i) => play[board.length - 1 - i] === currentTurn)
		)
			return endGame()
		else if (board.every((row) => row.every((play) => play !== PlayType.NONE))) {
			store.message = 'Draw!'
			return endGame()
		}
		resume()
	}

	const computer = () => {
		turn = PlayType.COMPUTER
		const row = ~~(Math.random() * board.length)
		const col = ~~(Math.random() * board.length)
		const tableRow = board[row]
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
		const tableRow = board[row]
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
	{#each board as row, i (i)}
		{#each row as play, j (j)}
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
