const landing = document.getElementById("landing");
const filter = document.getElementById("filter");
const cardsEl = document.getElementById("cards");
const contactPanel = document.getElementById("contact-panel");

let data = []; // Will hold Google Sheet data

/* NAVIGATION */
document.getElementById("nav-store").onclick = e => {
  e.preventDefault();
  landing.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
};

document.getElementById("nav-contact").onclick = e => {
  e.preventDefault();
  contactPanel.style.display = "flex";
};

document.getElementById("close-contact").onclick = () => {
  contactPanel.style.display = "none";
};

/* LANDING CARD FILTER */
document.querySelectorAll(".tcg-card").forEach(card => {
  card.onclick = () => {
    filter.value = card.dataset.tcg.trim();
    landing.style.display = "none";
    renderCards();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
});

/* DROPDOWN FILTER CHANGE */
filter.onchange = () => renderCards();

/* LOAD DATA FROM GOOGLE SHEET */
function loadSheet() {
  Tabletop.init({
    key: "1N_YBdaxHlChVPw_ZH0oYcMjCCvvhW5YJnZEKO7PNVaM",
    simpleSheet: true,
    callback: googleSheetData => {
      data = googleSheetData.map(item => ({
        tcg: item.TCG,
        name: item["Card Name"],
        set: item.Set,
        condition: item.Condition,
        language: item.Language,
        foil: item.Foil,
        quantity: item.Quantity,
        price: item.Price,
        img: item.ImageURL
      }));
      console.log("Loaded data:", data); // Check data in console
      renderCards(); // render AFTER data is loaded
    },
    error: err => {
      console.error("Error loading sheet:", err);
    }
  });
}

/* RENDER CARDS */
function renderCards() {
  cardsEl.innerHTML = "";

  const filtered = data.filter(c =>
    filter.value.toLowerCase() === "all" || c.tcg.toLowerCase() === filter.value.toLowerCase()
  );

  if (filtered.length === 0) {
    cardsEl.innerHTML = "<p style='text-align:center; color:var(--muted)'>No cards found.</p>";
    return;
  }

  filtered.forEach(c => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${c.img}" alt="${c.name}">
      <h4>${c.name}</h4>
      <p><strong>Set:</strong> ${c.set}</p>
      <p><strong>Condition:</strong> ${c.condition}</p>
      <p><strong>Language:</strong> ${c.language}</p>
      <p><strong>Foil:</strong> ${c.foil}</p>
      <div class="price">SAR ${c.price}</div>
      <button class="buy-btn">Buy</button>
    `;
    cardsEl.appendChild(card);
  });

  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.onclick = e => {
      const cardName = e.target.parentElement.querySelector("h4").textContent;
      window.open(`https://wa.me/966566173384?text=Hi, I want to buy: ${cardName}`, "_blank");
    };
  });
}

/* INITIAL LOAD */
loadSheet();
