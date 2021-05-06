"use strict";

const basicURL = "https://rickandmortyapi.com/api";

const getData = async () => {
  try {
    const resposne = await fetch(`${basicURL}/episode/`);

    const responseJSON = await resposne.json();

    console.log(responseJSON);
  } catch (error) {
    console.error(error.message);
  }
};

getData("pc", "Carexo");
