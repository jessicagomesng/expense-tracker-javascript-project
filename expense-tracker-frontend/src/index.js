const BASE_URL = "http://localhost:3000"
const BUDGETS_URL = `${BASE_URL}/budgets`

document.addEventListener('DOMContentLoaded', function(event) {
    let logIn = document.getElementsByClassName('signup-form')[0]
    let input = document.getElementsByTagName('input')
    let loggedIn = null;
    // let formData = new FormData();
    // formData.append(input[0].name, input[0].value);
    // formData.append(input[1].name, input[1].value);
    // let formObject = {};
    // formData.forEach((value, key) => formObject[key] = value);

    logIn.addEventListener('submit', function(event) {
        event.preventDefault();
        let configObj = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            }, 
            body: JSON.stringify({ username: input[0].value, email: input[1].value })
        }

        fetch("http://localhost:3000/login", configObj) 
        .then(function(response) {
            return response.json();
        })
        .then(function(object) {
            loggedIn = object;
            localStorage.loggedIn = object.id;
            console.log(object);
            console.log(localStorage.loggedIn)
        })

        
    })

    function renderLoggedInPage() {
    }
})


        //             addPoke.addEventListener('click', function(e) {
//                 let configObj = {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Accept": "application/json"
//                     },
//                     body: JSON.stringify({trainer_id: `${trainer.id}`})
//                 }
//                 fetch("http://localhost:3000/pokemons", configObj)
//                 .then(function(response) {
//                     return response.json();
//                 })
//                 .then(function(object) {
//                     createPokemon(object);
//                 })
//             })
//     }
// })
//     // first, I need to fetch all of the trainers from localhost:3000/trainers
//     fetch("http://localhost:3000/trainers")
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(json) {
//         console.log(json[0].pokemons);
//         createTrainers(json);
//     })

//     function createTrainers(trainers) {
//         let main = document.getElementsByTagName('main')[0]

//         for (const trainer of trainers) {
//             let div = document.createElement('div')
//             div.setAttribute('data-id', trainer.id)
//             main.appendChild(div)
//             let ul = document.createElement('ul')
//             div.appendChild(ul)
//             let addPoke = document.createElement('button')
//             addPoke.setAttribute('data-trainer-id', trainer.id)
//             addPoke.textContent = 'Add Pokemon'
//             ul.appendChild(addPoke)
//             addPoke.addEventListener('click', function(e) {
//                 let configObj = {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Accept": "application/json"
//                     },
//                     body: JSON.stringify({trainer_id: `${trainer.id}`})
//                 }
//                 fetch("http://localhost:3000/pokemons", configObj)
//                 .then(function(response) {
//                     return response.json();
//                 })
//                 .then(function(object) {
//                     createPokemon(object);
//                 })
//             })

//             for (const pokemon of trainer.pokemons) {
//                 createPokemon(pokemon)
//             }

//             function createPokemon(pokemon) {
//                 let li = document.createElement('li')
//                 li.textContent = `${pokemon.nickname} (${pokemon.species})`
//                 let releasePoke = document.createElement('button')
//                 releasePoke.setAttribute('class', 'release')
//                 releasePoke.setAttribute('data-pokemon-id', pokemon.id)
//                 releasePoke.addEventListener('click', function(event) {
//                     let configObj = {
//                         method: "DELETE", 
//                         headers: {
//                             "Content-Type": "application/json",
//                             "Accept": "application/json"
//                         },
//                         body: JSON.stringify({pokemon_id: `${pokemon.id}`})
//                     }

//                     fetch(`http://localhost:3000/pokemons/${pokemon.id}`, configObj)
//                     .then(function(response) {
//                         return response.json();
//                     })
//                     .then(function(object) {
//                         let btn = document.querySelectorAll(`[data-pokemon-id='${pokemon.id}']`)[0]
//                         let li = btn.parentElement
//                         li.remove();
//                         btn.remove();
//                     })
//                 })
//                 releasePoke.textContent = 'Release'
//                 li.appendChild(releasePoke)
//                 ul.appendChild(li)
//             }
//         }
//     }

// })