<script lang="ts">
	export let data;
	import { global_theme, character_filter } from '$lib/stores'; // theme store import 추가

	$: artists_raw = data.musics.artistCache;
	let selectedArtists: boolean[] = [];

	$: if (artists_raw) {
		selectedArtists = new Array(artists_raw.length).fill(false);
	}

	function toggleSelection(index: number) {
		selectedArtists[index] = !selectedArtists[index];
		selectedArtists = [...selectedArtists];

		// character_filter store 업데이트
		const selectedIds = artists_raw.filter((_, i) => selectedArtists[i]).map((artist) => artist.id);

		character_filter.set(selectedIds);
	}
</script>

<div class="flex flex-wrap justify-center gap-4">
	{#each artists_raw || [] as item, i}
		<button
			on:click={() => toggleSelection(i)}
			class="btn relative h-32 w-32 border-none bg-transparent p-0 transition-all duration-200 hover:-translate-y-1"
		>
			<div class="relative h-full w-full {selectedArtists[i]}">
				<!-- 어두운 오버레이 -->
				{#if !selectedArtists[i]}
					<div
						class="absolute inset-0 z-10 rounded-xl {$global_theme === 'dark'
							? 'bg-black/60'
							: 'bg-black/30'} transition-opacity duration-200"
					/>
				{/if}

				<img
					src={`/images/idol/${item.id}.webp`}
					class="h-full w-full rounded-lg object-cover {selectedArtists[i] &&
					$global_theme === 'dark'
						? 'brightness-125'
						: ''}"
					alt="thumbnail"
				/>
				<!-- 텍스트를 위한 그라데이션 배경 -->
				<div
					class="absolute bottom-0 left-0 right-0 h-12 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent"
				/>
				<span
					class="absolute bottom-2 left-0 right-0 z-20 text-center font-medium text-white drop-shadow-lg"
				>
					{item.name}
				</span>
			</div>
		</button>
	{/each}
</div>
