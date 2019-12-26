Modal_js
==

```
Author : Yugeta.Koji
Date   : 2019.06.19
```


# Summary
WEBページにmodalダイアログの表示機能を追加します。
javascriptでのalertダイアログではデザインなどができないため、独自にダイアログ表示をしたい場合に便利に行うことができます。



# Sample
sampleフォルダのindex.htmlをブラウザで表示して「clickリンク」を押すと、modalダイアログが表示されます。



# Howto
```
new $$modal({
  // 表示サイズ
  size    : {
    width : "500px",
    height: "auto"
  },
  // 表示位置
  position : {
    vertical : "top",     // 縦 [top , *center(*画像などがある場合はサイズ指定してから使用すること) , bottom]
    horizon  : "center",  // 横 [left , *center , right]
    margin   : ["10px","10px","10px","10px"]   // [上、右、下、左]
  },
  // 閉じるボタン
  close   : {
    html  : "",
    size  : 20,
    click : function(){}
  },
  // [上段] タイトル表示文字列
  title   : "Title",
  // [中断] メッセージ表示スタイル
  message : {
    html   : "Message",
    height : "auto",
    align  : "left"
  },
  // [下段] ボタン
  button  : [
    {
      mode:"close",
      text:"Click",
      click : function(){}
    }
  ],
  // クリック挙動 [ "close" , "none" ]
  bgClick : "close",

  // modal表示後の実行function
  loaded : function(){}
});
```