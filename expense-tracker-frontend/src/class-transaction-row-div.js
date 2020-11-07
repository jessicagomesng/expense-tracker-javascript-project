class TransactionRowDiv {
    constructor(transaction_id, budget_id, date, description, amount) {
        this.id = transaction_id
        this.budget_id = budget_id
        this.date = date 
        this.description = description
        this.amount = amount
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
        renderDate.innerText = this.date; 
        // renderDate.innerText = displayDate(this.date);
        let renderDesc = document.createElement('p');
        renderDesc.innerText = this.description;
        let renderAmt = document.createElement('p');
        renderAmt.innerText = this.amount;

        let renderEdit = document.createElement('button');
        renderEdit.setAttribute('class', 'edit-transaction button');
        renderEdit.innerText = 'X';
        let renderDelete = document.createElement('button');
        renderDelete.innerText = 'X';
        renderDelete.setAttribute('class', `delete-transaction button`)

        newColOne.appendChild(renderDate);
        newColTwo.appendChild(renderDesc);
        newColThree.appendChild(renderAmt);
        newColFour.appendChild(renderEdit);
        newColFive.appendChild(renderDelete);

        let clmns = [newColOne, newColTwo, newColThree, newColFour, newColFive];

        for (let column of clmns) {
            newRow.appendChild(column);
        }
        let table = document.querySelectorAll(`[budget-data-id="${this.budget_id}"]`)[1]
        table.appendChild(newRow);
    }
}

function renderTransaction(budget, transaction) {
    let newRow = document.createElement('div');
    newRow.setAttribute('transaction-data-id', transaction.id)
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
    renderDate.innerText = displayDate(transaction.date);
    let renderDesc = document.createElement('p');
    renderDesc.innerText = transaction.description;
    let renderAmt = document.createElement('p');
    renderAmt.innerText = transaction.price;

    let renderEdit = document.createElement('button');
    renderEdit.setAttribute('class', 'edit-transaction button');
    renderEdit.innerText = 'X';
    renderEdit.addEventListener('click', function(event) {
        event.preventDefault();
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
                editTransactionForm.style.display = 'none';
                renderTransaction(budget, object);
                console.log(object);
            })
        })
        editTransactionForm.appendChild(editDate);
        editTransactionForm.appendChild(editAmt);
        editTransactionForm.appendChild(editDesc);
        editTransactionForm.appendChild(submitEdit);
        newRow.innerHTML = '';
        newRow.appendChild(editTransactionForm);
    })

        let renderDelete = document.createElement('button');
        renderDelete.innerText = 'X';
        renderDelete.setAttribute('class', `delete-transaction button`)
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
                let rowToDelete =document.querySelectorAll(`[transaction-data-id='${object.id}']`)[0];
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