"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";

export default function Home() {
  const [song, setSong] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!song.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      // 1. Fetch song details from Spotify API Route
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(song)}`);
      
      if (!res.ok) {
        throw new Error("No pudimos encontrar ese tema en Spotify. Probá con otro.");
      }

      const track = await res.json();

      // 2. Insert into Supabase
      const { error } = await supabase.from("song_requests").insert([
        {
          guest_name: name.trim() || "Anónimo",
          song_query: song.trim(),
          spotify_track_id: track.track_id,
          spotify_url: track.url,
          cover_url: track.cover_url,
          status: "pending"
        }
      ]);

      if (error) {
        throw new Error("Error al enviar el pedido.");
      }

      setStatus("success");
      setSong("");
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
        <h1 className="logo-text">POPUP</h1>
        <div className="slogan">Escaneá, pedí y bailá</div>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="song">¿QUÉ TEMA QUERÉS ESCUCHAR?</label>
        <input 
          type="text" 
          id="song"
          value={song}
          onChange={(e) => setSong(e.target.value)}
          placeholder="Ej: Macarena - Los del Río" 
          autoComplete="off"
          required
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
