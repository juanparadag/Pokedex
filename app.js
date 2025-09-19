let contador = 0;
let main = document.querySelector("#pokemon-list");
const input = document.querySelector("#search");
console.log(input.value);

function conseguirImagen(n) {
  return fetch(`https://pokeapi.co/api/v2/pokemon-form/${n}/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`No se encontró el Pokémon con ID ${n}`);
      }
      return response.json();
    })
    .then((data) => data.sprites["front_default"]) // Retorna la URL de la imagen
    .catch((error) => {
      console.error(`Error al cargar la imagen del Pokémon ${n}:`, error);
      return "https://via.placeholder.com/150"; // Imagen de placeholder para errores
    });
}

function conseguirNombre(n) {
  return fetch(`https://pokeapi.co/api/v2/pokemon-form/${n}/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`No se encontró el Pokémon con ID ${n}`);
      }
      return response.json();
    })
    .then((data) => data.pokemon.name) // Retorna el nombre
    .catch((error) => {
      console.error(`Error al cargar el nombre del Pokémon ${n}:`, error);
      return "Desconocido";
    });
}

function conseguirHabilidad(n) {
  return fetch(`https://pokeapi.co/api/v2/pokemon-form/${n}/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`No se encontró el Pokémon con ID ${n}`);
      }
      return response.json();
    })
    .then((data) => {
      return data.types.map((type) => type.type.name).join(", "); // Unir habilidades
    })
    .catch((error) => {
      console.error(`Error al cargar las habilidades del Pokémon ${n}:`, error);
      return "Sin habilidades";
    });
}

function callback(funcionNombre, funcionHabilidad, i) {
  let div = document.createElement("div");
  div.id = "pokemon";

  let image = document.createElement("img");
  image.alt = "Cargando imagen...";
  image.id = "imgpokes";

  conseguirImagen(i)
    .then((url) => {
      image.src = url; // Asigna la URL de la imagen
    })
    .catch((error) => {
      console.error(
        `Error en callback al cargar la imagen del Pokémon ${i}:`,
        error
      );
      image.alt = "Imagen no disponible"; // Manejo de error
    });

  let p = document.createElement("p");
  p.innerHTML = `ID: ${
    i < 10 ? "#00" + i : i < 100 ? "#0" + i : "#" + i
  }<br>Nombre: ${funcionNombre}<br>Habilidad: ${funcionHabilidad}`;
  div.classList.add("div-pokemons");
  div.appendChild(image);
  div.appendChild(p);
  main.appendChild(div);
  console.log(funcionHabilidad);
}

// Ajuste del bucle para coordinar las llamadas a las funciones
for (let i = 1; i < 132; i++) {
  Promise.all([conseguirNombre(i), conseguirHabilidad(i)])
    .then(([nombre, habilidad]) => {
      callback(nombre, habilidad, i);
      contador++;
    })
    .catch((error) => {
      console.error(
        `Error general en el procesamiento del Pokémon ${i}:`,
        error
      );
    });
}

console.log(`Pokémon procesados: ${contador}`);

function filtrarHabilidad(habilidad) {
  const pokemons = document.querySelectorAll(".div-pokemons");

  // Recorre todos los Pokémon y oculta o muestra según la habilidad
  pokemons.forEach((pokemon) => {
    const habilidades = pokemon.querySelector("p").innerHTML.toLowerCase();
    if (habilidades.includes(habilidad)) {
      pokemon.style.display = "block";
    } else {
      pokemon.style.display = "none";
    }
  });
}

function busquedaPokemons() {
  const input = document.querySelector("#search");
  const pokemons = document.querySelectorAll(".div-pokemons");
  const search = document.querySelector("#search").value.toLowerCase();
  let found = false;

  if (input.value === "") {
    input.value = "";
    pokemons.forEach((pokemon) => {
      pokemon.style.display = "block";
    });
    return alert("Ingrese un nombre de Pokémon");
  }
  input.value = "";
  pokemons.forEach((pokemon) => {
    const nombre = pokemon.querySelector("p").innerHTML.toLowerCase();
    if (nombre.includes(search)) {
      pokemon.style.display = "block";
      found = true;
    } else {
      pokemon.style.display = "none";
    }
  });
  if (!found) {
    pokemons.forEach((pokemon) => {
      pokemon.style.display = "block";
    });
    alert(`No se encontró ningún Pokémon con el nombre ${search}`);
  }
}

document
  .querySelector("#searchButton")
  .addEventListener("click", busquedaPokemons);
document.querySelector("#search").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    // Verifica si la tecla presionada es Enter
    busquedaPokemons();
  }
});

function filtrarHabilidadEventos(boton, habilidad) {
  document
    .querySelector(boton)
    .addEventListener("click", () => filtrarHabilidad(habilidad));
}
const arrayHabsYBtns = [
  ["#grass-btn", "grass"],
  ["#poison-btn", "poison"],
  ["#fire-btn", "fire"],
  ["#flying-btn", "flying"],
  ["#water-btn", "water"],
  ["#bug-btn", "bug"],
  ["#normal-btn", "normal"],
  ["#electric-btn", "electric"],
  ["#ground-btn", "ground"],
  ["#fairy-btn", "fairy"],
  ["#fighting-btn", "fighting"],
  ["#psychic-btn", "psychic"],
  ["#rock-btn", "rock"],
  ["#ice-btn", "ice"],
  ["#steel-btn", "steel"],
  ["#ghost-btn", "ghost"],
];
arrayHabsYBtns.forEach((habYBtn) =>
  filtrarHabilidadEventos(habYBtn[0], habYBtn[1])
);
