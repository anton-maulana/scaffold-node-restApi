const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');

const AppController = () => {
    const home = async (req, res) => {
        res.render('home',{title:"RESTful Crud Example"});
    }

    return {
        home,
    };
}

module.exports = AppController;