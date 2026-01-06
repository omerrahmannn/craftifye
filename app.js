const SHEET_ID = "1N_YBdaxHlChVPw_ZH0oYcMjCCvvhW5YJnZEKO7PNVaM";
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/Sheet1`;
const WHATSAPP = "966566173384";

let inventory = [];

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    inventory = data.filter(c => Number(c.Quantity) > 0);
    render(inventory);
  });

function render(cards) {
  const grid = document.getElementById("cards");
  grid.innerHTML = "";

  cards.forEach(async card => {
    if (Number(card.Quantity) < 1) return; // Hide out-of-stock cards

    let image = card.ImageURL?.trim();
    if (card.TCG === "MTG" && !image) {
      try {
        const r = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(card["Card Name"].trim())}`);
        const j = await r.json();
        image = j.image_uris?.normal || j.card_faces?.[0]?.image_uris?.normal || "";
      } catch { image = ""; }
    }

    if (!image) image = "https://via.placeholder.com/300x420?text=No+Image";

    const msg = `Hello, I want to buy:\n${card["Card Name"]}\nTCG: ${card.TCG}\nCondition: ${card.Condition}\nPrice: ${card.Price} SAR`;

    grid.insertAdjacentHTML("beforeend", `
      <div class="card">
        <img loading="lazy" src="${image}" onerror="this.src='https://via.placeholder.com/300x420?text=No+Image'">
        <h4>${card["Card Name"]}</h4>
        <p>${card.TCG} • ${card.Condition}</p>
        <div class="price">${card.Price} SAR</div>
        <button class="add-to-cart">Add to Cart</button>
        <a class="buy" target="_blank" href="https://wa.me/966566173384?text=${encodeURIComponent(msg)}">Buy Now</a>
      </div>
    `);

    const lastButton = grid.lastElementChild.querySelector(".add-to-cart");
    lastButton.onclick = () => addToCart(card);
  });
}


document.getElementById("search").oninput = e => {
  const v = e.target.value.toLowerCase();
  render(inventory.filter(c => c["Card Name"].toLowerCase().includes(v)));
};

document.getElementById("tcgFilter").onchange = e => {
  render(e.target.value === "all"
    ? inventory
    : inventory.filter(c => c.TCG === e.target.value));
};





