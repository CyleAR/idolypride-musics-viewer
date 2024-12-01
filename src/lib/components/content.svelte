<script lang="ts">
	import {
		global_theme,
		currentLanguage,
		character_filter,
		view_mode,
		selectedBlock
	} from '$lib/stores';
	import { language_table } from '$lib/lang.ts';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	import Table from './table.svelte';
	import Block from './block.svelte';

	export let data: PageData;
	export let itemsPerPage = 16; // 페이지당 표시할 항목 수
	export let onHeightChange: (height: number) => void;

	onMount(() => {
		const initialState = { page: current_page };
		history.replaceState(initialState, '', window.location.href);

		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	});

	let current_page = 1;

	$: blocks_info = data.musics.results;
	$: content_lang = language_table[$currentLanguage]['content'];
	$: isDrawerOpen = $selectedBlock !== null;

	// 필터링된 블록을 계산하는 반응형 선언 추가
	$: filteredBlocks = blocks_info.filter((block) => {
		// character_filter가 비어있으면 모든 블록 표시
		if ($character_filter.length === 0 || $character_filter == undefined) return true;

		current_page = 1;

		// 모든 선택된 artist가 block의 artists에 포함되어 있는지 확인 (AND 조건)
		return $character_filter.every((selectedArtistId) =>
			block.artists.some((artist) => artist.id === selectedArtistId)
		);
	});

	// 전체 페이지 수 계산
	$: totalPages = Math.ceil(filteredBlocks.length / itemsPerPage);

	// 필터링 된 blocks 에서 16개씩 가져오기
	$: paginatedBlocks = filteredBlocks.slice(
		(current_page - 1) * itemsPerPage,
		current_page * itemsPerPage
	);

	function handlePopState(event: PopStateEvent) {
		if (event.state?.page) {
			current_page = event.state.page;
			document.getElementById('content-main')?.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	}

	function goToPage(page: number) {
		console.log(data);
		if (page !== current_page) {
			current_page = page;
			// 새로운 페이지 상태를 history에 추가
			const newState = { page: page };
			const newUrl = new URL(window.location.href);
			newUrl.searchParams.set('page', page.toString());
			history.pushState(newState, '', newUrl);

			// 스크롤 위치 조정
			document.getElementById('content-main')?.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	}

	function calculateBlockHeight(block: { artists: string[]; groups: string[] }): string {
		const artistCount = block.artists.length;
		const groupCount = block.groups.length;

		if (artistCount >= 9 || groupCount >= 5) {
			return 'h-[7rem]'; // 큰 높이
		}
		return 'h-[6rem]'; // 중간 높이
	}

	$: contentHeight = paginatedBlocks.reduce((height, block) => {
		const blockHeight = parseFloat(calculateBlockHeight(block).match(/\d+/)[0]);
		return height + blockHeight + 0.7; // 0.5rem 여백
	}, 0);

	// 계산된 Height 를 상위 컴포넌트로 전파 ( +page.svelte )
	$: onHeightChange(contentHeight);

	function getColorTag(block: typeof data) {
		return block.groups[0].id === 8 ? block.artists[0]?.color : block.groups[0]?.color;
	}
</script>

<div class="duration-50 flex transition-all" style="margin-left: {isDrawerOpen ? '-30px' : '0'}">
	<div
		id="content-main"
		style="height: {contentHeight + 5}rem"
		class="w-full rounded-lg bg-base-100 shadow-lg"
	>
		{#if $view_mode == 'viewByAlbums'}
			<Table {data} />
		{:else if $view_mode == 'viewByGroup'}
			<Table {data} />
		{:else}
			<div class="flex w-full flex-col lg:flex-row">
				<div class="common-card w-[9%]"></div>
				<div class="common-card w-[13%]">{content_lang['songName']}</div>
				<div class="common-card w-[20%]">{content_lang['group']}</div>
				<div class="common-card w-[33%]">{content_lang['artist']}</div>
				<div class="common-card w-[18.5%]">{content_lang['album']}</div>
				<div class="common-card">{content_lang['releaseDate']}</div>
			</div>
			<div id="blocks" class="gap flex h-full w-full flex-col">
				{#each paginatedBlocks as block}
					<div class="flex w-[100%] p-1.5">
						<Block
							id={block.id}
							title={block.music_name}
							artists={block.artists}
							groups={block.groups}
							colorTag={getColorTag(block)}
							included_albums={block.albums}
							announce_date={block.announce_date || '#'}
						/>
					</div>
				{/each}
			</div>

			<div class="flex justify-center gap-2 p-4">
				{#if current_page > 1}
					<button class="btn btn-circle btn-sm" on:click={() => goToPage(current_page - 1)}>
						«
					</button>
				{/if}

				{#each Array(totalPages) as _, i}
					<button
						class="btn btn-circle btn-sm {current_page === i + 1 ? 'btn-primary' : ''}"
						on:click={() => goToPage(i + 1)}
					>
						{i + 1}
					</button>
				{/each}

				{#if current_page < totalPages}
					<button class="btn btn-circle btn-sm" on:click={() => goToPage(current_page + 1)}>
						»
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.common-card {
		@apply card grid h-14 items-center justify-start rounded-box bg-base-100 pt-4;
	}
	.icon-white {
		-webkit-filter: brightness(0) invert(1);
		filter: brightness(0) invert(1);
	}

	.icon-black {
		-webkit-filter: brightness(0);
		filter: brightness(0);
	}
</style>
