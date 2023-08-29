const qsa = (q) => document.querySelectorAll(q);
const qs = (q) => document.querySelector(q);
const customerName = document.getElementById('customer-name');
const creditCardElement = document.getElementById('credit-card-info');
const table = document.getElementById('transactions-table');
const months = qsa('input[name="month"]');
const sectionFilters = qs('.filters');
const totalAmount = document.getElementById('total-amount');
let chart = qs('canvas');

const arrayAllMonths = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const loadCustomerList = (customers) => {
  customers.forEach((customer) => {
    const newOption = document.createElement('option');
    newOption.innerText = customer.name;
    newOption.value = customer.customer_id;
    customerName.appendChild(newOption);
  });
};

const getCreditCardInfo = (credit_card_id) => data.credit_cards
  .find((card) => card.credit_card_id === credit_card_id);
const getCustomer = (customer_id) => data.customers
  .find((customer) => customer.customer_id == customer_id);
const getTransactions = (customer_id, months) => data.transactions
  .filter((transaction) => transaction.customer_id == customer_id && months.includes(transaction.month));

const showCreditCardInfo = (customer_id) => {
  creditCardElement.innerHTML = '';

  const customer = getCustomer(customer_id);
  const creditCard = getCreditCardInfo(customer.credit_card_id);

  creditCardElement.insertAdjacentHTML(
    'afterbegin',
    `<img src="./images/cartao-nacional.png"><p>Cartão ${creditCard.name} - No: ${customer.credit_card_number}</p>`
  );
};

const filterByMonth = () => [...qsa('input[name="month"]:checked')].map((month) => month.id);

const showTransactions = (transactions) => {
  qs('table tbody').innerHTML = '';
  transactions.forEach(
    (transaction) => qs('table tbody')
      .insertAdjacentHTML(
        'beforeend',`
        <td>${transaction.month}</td>
        <td>${transaction.transaction_id}</td>
        <td>${transaction.company}</td>
        <td>R$${transaction.amount.toFixed(2)}</td>`
      )
  );
};

const showCustomerInfo = () => {
  const customer = getCustomer(customerName.value);
  const transactions = getTransactions(customer.customer_id, filterByMonth());

  showTransactions(transactions);

  const total = transactions.reduce((acc, transaction) => acc += transaction.amount, 0);
  totalAmount.innerText = `TOTAL = R$${total.toFixed(2)}`;
};

const getTotalByMonths = () => {
  const customer = getCustomer(customerName.value);
  const customerTransactions = data.transactions.filter((transaction) => transaction.customer_id === customer.customer_id);
  return arrayAllMonths.map((month) => customerTransactions
      .filter((transaction) => transaction.month === month)
      .reduce((total, transaction) => total + transaction.amount, 0)
  );
};

const chartGenerator = (data) => {
  const dataBar = {
    type: 'bar',
    data: {
      labels: arrayAllMonths,
      datasets: [
        {
          label: 'Movimentação do Cartão',
          data,
        },
      ],
    },
  };

  if (chart.classList.length) {
    chart.remove();
    chart = document.createElement('canvas');
    chart.id = 'bar-chart';
    qs('#credit-chart').appendChild(chart);
  }

  new te.Chart(document.getElementById('bar-chart'), dataBar);
}

window.onload = () => {
  loadCustomerList(data.customers);

  customerName.addEventListener('change', () => {
    chartGenerator(getTotalByMonths());
    showCreditCardInfo(customerName.value);
  })

  sectionFilters.addEventListener('change', () => {
    showCustomerInfo();
  })
};
