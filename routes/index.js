const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const authenticate = require('../authenticate');
const router = express.Router();
const multer =require('multer');
const path = require ('path');

const storage = multer.diskStorage({
	destination :'./public/uploads/',
	filename : function(req,file,cb){
		cb(null,file.fieldname+'_'+Date.now()+path.extname(file.originalname))
	}
});
var upload = multer({
	storage:storage,
	limits:{filesize:10},
	fileFilter:function(req,file,cb){
		checkFileType(file,cb);
	}
}).single('myImg');

//check the file Type
function checkFileType(file,cb){
	//allowed Extentions
	var filetypes = /jpeg|jpg|png|gif/;
	//check extends
	var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	//check mime type
	var mimetype =filetypes.test(filr.mimetype);
	
	if(mimetype && extname){
		return cb(null,true);
		
	}else{
		cb ('Error:Images Only!');
	}
}

router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
        if (err) {
			 res.statusCode = 500;
          return res.render('register', { error : err.message });
			  
		}

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
				 res.statusCode = 200;
                res.redirect('/');
            });
        });
    });
});


router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
	 var token = authenticate.getToken({_id: req.user._id});
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
		res.statusCode = 200;
        res.redirect('/');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
		res.statusCode = 200;
        res.redirect('/');
    });
});

/*
router.post('/upload', (req, res, next) =>{
	//res.send('test');
	upload(res,res,(err)=>{
		if(err){
		res.render('index',{
			msg:err
		});
		
		}else{
			 if(req.file === undefined){
				 res.render('index',{
					 msg:'Error: No file Selected'
				 });
				 
			 }else{
				 res.render('index',{
					 msg:'File Uploaded!',
					 file:`uploads/${req.file.filename}`
				 });
			 }
		}
	})
   Jimp.read(req.body).then(function (lenna) {
    lenna.resize(50, 50)            // resize
         .quality(60)                 // set JPEG quality              
         .write("lena-small-bw.jpg"); // save
}).catch(function (err) {
    console.error(err);
});
});

*/

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

module.exports = router;
