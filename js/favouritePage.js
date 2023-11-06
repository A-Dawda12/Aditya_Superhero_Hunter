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


/* select the fav container */
let favcontainer = document.getElementById('container');

// add eventListner to  display fav when page is loaded

window.addEventListener("load", async function(){
    //retrive fav characters gtom local storage
    let favouriteCharacters = localStorage.getItem("favouriteCharacters");

    if(favouriteCharacters === null || favouriteCharacters.length === 0){
        favcontainer.innerHTML = `<p class="no-hero"> No SuperHero added in your Favourite List</p>`
        return;
    }
    else{
        favouriteCharacters = JSON.parse(this.localStorage.getItem("favouriteCharacters"));
    }

    favcontainer.innerHTML = '';
    favouriteCharacters.forEach(char =>{
        favcontainer.innerHTML += `
            <div class= "flex-col card">
                <img src="${char.squareImage}">
                <span class="name">${char.name}</span>
                <span class="id">Id : ${char.id}</span>
                <span class="comics">Comics : ${char.comics}</span>
                <span class="series">Series : ${char.series}</span>
                <span class="stories">Stories : ${char.stories}</span>
                <a class="detailed-info" href="./detailedInfo.html">
                    <button class="btn">
                        <i class="fa-solid fa-circle-info"></i> &nbsp; Detailed Info
                    </button>
                </a>
                <div style="display:none;">
                    <span>${char.name}</span>
                    <span>${char.description}</span>
                    <span>${char.comics}</span>
                    <span>${char.series}</span>
                    <span>${char.stories}</span>
                    <span>${char.id}</span>
                    <span>${char.portraitImage}</span>
                    <span>${char.landscapeImage}</span>
                    <span>${char.squareImage}</span>
                </div>
                <button class="btn remove-btn">
                    <i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites
                </button>
            </div>
           `
    });
    await addEventsToButtons()
});

async function addEventsToButtons(){
    try {
        let removeButton = document.querySelectorAll(".remove-btn");
        removeButton.forEach((btn) => {
            btn.addEventListener("click", async function() {
                await removeFromFav(btn);
            });
        });
          

        let moreInfoLink = document.querySelectorAll(".detailed-info");
        moreInfoLink.forEach((detailedInfoLink) => {
            detailedInfoLink.addEventListener("click", async function() {
                await addDetailedInfoInLocalStorage(detailedInfoLink);
            });
        });
        
    } catch (error) {
        throw error;
    }
}

async function addDetailedInfoInLocalStorage(detailedInfoLink){
    try {
        
    } catch (error) {
        throw error
    }
}

async function removeFromFav(btn){
    try {
        //removing character from fav 
        let characterIdForRemoval = btn.parentElement.children[2].innerHTML.substring(5);
        console.log(characterIdForRemoval);
            
        // getting fav character from localStorage
        let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));

        // now lets get the characterId from local store so that we can delete that character's id from it
        let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));

        // delete id from favCharId
        favouritesCharacterIDs.delete(`${characterIdForRemoval}`);

        // now delete from favChar array with matching id
        favouritesArray.forEach(function (fav, index){
            console.log(fav.id);
            if(fav.id === characterIdForRemoval){
                console.log(`favouritesArray before : ${JSON.stringify(favouritesArray)}`);
                favouritesArray.splice(index, 1);
                console.log(`favouritesArray after: ${JSON.stringify(favouritesArray)}`);
            }
        });
        
        //now after removal of char if list is empty just give no char reposne
        console.log(favouritesArray.length);
        if(favouritesArray.length === 0){
            favcontainer.innerHTML = `<p class = "no-hero"> No SuperHero added in your Favourite List</p>`
        }

        localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));
        localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
        
        //remove the fav tile
        btn.parentElement.remove();

        // display toast
        document.querySelector(".remove-toast").setAttribute("data-visibility", "show");
        setTimeout(()=>{
            document.querySelector(".remove-toast").setAttribute("data-visibility", "hide");
        }, 1000)

    } catch (error) {
        throw error
    }
}