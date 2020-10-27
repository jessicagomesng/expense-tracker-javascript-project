const BASE_URL = "http://localhost:3000"
const BUDGETS_URL = `${BASE_URL}/budgets`

document.addEventListener('DOMContentLoaded', function(event) {
    let logIn = document.getElementsByClassName('signup-form')[0]
    let input = document.getElementsByTagName('input')
    let container = document.getElementsByClassName('container')[0]
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
            logIn.style.display = 'none';
            renderLoggedInPage();
            console.log(object);
        })

        
    })

    function renderLoggedInPage() {
        logIn.style.display = 'none';
        fetch(`http://localhost:3000/users/${loggedIn.id}/budgets`)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            console.log(json);
            createBudgets(json);
        })
    }

    function createBudgets(budgets) {
        let main = document.getElementsByTagName('main')[0];
        let addBudget = document.createElement('button')
        addBudget.setAttribute('class', 'create-budget')
        addBudget.innerText = 'Create Budget'
        main.appendChild(addBudget);

        function createBudgetForm() {
            let form = document.createElement('form');
            form.setAttribute('class', 'create-budget');

            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            let selectMonth = document.createElement('select');
            selectMonth.id = 'select-month';

            for (let i = 0; i < months.length; i++) {
                let option = document.createElement('option');
                option.value = months[i];
                option.innerText = months[i];
                selectMonth.appendChild(option);
            }

            let labelOne = document.createElement('label');
            labelOne.innerText = "Savings Goal:"
            let newSavingsGoal = document.createElement('input'); 
            newSavingsGoal.setAttribute('type', 'text');
            newSavingsGoal.name = 'savings_goal';
            let labelTwo = document.createElement('label');
            labelTwo.innerText = "Spending Goal:"
            let newSpendingGoal = document.createElement('input');
            newSpendingGoal.setAttribute('type', 'text');
            newSpendingGoal.name = 'spending_goal';
            let labelThree = document.createElement('label');
            labelThree.innerText = 'Expected Income:'
            let newExpectedIncome = document.createElement('input'); 
            newExpectedIncome.setAttribute('type', 'text')
            newExpectedIncome.name = 'expected_income';

            let submitNewBudget = document.createElement('button');
            submitNewBudget.innerText = 'Create';

            form.appendChild(selectMonth);
            form.appendChild(labelOne);
            form.appendChild(newSavingsGoal);
            form.appendChild(labelTwo);
            form.appendChild(newSpendingGoal);
            form.appendChild(labelThree);
            form.appendChild(newExpectedIncome);
            form.appendChild(submitNewBudget); 

            form.addEventListener('submit', function(event) {
                event.preventDefault();
                let configObj = {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }, 
                    body: JSON.stringify({ month: selectMonth.value, 
                        savings_goal: newSavingsGoal.value, 
                        spending_goal: newSpendingGoal.value, 
                        expected_income: newExpectedIncome.value })
                }
        
                fetch(`http://localhost:3000/users/${loggedIn.id}/budgets`, configObj) 
                .then(function(response) {
                    return response.json();
                })
                .then(function(object) {
                    // loggedIn = object;
                    // localStorage.loggedIn = object.id;
                    // logIn.style.display = 'none';
                    // renderLoggedInPage();
                    // console.log(object);
                })

            })
            container.appendChild(form);
        }

        addBudget.addEventListener('click', function(event) {
            addBudget.style.display = 'none';
            createBudgetForm();
        })

        for (const budget of budgets) {
            let div = document.createElement('div');
            div.setAttribute('data-id', budget.id);
            main.appendChild(div);
            let budgetTitle = document.createElement('h3');
            budgetTitle.innerText = budget.name;
            let budgetDates = document.createElement('h6');
            budgetDates.innerText = displayDate(budget.start_date) + ' to ' + displayDate(budget.end_date);
            let expectedIncome = document.createElement('h5'); 
            expectedIncome.innerText = `Expected Income: ${budget.expected_income}`;
            let spendingGoal = document.createElement('h5'); 
            spendingGoal.innerText = `Spending Goal: ${budget.spending_goal}`;
            let savingsGoal = document.createElement('h5'); 
            savingsGoal.innerText = `Savings Goal: ${budget.savings_goal}`;
            div.appendChild(budgetTitle);
            div.appendChild(budgetDates);
            div.appendChild(expectedIncome);
            div.appendChild(spendingGoal);
            div.appendChild(savingsGoal);
        }

    }

    function displayDate(string) {
        let dateArray = string.split('-').reverse();
        return dateArray.join('-');
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