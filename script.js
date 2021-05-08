"use strict";

const charactersContainer = document.querySelector("main");
const seasonBar = document.querySelector(".bar");
const loader = document.querySelector(".loader");

const baseURL = "https://rickandmortyapi.com/api";

class App {
  constructor() {
    seasonBar.addEventListener("click", this.getEpisodes.bind(this));
    this.getCharactersURL(
      "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41"
    );
  }

  getEpisodes(e) {
    const clicked = e.target.closest(".season-box");

    if (!clicked) return;

    const episodesList = clicked.dataset.episodes;
    [...seasonBar.children].forEach((seasonBox) =>
      seasonBox.classList.remove("active")
    );
    clicked.classList.add("active");

    charactersContainer.textContent = "";

    this.getCharactersURL(episodesList);
  }

  async getJSON(url, errorMessage = "Something went wrong") {
    const response = await fetch(url);

    if (!response.ok) throw new Error(errorMessage);

    return response.json();
  }

  async getCharactersURL(episodesList) {
    loader.style.display = "block";
    try {
      const resposne = await fetch(`${baseURL}/episode/${episodesList}`);
      if (!resposne.ok) console.error(error);

      const episodes = await resposne.json();
      const charactersURL = new Set();

      episodes.forEach((episode) => {
        episode.characters.forEach((characterURL) =>
          charactersURL.add(characterURL)
        );
      });

      this.getCharactersData(charactersURL);
    } catch (error) {
      console.error(error.message);
    }
  }

  renderCharacterCard(data) {
    const html = `
    <div class="character-card">
      <img src="${data.image}" />
      <div class="information-wraper">
        <h3>${data.name}</h3>
        <div class="informations">
          <div class="gender information">
            <img src="images/gender-${data.gender.toLowerCase()}.svg" />
            <p class="question">Gender</p>
            <p class="answare">${data.gender}</p>
          </div>
          <div class="status information">
            <img src="images/status-${data.status.toLowerCase()}.svg" />
            <p class="question">Status</p>
            <p class="answare">${data.status}</p>
          </div>
          <div class="species information">
            <img src="images/species.svg" />
            <p class="question">Species</p>
            <p class="answare">${data.species}</p>
          </div>
          <div class="origin information">
            <img src="images/origin.svg" />
            <p class="question">Origin</p>
            <p class="answare">${data.origin.name.split(" ")[0]}</p>
          </div>
        </div>
      </div>
    </div>
    `;

    charactersContainer.insertAdjacentHTML("beforeend", html);
  }

  async getCharactersData(charactersURL) {
    const [...arrayCharactersURL] = charactersURL;

    const characters = await Promise.all(
      arrayCharactersURL.map((characterURL) => this.getJSON(characterURL))
    );

    characters.forEach((character) => this.renderCharacterCard(character));
    loader.style.display = "none";
  }
}

const app = new App();
