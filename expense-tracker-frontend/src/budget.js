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

            budgetContent.innerHTML += `<form class="edit-budget">
                <label>Expected Income:</label>
                <input type="text" name="savings_goal" value="${this.expected_income}" budget-data-id="${this.id}"><br>
                <label>Spending Goal:</label>
                <input type="text" name="spending_goal" value="${this.spending_goal}" budget-data-id="${this.id}"><br>
                <label>Savings Goal:</label>
                <input type="text" name="savings_goal" value="${this.savings_goal}" budget-data-id="${this.id}"><br>
                <button class="submit-edit button" budget-data-id="${this.id}">Edit Budget</button>
            </form>`

            divs = document.querySelectorAll(`[budget-data-id="${this.id}"]`)
            divs = Array.from(divs);
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
                    budgetContent.innerHTML = '';
                    budgetContent.innerHTML += `<h5>Expected Income: ${object.expected_income}</h5>
                    <h5>Spending Goal: ${object.spending_goal}</h5>
                    <h5>Savings Goal: ${object.savings_goal}</h5>`
                    cancel.replaceWith(editBudget);
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

export default Budget;