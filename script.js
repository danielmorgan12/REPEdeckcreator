const form = document.querySelector("#deck-form");
const slidesContainer = document.querySelector("#slides");
const outputMeta = document.querySelector("#output-meta");
const copyButton = document.querySelector("#copy-json");

const parseLines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const parseComps = (text) =>
  parseLines(text).map((line) => {
    const [date, asset, city, keys, price, pricePerKey] = line
      .split("|")
      .map((item) => item.trim());
    return { date, asset, city, keys, price, pricePerKey };
  });

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const buildSlides = (values) => {
  const highlights = parseLines(values.highlights);
  const marketDrivers = parseLines(values.marketDrivers);
  const comps = parseComps(values.salesComps);
  const sources = safeJsonParse(values.sourcesUses) || [];
  const cashFlowNotes = parseLines(values.cashFlowNotes);
  const proForma = parseLines(values.proForma);

  return [
    {
      title: "Investment Overview",
      layout: "Split Hero + Key Stats",
      content: [
        `Hero image of ${values.location} with overlay: ${values.dealName}`,
        `Stats row: ${values.keys} keys, ${values.totalCost} total cost, ${values.equityRaise} raise`,
        `Tagline: ${values.propertyType}`,
      ],
    },
    {
      title: "Why We Like It",
      layout: "Left Image + Icon List",
      content: highlights.map((item) => `Highlight: ${item}`),
    },
    {
      title: "Market Momentum",
      layout: "Left Bullets + 2x3 Stat Tiles",
      content: marketDrivers.map((item) => `Market stat: ${item}`),
    },
    {
      title: "Investment Highlights",
      layout: "6-Panel Grid",
      content: [
        "Panel 1: Attractive debt summary",
        "Panel 2: Location advantages",
        "Panel 3: Demand drivers",
        "Panel 4: Supply constraints",
        "Panel 5: Sponsorship track record",
        "Panel 6: Basis vs comps",
      ],
    },
    {
      title: "Sales Comparables",
      layout: "Table + Callout",
      content: comps.map(
        (comp) =>
          `${comp.date} | ${comp.asset} | ${comp.city} | ${comp.keys} keys | ${comp.price} | ${comp.pricePerKey}`
      ),
    },
    {
      title: "Sources & Uses",
      layout: "Stacked Bars + Table",
      content: sources.map(
        (item) => `${item.label}: ${item.amount} (${item.percent})`
      ),
    },
    {
      title: "Projected Investor Returns",
      layout: "Returns Table + Waterfall Terms",
      content: [
        `Target IRR: ${values.irr}`,
        `Equity Multiple: ${values.equityMultiple}`,
        ...cashFlowNotes.map((note) => `Waterfall: ${note}`),
      ],
    },
    {
      title: "Deal Returns",
      layout: "Metric Strip + Exit Bridge",
      content: [
        `Exit cap rate: ${values.exitCap}`,
        `Hold period: ${values.holdPeriod}`,
        "Bridge: Value at exit, sale costs, debt payoff, net proceeds",
      ],
    },
    {
      title: "Pro Forma Snapshot",
      layout: "Financial Table + Callouts",
      content: proForma.map((item) => `Line item: ${item}`),
    },
    {
      title: "Our Competitive Edge",
      layout: "Numbered List + Image",
      content: [
        "Off-market opportunity",
        "Structured pref equity experience",
        "Strategic operating partner",
        "Below-the-radar deal size",
      ],
    },
    {
      title: "Next Steps",
      layout: "Timeline + Contact",
      content: [
        "Schedule site walk + investor tour",
        "Confirm equity commitments",
        "Finalize legal docs + close",
        "Sponsor contact block + QR code",
      ],
    },
  ];
};

const renderSlides = (slides) => {
  slidesContainer.innerHTML = "";
  slides.forEach((slide, index) => {
    const card = document.createElement("article");
    card.className = "slide-card";
    card.innerHTML = `
      <div class="slide-header">
        <div class="slide-title">${index + 1}. ${slide.title}</div>
        <div class="layout-chip">${slide.layout}</div>
      </div>
      <div class="slide-section">
        ${slide.content.map((item) => `<div>• ${item}</div>`).join("")}
      </div>
    `;
    slidesContainer.appendChild(card);
  });
};

const getFormValues = () => {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
};

const update = () => {
  const values = getFormValues();
  const slides = buildSlides(values);
  renderSlides(slides);
  outputMeta.textContent = `${slides.length} slides • Updated ${new Date().toLocaleTimeString()}`;
  copyButton.dataset.payload = JSON.stringify({ deal: values, slides }, null, 2);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});

copyButton.addEventListener("click", () => {
  const payload = copyButton.dataset.payload || "";
  navigator.clipboard.writeText(payload);
  copyButton.textContent = "Copied!";
  setTimeout(() => {
    copyButton.textContent = "Copy JSON";
  }, 1500);
});

update();
