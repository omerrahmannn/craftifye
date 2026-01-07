const landing = document.getElementById("landing");
const filter = document.getElementById("filter");
const cardsEl = document.getElementById("cards");
const contactPanel = document.getElementById("contact-panel");

/* NAV */
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

/* LANDING FILTER */
document.querySelectorAll(".tcg-card").forEach(card => {
  card.onclick = () => {
    filter.value = card.dataset.tcg;
    landing.style.display = "none";
    renderCards();
  };
});


/* SAMPLE DATA (REPLACE WITH SHEET) */
const data = [
  { name: "Black Lotus", tcg: "MTG", price: 999 },
  { name: "Pikachu", tcg: "Pokemon", price: 50 }
];

function renderCards() {
  cardsEl.innerHTML = "";
  data
    .filter(c => filter.value === "all" || c.tcg === filter.value)
    .forEach(c => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="https://via.placeholder.com/300x420">
        <h4>${c.name}</h4>
        <div class="price">SAR ${c.price}</div>
      `;
      cardsEl.appendChild(card);
    });
}

renderCards();
