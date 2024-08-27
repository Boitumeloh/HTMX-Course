const express = require('express');

const router = express.Router();

const expenses = [
  { id: 1, description: 'Groceries', amount: 2000, date: '2023-08-01' },
  { id: 2, description: 'Electricity Bill', amount: 1000, date: '2023-08-02' },
  { id: 3, description: 'Entertainment Subscriptions', amount: 300, date: '2023-08-03' },
  { id: 4, description: 'Transport Bill', amount: 600, date: '2023-08-04' },
  { id: 5, description: 'Dining Out', amount: 500, date: '2023-08-05' },
];

// GET /expenses
router.get('/expense s', (req, res) => {
  res.render('index', { action: '', expenses, expense: {} });
});

// GET /expenses/new
router.get('/expenses/new', (req, res) => {
  if (req.headers['hx-request']) {
    res.render('form', { expense: {} });
  } else {
    res.render('index', { action: 'new', expenses, expense: {} });
  }
});

// GET /expenses/:id
router.get('/expenses/:id', (req, res) => {
  const { id } = req.params;
  const expense = expenses.find((e) => e.id === Number(id));

  if (req.headers['hx-request']) {
    res.render('expense', { expense });
  } else {
    res.render('index', { action: 'show', expenses, expense });
  }
});

// GET /expenses/:id/edit
router.get('/expenses/:id/edit', (req, res) => {
  const { id } = req.params;
  const expense = expenses.find((e) => e.id === Number(id));

  if (req.headers['hx-request']) {
    res.render('form', { expense });
  } else {
    res.render('index', { action: 'edit', expenses, expense });
  }
});

// POST /expenses
router.post('/expenses', (req, res) => {
  const newExpense = {
    id: expenses.length + 1,
    description: req.body.description,
    amount: Number(req.body.amount),
    date: req.body.date,
  };

  expenses.push(newExpense);

  if (req.headers['hx-request']) {
    res.render('sidebar', { expenses }, (err, sidebarHtml) => {
      const html = `
        <main id="content" hx-swap-oob="afterbegin">
          <p class="flash">Expense was successfully added!</p>
        </main>
        ${sidebarHtml}
      `;
      res.send(html);
    });
  } else {
    res.render('index', { action: 'new', expenses, expense: {} });
  }
});

// PUT /expenses/:id
router.put('/update/:id', (req, res) => {
  const { id } = req.params;

  const updatedExpense = {
    id: Number(id),
    description: req.body.description,
    amount: Number(req.body.amount),
    date: req.body.date,
  };

  const index = expenses.findIndex((e) => e.id === Number(id));

  if (index !== -1) expenses[index] = updatedExpense;

  if (req.headers['hx-request']) {
    res.render('sidebar', { expenses }, (err, sidebarHtml) => {
      res.render('expense', { expense: expenses[index] }, (err, expenseHTML) => {
        const html = `
          ${sidebarHtml}
          <main id="content" hx-swap-oob="true">
            <p class="flash">Expense was successfully updated!</p>
            ${expenseHTML}
          </main>
        `;

        res.send(html);
      });
    });
  } else {
    res.redirect(`/expenses/${index + 1}`);
  }
});

// DELETE /expenses/:id
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const index = expenses.findIndex((e) => e.id === Number(id));

  if (index !== -1) expenses.splice(index, 1);
  if (req.headers['hx-request']) {
    res.render('sidebar', { expenses }, (err, sidebarHtml) => {
      const html = `
        <main id="content" hx-swap-oob="true">
          <p class="flash">Expense was successfully deleted!</p>
        </main>
        ${sidebarHtml}
      `;
      res.send(html);
    });
  } else {
    res.redirect('/expenses');
  }
});

module.exports = router;
