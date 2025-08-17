"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Produce = {
  name: string;
  price: number;
  pricePer: string;
  location: string;
  available: boolean;
};

const imageMap: Record<string, string> = {
  "Heirloom tomato": "/tomato.png",
  "Organic ginger": "/ginger.png",
};

export default function About() {
  const [sort, setSort] = useState<"default" | "az">("default");
  const [view, setView] = useState<"grid" | "list">("grid");

  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query { produce { name price pricePer location available } }`,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.errors && result.errors.length > 0) {
          setError(result.errors[0].message || "GraphQL error");
          setProduce([]);
        } else if (result.data && result.data.produce) {
          setProduce(result.data.produce);
        } else {
          setError("No produce data returned from API");
          setProduce([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const items = [...produce];
  if (sort === "az") {
    items.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <main style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "3rem", fontFamily: "serif", fontWeight: 400 }}>
          Produce
        </h1>
        <span style={{ fontWeight: 600 }}>Fresh</span>
        <span style={{ color: "#555", fontSize: "1.1rem" }}>
          — August 21, 2023
        </span>
        <div style={{ flex: 1 }} />
        <button
          style={{
            background: sort === "default" ? "#5B752A" : "white",
            color: sort === "default" ? "white" : "#333",
            borderRadius: "999px",
            padding: "0.4rem 1.2rem",
            border: "1px solid #d1d5db",
            marginRight: 8,
            fontWeight: 500,
          }}
          onClick={() => setSort("default")}
        >
          Default
        </button>
        <button
          style={{
            background: sort === "az" ? "#5B752A" : "white",
            color: sort === "az" ? "white" : "#333",
            borderRadius: "999px",
            padding: "0.4rem 1.2rem",
            border: "1px solid #d1d5db",
            marginRight: 8,
            fontWeight: 500,
          }}
          onClick={() => setSort("az")}
        >
          A-Z
        </button>
        <button
          style={{
            background: view === "list" ? "#fff" : "#fff",
            color: "#333",
            borderRadius: "999px",
            padding: "0.4rem 1.2rem",
            border: "1px solid #d1d5db",
            fontWeight: 500,
          }}
          onClick={() => setView(view === "grid" ? "list" : "grid")}
        >
          {view === "grid" ? "List view" : "Grid view"}
        </button>
      </div>
      <hr style={{ marginBottom: "2rem", borderColor: "#e5e7eb" }} />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>Error: {error}</div>
      ) : (
        <div
          style={
            view === "grid"
              ? {
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "2rem",
                }
              : { display: "flex", flexDirection: "column", gap: "2rem" }
          }
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                border: "1.5px solid #e5e7eb",
                borderRadius: 20,
                background: "#f9fafb",
                overflow: "hidden",
                display: "flex",
                flexDirection: view === "grid" ? "column" : "row",
                alignItems: view === "grid" ? "stretch" : "center",
                minHeight: 320,
                maxWidth: view === "grid" ? 400 : "100%",
                width: "100%",
                margin: "0 auto",
                opacity: item.available ? 1 : 0.5,
              }}
            >
              <div
                style={{
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: view === "grid" ? 220 : 160,
                  width: view === "grid" ? "100%" : 180,
                }}
              >
                <Image
                  src={imageMap[item.name] || "/placeholder.png"}
                  alt={item.name}
                  width={180}
                  height={180}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div style={{ padding: 24, flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 4 }}>
                  {item.name}
                </div>
                <div
                  style={{
                    color: "#5B752A",
                    fontWeight: 600,
                    fontSize: 18,
                    marginBottom: 4,
                  }}
                >
                  {item.pricePer}
                </div>
                <div style={{ color: "#888", fontSize: 15 }}>
                  {item.location}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    color: item.available ? "#5B752A" : "red",
                    fontWeight: 600,
                  }}
                >
                  {item.available ? "Available" : "Out of stock"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
