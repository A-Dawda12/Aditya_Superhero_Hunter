
const privateKey= "a4a4d048c660909e8164092a55c3ba014dc60f12";
const publicKey = "a923c2a1486b27ee8054aca709213d2f";

 

let modeButton = document.getElementById("theme-btn");

modeButton.addEventListener("click", modeButtonChanger);


// Dark or light mode setting for theme-button(just the button)
async function modeButtonChanger(){
    try {
        let root = document.getElementById("root");
        if(root.getAttribute("color-scheme") === "light"){
            root.setAttribute("color-scheme", "dark");
            modeButton.style.backgroundColor = "black";
            modeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
            modeButton.childNodes[0].style.color = "#DEBF47";
            localStorage.setItem("theme", "dark");
        }
        else if(root.getAttribute("color-scheme") === "dark"){
            root.setAttribute("color-scheme", "light");
            modeButton.style.backgroundColor = "#7A0808";
            modeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`
            modeButton.childNodes[0].style.color = "#DEBF47";
            localStorage.setItem("theme", "light");
        }
    } catch (error) {
        throw error
    }
}

//lets set the current mode based on data from localStorage(just the button)

async function storeModeInStorage(){
    try {
        let currentMode = localStorage.getItem("theme");
        if(currentMode == null  || currentMode === "light"){
            root.setAttribute("color-scheme", "light");
            modeButton.style.backgroundColor = "#7A0808";
            modeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`
            modeButton.childNodes[0].style.color = "#DEBF47";
            localStorage.setItem("theme", "light");
            return;
        }
        else if(currentMode === "dark"){
            root.setAttribute("color-scheme", "dark");
            modeButton.style.backgroundColor = "black";
            modeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
            modeButton.childNodes[0].style.color = "#DEBF47";
            localStorage.setItem("theme", "dark");
            return;
        }
        return;
    } catch (error) {
        throw error;
    }   
}

(async () => {
    await storeModeInStorage();
})();


// function to generate hash and ts date using private and public key

async function generateHashWithTs(publicKey, privateKey) {
    try {
        var ts = new Date().getTime();
        var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
        var res = {
            "ts": ts,
            "hash": hash
        }
        return res;
    } catch (error) {
        throw error;
    }
}

let searchBar = document.getElementById("search-bar");
let resultSearch = document.getElementById("search-results");

// eventListner for search-bar
searchBar.addEventListener("input", () => {
    let searchValue = searchBar.value;
    if (searchValue.length >= 4) {
        searchYouHero(searchValue);
    }
});

