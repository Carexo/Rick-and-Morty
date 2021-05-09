"use strict";

const header = document.querySelector("header");
const seasonBar = document.querySelector(".bar");
const seasonSection = document.querySelector(".season");

const charactersContainer = document.querySelector("main");

const loader = document.querySelector(".loader");
const backButton = document.querySelector(".back-button");
const errorBox = document.querySelector(".error-box");

const baseURL = "https://rickandmortyapi.com/api";

class App {
  constructor() {
    seasonBar.addEventListener("click", this.getEpisodes.bind(this));
    this.getCharactersURL(
      "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41"
    );
    backButton.addEventListener("click", this.backToMain.bind(this));
    this.ObserveSeasonSection();
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
      if (!resposne.ok) throw new Error("response is not ok");

      const episodes = await resposne.json();
      const charactersURL = new Set();

      episodes.forEach((episode) => {
        episode.characters.forEach((characterURL) =>
          charactersURL.add(characterURL)
        );
      });

      this.getCharactersData(charactersURL);
    } catch (error) {
      this.appearError();
      loader.style.display = "none";
      console.error(error.message);
    }
  }

  renderCharacterCard(data) {
    const html = `
    <div class="character-card">
      <img src="${data.image}" alt="image of ${data.name}" />
      <div class="information-wraper">
        <h3>${data.name}</h3>
        <div class="informations">
          <div class="gender information">
            <img src="images/gender/gender-${data.gender.toLowerCase()}.svg" alt="gender icon" />
            <p class="question">Gender</p>
            <p class="answare">${data.gender}</p>
          </div>
          <div class="status information">
            <img src="images/status/status-${data.status.toLowerCase()}.svg" alt="heart icon" />
            <p class="question">Status</p>
            <p class="answare">${data.status}</p>
          </div>
          <div class="species information">
            <img src="images/species/species.svg" alt="alien icon"/>
            <p class="question">Species</p>
            <p class="answare">${data.species}</p>
          </div>
          <div class="origin information">
            <img src="images/origin/origin.svg" alt="flaga icon"/>
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

    console.log(characters.filter((character) => character.gender === "Male"));
    characters.forEach((character) => this.renderCharacterCard(character));
    loader.style.display = "none";
  }

  ObserveSeasonSection() {
    const appearBackButton = (entries) => {
      const [entry] = entries;

      if (!entry.isIntersecting) backButton.style.display = "block";
      else backButton.style.display = "none";
    };

    const backButtonObserver = new IntersectionObserver(appearBackButton, {
      root: null,
      threshold: 0,
      rootMargin: `500px`,
    });

    backButtonObserver.observe(seasonSection);
  }

  backToMain() {
    header.scrollIntoView({ behavior: "smooth" });
  }

  appearError() {
    errorBox.style.display = "flex";
  }
}

const app = new App();
