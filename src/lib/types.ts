export interface ArtistData {
	id: number;
	name_ko: string;
	name_ja: string;
	name_en: string;
	name_zh: string;
}
export interface GroupData {
	id: number;
	name_ko: string;
	name_ja: string;
	name_en: string;
	name_zh: string;
}
export interface AlbumData {
	id: number;
	name_ko: string;
	name_ja: string;
	name_en: string;
	name_zh: string;
}

export interface MusicData {
	id: number;
	music_name: string;
	groups: GroupRow[];
	artists: ArtistRow[];
	albums: AlbumRow[];
	announce_date: string;
	lyrics: string;
	stream_url: string;
	mv_url: string;
}

export interface MusicRow {
	id: number;
	music_name: string;
	announce_date: string;
	lyrics: string;
	stream_url: string;
	mv_url: string;
}

export interface ArtistRow {
	id: number;
	name: string;
	color: string | null;
}

export interface GroupRow {
	id: number;
	name: string;
	color: string | null;
}

export interface AlbumRow {
	id: number;
	name: string;
	color: string | null;
	release_date: string | null;
}
