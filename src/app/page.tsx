"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";

export default function Home() {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!song.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      // 1. Combine query for Spotify
      const query = artist.trim() ? `${song.trim()} ${artist.trim()}` : song.trim();

      let trackId = null;
      let trackUrl = null;
      let trackCover = null;

      try {
        const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const track = await res.json();
          if (track.found) {
            trackId = track.track_id;
            trackUrl = track.url;
            trackCover = track.cover_url;
          }
        }
      } catch {
        // Spotify failed — continue without Spotify data
        console.warn("Spotify search failed, saving request without Spotify data.");
      }

      // 2. Insert into Supabase with all fields
      const { error } = await supabase.from("song_requests").insert([
        {
          guest_name: name.trim() || "Anónimo",
          song_query: song.trim(),
          artist_name: artist.trim() || null,
          dj_message: message.trim() || null,
          spotify_track_id: trackId,
          spotify_url: trackUrl,
          cover_url: trackCover,
          status: "pending"
        }
      ]);

      if (error) {
        throw new Error("Error al enviar el pedido.");
      }

      setStatus("success");
      setSong("");
      setArtist("");
      setMessage("");
      setName("");

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);

    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Ocurrió un error inesperado.");
    }
  };

  return (
    <div>
      <div className="logo-container">
        <img src="/logo_popup.png" alt="Fiesta PopUp" />
        <div className="slogan">PEDÍ Y BAILÁ</div>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="song">¿QUÉ TEMA QUERÉS ESCUCHAR?</label>
        <input 
          type="text" 
          id="song"
          value={song}
          onChange={(e) => setSong(e.target.value)}
          placeholder="Ej: Macarena" 
          autoComplete="off"
          required
        />

        <label htmlFor="artist">ARTISTA (Opcional pero recomendado)</label>
        <input 
          type="text" 
          id="artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Ej: Los del Río" 
          autoComplete="off"
        />

        <label htmlFor="message">MENSAJE PARA LA DJ (Opcional)</label>
        <input 
          type="text" 
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ej: Es la que suena en tiktok!" 
          autoComplete="off"
        />

        <label htmlFor="name">TU NOMBRE (Opcional)</label>
        <input 
          type="text" 
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Fede" 
          autoComplete="off"
        />

        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "ESCANEA..." : "ENVIAR PEDIDO"}
        </button>
      </form>

      {status === "loading" && (
        <div className="loading-text">Buscando en la rocola...</div>
      )}

      {status === "success" && (
        <div className="success-message">
          ¡Tu tema ya está a la suerte de la DJ!
        </div>
      )}

      {status === "error" && (
        <div className="success-message" style={{ borderColor: 'red', color: 'red', background: 'rgba(255,0,0,0.1)' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}
