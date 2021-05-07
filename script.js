"use strict";

const basicURL = "https://rickandmortyapi.com/api";

const getData = async () => {
  try {
    const resposne = await fetch(`${basicURL}/character`);

    const responseJSON = await resposne.json();

    console.log(responseJSON);
  } catch (error) {
    console.error(error.message);
  }
};

getData("pc", "Carexo");
