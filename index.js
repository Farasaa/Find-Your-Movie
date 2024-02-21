const siteSearch = document.getElementById('site-search')
const searchResult = document.getElementById("search-result")
let movieArr = []
let renderMovies = []
let movieWatchListArray = []
let addBtn = ""
let removeBtn = ""


// Event Listner for Movie Search Fetch Request


document.addEventListener('click', function(e){
    if(e.target.dataset.full){
        renderReadMoreText(e.target.dataset.full)
    }if(e.target.dataset.add){
        addMovieToWatchList(e.target.dataset.add)
    }if(e.target.dataset.remove){
        removeFromWatchList(e.target.dataset.remove)        
    }
})
document.addEventListener('submit', function(e){
e.preventDefault()
let movieSearch = siteSearch.value
    getMovieID(movieSearch)
  })
  
// Get Movie data from API

async function getMovieID(searchInput){
    try{
     const APIRespond = await fetch(`https://www.omdbapi.com/?s=${searchInput}&type=movie&apikey=311954f3`)
     if(!APIRespond.ok) {
        const text = await APIRespond.text()
        throw Error(text)
     }else{ 
        const jsonResponse = await APIRespond.json()
        .then(data => {
            clearMovieList()
            movieArr = data.Search
            const movieArrID = movieArr.map(function(movieID){
                return movieID.imdbID
            })
            getMovieData(movieArrID)  
        })

     }

    }catch (error){
        let errorMessageHtml = `<p class="error-message">Unable to find what you’re looking for. Please try another search.</p>`
        document.getElementById("movie-list").innerHTML = errorMessageHtml
    }

}





function getMovieData(array){
    array.forEach(function(idSearch){
        
        fetch(`https://www.omdbapi.com/?i=${idSearch}&type=movie&plot=full&apikey=311954f3`)
        .then(resTwo => resTwo.json())
        .then(dataTwo => {
            renderMovies = [dataTwo]
            let readMoreHtml = ""
            let movieHtml = ""
            let readMoreHtmlLength = ""
            let readMoreText = ""
            renderMovies.forEach(function(renderMovie){ 
                readMoreHtmlLength = renderMovie.Plot.length
                readMoreText = renderMovie.Plot
                readMoreHtml = readMore(readMoreHtmlLength, readMoreText)
                if(readMoreHtmlLength > 380){
                    return movieHtml += `
                    <div class="movie-display">    
                        <img class="movie-poster" src="${renderMovie.Poster}" alt="N/A">
                       <div class="row-one"> 
                            <h3>${renderMovie.Title}</h3>
                            <img class="star-icon" src="images/starIcon.png">              
                            <p class="movie-rating">${renderMovie.imdbRating}</p>
                        </div>
                        <div class="row-two">  
                            <p class="movie-runtime">${renderMovie.Runtime}</p>
                            <p class="movie-genre">${renderMovie.Genre}</p>
                            <button class="remove-movie" id="remove-${renderMovie.imdbID}" data-remove="${renderMovie.imdbID}">
                            <i class="fa-solid fa-minus"></i>
                            Remove
                            </button>
                            <button id="add-${renderMovie.imdbID}" style=""class="add-movie" data-add="${renderMovie.imdbID}">
                            Watchlist
                            </button>
                        </div> 
                        <div class="row-three">    
                            <p class="full-plot">
                            <span class="movie-plot">${readMoreHtml.substring(0, 340)}</span>
                            <span id="dots-${renderMovie.imdbID}" class="show-dots">...</span>
                            <span id="more-text-${renderMovie.imdbID}" class="more-text">${readMoreHtml.substring(340)}</span>
                            <button id="read-more-btn-${renderMovie.imdbID}" class="read-more-btn" data-full="${renderMovie.imdbID}">Read More</button>
                            </p>
                                                       
                        </div> 
                    </div>
                    `
                    
                }else
                movieHtml += `
                <div class="movie-display">    
                    <img class="movie-poster" src="${renderMovie.Poster}" alt="N/A">
                   <div class="row-one"> 
                        <h3>${renderMovie.Title}</h3>
                        <img class="star-icon" src="images/starIcon.png">              
                        <p class="movie-rating">${renderMovie.imdbRating}</p>
                    </div>
                    <div class="row-two">  
                        <p class="movie-runtime">${renderMovie.Runtime}</p>
                        <p class="movie-genre">${renderMovie.Genre}</p>
                        <button class="remove-movie" id="remove-${renderMovie.imdbID}" data-remove="${renderMovie.imdbID}">
                        <i class="fa-solid fa-minus"></i>
                        Remove
                        </button>
                        <button class="add-movie" id="add-${renderMovie.imdbID}"  data-add="${renderMovie.imdbID}">
                        Watchlist
                        </button>
                    </div> 
                    <div class="row-three">     
                        <p class="movie-plot">${readMoreHtml}</p>
                    </div> 
                </div>
                `   
            })
            searchResult.style.display = 'none'
            document.getElementById("movie-list").innerHTML += movieHtml
        })
    })
}

