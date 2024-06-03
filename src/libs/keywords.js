export async function getPopularKeywords() {
  const response = await fetch("/api/keywords", { method: "GET" });
  if (!response.ok) {
    throw new Error("Failed to fetch popular keywords");
  }
  return response.json();
}

export async function saveSearchKeyword(keyword) {
  const response = await fetch("/api/keywords", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ keyword }),
  });
  if (!response.ok) {
    throw new Error("Failed to save keyword");
  }
  return response.json();
}
