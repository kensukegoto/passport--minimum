const router = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


passport.use("mylogin",
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
  },(req,username,password,done) => {

    if(username==="user" && password==="password"){
      return done(null,username);
    }

    return done(null,false);

  })
);

// ユーザー情報を登録する
passport.serializeUser( (username,done) => {
  // ここでハッシュ化するなどの処理をするが今回は特に何もしない

  console.log(username)  
  done(null,username); // 成功した場合はこの記述※usernameを何処かに渡している場合ではない。
});

// クライアントとのセッションがあった場合
passport.deserializeUser( (username,done) => {
  // ここで正しいかの判定処理をするが今回は特に何もしない

  done(null,username); // 成功した場合はこの記述※usernameを何処かに渡している場合ではない。
});


router.use(passport.initialize());

router.get("/",(req,res) => {
  
  res.render("./login.ejs");
});

router.post("/",passport.authenticate(
  "mylogin",
  {
    successRedirect: "/member",
    failureRedirect: "/"
  }
));

router.get("/member",(req,res) => {
  res.render("./member.ejs");
});

module.exports = router;