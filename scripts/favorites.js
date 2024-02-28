export default function favoriteProfile() {
  const formAddFavorites = document.getElementById("favorites-add");
  const inputTextFavorite = document.querySelector(".add-favorites-input");
  const tableFavorites = document.querySelector(".table-favorites-body");
  const displayNoFavorites = document.querySelector(
    ".table-favorites-body-noFav"
  );

  let favorites = JSON.parse(localStorage.getItem("favoriteProfile")) || [];
  let loginsAdd = [];

  function attProfileGithubLocalStorage() {
    localStorage.setItem("favoriteProfile", JSON.stringify(favorites));
  }

  function noFavDisplay() {
    const noFav = favorites.length <= 0;
    if (!noFav) {
      displayNoFavorites.classList.add("hidden");
    } else {
      displayNoFavorites.classList.remove("hidden");
    }
  }

  noFavDisplay();

  function removeFavorite(tr, gitFavorite) {
    let isOk = confirm(
      "Tem certeza que deseja remover esse usuário do favoritos?"
    );
    if (isOk) {
      tr.remove();

      const index = favorites.findIndex(
        (favoriteItem) => favoriteItem.login === gitFavorite.login
      );

      if (index > 0) {
        favorites.splice(index, index);
      } else {
        favorites.splice(index, 1);
      }
      attProfileGithubLocalStorage();
      noFavDisplay();
    }
  }

  // função para criar um item de lista de favoritos
  function createItemFavorite(gitFavorite) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td class="table-favorites-body-profile">
                  <a href="" target="_blank">
                    <img
                      src=""
                      alt="Foto de perfil do github"
                    />
                    <p></p>
                  </a>
                </td>
                <td class="repositories"></td>
                <td class="followers"></td>
                <td class="table-favorites-body-button-remove">
                  <button class="table-favorites-body-remove">
                    <img src="assets/trash-solid.svg" alt="" />
                  </button>
                </td>
    `;

    tr.classList.add("table-favorites-body-line");
    tr.querySelector(
      ".table-favorites-body-profile a"
    ).href = `https://github.com/${gitFavorite.login}`;
    tr.querySelector(".table-favorites-body-profile a img").src =
      gitFavorite.avatar_url;
    tr.querySelector(".table-favorites-body-profile a p").textContent =
      gitFavorite.login;
    tr.querySelector(".repositories").textContent = gitFavorite.public_repos;
    tr.querySelector(".followers").textContent = gitFavorite.followers;

    // evento para remover um item da lista
    tr.querySelector(".table-favorites-body-remove").addEventListener(
      "click",
      () => {
        removeFavorite(tr, gitFavorite);
      }
    );

    return tr;
  }

  // funçao async para requisicao de api do github
  async function getProfileGithub(userName) {
    try {
      const dataResponse = await fetch(
        `https://api.github.com/users/${userName}`
      );
      const dataJSON = await dataResponse.json();
      const { avatar_url, login, public_repos, followers } = dataJSON;

      return {
        avatar_url,
        login,
        public_repos,
        followers,
      };
    } catch (erro) {
      console.log(erro);
    }
  }

  formAddFavorites.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usernameInput = inputTextFavorite.value;
    const gitFavorite = await getProfileGithub(usernameInput);

    loginsAdd = favorites.map((favorite) => {
      return favorite.login;
    });

    const nameDoesNotExist = loginsAdd.includes(gitFavorite.login);

    if (nameDoesNotExist) {
      alert("O usuário ja existe");
    }

    if (gitFavorite.login == undefined) {
      alert("O usuário não existe");
    }

    if (gitFavorite.login !== undefined && !nameDoesNotExist) {
      favorites.push(gitFavorite);
      attProfileGithubLocalStorage();
      noFavDisplay();
      const row = createItemFavorite(gitFavorite);
      tableFavorites.append(row);
      inputTextFavorite.value = "";
    }
    inputTextFavorite.value = "";
  });

  // iteracao para adicionar os itens criados ao carregar a pagina
  favorites.forEach((favorite) => {
    const row = createItemFavorite(favorite);
    tableFavorites.append(row);
  });

  const searchBar = document.querySelector(".search-bar-input");
  searchBar.addEventListener("input", filterSearch);

  function filterSearch() {
    const favoritesDisplay = document.querySelectorAll(
      ".table-favorites-body-line"
    );
    const filterValue = searchBar.value.toLowerCase();

    favoritesDisplay.forEach((favorite) => {
      const userName = favorite
        .querySelector(".table-favorites-body-profile a p")
        .textContent.toLowerCase();

      favorite.style.display = filterValue
        ? userName.includes(filterValue)
          ? ""
          : "none"
        : "";
    });
  }
}
