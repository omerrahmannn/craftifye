const SHEET_ID = "PASTE_YOUR_SHEET_ID_HERE";
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
      const res = await fetch(`https://api.scryfall.com/cards/named?exact=${card["Card Name"]}`);
      const json = await res.json();
      image = json.image_uris?.normal;
    }

    const msg = `Hello, I want to buy:
Card: ${card["Card Name"]}
TCG: ${card.TCG}
Condition: ${card.Condition}
Price: ${card.Price}`;

    grid.innerHTML += `
      <div class="card">
        <img src="${image}">
        <h4>${card["Card Name"]}</h4>
        <p>${card.TCG} | ${card.Condition}</p>
        <p><b>${card.Price} SAR</b></p>
        <a class="buy" target="_blank"
        href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}">
        Buy on WhatsApp
        </a>
      </div>
    `;
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