async function searchYouHero(searchValue){
    // calling genrateHash to get hash value
    var generateHashWithTsRes = await generateHashWithTs(publicKey, privateKey);
    //checking if we are gettig response from generateHashWithTsRes function or not
    if(!generateHashWithTsRes){
        resultSearch.innerHTML = '';
        return;
    }

    let hash = generateHashWithTsRes.hash;
    let ts = generateHashWithTsRes.ts;

    //api call for marvel's heroApi
    await fetch(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchValue}&ts=${ts}&apikey=${publicKey}&hash=${hash}`)
    .then(response => response.json()) // Parse the response as JSON
    .then(data => showResults(data.data.results));
    // .then(data => console.log(data.data.results));
    
}

// function to display searched result 
async function showResults(searchedHero) {

    try {
        // Map of favorite character IDs for button display
        
        let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
        // console.log(`favouritesCharacterIDs : ${JSON.stringify(favouritesCharacterIDs)}`);
        if(favouritesCharacterIDs === null){
            favouritesCharacterIDs = new Map();
        }
        else if(favouritesCharacterIDs !== null){
            favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
        }

        resultSearch.innerHTML = ``;
        for (const key in searchedHero.slice(0, 6)) { //top 5
            //moving over each hero 
            let hero = searchedHero[key];
            // Appending the element into DOM
            resultSearch.innerHTML +=
                    `
            <li class="flex-row single-search-result">
                    <div class="flex-row img-info">
                        <img src="${hero.thumbnail.path+'/portrait_medium.' + hero.thumbnail.extension}" alt="">
                        <div class="hero-info">
                            <a class="character-info" href="./more-info.html">
                                <span class="hero-name">${hero.name}</span>
                            </a>
                        </div>
                    </div>
                    <div class="flex-col buttons">
                        <!-- <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button> -->
                        <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${hero.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}
                    </div>
                    <div style="display:none;">
                        <span>${hero.name}</span>
                        <span>${hero.description}</span>
                        <span>${hero.comics.available}</span>
                        <span>${hero.series.available}</span>
                        <span>${hero.stories.available}</span>
                        <span>${hero.thumbnail.path+'/portrait_uncanny.' + hero.thumbnail.extension}</span>
                        <span>${hero.id}</span>
                        <span>${hero.thumbnail.path+'/landscape_incredible.' + hero.thumbnail.extension}</span>
                        <span>${hero.thumbnail.path+'/standard_fantastic.' + hero.thumbnail.extension}</span>
                    </div>
            </li>
            `
        }

        // Add appropriate events to the buttons after inserting them in the DOM
        await addEventsToButtons();   
    } catch (error) {
        throw error;
    }
}

// event to add favourite or remove hero and characterInfo
async function addEventsToButtons(){
    try {
        let favButton = document.querySelectorAll(".add-to-fav-btn");
        favButton.forEach((btn) => {
            btn.addEventListener("click", function() {
                addToFav(btn);
            });
        });
          

        let moreInfoLink = document.querySelectorAll(".character-info");
        moreInfoLink.forEach((detailedInfoLink) => {
            detailedInfoLink.addEventListener("click", function() {
                addDetailedInfoInLocalStorage(detailedInfoLink);
            });
        });
        
    } catch (error) {
        throw error;
    }
    
}

// function to add favourite hero or remove hero based on the user click
async function addToFav(buttonElement){
    try {
        // check if we search currently character is added to fav or not 
        // based on the value we get from the button ie fav/remove characters are added or removed from the fav list
        if (buttonElement.querySelector('.fa-heart.fav-icon')){
            
            // Add to fav   
            // Define an object to store hero information
            let heroInfo = {
                name: buttonElement.parentElement.parentElement.children[2].children[0].innerHTML,
                description: buttonElement.parentElement.parentElement.children[2].children[1].innerHTML,
                comics: buttonElement.parentElement.parentElement.children[2].children[2].innerHTML,
                series: buttonElement.parentElement.parentElement.children[2].children[3].innerHTML,
                stories: buttonElement.parentElement.parentElement.children[2].children[4].innerHTML,
                portraitImage: buttonElement.parentElement.parentElement.children[2].children[5].innerHTML,
                id: buttonElement.parentElement.parentElement.children[2].children[6].innerHTML,
                landscapeImage: buttonElement.parentElement.parentElement.children[2].children[7].innerHTML,
                squareImage: buttonElement.parentElement.parentElement.children[2].children[8].innerHTML
            }

            // Retrieve the favorites array from local storage or create an empty array if it doesn't exist
            let favoritesArray = JSON.parse(localStorage.getItem("favouriteCharacters")) || [];

            // we add id of the character in favouriteCharacterIDs so that we can use this id to check if character is fav or not 
            // Retrieve the favorite character IDs from local storage for characters added to favorites
            // If not found, create a new map to store id
            let favoritesIDs = JSON.parse(localStorage.getItem("favouritesCharacterIDs"));
            let favouritesCharacterIDs = favoritesIDs !== null && JSON.stringify(favoritesIDs) !== '{}' ? new Map(favoritesIDs) : new Map();

            // again setting the new favouritesCharacterIDs array to localStorage
            favouritesCharacterIDs.set(heroInfo.id, true);

            favoritesArray.push(heroInfo);

            // Storing the new favouritesCharactersID map to localStorage after converting to string
            localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
            // Setting the new favouritesCharacters array which now has the new character 
            localStorage.setItem("favouriteCharacters", JSON.stringify(favoritesArray));

            // now once the character is added to fav heroes we need to change button so that we can remove that character
            buttonElement.innerHTML = `<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites`;

            //now we need to add toast to display what action was performed to 1 sec
            //first unhide the toaster
            document.querySelector(".fav-toast").setAttribute("data-visibility", "show");
            setTimeout(()=>{
                document.querySelector(".fav-toast").setAttribute("data-visibility", "hide");
            }, 1000)
        }
        else{
            //removing character from fav 

            let characterIdForRemoval = buttonElement.parentElement.parentElement.children[2].children[6].innerHTML;
            
            // getting fav character from localStorage
            let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));

            // now lets get the characterId from local store so that we can delete that character's id from it
            let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
  
            let newFavArray = [];

            // deleting id from favoritesCharacterIDs
            favouritesCharacterIDs.delete(`${characterIdForRemoval}`);

            // now just add those character who id is not equal to characterIdForRemoval
            favouritesArray.forEach((fav) =>{
                if(fav.id !== characterIdForRemoval){
                    newFavArray.push(fav);
                }
            });

            // Now update the localStorage for favouriteCharacters, favoritesCharacterIDs
            localStorage.setItem("favouriteCharacters", JSON.stringify(newFavArray));
            localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));

            // now convert remove button to add fav button
            buttonElement.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';

            // show toaster for 1 sec
            document.querySelector(".remove-toast").setAttribute("data-visibility", "show");
            setTimeout(()=>{
                document.querySelector(".remove-toast").setAttribute("data-visibility", "hide");
            }, 1000)
        }
        
    } catch (error) {
        throw error;
    }
}


// function to add detailedInfo in localStorage so that is can be retrived when loading detailedInfo page
async function addDetailedInfoInLocalStorage(clickedElement) {
    try {
        let detailedInfo = {
            name: clickedElement.parentElement.parentElement.parentElement.children[2].children[0].innerHTML,
            description: clickedElement.parentElement.parentElement.parentElement.children[2].children[1].innerHTML,
            comics: clickedElement.parentElement.parentElement.parentElement.children[2].children[2].innerHTML,
            series: clickedElement.parentElement.parentElement.parentElement.children[2].children[3].innerHTML,
            stories: clickedElement.parentElement.parentElement.parentElement.children[2].children[4].innerHTML,
            portraitImage: clickedElement.parentElement.parentElement.parentElement.children[2].children[5].innerHTML,
            id: clickedElement.parentElement.parentElement.parentElement.children[2].children[6].innerHTML,
            landscapeImage: clickedElement.parentElement.parentElement.parentElement.children[2].children[7].innerHTML,
            squareImage: clickedElement.parentElement.parentElement.parentElement.children[2].children[8].innerHTML
        }
    
        localStorage.setItem("detailedInfo", JSON.stringify(detailedInfo));
    
        
    } catch (error) {
        throw error
    }
    
}