// Get Movie Plot full
function readMore(textLength, textContent){
    let readMoreUpdate = ""
    if(textLength > 380){
        readMoreUpdate = textContent
        return readMoreUpdate
        
    }else
    
    return textContent

}

// Clearing The Results for New Search
function clearMovieList(){
    document.getElementById("movie-list").innerHTML = ""
}

// Read More Button

function renderReadMoreText(fullPlot){
   const readMoreBtn = document.getElementById('read-more-btn-'+fullPlot)
   const removeDots = document.getElementById('dots-'+fullPlot)
   const readMoreTextDisplay = document.getElementById('more-text-'+fullPlot)
    if(readMoreBtn.innerHTML === 'Read More'){
        removeDots.classList.remove("show-dots")
        removeDots.classList.add("hide-dots")
        readMoreTextDisplay.classList.add("more-text-display")
        readMoreTextDisplay.classList.remove("more-text")
        readMoreBtn.innerHTML = 'Read Less'
    }else{
        removeDots.classList.add("show-dots")
        removeDots.classList.remove("hide-dots")
        readMoreTextDisplay.classList.add("more-text")
        readMoreTextDisplay.classList.remove("more-text-display")
        readMoreBtn.innerHTML = "Read More"
    }
  
}

// Add to Watch list

function addMovieToWatchList(movieToAdd){
    let addBtn = document.getElementById('add-'+movieToAdd)
    let removeBtn = document.getElementById('remove-'+movieToAdd)
        fetchData(movieToAdd)
        addBtn.style.display = 'none'
        removeBtn.style.display = 'block'      
}

    async function fetchData(fetchMovieId) {
        try {
          const response = await fetch(`https://www.omdbapi.com/?i=${fetchMovieId}&type=movie&plot=full&apikey=311954f3`)
          const data = await response.json()
          movieWatchListArray = JSON.parse(localStorage.getItem("listOfMovies") || "[]")
          localStorage.setItem("movieWatchListApi", JSON.stringify(data))
          movieWatchListArray.push(JSON.parse(localStorage.getItem("movieWatchListApi")))
         const movieWatchListArrayLs = JSON.stringify(movieWatchListArray)
         localStorage.setItem("listOfMovies", movieWatchListArrayLs)
        } catch (error) {
          console.error("Error fetching data:", error)
        }
        
      }
      

// Create the Remove button

function removeFromWatchList(removeID){
    let addBtn = document.getElementById('add-'+removeID)
    let removeBtn = document.getElementById('remove-'+removeID)
        addBtn.style.display = "block"
        removeBtn.style.display = "none"

    movieWatchListArray = JSON.parse(localStorage.getItem("listOfMovies") || "[]")
    const movieToRemove = movieWatchListArray.findIndex(findMovieId =>{
       return findMovieId.imdbID === removeID
    })
    movieWatchListArray.splice(movieToRemove, 1)
    const updatedWatchList = JSON.stringify(movieWatchListArray)
    localStorage.setItem("listOfMovies", updatedWatchList)
}