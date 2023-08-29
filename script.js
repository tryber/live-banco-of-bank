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

const getCreditCardInfo = (credit_card_id) => data.credit_cards.find((card) => card.credit_card_id === credit_card_id);
const getCustomer = (customer_id) => data.customers.find((customer) => customer.customer_id == customer_id);

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

const getCustomerInfo = (arrayColumns, arrayKeys) => {
  table.innerHTML = '';
  totalAmount.innerHTML = '';

  if (!customerName.value) return;

  arrayColumns.forEach((column) => {
    const newTh = document.createElement('th');
    newTh.innerText = column;
    table.appendChild(newTh);
  })

  const findCustomer = data.customers
    .find((customer) => customer.customer_id == customerName.value);
  const allTransactions = data.transactions
    .filter((transactions) => transactions.customer_id === findCustomer.customer_id)
    .filter(({ month }) => filterByMonth()
    .includes(month));

  let transactionsAmount = [];

  allTransactions.forEach((transaction) => {
    const newTr = document.createElement('tr');
    table.appendChild(newTr);
    transactionsAmount.push(transaction.amount);

    arrayKeys.forEach((key) => {
      const newTd = document.createElement('td');
      newTd.innerText = transaction[key];
      if (key === 'amount') newTd.innerText = `R$${transaction[key].toFixed(2)}`;
      newTr.appendChild(newTd);
    })

  })

  const total = transactionsAmount.reduce((acc, amount) => acc += amount, 0);
  totalAmount.innerText = `TOTAL = R$${total.toFixed(2)}`;
};

const getTotalByMonths = () => {
  const findCustomer = data.customers.find((customer) => customer.customer_id == customerName.value);
  return arrayAllMonths.map((month) => {
    const monthTransactions = data.transactions
      .filter((transaction) => transaction.customer_id === findCustomer.customer_id)
      .filter((transaction) => transaction.month === month);

    return monthTransactions
      .map((transaction) => transaction.amount)
      .reduce((acc, amount) => acc += amount, 0);
  })
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
    getCustomerInfo(['Mês', 'Transação', 'Estabelecimento', 'Valor'], ['month', 'transaction_id', 'company', 'amount']);
  })
};
