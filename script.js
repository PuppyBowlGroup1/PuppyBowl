const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-ET-WEB-PT-E';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        //fetching all players from API
        const response = await fetch(APIURL);
        const players = await response.json();
        return players; // returns an array of the players
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        //fetching single player feom API
        const response = await fetch(`${APIURL}/${playerId}`);
        const player = await response.json();
        //creating div element with class name player
        const playerElement = document.createElement("div");
        playerElement.classList.add("player");
        playerElement.innerHTML = `
                <h4>${player.name}</h4>
                <p>${player.breed}</p>
                <p>${player.status}</p>
                <p>${player.imageUrl}</p>
            `;
        playerContainer.appendChild(playerElement);
        return player;

    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

// adding new player
const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(playerObj),
          });
          const player = await response.json();
          console.log(player);
          fetchAllPlayers();

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

//remove player
const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`, {
            method: "DELETE",
          });
          const player = await response.json();
          console.log(player);
          fetchAllPlayers();

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        playerContainer.innerHTML = "";
        playerList.forEach((player) => {
            const playerElement = document.createElement("div");
            playerElement.classList.add("playerCard");
            playerElement.innerHTML = `
                    <h4>${player.name}</h4>
                    <p>${player.breed}</p>
                    <p>${player.status}</p>
                    <img src="${player.imageUrl}" class="img" alt="${player.name}"></br><br>
                    <button class="details-button" data-id="${player.id}">See Details</button>
                    <button class="remove-button" data-id="${player.id}">Remove</button>
                    `;
            playerContainer.appendChild(playerElement);

            // added eventlisteners to buttons

            document.querySelectorAll(".details").forEach((button) =>
                button.addEventListener("click", async (event) => {
                    await fetchSinglePlayer(event.target.id);
                    const players = await fetchAllPlayers();
                    renderAllPlayers(players);
                })
            );

            document.querySelectorAll(".remove").forEach((button) =>
                button.addEventListener("click", async (event) => {
                    await removePlayer(event.target.dataset.id);
                    const players = await fetchAllPlayers();
                    renderAllPlayers(players);
                })
            );
        
        });

    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        // const newPlayerForm = doucment.createElement('form');
        // newPlayerForm.classList.add('info');
        const newPlayerFormHTML = `
        <form id="new-player-form">
          <input type="text" name="name" placeholder="Name" required />
          <input type="text" name="breed" placeholder="Breed" required />
          <input type="text" name="status" placeholder="Status" required />
          <input type="text" name="imageUrl" placeholder="imageUrl" required />
          <button type="submit">Add Player</button>
        </form>
      `;


    newPlayerFormContainer.innerHTML = newPlayerFormHTML;

    const form = newPlayerFormContainer.querySelector('form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const playerData = {
        name: form.name.value,
        breed: form.breed.value,
        status: form.status.value,
        imageUrl: form.imageUrl.Value

      };

      await renderNewPlayerForm(playerData.name, playerData.breed, playerData.status, playerData.imageUrl);

      const players = await fetchAllPlayers();
      renderAllPlayers(players.data.players);

      form.name.value = '';
      form.breed.value = '';
      form.status.value = '';
      form.imageUrl.value = '';
    });

    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players.data.players);

    renderNewPlayerForm(players);
}

init();