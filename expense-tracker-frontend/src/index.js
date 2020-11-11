// to do: style total
// figure out the date display thing
document.addEventListener('DOMContentLoaded', function(event) {
    let container = document.getElementsByClassName('container')[0];

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
    }

    createSignInForm();

    let logIn = document.getElementsByClassName('sign-in')[0];
    let input = document.getElementsByTagName('input');
    let header = document.getElementsByTagName('header')[0];
    let table = document.createElement('div');
    let loggedIn = null;

    // shouldn't this be moved elsewhere to a function or sth
    let createBudgetDiv = document.createElement('div');
    createBudgetDiv.setAttribute('class', 'create-budget');
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
        console.log('budgets sorted');
    })
    let logOut = document.createElement('button');
    logOut.setAttribute('class', 'logout button');
    logOut.innerText = 'Log Out';
    logOut.addEventListener('click', function(event) {
        event.preventDefault();
        renderLoggedOutPage();
        loggedIn = null;
    })
    createBudgetDiv.appendChild(addBudget);
    createBudgetDiv.appendChild(sortBudgets);
    createBudgetDiv.appendChild(logOut);

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
        }

        render() {
            let div = document.createElement('div');
            div.setAttribute('budget-data-id', this.id);
            let budgetHeader = document.createElement('div');
            budgetHeader.setAttribute('class', 'budget-header');
            let datesHeader = document.createElement('div');
            datesHeader.setAttribute('class', 'dates-header');
            let budgetContent = document.createElement('div');
            budgetContent.setAttribute('budget-content-id', this.id);
            let budgetFooter = document.createElement('div');
            budgetFooter.setAttribute('class', 'budget-footer');
            let budgetTitle = document.createElement('h3');
            budgetTitle.setAttribute('class', 'item-one')
            budgetTitle.innerText = this.name;
            let budgetDates = document.createElement('h6');
            budgetDates.innerText = this.start_date + ' to ' + this.end_date;
            let expectedIncome = document.createElement('h5'); 
            expectedIncome.innerText = 'Expected Income: ' + this.expected_income;
            let spendingGoal = document.createElement('h5'); 
            spendingGoal.innerText = 'Spending Goal: ' + this.spending_goal;
            let savingsGoal = document.createElement('h5'); 
            savingsGoal.innerText = 'Savings Goal: ' + this.savings_goal;
            let deleteBudget = document.createElement('button');
            deleteBudget.innerText = 'delete budget'; 
            deleteBudget.setAttribute('class', `delete-budget-${this.id} button`);
            
            function hideBudget(event) {
                event.preventDefault();
                let configObj = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify( { id: this.id })
                }
                fetch(`http://localhost:3000/users/${this.user_id}/budgets/${this.id}`, configObj) 
                .then(function(response) {
                    return response.json();
                })
                .then(function(object) {
                    let budgetToDelete = document.querySelectorAll(`[budget-data-id='${object.id}']`)[0]
                    budgetToDelete.remove();
                })
            }

            let boundDeleteBudget = hideBudget.bind(this);

            deleteBudget.addEventListener('click', boundDeleteBudget);

            let editBudget = document.createElement('button');
            editBudget.innerText = 'edit budget';
            editBudget.setAttribute('class', `edit-budget-${this.id} button`);

            budgetHeader.appendChild(budgetTitle);
            budgetHeader.appendChild(editBudget);
            budgetHeader.appendChild(deleteBudget);
            datesHeader.appendChild(budgetDates);
            budgetContent.appendChild(expectedIncome);
            budgetContent.appendChild(spendingGoal);
            budgetContent.appendChild(savingsGoal);

            function renderEditBudgetForm(event) {
                event.preventDefault();
                budgetContent.style.display = 'none';
                let hideEditForm = document.createElement('button');
                hideEditForm.innerText = "X";
                hideEditForm.setAttribute('class', 'button');
                editBudget.replaceWith(hideEditForm);
                let editForm = document.createElement('form');
                editForm.setAttribute('class', 'edit-budget');
                let savingsLabel = document.createElement('label');
                savingsLabel.innerText = 'Savings Goal:'
                let editSavings = document.createElement('input'); 
                editSavings.setAttribute('type', 'text');
                editSavings.name = 'savings_goal';
                editSavings.value = this.savings_goal;
                let spendingLabel = document.createElement('label');
                spendingLabel.innerText = "Spending Goal:"
                let editSpending = document.createElement('input');
                editSpending.setAttribute('type', 'text');
                editSpending.name = 'spending_goal';
                editSpending.value = this.spending_goal;
                let incomeLabel = document.createElement('label');
                incomeLabel.innerText = 'Expected Income:'
                let editIncome = document.createElement('input'); 
                editIncome.setAttribute('type', 'text')
                editIncome.name = 'expected_income';
                editIncome.value = this.expected_income;
                let submit = document.createElement('button');
                submit.setAttribute('class', 'button')
                submit.innerText = 'edit budget';
                let formChildren = [incomeLabel, editIncome, spendingLabel, editSpending, savingsLabel, editSavings, submit]
                for (const element of formChildren) {
                    editForm.appendChild(element);
                    let br = document.createElement('br');
                    editForm.appendChild(br);
                }

                function submitBudgetEdit(event) {
                    event.preventDefault();
                    let configObj = {
                        method: "PATCH",
                        headers: { 
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        }, 
                        body: JSON.stringify({ 
                            savings_goal: editSavings.value, 
                            spending_goal: editSpending.value, 
                            expected_income: editIncome.value })
                    }
            
                    fetch(`http://localhost:3000/users/${this.user_id}/budgets/${this.id}`, configObj) 
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(object) {
                        console.log(object);
                        editForm.reset();
                        editForm.style.display = 'none';
                        expectedIncome.innerText = `Expected Income: ${object.expected_income}`;
                        spendingGoal.innerText = `Spending Goal: ${object.spending_goal}`;
                        savingsGoal.innerText = `Savings Goal: ${object.savings_goal}`;
                        budgetContent.style.display = 'block';
                        hideEditForm.replaceWith(editB);
                    })
                }

                let boundSubmitEdit = submitBudgetEdit.bind(this);

                editForm.addEventListener('submit', boundSubmitEdit);

                function removeEditForm(event) {
                    event.preventDefault();
                    budgetContent.style.display = 'block';
                    editForm.style.display = 'none';
                    hideEditForm.replaceWith(editBudget);
                }

                let boundRemoveEditForm = removeEditForm.bind(this);

                hideEditForm.addEventListener('click', boundRemoveEditForm);
                
                div.appendChild(editForm);
            }

            let boundEditBudget = renderEditBudgetForm.bind(this);
            editBudget.addEventListener('click', boundEditBudget);

            let displayTransactions = document.createElement('button');
            displayTransactions.innerText = 'display transactions';
            displayTransactions.setAttribute(`display-budget-transactions-id`, this.id);
            displayTransactions.setAttribute('class', 'button');      

            budgetFooter.appendChild(displayTransactions);
    
            div.appendChild(budgetHeader);
            div.appendChild(datesHeader); 
            div.appendChild(budgetContent);
            div.appendChild(budgetFooter);
    
            let container = document.getElementsByClassName('container')[0]
            container.appendChild(div);
        }
    }

    class TransactionsDiv {
        constructor(budget_id) {
            this.budget_id = budget_id
        }
    
        render() {
            let headers = ['date', 'description', 'amount', 'edit', 'delete'];
            let table = document.createElement('div');
            table.setAttribute('class', `transactions-container`);
            table.setAttribute('budget-data-id', this.budget_id)
            table.innerHTML = '';
            let horizontal = document.createElement('div');
            horizontal.setAttribute('class', 'transactions-header row');
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
    
            let dateHeader = document.createElement('h5');
            dateHeader.innerText = headers[0];
            function dateFunction(event) { 
                event.preventDefault();
                sortByDate(this.budget_id);
            }
            let boundDateFunction = dateFunction.bind(this);
            dateHeader.addEventListener('click', boundDateFunction);
            colOne.appendChild(dateHeader);

            let descHeader = document.createElement('h5');
            descHeader.innerText = headers[1];
            function descFunction(event) { 
                event.preventDefault();
                sortByDescription(this.budget_id);
            }
            let boundDescFunction = descFunction.bind(this);
            descHeader.addEventListener('click', boundDescFunction);
            colTwo.appendChild(descHeader);

            let amtHeader = document.createElement('h5');
            amtHeader.innerText = headers[2];
            function amtFunction(event) {
                event.preventDefault();
                sortByAmount(this.budget_id);
            }
            let boundAmtFunction = amtFunction.bind(this);
            amtHeader.addEventListener('click', boundAmtFunction);
            colThree.appendChild(amtHeader);
            let editHeader = document.createElement('h5');
            editHeader.innerText = headers[3];
            colFour.appendChild(editHeader);
            let delHeader = document.createElement('h5');
            delHeader.innerText = headers[4];
            colFive.appendChild(delHeader);
    
            let columns = [colOne, colTwo, colThree, colFour, colFive];
            for (const column of columns) {
                horizontal.appendChild(column);
            }
        
            table.appendChild(horizontal);
    
            let budgetDiv = document.querySelectorAll(`[budget-data-id='${this.budget_id}']`)[0]
            budgetDiv.appendChild(table);
        }
    }

    class TransactionRowDiv {
        constructor(transaction_id, budget_id, date, description, amount, user_id) {
            this.id = transaction_id
            this.budget_id = budget_id
            this.date = date 
            this.description = description
            this.amount = amount
            this.user_id = user_id
        }
    
        render() {
            let newRow = document.createElement('div');
            newRow.setAttribute('transaction-data-id', this.id)
            newRow.setAttribute('class', `row`);
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
            renderDate.setAttribute('budget-data-id', this.budget_id);
            renderDate.setAttribute('class', 'date');
            renderDate.innerText = this.date; 
            // renderDate.innerText = displayDate(this.date);
            let renderDesc = document.createElement('p');
            renderDesc.setAttribute('budget-data-id', this.budget_id);
            renderDesc.setAttribute('class', 'description');
            renderDesc.innerText = this.description;
            let renderAmt = document.createElement('p');
            renderAmt.setAttribute('class', 'amount');
            renderAmt.setAttribute('budget-data-id', this.budget_id);
            // get rid of this next thing
            renderAmt.setAttribute('amount-budget-id', this.budget_id)
            renderAmt.innerText = this.amount;
    
            let renderEdit = document.createElement('button');
            renderEdit.setAttribute('class', 'edit-transaction button');
            renderEdit.setAttribute('transaction-data-id', this.id);
            renderEdit.innerText = 'X';

            function createForm(event) {
                event.preventDefault();
                let editTransactionForm = document.createElement('form');
                let editDate = document.createElement('input');
                editDate.setAttribute('type', 'date')
                // editDate.setAttribute('min', `${budget.start_date}`)
                // editDate.setAttribute('max', `${budget.end_date}`)
                editDate.name = 'date';
                editDate.value = this.date;
                let editAmt = document.createElement('input');
                editAmt.setAttribute('type', 'number');
                editAmt.setAttribute('placeholder', 'amount');
                editAmt.value = this.amount;
                let editDesc = document.createElement('input');
                editDesc.setAttribute('type', 'text');
                editDesc.setAttribute('placeholder', 'description');
                editDesc.value = this.description;
    
                let submitEdit = document.createElement('input');
                submitEdit.setAttribute('class', 'button');
                submitEdit.setAttribute('type', 'submit');
                submitEdit.setAttribute('value', 'edit')
                let cancelEdit = document.createElement('button');
                cancelEdit.setAttribute('class', 'button');
                cancelEdit.innerText= 'cancel';
                function submitTransactionEdit(event) {
                    event.preventDefault();
                    let configObj = {
                        method: "PATCH",
                        headers: { 
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify( { date: editDate.value, price: editAmt.value, description: editDesc.value })
                    }
    
                    fetch(`http://localhost:3000/users/${this.user_id}/budgets/${this.budget_id}/transactions/${this.id}`, configObj)
                    .then( (response) => {
                        return response.json();
                    } )
                    .then( (object) => {
                        let formDiv = document.querySelectorAll(`[transaction-data-id="${this.id}"]`)[0]
                        formDiv.remove();
                        let newT = new TransactionRowDiv(object.id, this.budget_id, object.date, object.description, object.price)
                        newT.render();
                        renderTotal(this.budget_id);
                        cancelEdit.remove();
                    } )
                }

                let boundSubmitTransactionEdit = submitTransactionEdit.bind(this);
                submitEdit.addEventListener('click', boundSubmitTransactionEdit);

                function cancelTransactionEdit(event) {
                    event.preventDefault();
                    let formDiv = document.querySelectorAll(`[transaction-data-id="${this.id}"]`)[0]
                    formDiv.remove();
                    let oldT = new TransactionRowDiv(this.id, this.budget_id, this.date, this.description, this.amount);
                    oldT.render();
                }

                cancelEdit.addEventListener('click', cancelTransactionEdit.bind(this))
                editTransactionForm.appendChild(editDate);
                editTransactionForm.appendChild(editAmt);
                editTransactionForm.appendChild(editDesc);
                editTransactionForm.appendChild(submitEdit);
                newRow.innerHTML = '';
                newRow.appendChild(editTransactionForm);
                newRow.appendChild(cancelEdit);
            } 

            let boundFunction = createForm.bind(this);
            renderEdit.addEventListener('click', boundFunction);
                
            let renderDelete = document.createElement('button');
            renderDelete.innerText = 'X';
            renderDelete.setAttribute('class', `delete-transaction button`)

            function deleteTransaction(event) {
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
                    let rowToDelete =document.querySelectorAll(`[transaction-data-id='${object.id}']`)[0];
                    rowToDelete.remove();
                    renderTotal(object.budget_id);
                })
            }

            let boundDeleteTransaction = deleteTransaction.bind(this);

            renderDelete.addEventListener('click', boundDeleteTransaction);
    
            newColOne.appendChild(renderDate);
            newColTwo.appendChild(renderDesc);
            newColThree.appendChild(renderAmt);
            newColFour.appendChild(renderEdit);
            newColFive.appendChild(renderDelete);
    
            let clmns = [newColOne, newColTwo, newColThree, newColFour, newColFive];
    
            for (let column of clmns) {
                newRow.appendChild(column);
            }
            let divs = document.querySelectorAll(`[budget-data-id="${this.budget_id}"]`)
            divs = Array.from(divs);
            let table = divs.find(node => node.className === 'transactions-container');
            let total = divs.find(node => node.className === "total row");
            table.insertBefore(newRow, total);
        }
    }

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
        })
    })

    function renderLoggedInPage() {
        container.innerHTML = '';
        logIn.style.display = 'none';
        header.style.visibility = 'visible';
        container.appendChild(createBudgetDiv);
        fetch(`http://localhost:3000/users/${loggedIn.id}/budgets`) 
        .then(function(response) {
            return response.json();
        })
        .then(function(object) {
            listBudgets(object);
        })
    }

    function renderLoggedOutPage() {
        container.innerHTML = '';
        createSignInForm();
        header.style.visibility = 'hidden';
    }

    function listBudgets(object) {
        let budgets = object.sort( (a,b) => new Date(b.start_date) - new Date(a.start_date));
        // sort these by chronological date
        // render new budget form

        // render all budgets
        for (const budget of budgets) {
            let x = new Budget(budget)
            x.render();

            let displayT = document.querySelectorAll(`[display-budget-transactions-id="${budget.id}"]`)[0]
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
                        let transactionRow = new TransactionRowDiv(transaction.id, budget.id, transaction.date, transaction.description, transaction.price)
                        transactionRow.render();
                    }
                    renderTotal(budget.id);
                    renderTransactionForm(budget);
                    displayT.parentNode.prepend(transactionsTitle);
                    displayT.parentNode.replaceChild(hideT, displayT);
                })
            })
            hideT.addEventListener('click', function(event) {
                event.preventDefault();
                let transactions = document.querySelectorAll(`[budget-data-id="${budget.id}"]`)[1]
                transactions.remove();
                hideT.parentNode.replaceChild(displayT, hideT);
                let form = document.querySelectorAll(`[budget-data-id="${budget.id}"]`)[1]
                form.remove();
                transactionsTitle.remove();
            })
        }
    }

    function renderBudgetForm() { 
        let newBudgetForm = document.createElement('form');
        newBudgetForm.setAttribute('class', 'create-budget');

        let formTitle = document.createElement('h3');
        formTitle.innerText = 'Create a Budget'
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        let selectMonth = document.createElement('select');
        selectMonth.id = 'select-month';
        
        for (let i = 0; i < months.length; i++ ) {
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

        let formChildren = [formTitle, selectMonth, incomeLabel, newExpectedIncome, savingsLabel, newSavingsGoal, spendingLabel, newSpendingGoal, submitBudget]
            
        for (const element of formChildren) {
            newBudgetForm.appendChild(element);
            let br = document.createElement('br');
            newBudgetForm.appendChild(br);
        }

        newBudgetForm.addEventListener('submit', function(event) {
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
    
            fetch(`http://localhost:3000/users/${loggedIn.id}/budgets`, configObj) 
            .then(function(response) {
                return response.json();
            })
            .then(function(object) {
                newBudgetForm.remove();
                addBudget.style.display = 'inline-block';
                let x = new Budget(object)
                x.render();
            })
        })

        container.prepend(newBudgetForm);
    }

    function renderTransactionForm(budget) {
        let newTransactionForm = document.createElement('form');
        newTransactionForm.setAttribute('class', 'new-transaction form')
        newTransactionForm.setAttribute('budget-data-id', budget.id)
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
        submit.setAttribute('class', 'button');
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
                let newT = new TransactionRowDiv(object.id, budget.id, object.date, object.description, object.price)
                newT.render();
                newTransactionForm.reset();
                renderTotal(budget.id);
            })
        })
                
        // create new row for form
        let formRow = document.createElement('div');
        formRow.setAttribute('class', 'new-transaction row')
        let formElements = [dateInput, amountInput, descInput, submit];
        for (const element of formElements) {
            newTransactionForm.appendChild(element);
        }
        formRow.appendChild(newTransactionForm);

        let budgetDiv = document.querySelectorAll(`[budget-data-id='${budget.id}']`)[0]
        budgetDiv.appendChild(table);
        budgetDiv.appendChild(formRow);

    }

    function renderTotal(budget_id) {
        let divs = document.querySelectorAll(`[budget-data-id="${budget_id}"]`)
        let targetTable = divs[1];

        let divsArray = Array.from(divs);
        let totalRow = divsArray.find(node => node.className === "total row");
        if (totalRow) {
            totalRow.innerHTML= '';
        } else {
            totalRow = document.createElement('div');
        }

        let amountNodes = document.querySelectorAll(`[amount-budget-id="${budget_id}"]`)
        amountNodes = Array.from(amountNodes);
        let amounts = amountNodes.map(node => parseInt(node.innerText));
        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        let total = amounts.reduce(reducer, 0);
        totalRow.setAttribute('budget-data-id', budget_id);
        totalRow.setAttribute('class', 'total row');
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

        let totalLabel = document.createElement('p');
        totalLabel.innerText = 'TOTAL';
        colOne.appendChild(totalLabel);
        colTwo.innerText = '';
        let totalAmount = document.createElement('p');
        totalAmount.innerText = total;
        colThree.appendChild(totalAmount);
        colFour.innerText = '';
        colFive.innerText = '';

        totalRow.appendChild(colOne);
        totalRow.appendChild(colTwo);
        totalRow.appendChild(colThree);
        totalRow.appendChild(colFour);
        totalRow.appendChild(colFive);

        targetTable.appendChild(totalRow);
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

})