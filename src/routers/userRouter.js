const conn = require("../connection");
const router = require("express").Router();
const isEmail = require("Validator/lib/isEmail");
const bcrypt = require("bcrypt");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const mailVerify = require("../email/nodemailer");
const powrt = require("../config/port");

const rootdir = path.join(__dirname + "/../../");
const photosdir = path.join(rootdir, "upload/photo");
const folder = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, photosdir);
  },
  filename: function(req, file, cb) {
    // Waktu upload nama field, extension file
    cb(null, Date.now() + file.fieldname + path.extname(file.originalname));
  }
});

const upstore = multer({
  storage: folder,
  limits: {
    fileSize: 1000000 // Byte , default 1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      // will be error if the extension name is not one of these
      return cb(new Error("Please upload image file (jpg, jpeg, or png)"));
    }

    cb(undefined, true);
  }
});

// CREATE ONE USERS
// router.post("/users", (req, res) => {
//   var { username, name, email, password } = req.body;

//   if (!isEmail(email)) {
//     return res.send("Email is not valid");
//   }

//   password = bcrypt.hashSync(password, 8);

//   const sql = `INSERT INTO users (username, name, email, password)
//             VALUES ( '${username}','${name}','${email}', '${password}' )`;

//   conn.query(sql, (err, result) => {
//     if (err) {
//       return res.send(err);
//     }
//     res.send(result);
//   });
// });
router.post("/users", (req, res) => {
  const sql = `INSERT INTO users SET ?`;
  const sql2 = `SELECT id,name, email, username, verified FROM users WHERE id= ?`;
  const data = req.body;

  // Cek apakah email valid
  if (!isEmail(data.email)) {
    return res.send("Email is not Valid");
  }

  // Mengubah password dalam bentuk hash
  data.password = bcrypt.hashSync(data.password, 8);

  // Insert data
  conn.query(sql, data, (err, result1) => {
    // Terdapat error ketika insert
    if (err) {
      return res.send(err);
    }

    //  Read data by user id untuk di kirim sebagai respon
    conn.query(sql2, result1.insertId, (err, result2) => {
      if (err) {
        return res.send(err);
      }
      var user = result2[0];
      mailVerify(user);
      res.send(result2);
    });
  });
});

// UPLOAD AVATAR
router.post("/users/avatar", upstore.single("apatar"), (req, res) => {
  const sql = `SELECT * FROM users WHERE username = ?`;
  const sql2 = `UPDATE users SET avatar = '${
    req.file.filename
  }' WHERE username = '${req.body.uname}'`;
  const data = req.body.uname;
  conn.query(sql, data, (err, result) => {
    if (err) return res.send(err);
    const user = result[0];
    if (!user) return res.send("user not found");

    conn.query(sql2, (err, result2) => {
      if (err) return res.send(err);
      res.send({
        message: "Upload Berhasil",
        filename: req.file.filename
      });
    });
  });
});

// ACCESS IMAGE
router.get("/users/avatar/:image", (req, res) => {
  const option = {
    root: photosdir
  };
  const fileName = req.params.image;

  res.sendFile(fileName, option, function(err) {
    if (err) return res.send(err);
    console.log("Berhasil kirim gambar ");
  });
});

// DELETE IMAGE
router.delete("/users/avatar", (req, res) => {
  const sql = `SELECT avatar FROM users WHERE username = '${req.body.uname}'`;
  const sql2 = `UPDATE users SET avatar = null WHERE username = '${
    req.body.uname
  }'`;
  conn.query(sql, (err, result) => {
    if (err) return res.send(err);
    // Nama file
    const fileName = result[0].avatar;
    // Alamat file
    const imgpath = photosdir + "/" + fileName;

    // delete image
    fs.unlink(imgpath, err => {
      if (err) res.send(err);

      // ubah jadi null
      conn.query(sql2, (err, result2) => {
        if (err) res.send(err);
        res.send("Delete Berhasil");
      });
    });
  });
});

// READ PROFILE
router.get("/users/profile/:username", (req, res) => {
  const sql =
    "SELECT username, name, email,avatar FROM users WHERE username = ?";
  const data = req.params.username;

  conn.query(sql, data, (err, result) => {
    if (err) return res.send(err);
    const user = result[0];
    // Jika user tidak ditemukan

    if (!user) return res.send("User not found");
    res.send({
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: `localhost:${powrt}/users/avatar/:imageName/${user.avatar}`
    });
  });
});

// UPDATE PROFILE

router.patch("/users/profile/:uname", (req, res) => {
  const sql = "UPDATE users SET ? WHERE username = ?";
  const sql2 = `SELECT username, name, email FROM users WHERE username = '${
    req.params.uname
  }'`;
  const data = [req.body, req.params.uname];

  //  UPDATE (ubah data user di)
  conn.query(sql, data, (err, result) => {
    if (err) return res.send(err);
    res.send(result);

    // SELECT (Ambil user dari database)
    conn.query(sql2, (err, result) => {
      // Result SELECT adalah array
      if (err) return res.send(err);
      // Kirim usernya dalam bentuk object
      res.send(result[0]);
    });
  });
});

// VERFIY USER
router.get("/verify", (req, res) => {
  const sql = `UPDATE users SET verified = true 
              WHERE username = '${req.query.uname}'`;

  conn.query(sql, (err, result) => {
    if (err) return res.send(err);

    res.send("<h1>Verifikasi berhasil</h1>");
  });
});
module.exports = router;
