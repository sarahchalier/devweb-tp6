const originURL = ""; 

const form = document.getElementById("shorten-form");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = document.getElementById("url").value;

  try {
    const res = await fetch(`${originURL}/api-v2/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ url })
    });

    if (!res.ok) throw new Error(`Erreur ${res.status}`);

    const data = await res.json();

    resultDiv.innerHTML = `
      <p>Short URL: <a href="${originURL}/api-v2/${data.short}" target="_blank">${data.short}</a></p>
      <button id="copy-btn">Copy URL</button>
    `;

    document.getElementById("copy-btn").addEventListener("click", () => {
      navigator.clipboard.writeText(`${window.location.origin}/api-v2/${data.short}`)
        .then(() => alert("URL copiée dans le presse-papier !"))
        .catch(err => alert("Erreur copie : " + err));
    });

  } catch (err) {
    resultDiv.textContent = "Erreur : " + err.message;
  }
});
