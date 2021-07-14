const API_KEY = "563492ad6f91700001000001126718db07e3446582ca68a71b44255b";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
let page = 1;
let fetchLink;
let searchValue;
let currentSearch;
// Event Listeners
searchInput.addEventListener("input", updateInput);

form.addEventListener("submit", (e) => {
	e.preventDefault();
	currentSearch = searchValue;
	searchPhotos(searchValue);
});

more.addEventListener("click", loadMore);

function updateInput(e) {
	console.log(e.target.value);
	searchValue = e.target.value;
}

async function fetchAPI(url) {
	const dataFetch = await fetch(url, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: API_KEY,
		},
	});
	const data = await dataFetch.json();
	return data;
}

function generatePictures(dataFromAPI) {
	dataFromAPI.photos.forEach((photo) => {
		const galleryImg = document.createElement("div");
		galleryImg.classList.add("gallery-img");
		galleryImg.innerHTML = `
		<div class="gallery-info">
		<p>${photo.photographer}</p>
		<a href="${photo.src.original}" target="_blank">Download</a>
		</div>
		<img src="${photo.src.large}">
      `;

		gallery.appendChild(galleryImg);
	});
}

async function curatedPhotos() {
	clearGallery();
	fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
	const data = await fetchAPI(fetchLink);
	generatePictures(data);
}

async function searchPhotos(query) {
	clearGallery();
	fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=1`;
	const data = await fetchAPI(fetchLink);
	generatePictures(data);
}

function clearGallery() {
	gallery.innerHTML = "";
	searchInput.value = "";
}

async function loadMore() {
	page++;
	if (currentSearch) {
		fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${page}`;
	} else {
		fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
	}
	const data = await fetchAPI(fetchLink);
	generatePictures(data);
}

curatedPhotos();
