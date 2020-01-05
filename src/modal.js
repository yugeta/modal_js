;$$modal = (function(){
  /**
   * ModalJS
   * ==
   * [Summary]
   *  alertやconfirm処理をデザイン対応する時のモーダル表示処理。
   *  背景に黒半透明elmを置くことで、画面のelementにアタッチできなくさせる。
   * [Howto]
   * 
   *  
   */
  var __event = function(target, mode, func){
		if (typeof target.addEventListener !== "undefined"){target.addEventListener(mode, func, false);}
    else if(typeof target.attachEvent !== "undefined"){target.attachEvent('on' + mode, function(){func.call(target , window.event)});}
  };
  // [共通関数] URL情報分解
	var __urlinfo = function(uri){
    uri = (uri) ? uri : location.href;
    var data={};
    var urls_hash  = uri.split("#");
    var urls_query = urls_hash[0].split("?");
		var sp   = urls_query[0].split("/");
		var data = {
      uri      : uri
		,	url      : sp.join("/")
    , dir      : sp.slice(0 , sp.length-1).join("/") +"/"
    , file     : sp.pop()
		,	domain   : sp[2]
    , protocol : sp[0].replace(":","")
    , hash     : (urls_hash[1]) ? urls_hash[1] : ""
		,	query    : (urls_query[1])?(function(urls_query){
				var data = {};
				var sp   = urls_query.split("#")[0].split("&");
				for(var i=0;i<sp .length;i++){
					var kv = sp[i].split("=");
					if(!kv[0]){continue}
					data[kv[0]]=kv[1];
				}
				return data;
			})(urls_query[1]):[]
		};
		return data;
  };
  // 起動scriptタグを選択
  var __currentScriptTag = (function(){
    var scripts = document.getElementsByTagName("script");
    return __currentScriptTag = scripts[scripts.length-1].src;
  })();

  var __options = {
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
  };


  var $$ = function(options){
    this.reflectOptions(options);

    // margin-adjust
    for(var i=0; i<4; i++){
      this.options.position.margin[i] = (this.options.position.margin[i]) ? this.options.position.margin[i] : 0;
    }

    // view
    this.view_template(__modal_template);
  };



  $$.prototype.reflectOptions = function(options){
    if(!options){return;}
    var tmp = {};
    for(var i in __options){
      tmp[i] = __options[i];
    }
    for(var i in options){
      tmp[i] = options[i];
    }
    this.options = tmp;
  };

  $$.prototype.view_template = function(template){

    document.body.insertAdjacentHTML("beforeend",template);

    // BG
    var bg = document.querySelector(".modal");
    if(this.options.bgClick === "close"){
      __event(bg , "click" , (function(e){this.clickBg(e)}).bind(this));
    }

    // Base
    var base = bg.querySelector(".modal .modal-base");
    base.style.setProperty("width"  , this.options.size.width  , "");
    base.style.setProperty("height" , this.options.size.height  , "");

    // Close
    var close = bg.querySelector(".modal .modal-close");
    var close_icon = close.querySelector(".modal-close-icon");
    close_icon.innerHTML = this.options.close.html;
    close.style.setProperty("width"  , this.options.close.size + "px" , "");
    close.style.setProperty("height" , this.options.close.size + "px" , "");
    if(this.options.close.click){
      __event(close , "click" , this.options.close.click);
    }
    close.onclick   = (function(e){this.close(e);}).bind(this);

    // Title
    var title = bg.querySelector(".modal-title");
    title.innerHTML = this.options.title;

    // Message
    var message = bg.querySelector(".modal-message");
    message.style.setProperty("height" , this.options.message.height , "");
    message.style.setProperty("text-align" , this.options.message.align , "");
    var message_contents = bg.querySelector(".modal-message-contents");
    message_contents.innerHTML = this.options.message.html;

    // Buttons
    var btnArea = bg.querySelector(".modal-button-area");
    var btn = [];
    for(var i in this.options.button){
      btn[i] = document.createElement("button");
      btn[i].className = "modal-button";
      btn[i].innerHTML = this.options.button[i].text;
      if(this.options.button[i].click){
        __event(btn[i] , "click" , this.options.button[i].click);
      }
      if(this.options.button[i].mode === "close"){
        __event(btn[i] , "click" , (function(e){this.close(e);}).bind(this));
      }
      btnArea.appendChild(btn[i]);
    }

    // position
    this.setPosition(base);

    // animation
    bg.setAttribute("data-view","1");

    // loaded-function
    this.options.loaded(this);
  };

  $$.prototype.setPosition = function(base){

    // 縦位置
    switch(this.options.position.vertical){
      case "top":
        base.style.setProperty("top" , "0" , "");
        break;
      case "bottom":
        base.style.setProperty("margin-top"    , (document.documentElement.clientHeight) - (base.offsetHeight) + "px" , "");
        break;
      case "center":
        base.style.setProperty("margin-top"    , (document.documentElement.clientHeight / 2) - (base.offsetHeight / 2) + "px" , "");
        break;
    }
    
    // 横位置
    switch(this.options.position.horizon){
      case "left":
        base.style.setProperty("margin-left"  , "0"    , "");
        base.style.setProperty("margin-right" , "auto" , "");
        break;
      case "right":
        base.style.setProperty("margin-left"  , "auto" , "");
        base.style.setProperty("margin-right" , "0"    , "");
        break;
      case "center":
        base.style.setProperty("margin-left"  , "auto" , "");
        base.style.setProperty("margin-right" , "auto" , "");
        break;
    }

    // マージン
    var modal = base.parentNode;

    // top
    if(this.options.position.margin[0]){
      modal.style.setProperty("padding-top" , this.options.position.margin[0] , "");
    }
    // right
    if(this.options.position.margin[1]){
      modal.style.setProperty("padding-right" , this.options.position.margin[1] , "");
    }
    // bottom
    if(this.options.position.margin[2]){
      modal.style.setProperty("padding-bottom" , this.options.position.margin[2] , "");
    }
    // left
    if(this.options.position.margin[3]){
      modal.style.setProperty("padding-left" , this.options.position.margin[3] , "");
    }
    
  };

  $$.prototype.close = function(){
    // setTimeout(function(){
      var modal = document.querySelector(".modal");
      if(!modal){return;}
      modal.setAttribute("data-view" , "0");
      setTimeout(function(){
        var modal = document.querySelector(".modal");
        modal.parentNode.removeChild(modal);
      },500);
    // },100);
  };

  $$.prototype.clickBg = function(e){
    var target = e.target;
    if(!target.matches(".modal")){return;}
    this.close();
  };



  // [初期設定] 基本CSSセット(jsと同じ階層同じファイル名.cssを読み込む)
  var head = document.getElementsByTagName("head");
  var base = (head) ? head[0] : document.body;
  var modal_pathinfo = __urlinfo(__currentScriptTag);
  var css  = document.createElement("link");
  css.rel  = "stylesheet";
  var model_css = modal_pathinfo.dir + modal_pathinfo.file.replace(".js",".css");
  var query = [];
  for(var i in modal_pathinfo.query){
    query.push(i);
  }
  css.href = model_css +"?"+ query.join("");
  base.appendChild(css);

  var __modal_template = "";

  // ajax読み込み（事前に読み込まれていない場合のみ）
  if(typeof $$ajax === "undefined"){
    var s = document.createElement("script");
    s.src = modal_pathinfo.dir + "ajax.js";
    s.onload = function(){
      init();
    }
    document.getElementsByTagName("head")[0].appendChild(s);
  }
  else{
    init();
  }

  var init = function(){
    // template読み込み
    var modal_template_file = modal_pathinfo.dir + modal_pathinfo.file.replace(".js",".html");
    new $$ajax({
      url : modal_template_file,
      method : "get",
      query : {
        exit : true
      },
      onSuccess : function(res){
        __modal_template = res;
      }
    });
  }

  return $$;
})();