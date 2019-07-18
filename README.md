# expressでhtmlを配信する

- 静的ファイルとして配信する
- テンプレートエンジンを利用して配信する（データを渡して動的なhtmlを配信したい場合）

もし上記の方法を利用しない場合は、htmlを文字列で組み立てて`send`する必要がある。テンプレートエンジンを使うと、htmlを書いた別ファイルを返却する事が可能となる。

### htmlを文字列で組み立てる例
```JS
app.get("/",(req,res)=>{
  let data = "<!DOCTYPE html>\r\n";
  data += "<html>\r\n";

  ~ 略 ~

  data += "</html>";
  res.status(200).send(data);
});
```

## 静的ファイルとして配信する

```JS
// ルートへのアクセスと/public以下が対応
app.use(express.static(__dirname + "/public")); 
// /public以下と/public以下が対応
app.use("/public",express.static(__dirname + "/public"));
```

## テンプレートエンジンを利用

どのテンプレートエンジンを使うか宣言

```JS
app.set("view engine","ejs");
```
テンプレートを返却。上述の宣言はテンプレートを返却する際に、テンプレートの拡張子（.html、.ejs）まで記述するならば必要ない。宣言をすると拡張子を省略した場合に補ってくれる。

```JS
app.get("/",(req,res)=>{

  res.render("index.html"[, locals]); // localsはテンプレートへ渡したいデータ
});
```

# passport.js


- 認証とは<br>
  ユーザーが誰かを判定
- 認可とは<br>
  認証の後、そのユーザーがどのリソースにアクセス出来るか制御

## expressとpassport.js

- passport
- passport-local
- express-session
  - 最低限の実装をするならば不要。ログイン後のページ遷移で認証済みである事を引き継ぐため。サーバー側でセッションを作成。
  ```JS
  app.use(session({
    secret: "qwerty",
    resave: false, // セッション内容に変更がない場合にも保存するか
    saveUninitialized: true,
    name: "sid" // クッキーに何という名前で保存されるか
  }));
  ```
- body-parser
  - formからpostされるデータを受け取れるようにする。**express-generator**で作業ディレクトリを作成する場合は、body-parse無しでpostされたデータを受け取れる。
  ```JS
  // formからしかpostしないならばこれだけ
  app.use(bodyParser.urlencoded({extended:true}));
  // ajaxでもpostしたい場合は下記も必要
  app.use(bodyParser.json());
  ```
- cookie-parser
  - 最低限の実装をするならば不要。express-sessionで作成したセッションの情報をクライアントのクッキーに送受信する。
- connect-flash
  - flashメッセージを表示したい場合に利用（ログインに失敗しましたなど）

## 最低限の実装

- ログイン画面とログイン後の画面をejsで用意
- app.jsとrouter.jsを用意
- passport.jsを実装して行く
- "/"へのpostがあれば"mylogin"という認証処理をする。認証に成功すれば"/member"、失敗すれば"/"にリダイレクトする。

```JS
router.post("/",passport.authenticate(
  "mylogin",
  {
    successRedirect: "/member",
    failureRedirect: "/"
  }
));
```

"mylogin"という認証処理を作成する。

```JS
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
```

認証が成功したらユーザーのセッションと紐づけて鍵を保存

```JS
passport.serializeUser( (username,done) => {

  done(null,username);
});
```

上記の処理を有効化

```JS
router.use(passport.initialize());
```