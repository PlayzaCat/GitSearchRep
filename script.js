const inputSearch = document.querySelector("input");
const inputContainer = document.querySelector(".dropdown");
const chosens = document.querySelector(".chosens");


inputContainer.addEventListener("click", function(event) { 
    let target = event.target; 
    if (!target.classList.contains("dropdown-content")) { 
	return;
    }
    addChosen(target); // добавляем таргет в список выбранных
    inputSearch.value = ""; // обнуляем поиск
    removePredictions(); // скрываем список поиска
});




// Получаем инфу 
async function getPredictions() {
    const urlRepositories = new URL("https://api.github.com/search/repositories");
    let repositoriesPart = inputSearch.value; // наше введенное значение
    if (repositoriesPart == "") {  // убираем подсказку если строка
	removePredictions();
	return;
    }

    urlRepositories.searchParams.append("q", repositoriesPart)
    try {
	let response = await fetch(urlRepositories);
	if (response.ok) {  // если запрос прошел успешно, true
	let repositories = await response.json(); // Промис, грузим инфу в переменную перегоняя в массив
    // console.log(repositories) // подсматриваем
	showPredictions(repositories); // отправляем в функцию
	}
	else return null;
    } catch(error) {
	return null;
    }
}


// показываем список найденных репозиториев
function showPredictions(repositories) {
    let dropdownPredictions = document.querySelectorAll(".dropdown-content");
    removePredictions();
    // console.log(repositories)// подсматриваем полученное 
    for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++) { // для первых пяти результатов
	let dropdownPrediction = document.createElement("div");  // создаем див
	dropdownPrediction.classList.add("dropdown-content");  // крепим к нему класс
	let name = repositories.items[repositoryIndex].name; // берем имя
	let starsCount = repositories.items[repositoryIndex].stargazers_count; // в принципе можно сразу установить в атрибут
	dropdownPrediction.textContent = name; // и кладем его в див
    // console.log(dropdownPrediction) // подсматриваем полученное 
	dropdownPrediction.setAttribute("data-name", name); // устанавливаем атрибуты
	dropdownPrediction.setAttribute("data-owner", repositories.items[repositoryIndex].owner.login); // устанавливаем атрибуты
	dropdownPrediction.setAttribute("data-stars", starsCount); // устанавливаем атрибуты
    
	inputContainer.append(dropdownPrediction); // вкладываем в список полученного 
    }
}




// добавляем в блок выбранных
function addChosen(target) {
    let chosen = document.createElement("div");
    chosen.innerHTML = "Name: " + target.dataset.name + "<br>" + "Owner: " + target.dataset.owner + "<br>" + "Stars: " + target.dataset.stars; // получаем из устанавленных атрибутов
    chosen.classList.add("chosen");
    let button = document.createElement("button");
    button.classList.add("btn-close");
    chosen.append(button);
    chosens.append(chosen);
}



// регулируем запросы
function debounce(fn, timeout) {
    let timer = null;

    return (...args) => {
	clearTimeout(timer);
	return new Promise((resolve) => {
	    timer = setTimeout(
		() => resolve(fn(...args)),
		timeout,
	    );
	});
    };
}


const getPredictionsDebounce = debounce(getPredictions, 300);
inputSearch.addEventListener("keyup", getPredictionsDebounce); // запускаем поиск по факту (через дебаунс)

// выбранные репозитории
chosens.addEventListener("click", function(event) {
    let target = event.target;
    if (!target.classList.contains("btn-close")) return; 
    target.parentElement.style.display = "none"; // скрываем блок по клику в нан
});


// скрываем список найденных репозиториев
function removePredictions() {
    let dropdownPredictions = document.querySelectorAll(".dropdown-content");
    if (!dropdownPredictions) return;

    for (let dropdownPrediction of dropdownPredictions) {
	dropdownPrediction.remove();
    }
}