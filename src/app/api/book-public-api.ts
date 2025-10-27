import { GoogleBook } from "../lib/types";

function parseYear(publishedDate?: string): number | undefined {
    if (!publishedDate) return undefined;
    const matcher = publishedDate.match(/\d{4}/);
    return matcher ? Number(matcher[0]) : undefined;
}

export async function searchBooksByTitleGoogle(
    title: string,
    maxResults = 10,
): Promise<GoogleBook[]> {
    const url = new URL('https://www.googleapis.com/books/v1/volumes');
    url.searchParams.set('q', `intitle:${title}`);
    url.searchParams.set('maxResults', String(maxResults));
    url.searchParams.set('printType', 'books');

    const r = await fetch(url.toString());
    if (!r.ok) throw new Error('Erreur Google Books');
    const json = await r.json();

    const items: GoogleBook[] = Array.isArray(json.items) ? json.items : [];
    return items.map((it) => {
        const bookVolume = it.volumeInfo ?? {};
        return {
            provider: 'google',
            providerId: it.id ?? '',
            title: bookVolume.title ?? 'Sans titre',
            authors: Array.isArray(bookVolume.authors) ? bookVolume.authors : [],
            year: parseYear(bookVolume.publishedDate),
            genres: Array.isArray(bookVolume.categories) ? bookVolume.categories : [],
            thumbnail: bookVolume.imageLinks?.thumbnail ?? bookVolume.imageLinks?.smallThumbnail,
            description: bookVolume.description,
        };
    });
}
