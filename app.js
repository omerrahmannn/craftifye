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
    let image = card.ImageURL;

    if (card.TCG === "MTG" && !image) {
      try {
        const r = await fetch(`https://api.scryfall.com/cards/named?exact=${card["Card Name"]}`);
        const j = await r.json();
        image = j.image_uris?.small;
      } catch {
        image = "";
      }
    }

    const msg = `Hello, I want to buy:
${card["Card Name"]}
TCG: ${card.TCG}
Condition: ${card.Condition}
Price: ${card.Price} SAR`;

    grid.insertAdjacentHTML("beforeend", `
      <div class="card">
        <img loading="lazy" src="${image}">
        <h4>${card["Card Name"]}</h4>
        <p>${card.TCG} • ${card.Condition}</p>
        <div class="price">${card.Price} SAR</div>
        <a class="buy" target="_blank"
        href="https://wa.me/966566173384?text=${encodeURIComponent(msg)}">
        Buy
        </a>
      </div>
    `);
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


