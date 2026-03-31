import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    // 1. Get Access Token
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Spotify API credentials missing' }, { status: 500 });
    }

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
       console.error("Token response error", await tokenResponse.text());
       return NextResponse.json({ error: 'Failed to get Spotify token' }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Search Track using Spotify field filters for better accuracy
    const artist = searchParams.get('artist');
    let searchQuery = query;
    if (artist) {
      searchQuery = `track:${query} artist:${artist}`;
    }

    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=10`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!searchResponse.ok) {
        console.error("Search response error", await searchResponse.text());
        return NextResponse.json({ error: 'Failed to search Spotify track' }, { status: 500 });
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.tracks || !searchData.tracks.items.length) {
      // Instead of throwing a 404 error, we return a successful response indicating no match.
      // The frontend will use this to still save the request without spotify data.
      return NextResponse.json({ found: false });
    }

    // Sort by popularity descending to ensure original/famous tracks are prioritized over obscure covers
    const tracks = searchData.tracks.items.sort((a: any, b: any) => b.popularity - a.popularity);
    const track = tracks[0];
    
    
    return NextResponse.json({
      found: true,
      track_id: track.id,
      url: track.external_urls.spotify,
      cover_url: track.album.images[0]?.url || '',
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(', ')
    });

  } catch (error) {
    console.error('Spotify API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
