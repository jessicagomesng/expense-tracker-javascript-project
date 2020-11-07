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
        colOne.appendChild(dateHeader);
        let descHeader = document.createElement('h5');
        descHeader.innerText = headers[1];
        colTwo.appendChild(descHeader);
        let amtHeader = document.createElement('h5');
        amtHeader.innerText = headers[2];
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
// function renderTransactions(budget, transactions) {
//     // create transaction table -- shall I move this elsewhere?
//     let headers = ['date', 'description', 'amount', 'edit', 'delete'];
//     table.setAttribute('class', `budget-${budget.id} transactions-container`);
//     table.innerHTML = '';
//     let horizontal = document.createElement('div');
//     horizontal.setAttribute('class', 'transactions-header row')
//     let colOne = document.createElement('div');
//     colOne.setAttribute('class', 'col-one');
//     let colTwo = document.createElement('div');
//     colTwo.setAttribute('class', 'col-two');
//     let colThree = document.createElement('div');
//     colThree.setAttribute('class', 'col-three');
//     let colFour = document.createElement('div');
//     colFour.setAttribute('class', 'col-four');
//     let colFive = document.createElement('div');
//     colFive.setAttribute('class', 'col-five');

//     let dateHeader = document.createElement('h5');
//     dateHeader.innerText = headers[0];
//     colOne.appendChild(dateHeader);
//     let descHeader = document.createElement('h5');
//     descHeader.innerText = headers[1];
//     colTwo.appendChild(descHeader);
//     let amtHeader = document.createElement('h5');
//     amtHeader.innerText = headers[2];
//     colThree.appendChild(amtHeader);
//     let editHeader = document.createElement('h5');
//     editHeader.innerText = headers[3];
//     colFour.appendChild(editHeader);
//     let delHeader = document.createElement('h5');
//     delHeader.innerText = headers[4];
//     colFive.appendChild(delHeader);

//     let columns = [colOne, colTwo, colThree, colFour, colFive];
//     for (const column of columns) {
//         horizontal.appendChild(column);
//     }

//     table.appendChild(horizontal);

//     createTransactionForm(budget);

//     for (const transaction of transactions) {
//         renderTransaction(budget, transaction);
//     }

    // create new transaction form here
    // let newTransactionForm = document.createElement('form');
    // newTransactionForm.setAttribute('class', 'new-transaction form')
    // let dateInput = document.createElement('input');
    // dateInput.setAttribute('type', 'date')
    // dateInput.setAttribute('min', `${budget.start_date}`)
    // dateInput.setAttribute('max', `${budget.end_date}`)
    // dateInput.name = 'date';
    // let amountInput = document.createElement('input');
    // amountInput.setAttribute('type', 'number');
    // amountInput.setAttribute('placeholder', 'amount');
    // let descInput = document.createElement('input');
    // descInput.setAttribute('type', 'text');
    // descInput.setAttribute('placeholder', 'description');
    // let submit = document.createElement('input');
    // submit.setAttribute('type', 'submit');
    // submit.setAttribute('value', 'log transaction');
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
    //         renderTransaction(object);
    //         console.log(object);
    //     })
    // })
            
    // // create new row for form
    // let formRow = document.createElement('div');
    // formRow.setAttribute('class', 'new-transaction row')
    // let formElements = [dateInput, amountInput, descInput, submit];
    // for (const element of formElements) {
    //     newTransactionForm.appendChild(element);
    // }
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
// }

