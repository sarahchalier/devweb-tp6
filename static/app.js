const form = document.getElementById("submit-link");
const result = document.getElementById("result");
const originURL = "http://localhost:8080/api-v2/";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = document.getElementById("url").value;

  try {
    const res = await fetch(originURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    const data = await res.json();

    if (res.ok) {
      result.innerHTML = `
        <p>Short URL: <a href="/api-v2/${data.short}">${data.short}</a></p>
        <button id="copy-btn">Copy URL</button>
      `;
      document.getElementById("copy-btn").addEventListener("click", () => {
        navigator.clipboard.writeText(`${window.location.origin}/api-v2/${data.short}`);
      });
    } else {
      result.textContent = data.error || "Error";
    }
  } catch (err) {
    result.textContent = err.message;
  }
});
