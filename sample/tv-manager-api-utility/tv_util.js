/**
 * TV Manager API 用 Util ライブラリ
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *
 * 指定した video タグに Tuner の映像を表示し、番組の切り替えを簡単にするためのユーティリティです。
 * (プログラム情報の取得などは未対応なので、TV Manager API を参考にしてください)
 * 
 * Sample:
 *   var util = new TVUtil(document.getElementById("video-tag"));
 *   util.addEventListener("initcomplete", function() {
 *     util.play();
 *     addEventListener("keydown", function(event){
 *       switch(event.keyCode){
 *         case 37:
 *           util.setChannel(util.getChannelList[0]);
 *           break;
 *         case 39:
 *           util.setChannel(util.getChannelList[1]);
 *           break;
 *       }
 *     });
 *   });
 * 
 * API :
 * [Method]
 *  TVUtil(video)       :  コンストラクタ。HTMLVideoElement(videoタグ) を引数として必ず入れてください。
 *  play()              :  Tuner から取得したストリームを再生します。
 *  getChannelList      :  変更可能なチャネル番号のリスト。ここで取得した番号は、チャンネル変更メソッドで利用します。
 *  setChannel          :  チャンネルを指定したチャンネル番号に変更します。
 *  getChannelFromNumber:  チャンネル番号からチャンネルオブジェクトを取得します。プログラム情報はこのチャンネルオブジェクトから取得できます。
 * 
 * [Event]
 *  initcomplete        :  TV Manager API を利用するための初期化が完了した事を通知します。
 * 
 */
function TVUtil(video) {
  if(!video) {
    throw new Error("parameter is null");
  }
  
  if(!navigator.tv) {
    throw new Error("navigator.tv not found. Should define \"tv permission\".");
  }
  
  this._listeners = [];
  this.eventsName = ["initcomplete"];
  this.isCompleteInitialize = false;
  this.video = undefined;
  this.tuners = undefined;
  this.sources = undefined;
  this.channels = undefined;
  
  this.init(video);
}

TVUtil.prototype = {  
  init : function tv_util_init(video) {
    this.video = video;
    var me = this;
    
    navigator.tv.getTuners().then(function(t) {
        me.tuners = t;
        me.setSource(me.tuners[0], "isdb-t"); //If you specific source type, add 2nd parameter.
        me.getSources(me, me.tuners[0]);
      }, function(){
        throw new Error("failed getTuners");
      });
  },
  
  setSource : function tv_util_set_source(tuner, type) {
    if(!tuner) throw new Error("tuner is null");
    if(!type) type = "isdb-t";
    
    tuner.setCurrentSource(type).then(function(){}, function(){
      throw new Error("failed setCurrentSources");
    });
  },
  
  getSources : function tv_util_get_tuners(target, tuner){
    tuner.getSources().then(function(s){
      target.sources = s;
      target.getChannelDetails(target, target.sources[0]);
    }, function(){
     throw new Error("failed getSources");
    });
  },
  
  getChannelDetails : function tv_util_get_channel_numbers(target, source) {
    source.getChannels().then(function(c){
      target.channels = target.channels || [];
      
      for(var i=0; i<c.length; i++) {
        target.channels.push(c[i]);
      }
      
      // Fire Finish Init Event
      target.isCompleteInitialize = true;
      target.dispatch(target.eventsName[0]);
    }, function() {
      throw new Error("failed getChannels");
    })
  },
  
  play : function tv_util_play_video() {
    if(!this.isCompleteInitialize) {
      throw new Error("not complete init()");
    }
    this.video.mozSrcObject = this.tuners[0].stream;
    this.video.play();
  },
  
  getChannelList : function tv_util_get_channel_list() {
    if(!this.isCompleteInitialize) {
      throw new Error("not complete init()");
    }
    var retChannelList = new Array();
    for(var i=0; i<this.channels.length; i++){
      retChannelList.push(this.channels[i].number);
    }
    return retChannelList;
  },
  
  setChannel : function tv_util_set_channel(channelNumber) {
    if(!this.isCompleteInitialize) {
      throw new Error("not complete init()");
    }
    
    if(!this.getChannelFromNumber(channelNumber)){
      throw new Error("can't find [" + channelNumber + "] channel.");
    }
    
    this.sources[0].setCurrentChannel(channelNumber);
  },
  
  getChannelFromNumber : function tv_util_get_channel_from_number(number) {
    if(!this.isCompleteInitialize) {
      throw new Error("not complete init()");
    }
    
    for(var i=0; i<this.channels.length; i++) {
      if(this.channels[i].number === number) {
        return this.channels[i];
      }
    }
    
    return null;
  },
  
  addEventListener : function tv_util_add_event_listener(event, listener) {
    if(this.eventsName.indexOf(event) == -1) return;
    this._listeners[event] = this._listeners[event] ||  [];
    if(this._listeners[event]){
      this._listeners[event].push(listener);
    }
    
    //If finish initialize , fire completed event.
    if(this.isCompleteInitialize) 
      this.dispatch(this.eventsName[0]);
  },
  removeEventListener : function tv_util_remove_event_listener(event, listener) {
    if ( this._listeners[event] ) {
      var listeners = this._listeners[event];
      for ( var i = listeners.length-1; i>=0; --i ){
        if ( listeners[i] === listener ) {
          listeners.splice( i, 1 );
          return true;
        }
      }
    }
    return false;
  },
  dispatch : function tv_util_dispatch_event(event, eventObject) {
    if ( this._listeners[event] ) {
      var listeners = this._listeners[event], len = listeners.length;
      while ( len-- ) {
        listeners[len](this, eventObject);	
      }
    }
  },
  
}