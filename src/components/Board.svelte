<script lang="ts">
	import { store } from '../store.svelte'

	import Play, { PlayType } from './Play.svelte'

	type Board = [[PlayType, PlayType, PlayType], [PlayType, PlayType, PlayType], [PlayType, PlayType, PlayType]]

	const enum Turn {
		PLAYER = PlayType.CROSS,
		COMPUTER = PlayType.CIRCLE,
		NONE = PlayType.EMPTY,
	}

	let turn = $state<Turn>(Turn.PLAYER)
	let onintroend = $state(() => {})

	const initialBoard: Board = [
		[PlayType.EMPTY, PlayType.EMPTY, PlayType.EMPTY],
		[PlayType.EMPTY, PlayType.EMPTY, PlayType.EMPTY],
		[PlayType.EMPTY, PlayType.EMPTY, PlayType.EMPTY],
	]

	let plays = $state<Board>(structuredClone(initialBoard))

	$effect(() => {
		if (!store.showModal) {
			plays = structuredClone(initialBoard)
			turn = Turn.PLAYER
		}
	})

	const endGame = () => {
		turn = Turn.NONE
		store.showModal = true
	}

	const check = (currentTurn: Turn, resume: VoidFunction) => {
		store.message = currentTurn === Turn.PLAYER ? 'You win!' : 'You lose!'
		if (
			plays.some((row) => row.every((play) => play.toString() === currentTurn.toString())) ||
			Array.from({ length: plays.length }).some((_, col) =>
				plays.every((row) => row[col]?.toString() === currentTurn.toString())
			) ||
			[plays[1][1], plays[2][2], plays[0][0]].every((play) => play.toString() === currentTurn.toString()) ||
			[plays[1][1], plays[0][2], plays[2][0]].every((play) => play.toString() === currentTurn.toString())
		)
			return endGame()
		else if (plays.every((row) => row.every((play) => play !== PlayType.EMPTY))) {
			store.message = 'Draw!'
			return endGame()
		}
		resume()
	}

	const computer = () => {
		turn = Turn.COMPUTER
		const row = ~~(Math.random() * plays.length)
		const col = ~~(Math.random() * plays.length)
		const tableRow = plays[row]
		if (tableRow?.[col] === PlayType.EMPTY) {
			tableRow[col] = PlayType.CIRCLE
			onintroend = () => {
				check(Turn.COMPUTER, () => {
					turn = Turn.PLAYER
				})
			}
		} else {
			computer()
		}
	}

	const choose = (row: number, col: number) => {
		const tableRow = plays[row]
		if (turn === Turn.PLAYER && tableRow?.[col] === PlayType.EMPTY) {
			turn = Turn.NONE
			tableRow[col] = PlayType.CROSS
			onintroend = () => {
				check(Turn.PLAYER, computer)
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
