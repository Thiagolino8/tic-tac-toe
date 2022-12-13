<script lang="ts">
	import { onMount } from 'svelte';
	import { message, showModal } from '../routes/+page.svelte';

	import Play, { PlayType } from './Play.svelte';

	type Board = [
		[PlayType, PlayType, PlayType],
		[PlayType, PlayType, PlayType],
		[PlayType, PlayType, PlayType]
	];

	enum Turn {
		PLAYER = PlayType.CROSS,
		COMPUTER = PlayType.CIRCLE,
		NONE = PlayType.EMPTY
	}

	onMount(() => {
		const unsubscribe = showModal.subscribe((value) => {
			if (value) {
				turn = Turn.NONE;
			} else {
				turn = Turn.PLAYER;
			}
		});
		return () => unsubscribe();
	});

	let turn: Turn = Turn.PLAYER;

	const initialBoard: Board = [
		[PlayType.EMPTY, PlayType.EMPTY, PlayType.EMPTY],
		[PlayType.EMPTY, PlayType.EMPTY, PlayType.EMPTY],
		[PlayType.EMPTY, PlayType.EMPTY, PlayType.EMPTY]
	];

	let plays: Board = JSON.parse(JSON.stringify(initialBoard));

	const endGame = () => {
		turn = Turn.NONE;
		setTimeout(() => {
			$showModal = true;
			plays = JSON.parse(JSON.stringify(initialBoard));
		}, 1000);
	};

	const check = (currentTurn: Turn) => {
		$message = currentTurn === Turn.PLAYER ? 'You win!' : 'You lose!';
		if (
			plays.some((row) => row.every((play) => play.toString() === currentTurn.toString())) ||
			Array.from({ length: plays.length }).some((_, col) =>
				plays.every((row) => row[col].toString() === currentTurn.toString())
			) ||
			[plays[1][1], plays[2][2], plays[0][0]].every(
				(play) => play.toString() === currentTurn.toString()
			) ||
			[plays[1][1], plays[0][2], plays[2][0]].every(
				(play) => play.toString() === currentTurn.toString()
			)
		) {
			endGame();
		} else if (plays.every((row) => row.every((play) => play !== PlayType.EMPTY))) {
			$message = 'Draw!';
			endGame();
		}
	};

	const computer = () => {
		if (turn === Turn.COMPUTER) {
			const row = Math.floor(Math.random() * plays.length);
			const col = Math.floor(Math.random() * plays.length);
			if (plays[row][col] === PlayType.EMPTY) {
				plays[row][col] = PlayType.CIRCLE;
				setTimeout(() => {
					check(Turn.COMPUTER);
				}, 500);
			} else {
				computer();
			}
		}
	};

	const choose = (row: number, col: number) => {
		if (turn === Turn.PLAYER && plays[row][col] === PlayType.EMPTY) {
			turn = Turn.COMPUTER;
			plays[row][col] = PlayType.CROSS;
			setTimeout(() => {
				check(Turn.PLAYER);
				computer();
				turn = Turn.PLAYER;
			}, 500);
		}
	};
</script>

<div class="container">
	<h1>Tic Tac Toe</h1>
	<div class="board">
		{#each plays as row, i}
			{#each row as play, j}
				<Play {play} on:click={() => choose(i, j)} />
			{/each}
		{/each}
	</div>
</div>

<style>
	.container {
		height: 100vh;
		display: grid;
		place-content: center;
		place-items: center;
	}

	.board {
		background-color: #2c3e50;
		display: grid;
		width: fit-content;
		padding: 1rem;
		border-radius: 0.5rem;
		place-content: center;
		grid: repeat(3, 5rem) / repeat(3, 5rem);
		grid-gap: 1em;
		place-self: center;
	}
</style>
