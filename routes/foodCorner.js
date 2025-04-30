const express = require('express');
const foodRouter = express.Router();

foodRouter.get('/foodHomePage', (req, res) => {
    res.render("foodCornerHomePage");
});

module.exports = foodRouter;
