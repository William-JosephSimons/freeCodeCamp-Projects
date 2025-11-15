const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");

const nameElement = document.getElementById("creature-name");
const idElement = document.getElementById("creature-id");
const weightElement = document.getElementById("weight");
const heightElement = document.getElementById("height");
const mainAttributes = [idElement, nameElement, weightElement, heightElement];

const specialElement = document.getElementById("creature-special");
const hpElement = document.getElementById("hp");
const attackElement = document.getElementById("attack");
const defenseElement = document.getElementById("defense");
const specialAttackElement = document.getElementById("special-attack");
const specialDefenseElement = document.getElementById("special-defense");
const speedElement = document.getElementById("speed");
const mainStats = [
  hpElement,
  attackElement,
  defenseElement,
  specialAttackElement,
  specialDefenseElement,
  speedElement,
];

const typesElement = document.getElementById("types");

const updateTable = (jsonData) => {
  const { id, name, weight, height, special, stats, types } = jsonData;
  const attributes = [id, name, weight, height];
  attributes.forEach(
    (attribute, index) => (mainAttributes[index].textContent = attribute)
  );

  stats.forEach(
    ({ base_stat }, index) => (mainStats[index].textContent = base_stat)
  );

  typesElement.innerHTML = "";
  types.forEach(({ name }) => {
    const typeName = name.toUpperCase();
    typesElement.innerHTML += `
        <p>${typeName}</p>
        `;
  });
  const { name: specName, description: specDescription } = special;
  specialElement.innerHTML = `
    ${specName}:<br>
    ${specDescription}
    `;
};

const processSearch = async () => {
  try {
    const creatureId = +searchInput.value || searchInput.value.trim();
    if (!creatureId) {
    }
    const creatureUrl = `https://rpg-creature-api.freecodecamp.rocks/api/creature/${creatureId}`;
    const res = await fetch(creatureUrl);
    if (!res.ok) {
      if (res.status === 404) {
        alert("Creature not found");
        throw new Error(`Creature was not found: ${res.status}`);
      }
      throw new Error(`Response was not okay: ${res.status}`);
    }
    const jsonData = await res.json();
    updateTable(jsonData);
  } catch (err) {
    console.log("Failure in retrieving creature info: ", err);
    return;
  }
};

searchBtn.addEventListener("click", processSearch);
