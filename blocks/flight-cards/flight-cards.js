let path = '';
let currentPage = 1;
let maxPages = 1;
const itemsPerPage = 20;

function render(block, data) {
  const flightContent = block.querySelector('.flight-content');
  flightContent.replaceChildren();
  data.forEach((flight) => {
    const { flightNumber, origin, destination } = flight;
    const flightCard = document.createElement('div');
    flightCard.className = 'flight-card';
    flightCard.innerHTML = `
        <p></p><strong>${flightNumber}</strong></p>
        <p>${origin} to ${destination}</p>
      `;
    flightContent.append(flightCard);
  });
}

async function loadPage(block, pageNumber) {
  const offset = (pageNumber - 1) * itemsPerPage;
  const response = await fetch(`${path}?offset=${offset}&limit=${itemsPerPage}`);
  if (response.ok) {
    const content = await response.json();
    render(block, content.data);
    currentPage = pageNumber;
    maxPages = content.total / itemsPerPage;
    (document.querySelector('.current-page') || {}).innerHTML = `Page ${currentPage} of ${maxPages}`;
  }
}

async function renderPagination(block) {
  const pagination = document.createElement('div');
  pagination.className = 'pagination';
  pagination.innerHTML = `
      <button class="previous">Previous</button>
      <button class="next">Next</button>
      <span class="current-page">Page ${currentPage} of ${maxPages}</span>
    `;
  block.append(pagination);
  pagination.querySelector('.previous').addEventListener('click', () => {
    if (currentPage > 1) {
      loadPage(block, currentPage - 1);
    }
  });
  pagination.querySelector('.next').addEventListener('click', () => {
    if (currentPage < maxPages) {
      loadPage(block, currentPage + 1);
    }
  });
}

async function init(block) {
  path = block.textContent.trim().startsWith('http')
    ? new URL(block.textContent.trim(), window.location).pathname
    : block.textContent.trim();

  block.replaceChildren();
  const flightContent = document.createElement('div');
  flightContent.className = 'flight-content';
  block.append(flightContent);
  await loadPage(block, currentPage);
  await renderPagination(block);
}

export default async function decorate(block) {
  await init(block);
}
