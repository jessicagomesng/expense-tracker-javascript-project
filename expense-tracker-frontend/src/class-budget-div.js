class BudgetDiv { 
    constructor(id, name, start_date, end_date, expected_income, savings_goal, spending_goal, user_id) {
        this.id = id;
        this.name = name;
        this.start_date = start_date;
        this.end_date = end_date;
        this.expected_income = expected_income,
        this.savings_goal = savings_goal,
        this.spending_goal = spending_goal 
        this.user_id = user_id
    }

    render() {
        let div = document.createElement('div');
        div.setAttribute('budget-data-id', this.id);
        let budgetHeader = document.createElement('div');
        budgetHeader.setAttribute('class', 'budget-header');
        let datesHeader = document.createElement('div');
        datesHeader.setAttribute('class', 'dates-header');
        let budgetContent = document.createElement('div');
        budgetContent.setAttribute('class', 'budget-content');
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
        deleteBudget.setAttribute('class', 'delete-budget button');
        deleteBudget.addEventListener('click', function(e) {
            e.preventDefault();
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
        })
        let editBudget = document.createElement('button');
        editBudget.innerText = 'edit budget';
        editBudget.setAttribute('class', 'edit-budget button');
        editBudget.addEventListener('click', function(event) {
            event.preventDefault();
            budgetContent.style.display = 'none';
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
            let editBudget = document.createElement('button');
            editBudget.setAttribute('class', 'button')
            editBudget.innerText = 'edit budget';
            let formChildren = [incomeLabel, editIncome, spendingLabel, editSpending, savingsLabel, editSavings, editBudget]
            for (const element of formChildren) {
                editForm.appendChild(element);
                let br = document.createElement('br');
                editForm.appendChild(br);
                editForm.addEventListener('submit', function(event) {
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
                    })
    
                })
                div.appendChild(editForm);
            }
        })
            

        budgetHeader.appendChild(budgetTitle);
        budgetHeader.appendChild(editBudget);
        budgetHeader.appendChild(deleteBudget);
        datesHeader.appendChild(budgetDates);
        budgetContent.appendChild(expectedIncome);
        budgetContent.appendChild(spendingGoal);
        budgetContent.appendChild(savingsGoal);
        // budgetFooter.appendChild(displayTransactions);

        div.appendChild(budgetHeader);
        div.appendChild(datesHeader); 
        div.appendChild(budgetContent);
        div.appendChild(budgetFooter);

        let container = document.getElementsByClassName('container')[0]
        container.appendChild(div);
    }
}