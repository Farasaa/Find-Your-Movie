let renderMovieWatchList = []


// event listners
document.addEventListener('click', function(e){
    if(e.target.dataset.full){
        renderReadMoreText(e.target.dataset.full)
        }if(e.target.dataset.remove){
            removeFromWatchList(e.target.dataset.remove)
        }
    })
    
      function populateList() { 
        let movieWatchListHtml = ""
        let readMoreHtmlLength = ""
        let readMoreHtml = ""
        let readMoreText = ""
        const listOfMovies =  localStorage.getItem('listOfMovies')
        renderMovieWatchList = JSON.parse(listOfMovies)
        if(renderMovieWatchList.length === 0){
            document.getElementById('watch-list').innerHTML = `
            <div>
            <p>Your watchlist is looking a little empty...</p>
            <i class="fa-solid fa-circle-plus"></i>
            <a class="watchlist-link" href="index.html">Let's add some movies!</a>
            `    
        }else
            renderMovieWatchList.forEach(movie =>{
            readMoreHtmlLength = movie.Plot.length
            readMoreText = movie.Plot
            readMoreHtml = readMore(readMoreHtmlLength, readMoreText)
                if(readMoreHtmlLength > 380){
                return movieWatchListHtml += `
           <div class="movie-display">    
                <img class="movie-poster" src="${movie.Poster}" alt="N/A">
                <div class="row-one"> 
                    <h3>${movie.Title}</h3>
                    <img class="star-icon" src="images/starIcon.png">              
                    <p class="movie-rating">${movie.imdbRating}</p>
                </div>
                <div class="row-two">  
                        <p class="movie-runtime">${movie.Runtime}</p>
                        <p class="movie-genre">${movie.Genre}</p>
                        <button class="remove-movie-watch" id="remove-${movie.imdbID}" data-remove="${movie.imdbID}">
                            <i class="fa-solid fa-minus"></i>
                             Remove
                        </button>
                </div>    
                <div class="row-three">    
                        <p class="full-plot">
                            <span class="movie-plot">${readMoreHtml.substring(0, 340)}</span>
                            <span id="dots-${movie.imdbID}" class="show-dots">...</span>
                            <span id="more-text-${movie.imdbID}" class="more-text">${readMoreHtml.substring(340)}</span>
                            <button id="read-more-btn-${movie.imdbID}" class="read-more-btn" data-full="${movie.imdbID}">Read More</button>
                        </p>                           
                </div>  
             </div>      
            `
            }else movieWatchListHtml += `
                <div class="movie-display">    
                    <img class="movie-poster" src="${movie.Poster}" alt="N/A">
                    <div class="row-one"> 
                        <h3>${movie.Title}</h3>
                        <img class="star-icon" src="images/starIcon.png">              
                        <p class="movie-rating">${movie.imdbRating}</p>
                    </div>
                    <div class="row-two">  
                        <p class="movie-runtime">${movie.Runtime}</p>
                        <p class="movie-genre">${movie.Genre}</p>
                        <button class="remove-movie-watch" id="remove-${movie.imdbID}" data-remove="${movie.imdbID}">
                        <i class="fa-solid fa-minus"></i>
                        Remove
                        </button>
                    </div> 
                    <div class="row-three">     
                        <p class="movie-plot">${readMoreHtml}</p>
                    </div> 
                </div>
            `  
            })
            document.getElementById('watch-list').innerHTML += movieWatchListHtml
          }
    // Function read more   
      function readMore(textLength, textContent){
        let readMoreUpdate = ""
        if(textLength > 380){
            readMoreUpdate = textContent
            return readMoreUpdate
            
        }else
        
        return textContent
    
    }

    // Read more Text
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
    //  Remove movie from watchlist

    function removeFromWatchList(removeID){    
        renderMovieWatchList = JSON.parse(localStorage.getItem("listOfMovies") || "[]")
        const movieToRemoveWatchList = renderMovieWatchList.findIndex(findMovieId =>{
           return findMovieId.imdbID === removeID
        })
        console.log(removeID)
        console.log(movieToRemoveWatchList)
        console.log(renderMovieWatchList)
        renderMovieWatchList.splice(movieToRemoveWatchList, 1)
        document.getElementById('watch-list').innerHTML = ""
        const updatedWatchListRender = JSON.stringify(renderMovieWatchList)
        localStorage.setItem("listOfMovies", updatedWatchListRender)
        populateList()
    }

      populateList()