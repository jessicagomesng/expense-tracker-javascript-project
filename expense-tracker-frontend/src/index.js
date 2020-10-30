const BASE_URL = "http://localhost:3000"

document.addEventListener('DOMContentLoaded', function(event) {
    let logIn = document.getElementsByClassName('signup-form')[0];
    let input = document.getElementsByTagName('input');
    let main = document.getElementsByTagName('main');
    let container = document.getElementsByClassName('container')[0];
    let loggedIn = null;

    logIn.addEventListener('submit', function(event) {
        event.preventDefault();
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ email: input[0].value })
        }

        fetch('http://localhost:3000/login', configObj)
        .then(function(response) {
            return response.json();
        })
        .then(function(object) {
            loggedIn = object; 
            localStorage.loggedIn = object.id;
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
        .then(function(object) {
            console.log(object);
            listBudgets(object);
        })
    }

    function listBudgets(budgets) {
        // sort these by chronological date
        // render new budget form
        let addBudget = document.createElement('button')
        addBudget.setAttribute('class', 'create-budget button');
        addBudget.innerText = 'Create Budget';
        addBudget.addEventListener('click', function(event) {
            addBudget.style.display = 'none';
            createBudgetForm();
        })
        container.appendChild(addBudget);
        // render all budgets
        for (const budget of budgets) {
            renderBudget(budget);
        }
    }

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

        let savingsLabel = document.createElement('label');
        savingsLabel.innerText = 'Savings Goal:'
        let newSavingsGoal = document.createElement('input'); 
        newSavingsGoal.setAttribute('type', 'text');
        newSavingsGoal.name = 'savings_goal';
        let spendingLabel = document.createElement('label');
        spendingLabel.innerText = "Spending Goal:"
        let newSpendingGoal = document.createElement('input');
        newSpendingGoal.setAttribute('type', 'text');
        newSpendingGoal.name = 'spending_goal';
        let incomeLabel = document.createElement('label');
        incomeLabel.innerText = 'Expected Income:'
        let newExpectedIncome = document.createElement('input'); 
        newExpectedIncome.setAttribute('type', 'text')
        newExpectedIncome.name = 'expected_income';
        let submitBudget = document.createElement('button');
        submitBudget.setAttribute('class', 'button')
        submitBudget.innerText = 'Create';

        let formChildren = [selectMonth, savingsLabel, newSavingsGoal, spendingLabel, newSpendingGoal, incomeLabel, newExpectedIncome, submitBudget]

        for (const element of formChildren) {
            form.appendChild(element);
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            let configObj = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            }, 
            body: JSON.stringify({ 
                user_id: loggedIn.id,
                month: selectMonth.value, 
                savings_goal: newSavingsGoal.value, 
                spending_goal: newSpendingGoal.value, 
                expected_income: newExpectedIncome.value })
            }

            fetch(`http://localhost:3000/budgets`, configObj) 
            .then(function(response) {
                return response.json();
            })
            .then(function(object) {
                form.reset();
                console.log(object);
                renderBudget(object);
            })

        })
        container.appendChild(form);
    }

    function renderBudget(budget) {
        let div = document.createElement('div');
        div.setAttribute('budget-data-id', budget.id);
        let budgetTitle = document.createElement('h3');
        budgetTitle.setAttribute('class', 'item-one')
        budgetTitle.innerText = budget.name;
        let budgetDates = document.createElement('h6');
        budgetDates.innerText = displayDate(budget.start_date) + ' to ' + displayDate(budget.end_date);
        let expectedIncome = document.createElement('h5'); 
        expectedIncome.innerText = `Expected Income: ${budget.expected_income}`;
        let spendingGoal = document.createElement('h5'); 
        spendingGoal.innerText = `Spending Goal: ${budget.spending_goal}`;
        let savingsGoal = document.createElement('h5'); 
        savingsGoal.innerText = `Savings Goal: ${budget.savings_goal}`;
        let deleteBudget = document.createElement('button');
        deleteBudget.innerText = 'delete'; 
        deleteBudget.setAttribute('class', 'delete-budget button');
        deleteBudget.addEventListener('click', function(e) {
            e.preventDefault()
            let configObj = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify( { id: budget.id })
            }
            fetch(`http://localhost:3000/users/${loggedIn}/budgets/${budget.id}`, configObj) 
            .then(function(response) {
                return response.json();
            })
            .then(function(object) {
                let budgetToDelete = document.querySelectorAll(`[budget-data-id='${budget.id}']`)[0]
                budgetToDelete.remove();
                console.log(object);
            })
        })

        let displayTransactions = document.createElement('button');
        displayTransactions.innerText = 'show';
        displayTransactions.setAttribute('class', 'display-transactions button');
        displayTransactions.addEventListener('click', function(event) {
            event.preventDefault();
            fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions`)
            .then(function(response) {
                return response.json();
            })
            .then(function(object) {
                console.log(object);
                renderTransactions(budget, object);
                // create table w transactions here. Create form & render transactions.
            })
        })
        let budgetHeader = document.createElement('div');
        budgetHeader.setAttribute('class', 'budget-header');
        budgetHeader.appendChild(budgetTitle);
        budgetHeader.appendChild(deleteBudget);
        budgetHeader.appendChild(displayTransactions);

        let budgetEntries = [budgetHeader, budgetDates, expectedIncome, spendingGoal, savingsGoal]

        for (const entry of budgetEntries) {
            div.appendChild(entry);
        }


        container.appendChild(div);
    }

    function renderTransactions(budget, transactions) {
        // create transaction table -- shall I move this elsewhere?
        let headers = ['date', 'description', 'amount', 'edit', 'delete'];
        let table = document.createElement('div');
        table.setAttribute('class', 'transactions-container');
        let horizontal = document.createElement('div');
        horizontal.setAttribute('class', 'row')
        let colOne = document.createElement('div');
        colOne.setAttribute('class', 'col-one');
        let colTwo = document.createElement('div');
        colTwo.setAttribute('class', 'col-two');
        let colThree = document.createElement('div');
        colThree.setAttribute('class', 'col-three');
        let colFour = document.createElement('div');
        colFour.setAttribute('class', 'col-four');
        let colFive = document.createElement('div');
        colFive.setAttribute('class', 'col-five');

        let dateHeader = document.createElement('h4');
        dateHeader.innerText = headers[0];
        colOne.appendChild(dateHeader);
        let descHeader = document.createElement('h4');
        descHeader.innerText = headers[1];
        colTwo.appendChild(descHeader);
        let amtHeader = document.createElement('h4');
        amtHeader.innerText = headers[2];
        colThree.appendChild(amtHeader);
        let editHeader = document.createElement('h4');
        editHeader.innerText = headers[3];
        colFour.appendChild(editHeader);
        let delHeader = document.createElement('h4');
        delHeader.innerText = headers[4];
        colFive.appendChild(delHeader);

        table.appendChild(horizontal);

        // create new transaction form here
        let newTransactionForm = document.createElement('form');
        newTransactionForm.setAttribute('class', 'new-transaction form')
        let dateInput = document.createElement('input');
        dateInput.setAttribute('type', 'date')
        dateInput.setAttribute('min', `${budget.start_date}`)
        dateInput.setAttribute('max', `${budget.end_date}`)
        dateInput.name = 'date';
        let amountInput = document.createElement('input');
        amountInput.setAttribute('type', 'number');
        amountInput.setAttribute('placeholder', 'amount');
        let descInput = document.createElement('input');
        descInput.setAttribute('type', 'text');
        descInput.setAttribute('placeholder', 'description');
        let submit = document.createElement('input');
        submit.setAttribute('type', 'submit');
        submit.setAttribute('value', 'log transaction');
        submit.addEventListener('click', function(event) {
            event.preventDefault();
            let configObj = {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                    "Accept": "application/json"
                },
                body: JSON.stringify( { date: dateInput.value, price: amountInput.value, description: descInput.value })
            }
            fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions`, configObj)
            .then(function(response) {
                return response.json();
            })
            .then(function(object) {
                renderTransaction(object);
                console.log(object);
            })
        })
                
        // create new row for form
        let formRow = document.createElement('div');
        formRow.setAttribute('class', 'new-transaction row')
        let formElements = [dateInput, amountInput, descInput, submit];
        for (const element of formElements) {
            newTransactionForm.appendChild(element);
        }
        // let rTcO = document.createElement('div');
        // rTcO.setAttribute('class', 'col-one');
        // rTcO.appendChild(formLabel);
        // let rTcT = document.createElement('div');
        // rTcT.setAttribute('class', 'col-two');
        // rTcT.appendChild(dateInput);
        // let rTcTh = document.createElement('div');
        // rTcTh.setAttribute('class', 'col-three');
        // rTcTh.appendChild(amountInput);
        // let rTcF = document.createElement('div');
        // rTcF.setAttribute('class', 'col-four');
        // rTcF.appendChild(descInput);
        // let rTcFi = document.createElement('div');
        // rTcFi.setAttribute('class', 'col-five');
        // rTcFi.appendChild(submit);

        // newTransactionForm.appendChild(rTcO);
        // newTransactionForm.appendChild(rTcT);
        // newTransactionForm.appendChild(rTcTh);
        // newTransactionForm.appendChild(rTcF);
        // newTransactionForm.appendChild(rTcFi);
        formRow.appendChild(newTransactionForm);

        table.appendChild(formRow);
        

        function renderTransaction(transaction) {
            let newRow = document.createElement('div');
            newRow.setAttribute('class', `transaction-${transaction.id} row`);
            let newColOne = document.createElement('div');
            newColOne.setAttribute('class', 'col-one');
            let newColTwo = document.createElement('div');
            newColTwo.setAttribute('class', 'col-two');
            let newColThree = document.createElement('div');
            newColThree.setAttribute('class', 'col-three');
            let newColFour = document.createElement('div');
            newColFour.setAttribute('class', 'col-four');
            let newColFive = document.createElement('div');
            newColFive.setAttribute('class', 'col-five');

            let renderDate = document.createElement('p');
            renderDate.innerText = displayDate(transaction.date);
            let renderDesc = document.createElement('p');
            renderDesc.innerText = transaction.description;
            let renderAmt = document.createElement('p');
            renderAmt.innerText = transaction.price;
            let renderEdit = document.createElement('button');
            renderEdit.setAttribute('class', 'button');
            renderEdit.innerText = 'X';
            renderEdit.addEventListener('click', function(event) {
                event.preventDefault();
                // create edit form
                let editTransactionForm = document.createElement('form');
                let editDate = document.createElement('input');
                editDate.setAttribute('type', 'date')
                editDate.setAttribute('min', `${budget.start_date}`)
                editDate.setAttribute('max', `${budget.end_date}`)
                editDate.name = 'date';
                editDate.value = transaction.date;
                let editAmt = document.createElement('input');
                editAmt.setAttribute('type', 'number');
                editAmt.setAttribute('placeholder', 'amount');
                editAmt.value = transaction.price;
                let editDesc = document.createElement('input');
                editDesc.setAttribute('type', 'text');
                editDesc.setAttribute('placeholder', 'description');
                editDesc.value = transaction.description;
                let submitEdit = document.createElement('input');
                submitEdit.setAttribute('class', 'button');
                submitEdit.setAttribute('type', 'submit');
                submitEdit.setAttribute('value', 'edit')
                submitEdit.addEventListener('click', function(event) {
                    event.preventDefault();
                    let configObj = {
                        method: "PATCH",
                        headers: { 
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify( { date: editDate.value, price: editAmt.value, description: editDesc.value })
                    }

                    fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions/${transaction.id}`, configObj)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(object) {
                        renderTransaction(object);
                        console.log(object);
                    })
                })
                editTransactionForm.appendChild(editDate);
                editTransactionForm.appendChild(editAmt);
                editTransactionForm.appendChild(editDesc);
                editTransactionForm.appendChild(submitEdit);
                newRow.innerHTML = '';
                newRow.appendChild(editTransactionForm);
                // let submit = document.createElement('input');
                // submit.setAttribute('type', 'submit');
                // submit.setAttribute('value', 'log transaction');
                // replace contents of newRow with edit form

                // let configObj = {
                //     method: "PATCH",
                //     headers: { 
                //         "Content-Type": "application/json",
                //         "Accept": "application/json"
                //     },
                //     body: JSON.stringify( {transaction_id: transaction.id })
                // }

                // fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions/${transaction.id}`, configObj)
                // .then(function(response) {
                //     response.json();
                // })
                // .then(function(object) {
                //     console.log(object);
                // })

            })
            let renderDelete = document.createElement('button');
            renderDelete.innerText = 'X';
            renderDelete.setAttribute('class', `button`)
            renderDelete.addEventListener('click', function(event) {
                event.preventDefault();
                let configObj = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json", 
                        "Accept": "application/json"
                    },
                    body: JSON.stringify( { transaction_id: transaction.id } )
                }
                fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions/${transaction.id}`, configObj)
                .then(function(response) {
                    return response.json();
                })
                .then(function(object) {
                    let rowToDelete =document.getElementsByClassName(`transaction-${object.id}`)[0];
                    rowToDelete.remove();
                })
            })

            newColOne.appendChild(renderDate);
            newColTwo.appendChild(renderDesc);
            newColThree.appendChild(renderAmt);
            newColFour.appendChild(renderEdit);
            newColFive.appendChild(renderDelete);

            let clmns = [newColOne, newColTwo, newColThree, newColFour, newColFive];

            for (let column of clmns) {
                newRow.appendChild(column);
            }

            table.appendChild(newRow);
        }

        let columns = [colOne, colTwo, colThree, colFour, colFive];
        for (const column of columns) {
            horizontal.appendChild(column);
        }

        for (const transaction of transactions) {
            renderTransaction(transaction);
        }
        let budgetDiv = document.querySelectorAll(`[budget-data-id='${budget.id}']`)[0]
        budgetDiv.appendChild(table);

    }

    function displayDate(string) {
        let dateArray = string.split('-').reverse();
        return dateArray.join('-');
    }
})

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
