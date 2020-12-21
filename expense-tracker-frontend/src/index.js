document.addEventListener('DOMContentLoaded', function(event) {
    let container = document.getElementsByClassName('container')[0];
    let currentColor = "green";

    function createSignInForm() {
        container.innerHTML += `<div class="sign-in">
        <form class="signup-form">
          <h2>Expense Tracker</h2>
            <div class='wrapper'>
            <label for="email">Sign In/Up Below:</label>
            <input type="text" id="email" name="email" placeholder="YOUR EMAIL HERE" /><br>
            <div class='centered-button'>
            <input type="submit" value="Sign In" class='button' /> 
            </div>
            </div>
        </form>
        </div>`

        let logIn = document.getElementsByClassName('sign-in')[0];
        let input = document.getElementsByTagName('input');

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

            if (input[0].value !== "") { 
                fetch('http://localhost:3000/login', configObj)
                .then(function(response) {
                    return response.json();
                })
                .then(function(object) {
                    loggedIn = object; 
                    localStorage.loggedIn = object.id;
                    renderLoggedInPage();
                })
                .catch(function(error) {
                    container.insertAdjacentHTML('beforebegin', `<p>Something went wrong. Please try again</p>`)
                })
            }
        })
            
    }

    createSignInForm();

    let header = document.getElementsByTagName('header')[0];
    let loggedIn = null;

    function setUpHeader() {
        let create = document.getElementsByClassName('create-budget');
        create = Array.from(create);
        let createBudgetDiv = create.find(node => node.nodeName === 'DIV')
        if (createBudgetDiv) {
            createBudgetDiv.innerHTML = '';
        } else {
            createBudgetDiv = document.createElement('div');
            createBudgetDiv.setAttribute('class', 'create-budget');
            createBudgetDiv.setAttribute('data-color', currentColor);
        }

        let divOne = document.createElement('div');
        divOne.setAttribute('class', 'create-and-sort');
        let addBudget = document.createElement('button');
        addBudget.setAttribute('class', 'create-budget button');
        addBudget.innerText = 'Create Budget';
        addBudget.addEventListener('click', function(event) {
            addBudget.style.display = 'none';
            renderBudgetForm();
        })
        let sortBudgets = document.createElement('button');
        sortBudgets.setAttribute('class', 'sort-budgets button');
        sortBudgets.innerText = 'Sort Budgets';
        sortBudgets.addEventListener('click', function(event) {
            event.preventDefault();
            renderLoggedInPage();
        })
        let viewStarred = document.createElement('button');
        viewStarred.setAttribute('class', 'view-starred button');
        viewStarred.innerText = 'Starred Budgets';
        viewStarred.addEventListener('click', function(event) {
            event.preventDefault();
            renderLoggedInPage(true);
        })

        let divTwo = document.createElement('div');
        let logOut = document.createElement('button');
        logOut.setAttribute('class', 'logout button');
        logOut.innerText = 'Log Out';
        logOut.addEventListener('click', function(event) {
            event.preventDefault();
            renderLoggedOutPage();
            loggedIn = null;
        })
        divOne.appendChild(addBudget);
        divOne.appendChild(sortBudgets);
        divOne.appendChild(viewStarred);
        divTwo.appendChild(logOut);
        createBudgetDiv.appendChild(divOne);
        createBudgetDiv.appendChild(divTwo);
        container.prepend(createBudgetDiv);
    }

    class Budget {
        constructor(budgetAttributes) {
            this.id = budgetAttributes.id;
            this.name = budgetAttributes.name;
            this.start_date = budgetAttributes.start_date;
            this.end_date = budgetAttributes.end_date;
            this.expected_income = budgetAttributes.expected_income,
            this.savings_goal = budgetAttributes.savings_goal,
            this.spending_goal = budgetAttributes.spending_goal 
            this.user_id = budgetAttributes.user_id
            this.starred = budgetAttributes.starred;
        }

        render() {
            container.insertAdjacentHTML('beforeend', `
            <div budget-data-id="${this.id}" data-color="${currentColor}">
                <div class="budget-header" data-color="${currentColor}">
                    <h3 class="transaction-title">${this.name}</h3>
                    <div class="buttons">
                        <button budget-data-id="${this.id}" class="edit-budget button">edit budget</button>
                        <button budget-data-id="${this.id}" class="delete-budget button">delete budget</button>
                        <button budget-data-id="${this.id}" class="star-budget button">☆</button>
                    </div>
                </div>
                <div class="dates-header">
                    <h6>${displayDate(this.start_date)} to ${displayDate(this.end_date)}</h6>
                </div>
                <div budget-data-id="${this.id}" class="budget-content">
                    <h5>Expected Income: ${this.expected_income}</h5>
                    <h5>Spending Goal: ${this.spending_goal}</h5>
                    <h5>Savings Goal: ${this.savings_goal}</h5>
                </div>
                <div class="budget-footer">
                    <button budget-data-id="${this.id}" class="display-transactions button">Display transactions</button>
                </div>
            </div>`)

            let divs = document.querySelectorAll(`[budget-data-id="${this.id}"]`)
            divs = Array.from(divs);

            let deleteBudget = divs.find(node => node.className === 'delete-budget button');
            let editBudget = divs.find(node => node.className === "edit-budget button");
            let budgetContent = divs.find(node => node.className === 'budget-content');
            let starBudget = divs.find(node => node.className === 'star-budget button');

            this.starred ? starBudget.innerText = "★" : starBudget.innerText = "☆"

            starBudget.addEventListener('click', (event) => {
                event.preventDefault();
                this.starred = !this.starred;
                let configObj = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify( { starred: this.starred, user_id: this.user_id, id: this.id } )
                }
                console.log(this.starred)
                fetch(`http://localhost:3000/users/${this.user_id}/budgets/${this.id}}`, configObj)
                .then((response) => response.json())
                .then((object) => {
                    object.starred ? starBudget.innerText = "★" : starBudget.innerText = "☆"
                    console.log(object)
                });
            })

            function removeBudget(event) {
                event.preventDefault();
                let configObj = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json", 
                        "Accept": "application/json"
                    },
                    body: JSON.stringify( { id: this.id } )
                }
                fetch(`http://localhost:3000/users/${this.user_id}/budgets/${this.id}}`, configObj)
                .then(function(response) {
                    return response.json();
                })
                .then(function(object) {
                    let budgetToDelete = document.querySelectorAll(`[budget-data-id="${object.id}"]`)[0];
                    budgetToDelete.remove();
                })
            }

            deleteBudget.addEventListener("click", removeBudget.bind(this));

            function renderEditBudgetForm(event) {
                event.preventDefault();
                let oldBudget = budgetContent.innerHTML
                budgetContent.innerHTML = '';
                let cancel = document.createElement('button');
                cancel.innerText = "X";
                cancel.setAttribute('class', 'button');
                editBudget.replaceWith(cancel);

                budgetContent.innerHTML += `<form class="edit-budget" budget-data-id="${this.id}">
                    <label>Expected Income:</label>
                    <input type="text" name="savings_goal" value="${this.expected_income}" budget-data-id="${this.id}" required /><br>
                    <label>Spending Goal:</label>
                    <input type="text" name="spending_goal" value="${this.spending_goal}" budget-data-id="${this.id}" required /><br>
                    <label>Savings Goal:</label>
                    <input type="text" name="savings_goal" value="${this.savings_goal}" budget-data-id="${this.id}" required /><br>
                    <button class="submit-edit button" budget-data-id="${this.id}">Edit Budget</button>
                </form>`

                divs = document.querySelectorAll(`[budget-data-id="${this.id}"]`)
                divs = Array.from(divs);
                let form = divs.find(node => node.className === 'edit-budget');
                let submit = divs.find(node => node.className === 'submit-edit button');
                let inputs = divs.filter(node => node.nodeName === 'INPUT');

                function submitBudgetEdit(event) {
                    event.preventDefault();
                    let configObj = {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json", 
                            "Accept": "application/json"
                        },
                        body: JSON.stringify( {
                            expected_income: inputs[0].value,
                            spending_goal: inputs[1].value, 
                            savings_goal: inputs[2].value
                        })
                    }
                    fetch(`http://localhost:3000/users/${this.user_id}/budgets/${this.id}`, configObj)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(object) {
                        if (object.errors) {
                            let ul = document.createElement('ul');
                            object.errors.map( (error) => { 
                                let li = document.createElement('li');
                                li.innerText = error;
                                ul.appendChild(li);
                            } )
                            form.prepend(ul)
                        } else { 
                            budgetContent.innerHTML = '';
                            budgetContent.innerHTML += `<h5>Expected Income: ${object.expected_income}</h5>
                            <h5>Spending Goal: ${object.spending_goal}</h5>
                            <h5>Savings Goal: ${object.savings_goal}</h5>`
                            cancel.replaceWith(editBudget);
                        }
                    })
                }

                submit.addEventListener("click", submitBudgetEdit.bind(this));

                function cancelBudgetEdit(event) {
                    event.preventDefault();
                    budgetContent.innerHTML = '';
                    budgetContent.innerHTML += oldBudget;
                    cancel.replaceWith(editBudget);
                }

                cancel.addEventListener("click", cancelBudgetEdit)
            }

            editBudget.addEventListener("click", renderEditBudgetForm.bind(this));
        }
    }

    class TransactionsDiv {
        constructor(budget_id) {
            this.budget_id = budget_id
        }
    
        render() {
            let div = document.querySelectorAll(`[budget-data-id="${this.budget_id}"]`)[0]
            div.insertAdjacentHTML("beforeend", `<div budget-data-id="${this.budget_id}" class="transactions-container" data-color="${currentColor}">
                <div class="transactions-header row">
                    <div class="col-one">
                        <h5 budget-data-id="${this.budget_id}">date</h5>
                    </div>
                    <div class="col-two">
                        <h5 budget-data-id="${this.budget_id}">description</h5>
                    </div>
                    <div class="col-three">
                        <h5 budget-data-id="${this.budget_id}">amount</h5>
                    </div>
                    <div class="col-four">
                        <h5 budget-data-id="${this.budget_id}">edit</h5>
                    </div>
                    <div class="col-five">
                        <h5 budget-data-id="${this.budget_id}">delete</h5>
                    </div>
                </div>
            </div>`)

            function dateFunction(event) { 
                event.preventDefault();
                sortByDate(this.budget_id);
            }
            function descFunction(event) { 
                event.preventDefault();
                sortByDescription(this.budget_id);
            }
            function amtFunction(event) {
                event.preventDefault();
                sortByAmount(this.budget_id);
            }

            let headers = Array.from(document.querySelectorAll(`[budget-data-id="${this.budget_id}"]`))
            headers = headers.filter(node => node.nodeName === "H5");
            headers[0].addEventListener("click", dateFunction.bind(this));
            headers[1].addEventListener("click", descFunction.bind(this));
            headers[2].addEventListener("click", amtFunction.bind(this));
        }
    }

    class Transaction {
        constructor(transaction_id, budget_id, date, description, amount, user_id) {
            this.id = transaction_id
            this.budget_id = budget_id
            this.date = date 
            this.description = description
            this.amount = amount
            this.user_id = user_id
        }
    
        render() {
            let divs = document.querySelectorAll(`[budget-data-id="${this.budget_id}"]`)
            divs = Array.from(divs);
            let table = divs.find(node => node.className === 'transactions-container');

            table.insertAdjacentHTML("beforeend", 
            `<div transaction-data-id="${this.id}" class="row">
            <div class="col-one">
                <p budget-data-id="${this.budget_id}" class="date">${displayDate(this.date)}</p>
            </div>
            <div class="col-two">
                <p budget-data-id="${this.budget_id}" class="description">${this.description}</p>
            </div>
            <div class="col-three">
                <p budget-data-id="${this.budget_id}" class="amount">${this.amount}</p>
            </div>
            <div class="col-four">
                <button transaction-data-id="${this.id}" class="edit-transaction button">X</button>
            </div>
            <div class="col-five">
                <button transaction-data-id="${this.id}" class="delete-transaction button">X</button>
            </div>
            </div>`)

            let transactionElements = Array.from(document.querySelectorAll(`[transaction-data-id="${this.id}"]`))
            let editTransaction = transactionElements.find(node => node.className === "edit-transaction button")
            let deleteTransaction = transactionElements.find(node => node.className === "delete-transaction button")
            let row = transactionElements.find(node => node.className === 'row');

            function renderEditTForm(event) {
                event.preventDefault();

                table.insertAdjacentHTML("afterend", 
                `<form transaction-data-id="${this.id}" class="edit-transaction">
                    <div><label>${displayDate(this.date)}</label></div>
                    <input transaction-data-id="${this.id}" type="number" value="${this.amount}" placeholder="amount" required />
                    <input transaction-data-id="${this.id}" type="text" value="${this.description}" placeholder="description" required />
                    <input transaction-data-id="${this.id}" type="submit" class="submit-edit button" value="edit">
                    <button transaction-data-id="${this.id}" class="cancel-edit button">cancel</button>
                </form>`)

                let els = Array.from(document.querySelectorAll(`[transaction-data-id="${this.id}"]`));
                let form = els.find(node => node.className === "edit-transaction");
                let inputs = els.filter(node => node.nodeName === "INPUT");
                let submit = els.find(node => node.className === 'submit-edit button');
                let cancel = els.find(node => node.className === 'cancel-edit button')

                function submitEditT(event) {
                    event.preventDefault();
                    let configObj = {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify( { price: inputs[0].value, description: inputs[1].value } )
                    }
                    fetch(`http://localhost:3000/users/${this.user_id}/budgets/${this.budget_id}/transactions/${this.id}`, configObj)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(object) {
                        if (object.errors) {
                            let ul = document.createElement('ul');
                            object.errors.map( (error) => {
                                let li = document.createElement('li');
                                li.innerText = error;
                                ul.appendChild(li);
                            })
                            form.appendChild(ul);
                        } else {
                            form.remove();
                            row.remove();
                            let newT = new Transaction(object.id, object.budget_id, object.date, object.description, object.price);
                            newT.render();
                            renderTotal(object.budget_id);
                        }
                    })
                }

                submit.addEventListener("click", submitEditT.bind(this));

                function cancelEditT(event) {
                    event.preventDefault();
                    form.remove();
                }

                cancel.addEventListener("click", cancelEditT.bind(this));
            }

            editTransaction.addEventListener("click", renderEditTForm.bind(this))

            function deleteT(event) {
                event.preventDefault();
                let configObj = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify( { transaction_id: this.id } ) 
                }
                fetch(`http://localhost:3000/users/${this.user_id}/budgets/${this.budget_id}/transactions/${this.id}`, configObj)
                .then(function(response) {
                    return response.json();
                })
                .then(function(object) {
                    let rowToDelete = document.querySelectorAll(`[transaction-data-id="${object.id}"]`)[0]
                    rowToDelete.remove();
                    renderTotal(object.budget_id);
                })
            }

            deleteTransaction.addEventListener("click", deleteT.bind(this))
        }
    }

    function customisePage() {
        header.insertAdjacentHTML("afterbegin", 
        `<div class="customise"><p>CUSTOMISE THEME: 
        <img src="./assets/images/mint.jpg" alt="pastel green" id="mint">
        <img src="./assets/images/clementine.jpg" alt="pastel orange" id="clementine">
        <img src="./assets/images/lilac.jpg" alt="pastel purple" id="lilac">
        <img src="./assets/images/salmon.jpg" alt="pastel red" id="salmon"></p></div>`)

        let mint = document.getElementById("mint");
        let clementine = document.getElementById("clementine");
        let lilac = document.getElementById("lilac");
        let salmon = document.getElementById("salmon");

        mint.addEventListener("click", function(event) {
            event.preventDefault();
            let elements = document.querySelectorAll('[data-color]');
            for (const e of elements) {
                e.setAttribute("data-color", "green")
            }
        })

        clementine.addEventListener("click", function(event) {
            event.preventDefault();
            currentColor = "orange";
            let elements = document.querySelectorAll('[data-color]');
            for (const e of elements) {
                e.setAttribute("data-color", "orange")
            }
        })

        lilac.addEventListener("click", function(event) {
            event.preventDefault();
            currentColor = "lilac";
            let elements = document.querySelectorAll('[data-color]');
            for (const e of elements) {
                e.setAttribute("data-color", "lilac")
            }
        })

        salmon.addEventListener("click", function(event) {
            event.preventDefault();
            currentColor = "salmon";
            let elements = document.querySelectorAll('[data-color]');
            for (const e of elements) {
                e.setAttribute("data-color", "salmon")
            }
        })
        
    }

    function renderLoggedInPage(starred = false) {
        container.innerHTML = '';
        let customise = document.getElementsByClassName('customise')[0];
        if (customise) {
            customise.remove();
        }
        customisePage();
        header.style.visibility = 'visible';
        setUpHeader();
        fetch(`http://localhost:3000/users/${loggedIn.id}/budgets`) 
        .then(function(response) {
            return response.json();
        })
        .then(function(object) {
            if (starred) {
                let starredBudgets = object.filter((budget) => budget.starred)
                listBudgets(starredBudgets);
            } else {
                listBudgets(object);
            }
        })
    }

    function renderLoggedOutPage() {
        container.innerHTML = '';
        createSignInForm();
        header.style.visibility = 'hidden';
    }

    function listTransactions(budget) {
        let elements = Array.from(document.querySelectorAll(`[budget-data-id="${budget.id}"]`))
        let displayT = elements.find(node => node.className === 'display-transactions button')
        let hideT = document.createElement('button');
        hideT.innerText = 'X';
        hideT.setAttribute(`hide-budget-transactions-id`, budget.id);
        hideT.setAttribute('class', 'hide-transactions button');
        let transactionsTitle = document.createElement('h4');
        transactionsTitle.innerText = 'all transactions';

        displayT.addEventListener('click', function(event) {
            event.preventDefault();
            fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions`)
            .then(function(response) {
                return response.json();
            })
            .then(function(object) {
                let transactions = new TransactionsDiv(budget.id);
                transactions.render();

                let sortedTransactions = object.sort( (a,b) => new Date(a.date) - new Date(b.date) )
                for (const transaction of sortedTransactions) {
                    let transactionRow = new Transaction(transaction.id, budget.id, transaction.date, transaction.description, transaction.price)
                    transactionRow.render();
                }
                renderTransactionForm(budget);
                renderTotal(budget.id);
                displayT.parentNode.prepend(transactionsTitle);
                displayT.parentNode.replaceChild(hideT, displayT);
            })
        })

        hideT.addEventListener('click', function(event) {
            event.preventDefault();
            let divs = Array.from(document.querySelectorAll(`[budget-data-id="${budget.id}"]`))
            let transactions = divs.find(node => node.className === 'transactions-container')
            transactions.remove();
            hideT.parentNode.replaceChild(displayT, hideT);
            let form = divs.find(node => node.nodeName === 'FORM');
            form.remove();
            let editTs = Array.from(document.getElementsByClassName('edit-transaction'))
            let editF = editTs.find(node => node.className === 'edit-transaction')
            if (editF) {
                editF.remove();
            }
            transactionsTitle.remove();
        })
    }

    function listBudgets(object) {
        let budgets = object.sort( (a,b) => new Date(b.start_date) - new Date(a.start_date));

        for (const budget of budgets) {
            let x = new Budget(budget)
            x.render();

            listTransactions(x);
        }
    }

    function renderBudgetForm() { 
        let div = document.getElementsByClassName('create-budget')[0];
        div.insertAdjacentHTML('afterbegin', `<form class='create-budget'>
        <h3>Create a Budget</h3><br>
        <select id='select-month'>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
        </select>
        <select id='select-year'>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
        </select><br>
        <label>Expected Income:</label>
        <input type="text" name="expected_income" required /><br>
        <label>Savings Goal:</label>
        <input type="text" name="savings_goal" required /><br>
        <label>Spending Goal:</label>
        <input type="text" name="spending_goal" required /><br>
        <button id="submit-create-budget" class="button">Create</button>  <button id="cancel-create-budget" class="button">Cancel</button>        
        </form>`)

        let elements = Array.from(document.getElementsByClassName('create-budget'));
        let form = elements.find(node => node.nodeName === 'FORM');
        // let form = document.getElementsByClassName('create-budget')[1];
        let createB = document.getElementById('submit-create-budget');
        // let createB = document.getElementsByClassName('create-budget')[1];
        let cancelNewB = document.getElementById('cancel-create-budget')
        let selectMonth = document.getElementById('select-month');
        let selectYear = document.getElementById('select-year');
        let inputs = document.getElementsByTagName('input');
        
        createB.addEventListener("click", function(event) {
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
                year: selectYear.value,
                expected_income: inputs[0].value,
                savings_goal: inputs[1].value,
                spending_goal: inputs[2].value })
            }
    
            fetch(`http://localhost:3000/users/${loggedIn.id}/budgets`, configObj) 
            .then(function(response) {
                return response.json();
            })
            .then(function(object) {
                if (object.errors) {
                    let ul = document.createElement('ul');
                    object.errors.map( (error) => { 
                        let li = document.createElement('li');
                        li.innerText = error;
                        ul.appendChild(li);
                    } )
                    form.prepend(ul)
                } else { 
                    form.remove();
                    createB.style.display = "inline-block";
                    setUpHeader();
                    let x = new Budget(object)
                    x.render();
                    listTransactions(x);
                }
            })
        })

        cancelNewB.addEventListener("click", function(event) {
            event.preventDefault();
            form.remove();
            setUpHeader();
        })
    }

    function renderTransactionForm(budget) {
        let budgetDiv = document.querySelectorAll(`[budget-data-id='${budget.id}']`)[0];
        budgetDiv.insertAdjacentHTML('beforeend', `<div class="new-transaction row">
        <form budget-data-id="${budget.id}" class="new-transaction form">
            <input budget-data-id="${budget.id}" class="new-transaction" type="date" min="${budget.start_date}" max="${budget.end_date}" name="date" required />
            <input budget-data-id="${budget.id}" class="new-transaction" type="number" placeholder="amount" step="0.01" required />
            <input budget-data-id="${budget.id}" class="new-transaction" type="text" placeholder="description" required />
            <button budget-data-id="${budget.id}" class="submit-transaction button">log transaction</button>
        </form>
        </div>`)
        
        let divs = document.querySelectorAll(`[budget-data-id='${budget.id}']`)
        divs = Array.from(divs);
        let submitTransaction = divs.find(node => node.className === 'submit-transaction button');
        let newTForm = divs.find(node => node.nodeName ==="FORM");
        let newTInputs = divs.filter(node => node.nodeName === 'INPUT');
        submitTransaction.addEventListener("click", function(event) {
            event.preventDefault();
            let configObj = {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                    "Accept": "application/json"
                },
                body: JSON.stringify( { date: newTInputs[0].value, price: newTInputs[1].value, description: newTInputs[2].value })
            }
            fetch(`http://localhost:3000/users/${loggedIn.id}/budgets/${budget.id}/transactions`, configObj)
            .then(function(response) {
                return response.json();
            })
            .then(function(object) {
                if (object.errors) {
                    let ul = document.createElement('ul');
                    object.errors.map( (error) => {
                        let li = document.createElement('li');
                        li.innerText = error;
                        ul.appendChild(li);
                    })
                    newTForm.appendChild(ul)
                } else {
                    let newT = new Transaction(object.id, budget.id, object.date, object.description, object.price)
                    newT.render();
                    newTForm.reset();
                    renderTotal(budget.id);
                }
            })
        })

    }

    function renderTotal(budget_id) {
        let divs = Array.from(document.querySelectorAll(`[budget-data-id="${budget_id}"]`))
        let targetTable = divs.find(node => node.className === 'transactions-container');

        let totalRow = divs.find(node => node.className === "total row");
        if (totalRow) {
            totalRow.remove();
        }

        let amountNodes = divs.filter(node => node.className === "amount");
        let amounts = amountNodes.map(node => parseInt(node.innerText));
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let total = amounts.reduce(reducer, 0);

        targetTable.insertAdjacentHTML("beforeend", `<div budget-data-id="${budget_id}" class="total row">
        <div class="col-one">
            <p>TOTAL</p>
        </div>
        <div class="col-two"></div>
        <div class="col-three">
            <p>${total}</div>
        <div class="col-four"></div>
        <div class="col-five"></div>
        </div>`)
    }

    function sortByDate(budget_id) {
        let divs = document.querySelectorAll(`[budget-data-id="${budget_id}"]`)
        divs = Array.from(divs);
        let total = divs.find(node => node.className === "total row");
        let table = divs.find(node => node.className === 'transactions-container');

        let entries = divs.filter( node => node.nodeName === "P" );
        let dates = entries.filter( node => node.className === "date" );
        dates.sort( (a,b) => new Date(a.innerText) - new Date(b.innerText) );
        let sortedRows = dates.map(p => p.parentNode.parentNode);

        for (let i = 0; i < sortedRows.length; i ++) {
            table.insertBefore(sortedRows[i], total)
        }
        // insert each dateRow above the total row, with the lowest being the earliest.
    }

    function sortByAmount(budget_id) {
        let divs = document.querySelectorAll(`[budget-data-id="${budget_id}"]`)
        divs = Array.from(divs);
        let total = divs.find(node => node.className === "total row");
        let table = divs.find(node => node.className === 'transactions-container');
        
        let entries = divs.filter( node => node.nodeName === "P" );
        let amounts = entries.filter( node => node.className === "amount" );
        amounts.sort( (a,b) => parseInt(a.innerText) - parseInt(b.innerText) );
        let sortedRows = amounts.map(p => p.parentNode.parentNode);

        for (let i = 0; i < sortedRows.length; i ++) {
            table.insertBefore(sortedRows[i], total)
        }
        // insert each dateRow above the total row, with the lowest being the earliest.
    }

    function sortByDescription(budget_id) {
        let divs = document.querySelectorAll(`[budget-data-id="${budget_id}"]`)
        divs = Array.from(divs);
        let total = divs.find(node => node.className === "total row");
        let table = divs.find(node => node.className === 'transactions-container');
        
        let entries = divs.filter( node => node.nodeName === "P" );
        let descriptions = entries.filter( node => node.className === "description" );
        descriptions.sort( function(a, b) { 
            let firstA = a.innerText[0];
            let firstB = b.innerText[0];
            if (firstA > firstB) {
                return 1;
            } else if (firstB > firstA) {
                return -1;
            } else {
                return 0;
            }
        })        
        let sortedRows = descriptions.map(p => p.parentNode.parentNode);

        for (let i = 0; i < sortedRows.length; i ++) {
            table.insertBefore(sortedRows[i], total)
        }
        // insert each dateRow above the total row, with the lowest being the earliest.
    }

    function displayDate(date) {
        let array = date.split("-")
        array = array.map(n => parseInt(n))

        let d = new Date(array[0], array[1], array[2])
        let options = {month: 'short', day: 'numeric', year: 'numeric'}
        
        return d.toLocaleString('en-EN', options)
    }

    function displayDate(date) {
        if (date) {

        let array = date.split("-");
        array = array.reverse();
        return array.join('-')
        }

    }

})