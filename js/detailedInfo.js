let title = document.getElementById('page-title');

let heroInfo = JSON.parse(localStorage.getItem("heroInfo"));
console.log(`heroInfo : ${JSON.stringify(heroInfo)}`)

//title  value to be chnaged to hero's name
title.innerHTML = heroInfo.name;

// setting theme
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


let info = document.getElementById('info-container');


window.addEventListener("load", async function(){
    //retrive fav characters gtom local storage
    let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");

    if (favouritesCharacterIDs == null) {
        favouritesCharacterIDs = new Map();
    } else if (favouritesCharacterIDs != null) {
            favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
    }

    //add deatiled Info tile 
    info.innerHTML = `
        <div class="flex-row hero-name">${heroInfo.name}</div>
        <div class="flex-row hero-detail">
            <img class="potraitImage" src="${heroInfo.portraitImage}">
            <div clasd="flex-col more-info">
                <div class="flex-row id">
                    <span><b>Id : </b>${heroInfo.id}</span>
                </div>
                <div class="flex-row comics">
                    <span><b>Comics : </b>${heroInfo.comics}</span>
                </div>
                <div class="flex-row series">
                    <span><b>Series : </b>${heroInfo.series}</span>
                </div>
                <div class="flex-row stories">
                    <span><b>Stories : </b>${heroInfo.stories}</span>
                </div>
            </div>
        </div>
        <div class="flex-col discription">
            <b>Description</b>
            <p>${heroInfo.description ? heroInfo.description : "No description available for your hero"}</p>
        </div>
        <div style="display:none;">
            <span>${heroInfo.name}</span>
            <span>${heroInfo.portraitImage}</span>
            <span>${heroInfo.landscapeImage}</span>
            <span>${heroInfo.id}</span>
            <span>${heroInfo.comics}</span>
            <span>${heroInfo.series}</span>
            <span>${heroInfo.stories}</span>
            <span>${heroInfo.squareImage}</span>
            <span>${heroInfo.description}</span>
        </div>
        <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${heroInfo.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}
    `
    await addEventsToButtons();
});


async function addEventsToButtons(){
    try {
        let favButton = document.querySelectorAll(".add-to-fav-btn");
        favButton.forEach((btn) => {
            btn.addEventListener("click", async function() {
                await addToFav(btn);
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
                name: buttonElement.parentElement.children[3].children[0].innerHTML,
                description: buttonElement.parentElement.children[3].children[8].innerHTML,
                comics: buttonElement.parentElement.children[3].children[4].innerHTML,
                series: buttonElement.parentElement.children[3].children[5].innerHTML,
                stories: buttonElement.parentElement.children[3].children[6].innerHTML,
                portraitImage: buttonElement.parentElement.children[3].children[1].innerHTML,
                id: buttonElement.parentElement.children[3].children[3].innerHTML,
                landscapeImage: buttonElement.parentElement.children[3].children[2].innerHTML,
                squareImage: buttonElement.parentElement.children[3].children[7].innerHTML
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

            let characterIdForRemoval = buttonElement.parentElement.children[3].children[3].innerHTML;
            
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
