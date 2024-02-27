export default function favoriteProfile() {
  const formAddFavorites = document.getElementById("favorites-add");
  const inputTextFavorite = document.querySelector(".add-favorites-input");
  const tableFavorites = document.querySelector(".table-favorites-body");
  const favorites = JSON.parse(localStorage.getItem("favoriteProfile")) || [];

  function attProfileGithubLocalStorage() {
    localStorage.setItem("favoriteProfile", JSON.stringify(favorites));
  }

  function createItemFavorite(gitFavorite) {
    const { avatar_url, login, public_repos, followers } = gitFavorite;
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

    return tr;
  }

  async function getProfileGithub(userName) {
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
  }

  formAddFavorites.addEventListener("submit", async (event) => {
    event.preventDefault();
    const usernameInput = inputTextFavorite.value;

    const gitFavorite = await getProfileGithub(usernameInput);
    favorites.push(gitFavorite);
    attProfileGithubLocalStorage();

    const row = createItemFavorite(gitFavorite);
    tableFavorites.append(row);
  });

  favorites.forEach((favorite) => {
    const row = createItemFavorite(favorite);
    tableFavorites.append(row);
  });

  console.log(favorites);
}
