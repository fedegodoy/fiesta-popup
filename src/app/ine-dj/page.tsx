"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

type SongRequest = {
  id: string;
  guest_name: string;
  song_query: string;
  artist_name?: string | null;
  dj_message?: string | null;
  spotify_track_id?: string | null;
  spotify_url?: string | null;
  cover_url?: string | null;
  status: "pending" | "downloaded";
  created_at: string;
};

export default function DJPanel() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "pagadios") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Clave incorrecta.");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("song_requests")
        .select("*")
        .order("status", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching", error);
        return;
      }
      if (data) setRequests(data as SongRequest[]);
    };

    fetchRequests();

    const subscription = supabase
      .channel("song_requests_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "song_requests" },
        () => { fetchRequests(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [isAuthenticated]);

  const toggleDownloaded = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "downloaded" : "pending";
    const { error } = await supabase
      .from("song_requests")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) console.error("Error updating", error);
  };

  const clearAll = async () => {
    if (!confirm("¿Segura que querés borrar TODOS los pedidos?")) return;
    const { error } = await supabase
      .from("song_requests")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) console.error("Error clearing", error);
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h2 style={{ color: "var(--text-highlight)", marginBottom: "1rem" }}>Acceso DJ Inés</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="password">Palabra Clave</label>
          <input
            type="password"
            id="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "1rem", background: "#000", color: "#0f0", border: '2px solid #555' }}
          />
          <button type="submit">ENTRAR</button>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </form>
      </div>
    );
  }

  const pendingCount = requests.filter(r => r.status === "pending").length;

  return (
    <div className="dj-panel">
      <h2 style={{ color: "var(--text-highlight)", marginBottom: "1rem", textAlign: "center" }}>🎤 Panel de Control DJ 💿</h2>

      <div style={{ background: '#222', padding: '10px', fontSize: '0.8rem', border: '1px solid #444', marginBottom: '16px' }}>
        <strong>ESTADO:</strong> CONECTADO (Tiempo Real)<br/>
        <strong>PENDIENTES:</strong> {pendingCount} / <strong>TOTAL:</strong> {requests.length}
      </div>

      {requests.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic", opacity: 0.7 }}>Esperando los temazos...</p>
      ) : (
        <>
          <ul className="song-list">
            {requests.map((req) => (
              <li key={req.id} className={`song-item ${req.status === "downloaded" ? "downloaded" : ""}`}>
                {req.cover_url ? (
                  <img src={req.cover_url} alt="Cover" />
                ) : (
                  <div style={{ width: 50, height: 50, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, marginRight: 10, fontSize: '0.6rem', color: '#888', textAlign: 'center' }}>
                    SIN<br/>PORTADA
                  </div>
                )}

                <div className="song-info">
                  <div className="song-title">
                    {req.song_query}
                    {req.artist_name && <span style={{ fontSize: '0.9rem', color: '#ccc', marginLeft: '6px' }}> - {req.artist_name}</span>}
                  </div>

                  {req.dj_message && (
                    <div style={{ color: 'var(--text-yellow)', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '2px' }}>
                      &ldquo;{req.dj_message}&rdquo;
                    </div>
                  )}

                  <div className="guest-name" style={{ marginTop: '4px' }}>Pedido por: {req.guest_name}</div>
                </div>

                <div className="dj-controls">
                  {req.spotify_url ? (
                    <a href={req.spotify_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <button className="btn-small" style={{ background: '#1db954', border: '2px solid #000', color: 'black', fontWeight: 'bold' }}>▶ SPOTIFY</button>
                    </a>
                  ) : (
                    <button className="btn-small" disabled style={{ background: '#444', border: '2px solid #222', color: '#888', cursor: 'not-allowed' }}>NO SPOTIFY</button>
                  )}
                  <button
                    className="btn-small"
                    onClick={() => toggleDownloaded(req.id, req.status)}
                    style={{ fontSize: '0.8rem', opacity: req.status === "downloaded" ? 0.5 : 1 }}
                  >
                    {req.status === "pending" ? "↓ DESCARGADO" : "↺ RESTAURAR"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button className="btn-danger" onClick={clearAll}>
            🗑 LIMPIAR TODO
          </button>
        </>
      )}
    </div>
  );
}
