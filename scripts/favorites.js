export default function favoriteProfile() {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    textValue = formInput.value;
    formInput.value = "";
    console.log(textValue);
    requisicaoAPI();
  });
  function requisicaoAPI() {
    const api = fetch(`https://api.github.com/users/${textValue}`);
    api
      .then((res) => res.json())
      .then((res) => {
        nome.textContent = res.login;
        repositorio.textContent = res.public_repos;
      });
  }
}

// rascunho html item

/* <tr class="table-favorites-body-line">
                <td class="table-favorites-body-profile">
                  <a href="" target="_blank">
                    <img
                      src="https://avatars.githubusercontent.com/u/87910555?v=4"
                      alt=""
                    />
                    Felipe
                  </a>
                </td>
                <td>9</td>
                <td>32</td>
                <td class="table-favorites-body-button-remove">
                  <button class="table-favorites-body-remove">
                    <img src="assets/trash-solid.svg" alt="" />
                  </button>
                </td>
              </tr> */
