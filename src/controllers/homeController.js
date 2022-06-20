import db from '../models/index';
import CRUDService from '../sevices/CRUDService';

let getHomePage = async (req, res) => {
    // return res.send("Hello from controller")
    try {
        let data = await db.User.findAll();
        // console.log("----------");
        // console.log(data);
        // console.log("-----------");
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e)
    }


}
let getAboutPage = (req, res) => {
    return res.render('test/about.ejs')
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    // console.log(req.body)
    let message = await CRUDService.createNewUser(req.body);
    console.log(message)
    return res.send('Posted');
    // return res.redirect('/get-crud');
}

let displayGetCRUD = async (req, res) => {
    let displayData = await CRUDService.getAllUsers();
    console.log('------')
    console.log(displayData)
    console.log('------')
    // return res.send('display get CRUD')
    return res.render('displayCRUD.ejs', {
        dataTable: displayData,
    })
}

let editCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInforById(userId);
        // check existence of user
        if (userData) {
            return res.render('editCRUD.ejs', {
                user: userData,
            })
        }

    } else {
        return res.send('Not found User (id) from homeController')
    }
}
let putCRUD = async (req, res) => {
    let data = req.body;
    console.log("body", req.body)
    let allUsers = await CRUDService.updateUserData(data);
    return res.redirect('/get-crud');
    // return res.render('displayCRUD.ejs', {
    //     dataTable: allUsers,
    // })
}

let delCRUD = async (req, res) => {
    let userId = req.query.id;
    await CRUDService.deleteUser(userId);
    return res.redirect('/get-crud');
}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,

    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    editCRUD: editCRUD,
    putCRUD: putCRUD,
    delCRUD: delCRUD,

}