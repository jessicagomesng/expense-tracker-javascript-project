
// const BASE_URL = "http://localhost:3000"
// const BUDGETS_URL = `${BASE_URL}/budgets`

// document.addEventListener('DOMContentLoaded', function(event) {
//     let logIn = document.getElementsByClassName('signup-form')[0]
//     let input = document.getElementsByTagName('input')
//     let container = document.getElementsByClassName('container')[0]
//     let loggedIn = null;
//     // let formData = new FormData();
//     // formData.append(input[0].name, input[0].value);
//     // formData.append(input[1].name, input[1].value);
//     // let formObject = {};
//     // formData.forEach((value, key) => formObject[key] = value);

//     logIn.addEventListener('submit', function(event) {
//         event.preventDefault();
//         let configObj = {
//             method: "POST",
//             headers: { 
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             }, 
//             body: JSON.stringify({ email: input[0].value })
//         }

//         fetch("http://localhost:3000/login", configObj) 
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function(object) {
//             loggedIn = object;
//             localStorage.loggedIn = object.id;
//             logIn.style.display = 'none';
//             renderLoggedInPage();
//             console.log(object);
//         })

        
//     })

//     function renderLoggedInPage() {
//         logIn.style.display = 'none';
//         fetch(`http://localhost:3000/users/${loggedIn.id}/budgets`)
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function(json) {
//             console.log(json);
//             createBudgets(json);
//         })
//     }

//     function createBudgets(budgets) {
//         // sort these by chronological date 
//         let main = document.getElementsByTagName('main')[0];
//         let addBudget = document.createElement('button')
//         addBudget.setAttribute('class', 'create-budget')
//         addBudget.innerText = 'Create Budget'
//         main.appendChild(addBudget);

//         function createBudgetForm() {
//             let form = document.createElement('form');
//             form.setAttribute('class', 'create-budget');

//             let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
//             let selectMonth = document.createElement('select');
//             selectMonth.id = 'select-month';

//             for (let i = 0; i < months.length; i++) {
//                 let option = document.createElement('option');
//                 option.value = months[i];
//                 option.innerText = months[i];
//                 selectMonth.appendChild(option);
//             }

//             let labelOne = document.createElement('label');
//             labelOne.innerText = "Savings Goal:"
//             let newSavingsGoal = document.createElement('input'); 
//             newSavingsGoal.setAttribute('type', 'text');
//             newSavingsGoal.name = 'savings_goal';
//             let labelTwo = document.createElement('label');
//             labelTwo.innerText = "Spending Goal:"
//             let newSpendingGoal = document.createElement('input');
//             newSpendingGoal.setAttribute('type', 'text');
//             newSpendingGoal.name = 'spending_goal';
//             let labelThree = document.createElement('label');
//             labelThree.innerText = 'Expected Income:'
//             let newExpectedIncome = document.createElement('input'); 
//             newExpectedIncome.setAttribute('type', 'text')
//             newExpectedIncome.name = 'expected_income';

//             let submitNewBudget = document.createElement('button');
//             submitNewBudget.innerText = 'Create';

//             form.appendChild(selectMonth);
//             form.appendChild(labelOne);
//             form.appendChild(newSavingsGoal);
//             form.appendChild(labelTwo);
//             form.appendChild(newSpendingGoal);
//             form.appendChild(labelThree);
//             form.appendChild(newExpectedIncome);
//             form.appendChild(submitNewBudget); 

//             form.addEventListener('submit', function(event) {
//                 event.preventDefault();
//                 let configObj = {
//                     method: "POST",
//                     headers: { 
//                         "Content-Type": "application/json",
//                         "Accept": "application/json"
//                     }, 
//                     body: JSON.stringify({ month: selectMonth.value, 
//                         savings_goal: newSavingsGoal.value, 
//                         spending_goal: newSpendingGoal.value, 
//                         expected_income: newExpectedIncome.value })
//                 }
        
//                 fetch(`http://localhost:3000/users/${loggedIn.id}/budgets`, configObj) 
//                 .then(function(response) {
//                     return response.json();
//                 })
//                 .then(function(object) {
//                     // move this later
//                     form.reset();
//                     console.log(object);
//                     renderBudget(object);
//                 })

//             })
//             container.appendChild(form);
//         }

//         addBudget.addEventListener('click', function(event) {
//             addBudget.style.display = 'none';
//             createBudgetForm();
//         })

//         for (const budget of budgets) {
//             renderBudget(budget);
//         }

//         function renderBudget(budget) {
//             let div = document.createElement('div');
//             // used this ID twice, check it over 
//             div.setAttribute('budget-data-id', budget.id);
//             main.appendChild(div);
//             let budgetTitle = document.createElement('h3');
//             budgetTitle.innerText = budget.name;
//             let budgetDates = document.createElement('h6');
//             budgetDates.innerText = displayDate(budget.start_date) + ' to ' + displayDate(budget.end_date);
//             let expectedIncome = document.createElement('h5'); 
//             expectedIncome.innerText = `Expected Income: ${budget.expected_income}`;
//             let spendingGoal = document.createElement('h5'); 
//             spendingGoal.innerText = `Spending Goal: ${budget.spending_goal}`;
//             let savingsGoal = document.createElement('h5'); 
//             savingsGoal.innerText = `Savings Goal: ${budget.savings_goal}`;

//             let deleteBudget = document.createElement('button');
//             deleteBudget.innerText = 'delete'; 
//             deleteBudget.setAttribute('class', 'delete-budget');
//             deleteBudget.addEventListener('click', function(e) {
//                 e.preventDefault();

//                 let configObj = {
//                     method: "DELETE",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Accept": "application/json"
//                     },
//                     body: JSON.stringify( { id: budget.id })
//                 }

//                 fetch(`http://localhost:3000/users/${loggedIn}/budgets/${budget.id}`, configObj) 
//                 .then(function(response) {
//                     return response.json();
//                 })
//                 .then(function(object) {
//                     let budgetToDelete = document.querySelectorAll(`[budget-data-id='${budget.id}']`)[0]
//                     budgetToDelete.remove();
//                     console.log(object);
//                 })
//             })
//             let displayTransactions = document.createElement('button');
//             displayTransactions.innerText = 'show';
//             displayTransactions.setAttribute('class', 'display-transactions')
//             displayTransactions.addEventListener('click', function(event) {
//                 // change button to hide and hide the form
//                 event.preventDefault();
//                 fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions`)
//                 .then(function(response) {
//                     return response.json();
//                 })
//                 .then(function(object) {
//                     console.log(object);
//                     // create table
//                     let headers = ['date', 'description', 'amount', 'edit', 'delete'];
//                     let table = document.createElement('table');
//                     let rowHeaders = document.createElement('tr');

//                     for (const header of headers) {
//                         let head = document.createElement('th');
//                         head.innerText = header;
//                         rowHeaders.appendChild(head);
//                     }
//                     table.appendChild(rowHeaders);

//                     function createTransaction(transaction) {
//                         let newRow = document.createElement('tr');
//                         newRow.setAttribute('transaction-data-id', `${transaction.id}`)
//                         let date = document.createElement('td');
//                         let amount = document.createElement('td');
//                         let description = document.createElement('td');
//                         let editCell = document.createElement('td');
//                         let editTrans = document.createElement('button');
//                         let deleteCell = document.createElement('td');
//                         let deleteTrans = document.createElement('button');
            
//                         editTrans.innerText = 'edit';

//                         editTrans.addEventListener('click', function(event) {
//                             event.preventDefault();
//                             let rowToDelete = document.querySelectorAll(`[transaction-data-id='${transaction.id}']`)[0]
//                             rowToDelete.remove();
//                             // replace this row with a form 
//                         })
//                         deleteTrans.innerText = 'delete';
//                         deleteTrans.addEventListener('click', function(event) {
//                             event.preventDefault();
//                             let configObj = {
//                                 method: "DELETE", 
//                                 headers: { 
//                                     "Content-Type": "application/json", 
//                                     "Accept": "application/json"
//                                 },
//                                 body: JSON.stringify( {transaction_id: transaction.id})
//                             }
//                             fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions/${transaction.id}`, configObj)
//                             .then(function(response) {
//                                 return response.json();
//                             })
//                             .then(function(object) {
//                                 let rowToDelete = document.querySelectorAll(`[transaction-data-id='${transaction.id}']`)[0]
//                                 rowToDelete.remove();
//                                 console.log(object);
//                             })
//                         })
//                         editCell.appendChild(editTrans);
//                         deleteCell.appendChild(deleteTrans);
//                         date.innerText = displayDate(transaction.date);
//                         amount.innerText = transaction.price;
//                         description.innerText = transaction.description;
            
//                         newRow.appendChild(date);
//                         // figure out how to display this to float 2 
//                         newRow.appendChild(description);
//                         newRow.appendChild(amount); 
//                         // create row for total 
//                         newRow.appendChild(editCell);
//                         newRow.appendChild(deleteCell);
//                         table.appendChild(newRow);
//                     }

//                     // create form for new entry in table format 

//                     let newTransaction = document.createElement('form');
//                     let dateInput = document.createElement('input');
//                     dateInput.setAttribute('type', 'date');
//                     dateInput.setAttribute('min', `${budget.start_date}` )
//                     dateInput.setAttribute('max', `${budget.end_date}` )
//                     dateInput.name = 'date';
//                     // put max/min on date so it has to be within the month and no greater than today
//                     let amountInput = document.createElement('input');
//                     amountInput.setAttribute('type', 'number');
//                     amountInput.setAttribute('step', '.01');
//                     // dont let this be text
//                     amountInput.setAttribute('placeholder', 'amount');
//                     let descInput = document.createElement('input');
//                     descInput.setAttribute('type', 'text');
//                     descInput.setAttribute('placeholder', 'description');
//                     let submit = document.createElement('input');
//                     submit.setAttribute('type', 'submit');
//                     submit.innerText = 'log transaction';
//                     submit.addEventListener('click', function(event) {
//                         event.preventDefault();
//                         let configObj = {
//                             method: "POST", 
//                             headers: {
//                                 "Content-Type": "application/json", 
//                                 "Accept": "application/json"
//                             },
//                             body: JSON.stringify( { date: dateInput.value, price: amountInput.value, description: descInput.value })
//                         }
//                         fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions`, configObj)
//                         .then(function(response) {
//                             return response.json();
//                         })
//                         .then(function(object) {
//                             createTransaction(object);
//                             console.log(object);
//                         })
//                     })
//                     newTransaction.appendChild(dateInput);
//                     newTransaction.appendChild(amountInput);
//                     newTransaction.appendChild(descInput);
//                     newTransaction.appendChild(submit);

//                     div.appendChild(table);
//                     div.appendChild(newTransaction);

//                     // let newFormTable = document.createElement('table');
//                     // let formRow = document.createElement('tr');
//                     // let enterDate = document.createElement('td');
//                     // let enterAmount = document.createElement('td');
//                     // let enterDesc = document.createElement('td');
//                     // let submitCell = document.createElement('td')

//                     // let dateInput = document.createElement('input');
//                     // dateInput.setAttribute('type', 'date');
//                     // dateInput.name = 'date';
//                     // enterDate.appendChild(dateInput);

//                     // let amountInput = document.createElement('input');
//                     // amountInput.setAttribute('type', 'number');
//                     // amountInput.setAttribute('step', '.01');
//                     // amountInput.setAttribute('placeholder', 'amount');
//                     // enterAmount.appendChild(amountInput);

//                     // let descInput = document.createElement('input');
//                     // descInput.setAttribute('type', 'text');
//                     // descInput.setAttribute('placeholder', 'description');
//                     // enterDesc.appendChild(descInput);

//                     // let submit = document.createElement('input');
//                     // submit.setAttribute('type', 'submit');
//                     // submit.innerText = 'log transaction';
//                     // submitCell.appendChild(submit);

//                     // formRow.appendChild(enterDate);
//                     // formRow.appendChild(enterAmount);
//                     // formRow.appendChild(enterDesc);
//                     // formRow.appendChild(submitCell);

//                     // newFormTable.appendChild(formRow);
//                     // newTransaction.appendChild(newFormTable);


//                     // submit.addEventListener('click', function(event) {
//                     //     // let configObj = {
//                     //     //     method: "POST", 
//                     //     //     headers: {
//                     //     //         "Content-Type": "application/json", 
//                     //     //         "Accept": "application/json"
//                     //     //     },
//                     //     //     body: JSON.stringify( { date: dateInput.value, price: amountInput.value, description: descInput.value } )
//                     //     // }

//                     //     let configObj = {
//                     //         method: "POST", 
//                     //         headers: {
//                     //             "Content-Type": "application/json",
//                     //             "Accept": "application/json"
//                     //         },
//                     //         body: JSON.stringify( { date: dateInput.value })
//                     //     }

//                     //     fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions`, configObj)
//                     //     .then(function(response) {
//                     //         return response.json();
//                     //     })
//                     //     .then(function(object) {
//                     //         console.log(object);
//                     //     })
//                     // })
//                     //     fetch(`http://localhost:3000/users`, {
//                     //         method: "POST",
//                     //         headers: {
//                     //             'Content-Type': 'application/json', 
//                     //             'Accept': 'application/json'
//                     //         },
//                     //         body: JSON.stringify( { 
//                     //             date: dateInput.value, 
//                     //             price: amountInput.value,
//                     //             description: descInput.value,
//                     //         })
//                     //     })
//                     //     .then(function(response) {
//                     //         return response.json();
//                     //     })
//                     //     .then(function(object) {
//                     //         console.log(object);
//                     //     })
//                     // })

//                     // create an entry for each transaction
//                     for (const transaction of object) {
//                         // let newRow = document.createElement('tr');
//                         // let date = document.createElement('td')
//                         // let amount = document.createElement('td')
//                         // let description = document.createElement('td')

//                         // date.innerText = displayDate(transaction.date);
//                         // amount.innerText = transaction.price;
//                         // description.innerText = transaction.description;

//                         // newRow.appendChild(date);
//                         // newRow.appendChild(amount);
//                         // // figure out how to display this to float 2 
//                         // newRow.appendChild(description);
//                         // table.appendChild(newRow);
//                         createTransaction(transaction);
//                         console.log(transaction);
//                     }

//                 })
//                 // also new form at top to create new transaction

//             })
//             div.appendChild(budgetTitle);
//             div.appendChild(displayTransactions);
//             div.appendChild(deleteBudget);
//             div.appendChild(budgetDates);
//             div.appendChild(expectedIncome);
//             div.appendChild(spendingGoal);
//             div.appendChild(savingsGoal);
//         }
//     }

//     function displayDate(string) {
//         let dateArray = string.split('-').reverse();
//         return dateArray.join('-');
//     }
// })

// const BASE_URL = "http://localhost:3000"
// const BUDGETS_URL = `${BASE_URL}/budgets`

// document.addEventListener('DOMContentLoaded', function(event) {
//     let logIn = document.getElementsByClassName('signup-form')[0]
//     let input = document.getElementsByTagName('input')
//     let container = document.getElementsByClassName('container')[0]
//     let loggedIn = null;
//     // let formData = new FormData();
//     // formData.append(input[0].name, input[0].value);
//     // formData.append(input[1].name, input[1].value);
//     // let formObject = {};
//     // formData.forEach((value, key) => formObject[key] = value);

//     logIn.addEventListener('submit', function(event) {
//         event.preventDefault();
//         let configObj = {
//             method: "POST",
//             headers: { 
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             }, 
//             body: JSON.stringify({ email: input[0].value })
//         }

//         fetch("http://localhost:3000/login", configObj) 
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function(object) {
//             loggedIn = object;
//             localStorage.loggedIn = object.id;
//             logIn.style.display = 'none';
//             renderLoggedInPage();
//             console.log(object);
//         })

        
//     })

//     function renderLoggedInPage() {
//         logIn.style.display = 'none';
//         fetch(`http://localhost:3000/users/${loggedIn.id}/budgets`)
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function(json) {
//             console.log(json);
//             createBudgets(json);
//         })
//     }

//     function createBudgets(budgets) {
//         // sort these by chronological date 
//         let main = document.getElementsByTagName('main')[0];
//         let addBudget = document.createElement('button')
//         addBudget.setAttribute('class', 'create-budget')
//         addBudget.innerText = 'Create Budget'
//         main.appendChild(addBudget);

//         function createBudgetForm() {
//             let form = document.createElement('form');
//             form.setAttribute('class', 'create-budget');

//             let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
//             let selectMonth = document.createElement('select');
//             selectMonth.id = 'select-month';

//             for (let i = 0; i < months.length; i++) {
//                 let option = document.createElement('option');
//                 option.value = months[i];
//                 option.innerText = months[i];
//                 selectMonth.appendChild(option);
//             }

//             let labelOne = document.createElement('label');
//             labelOne.innerText = "Savings Goal:"
//             let newSavingsGoal = document.createElement('input'); 
//             newSavingsGoal.setAttribute('type', 'text');
//             newSavingsGoal.name = 'savings_goal';
//             let labelTwo = document.createElement('label');
//             labelTwo.innerText = "Spending Goal:"
//             let newSpendingGoal = document.createElement('input');
//             newSpendingGoal.setAttribute('type', 'text');
//             newSpendingGoal.name = 'spending_goal';
//             let labelThree = document.createElement('label');
//             labelThree.innerText = 'Expected Income:'
//             let newExpectedIncome = document.createElement('input'); 
//             newExpectedIncome.setAttribute('type', 'text')
//             newExpectedIncome.name = 'expected_income';

//             let submitNewBudget = document.createElement('button');
//             submitNewBudget.innerText = 'Create';

//             form.appendChild(selectMonth);
//             form.appendChild(labelOne);
//             form.appendChild(newSavingsGoal);
//             form.appendChild(labelTwo);
//             form.appendChild(newSpendingGoal);
//             form.appendChild(labelThree);
//             form.appendChild(newExpectedIncome);
//             form.appendChild(submitNewBudget); 

//             form.addEventListener('submit', function(event) {
//                 event.preventDefault();
//                 let configObj = {
//                     method: "POST",
//                     headers: { 
//                         "Content-Type": "application/json",
//                         "Accept": "application/json"
//                     }, 
//                     body: JSON.stringify({ month: selectMonth.value, 
//                         savings_goal: newSavingsGoal.value, 
//                         spending_goal: newSpendingGoal.value, 
//                         expected_income: newExpectedIncome.value })
//                 }
        
//                 fetch(`http://localhost:3000/users/${loggedIn.id}/budgets`, configObj) 
//                 .then(function(response) {
//                     return response.json();
//                 })
//                 .then(function(object) {
//                     // move this later
//                     form.reset();
//                     console.log(object);
//                     renderBudget(object);
//                 })

//             })
//             container.appendChild(form);
//         }

//         addBudget.addEventListener('click', function(event) {
//             addBudget.style.display = 'none';
//             createBudgetForm();
//         })

//         for (const budget of budgets) {
//             renderBudget(budget);
//         }

//         function renderBudget(budget) {
//             let div = document.createElement('div');
//             // used this ID twice, check it over 
//             div.setAttribute('budget-data-id', budget.id);
//             main.appendChild(div);
//             let budgetTitle = document.createElement('h3');
//             budgetTitle.innerText = budget.name;
//             let budgetDates = document.createElement('h6');
//             budgetDates.innerText = displayDate(budget.start_date) + ' to ' + displayDate(budget.end_date);
//             let expectedIncome = document.createElement('h5'); 
//             expectedIncome.innerText = `Expected Income: ${budget.expected_income}`;
//             let spendingGoal = document.createElement('h5'); 
//             spendingGoal.innerText = `Spending Goal: ${budget.spending_goal}`;
//             let savingsGoal = document.createElement('h5'); 
//             savingsGoal.innerText = `Savings Goal: ${budget.savings_goal}`;

//             let deleteBudget = document.createElement('button');
//             deleteBudget.innerText = 'delete'; 
//             deleteBudget.setAttribute('class', 'delete-budget');
//             deleteBudget.addEventListener('click', function(e) {
//                 e.preventDefault();

//                 let configObj = {
//                     method: "DELETE",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Accept": "application/json"
//                     },
//                     body: JSON.stringify( { id: budget.id })
//                 }

//                 fetch(`http://localhost:3000/users/${loggedIn}/budgets/${budget.id}`, configObj) 
//                 .then(function(response) {
//                     return response.json();
//                 })
//                 .then(function(object) {
//                     let budgetToDelete = document.querySelectorAll(`[budget-data-id='${budget.id}']`)[0]
//                     budgetToDelete.remove();
//                     console.log(object);
//                 })
//             })
//             let displayTransactions = document.createElement('button');
//             displayTransactions.innerText = 'show';
//             displayTransactions.setAttribute('class', 'display-transactions')
//             displayTransactions.addEventListener('click', function(event) {
//                 // change button to hide and hide the form
//                 event.preventDefault();
//                 fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions`)
//                 .then(function(response) {
//                     return response.json();
//                 })
//                 .then(function(object) {
//                     console.log(object);
//                     // create table
//                     let headers = ['date', 'description', 'amount', 'edit', 'delete'];
//                     let table = document.createElement('div');
//                     table.setAttribute('class', 'container');
//                     let horizontal = document.createElement('div');
//                     horizontal.setAttribute('id', 'row')
//                     let colOne = document.createElement('div');
//                     colOne.setAttribute('id', 'col-one');
//                     let colTwo = document.createElement('div');
//                     colTwo.setAttribute('id', 'col-two');
//                     let colThree = document.createElement('div');
//                     colThree.setAttribute('id', 'col-three');
//                     let colFour = document.createElement('div');
//                     colFour.setAttribute('id', 'col-four');
//                     let colFive = document.createElement('div');
//                     colFive.setAttribute('id', 'col-five');

//                     let dateHeader = document.createElement('h4');
//                     dateHeader.innerText = header[0];
//                     colOne.appendChild(dateHeader);
//                     let descHeader = document.createElement('h4');
//                     descHeader.innerText = header[1];
//                     colTwo.appendChild(descHeader);
//                     let amtHeader = document.createElement('h4');
//                     amtHeader.innerText = header[2];
//                     colThree.appendChild(amtHeader);
//                     let editHeader = document.createElement('h4');
//                     editHeader.innerText = header[3];
//                     colFour.appendChild(editHeader);
//                     let delHeader = document.createElement('h4');
//                     delHeader.innerText = header[4];
//                     colFive.appendChild(delHeader);

//                     table.appendChild(colOne);
//                     table.appendChild(colTwo);
//                     table.appendChild(colThree);
//                     table.appendChild(colFour);
//                     table.appendChild(colFive);
//                 })
//             })
//         }

//         function displayDate(string) {
//             let dateArray = string.split('-').reverse();
//             return dateArray.join('-');
//         }
//     }
// })

                    // function createTransaction(transaction) {
                    //     let newRow = document.createElement('tr');
                    //     newRow.setAttribute('transaction-data-id', `${transaction.id}`)
                    //     let date = document.createElement('td');
                    //     let amount = document.createElement('td');
                    //     let description = document.createElement('td');
                    //     let editCell = document.createElement('td');
                    //     let editTrans = document.createElement('button');
                    //     let deleteCell = document.createElement('td');
                    //     let deleteTrans = document.createElement('button');
            
                    //     editTrans.innerText = 'edit';

                    //     editTrans.addEventListener('click', function(event) {
                    //         event.preventDefault();
                    //         let rowToDelete = document.querySelectorAll(`[transaction-data-id='${transaction.id}']`)[0]
                    //         rowToDelete.remove();
                    //         // replace this row with a form 
                    //     })
                    //     deleteTrans.innerText = 'delete';
                    //     deleteTrans.addEventListener('click', function(event) {
                    //         event.preventDefault();
                    //         let configObj = {
                    //             method: "DELETE", 
                    //             headers: { 
                    //                 "Content-Type": "application/json", 
                    //                 "Accept": "application/json"
                    //             },
                    //             body: JSON.stringify( {transaction_id: transaction.id})
                    //         }
                    //         fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions/${transaction.id}`, configObj)
                    //         .then(function(response) {
                    //             return response.json();
                    //         })
                    //         .then(function(object) {
                    //             let rowToDelete = document.querySelectorAll(`[transaction-data-id='${transaction.id}']`)[0]
                    //             rowToDelete.remove();
                    //             console.log(object);
                    //         })
                    //     })
                    //     editCell.appendChild(editTrans);
                    //     deleteCell.appendChild(deleteTrans);
                    //     date.innerText = displayDate(transaction.date);
                    //     amount.innerText = transaction.price;
                    //     description.innerText = transaction.description;
            
                    //     newRow.appendChild(date);
                    //     // figure out how to display this to float 2 
                    //     newRow.appendChild(description);
                    //     newRow.appendChild(amount); 
                    //     // create row for total 
                    //     newRow.appendChild(editCell);
                    //     newRow.appendChild(deleteCell);
                    //     table.appendChild(newRow);
                    // }

                    // // create form for new entry in table format 

                    // let newTransaction = document.createElement('form');
                    // let dateInput = document.createElement('input');
                    // dateInput.setAttribute('type', 'date');
                    // dateInput.setAttribute('min', `${budget.start_date}` )
                    // dateInput.setAttribute('max', `${budget.end_date}` )
                    // dateInput.name = 'date';
                    // // put max/min on date so it has to be within the month and no greater than today
                    // let amountInput = document.createElement('input');
                    // amountInput.setAttribute('type', 'number');
                    // amountInput.setAttribute('step', '.01');
                    // // dont let this be text
                    // amountInput.setAttribute('placeholder', 'amount');
                    // let descInput = document.createElement('input');
                    // descInput.setAttribute('type', 'text');
                    // descInput.setAttribute('placeholder', 'description');
                    // let submit = document.createElement('input');
                    // submit.setAttribute('type', 'submit');
                    // submit.innerText = 'log transaction';
                    // submit.addEventListener('click', function(event) {
                    //     event.preventDefault();
                    //     let configObj = {
                    //         method: "POST", 
                    //         headers: {
                    //             "Content-Type": "application/json", 
                    //             "Accept": "application/json"
                    //         },
                    //         body: JSON.stringify( { date: dateInput.value, price: amountInput.value, description: descInput.value })
                    //     }
                    //     fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions`, configObj)
                    //     .then(function(response) {
                    //         return response.json();
                    //     })
                    //     .then(function(object) {
                    //         createTransaction(object);
                    //         console.log(object);
                    //     })
                    // })
                    // newTransaction.appendChild(dateInput);
                    // newTransaction.appendChild(amountInput);
                    // newTransaction.appendChild(descInput);
                    // newTransaction.appendChild(submit);

                    // div.appendChild(table);
                    // div.appendChild(newTransaction);

                    // let newFormTable = document.createElement('table');
                    // let formRow = document.createElement('tr');
                    // let enterDate = document.createElement('td');
                    // let enterAmount = document.createElement('td');
                    // let enterDesc = document.createElement('td');
                    // let submitCell = document.createElement('td')

                    // let dateInput = document.createElement('input');
                    // dateInput.setAttribute('type', 'date');
                    // dateInput.name = 'date';
                    // enterDate.appendChild(dateInput);

                    // let amountInput = document.createElement('input');
                    // amountInput.setAttribute('type', 'number');
                    // amountInput.setAttribute('step', '.01');
                    // amountInput.setAttribute('placeholder', 'amount');
                    // enterAmount.appendChild(amountInput);

                    // let descInput = document.createElement('input');
                    // descInput.setAttribute('type', 'text');
                    // descInput.setAttribute('placeholder', 'description');
                    // enterDesc.appendChild(descInput);

                    // let submit = document.createElement('input');
                    // submit.setAttribute('type', 'submit');
                    // submit.innerText = 'log transaction';
                    // submitCell.appendChild(submit);

                    // formRow.appendChild(enterDate);
                    // formRow.appendChild(enterAmount);
                    // formRow.appendChild(enterDesc);
                    // formRow.appendChild(submitCell);

                    // newFormTable.appendChild(formRow);
                    // newTransaction.appendChild(newFormTable);


                    // submit.addEventListener('click', function(event) {
                    //     // let configObj = {
                    //     //     method: "POST", 
                    //     //     headers: {
                    //     //         "Content-Type": "application/json", 
                    //     //         "Accept": "application/json"
                    //     //     },
                    //     //     body: JSON.stringify( { date: dateInput.value, price: amountInput.value, description: descInput.value } )
                    //     // }

                    //     let configObj = {
                    //         method: "POST", 
                    //         headers: {
                    //             "Content-Type": "application/json",
                    //             "Accept": "application/json"
                    //         },
                    //         body: JSON.stringify( { date: dateInput.value })
                    //     }

                    //     fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions`, configObj)
                    //     .then(function(response) {
                    //         return response.json();
                    //     })
                    //     .then(function(object) {
                    //         console.log(object);
                    //     })
                    // })
                    //     fetch(`http://localhost:3000/users`, {
                    //         method: "POST",
                    //         headers: {
                    //             'Content-Type': 'application/json', 
                    //             'Accept': 'application/json'
                    //         },
                    //         body: JSON.stringify( { 
                    //             date: dateInput.value, 
                    //             price: amountInput.value,
                    //             description: descInput.value,
                    //         })
                    //     })
                    //     .then(function(response) {
                    //         return response.json();
                    //     })
                    //     .then(function(object) {
                    //         console.log(object);
                    //     })
                    // })

                //     // create an entry for each transaction
                //     for (const transaction of object) {
                //         // let newRow = document.createElement('tr');
                //         // let date = document.createElement('td')
                //         // let amount = document.createElement('td')
                //         // let description = document.createElement('td')

                //         // date.innerText = displayDate(transaction.date);
                //         // amount.innerText = transaction.price;
                //         // description.innerText = transaction.description;

                //         // newRow.appendChild(date);
                //         // newRow.appendChild(amount);
                //         // // figure out how to display this to float 2 
                //         // newRow.appendChild(description);
                //         // table.appendChild(newRow);
                //         createTransaction(transaction);
                //         console.log(transaction);
                //     }

                // })
                // also new form at top to create new transaction

        //     })
        //     div.appendChild(budgetTitle);
        //     div.appendChild(displayTransactions);
        //     div.appendChild(deleteBudget);
        //     div.appendChild(budgetDates);
        //     div.appendChild(expectedIncome);
        //     div.appendChild(spendingGoal);
        //     div.appendChild(savingsGoal);
        // }
    // }

// })
