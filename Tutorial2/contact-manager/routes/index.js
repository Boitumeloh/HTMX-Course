const express = require('express');

const router = express.Router();

  const lists = [
  { id: 1,item: 'Rice', price: 'R120,00' },
  { id: 2, item: 'Chicken',price: 'R150,00' },
  { id: 3, item: 'Bread', price: 'R19,00' },
  { id: 4, item: 'Juice', price: 'R55,00' },
  { id: 5, item: 'Snacks',price: 'R110' },

];

// GET /lists
router.get('/lists', (req, res) => {
  res.render('index', { action: '', lists, list: {} });
});

// GET /lists/new
router.get('/lists/new', (req, res) => {
  if (req.headers['hx-request']) {
    res.render('form', { list: {} });
  } else {
    res.render('index', { action: 'new', lists, list: {} });
  }
});

// GET /lists/1
router.get('/lists/:id', (req, res) => {
  const { id } = req.params;
  const list = lists.find((c) => c.id === Number(id));

  if (req.headers['hx-request']) {
    res.render('list', { list });
  } else {
    res.render('index', { action: 'show', lists, list });
  }
});

// GET /lists/1/edit
router.get('/lists/:id/edit', (req, res) => {
  const { id } = req.params;
  const list = lists.find((c) => c.id === Number(id));

  if (req.headers['hx-request']) {
    res.render('form', { list });
  } else {
    res.render('index', { action: 'edit', lists, list });
  }
});

// POST /lists
router.post('/lists', (req, res) => {
  const newlist = {
    id: lists.length + 1,
    item: req.body.item,
    price: req.body.price,
  };

  lists.push(newlist);

  if (req.headers['hx-request']) {
    res.render('sidebar', { lists }, (err, sidebarHtml) => {
      const html = `
        <main id="content" hx-swap-oob="afterbegin">
          <p class="flash">list was successfully added!</p>
        </main>
        ${sidebarHtml}
      `;
      res.send(html);
    });
  } else {
    res.render('index', { action: 'new', lists, list: {} });
  }
});

// PUT /lists/1
router.put('/update/:id', (req, res) => {
  const { id } = req.params;

  const newlist = {
    id: Number(id),
    item: req.body.item,
    price: req.body.price,
  };

  const index = lists.findIndex((c) => c.id === Number(id));

  if (index !== -1) lists[index] = newlist;

  if (req.headers['hx-request']) {
    res.render('sidebar', { lists }, (err, sidebarHtml) => {
      res.render('list', { list: lists[index] }, (err, listHTML) => {
        const html = `
          ${sidebarHtml}
          <main id="content" hx-swap-oob="true">
            <p class="flash">list was successfully updated!</p>
            ${listHTML}
          </main>
        `;

        res.send(html);
      });
    });
  } else {
    res.redirect(`/lists/${index + 1}`);
  }
});

// DELETE /lists/1
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const index = lists.findIndex((c) => c.id === Number(id));

  if (index !== -1) lists.splice(index, 1);
  if (req.headers['hx-request']) {
    res.render('sidebar', { lists }, (err, sidebarHtml) => {
      const html = `
        <main id="content" hx-swap-oob="true">
          <p class="flash">list was successfully deleted!</p>
        </main>
        ${sidebarHtml}
      `;
      res.send(html);
    });
  } else {
    res.redirect('/lists');
  }
});

module.exports = router;