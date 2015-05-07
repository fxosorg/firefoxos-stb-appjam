/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
   /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var video;
var chBanner;

var channelList = [];
var currentSource = null;

window.addEventListener("keydown" , KeyDownFunc);  

window.onload = function() {
    var tv = window.navigator.tv;
    video = document.getElementById('tv');

    if (!tv) {
        errlog ('failed to get tv. check permission.');
        return;
    }

    tv.getTuners().then (function onsuccess(tuners) {
        if (tuners.length == 0) {
            errlog ('getTuners() fail.');
            return;
        }
        tuners[0].setCurrentSource ('isdb-t').then(function onsuccess() {
            video.mozSrcObject = tuners[0].stream;
            currentSource = tuners[0].currentSource;
            currentSource.getChannels().then(function onsuccess(channels) {
                chBanner = document.getElementById('channel-banner');
                if (channels.length == 0) {
                    addBanner ('Service Not Found.');
                } 
                else {             
                  channels.forEach (function (ch) { 
                    if (channelList.some(function (e) {
                       return ((e.transportStreamId == ch.transportStreamId) || (e.number == ch.number))
                    })) 
                    {
                      return;
                    }
                    channelList.push (ch);
                  }); 
                  var currentChannel = channelList[0];

                  TvTuning(currentChannel);
                    
                  currentChannel.getCurrentProgram().then(function onsuccess(program) {
                       createChannelProgramBanner(currentChannel, program);
                  }, function onerror(error) {
                       errlog ('getCurrentProgram() error');
                  });
                }  
            }, function onerror(error) {
                errlog ('getChannels() error');
            });
        }, function onerror(error) {
            errlog ('setCurrentSource() error');
        });
        // ### TV Source ###            
    }, function onerror(error) {
        errlog ('getTuners() error.');
   });
};


function KeyDownFunc(event) { 

    var key = event.keyCode;
    //dbglog('kc = ' + key);
  
    var channelList_index = 0;
   
    switch(key) {
    case KeyEvent.DOM_VK_1:
       channelList_index = 0;
       if(channelList.length <= channelList_index){ return; }
       break;
    case KeyEvent.DOM_VK_2:
       channelList_index = 1;
       if(channelList.length <= channelList_index){ return; }
       break;
    case KeyEvent.DOM_VK_3:
       channelList_index = 2;
       if(channelList.length <= channelList_index){ return; }
       break;
    case KeyEvent.DOM_VK_4:
       channelList_index = 3;
       if(channelList.length <= channelList_index){ return; }
       break;
    case KeyEvent.DOM_VK_5:
       channelList_index = 4;
       if(channelList.length <= channelList_index){ return; }
       break;
    case KeyEvent.DOM_VK_6:
       channelList_index = 5;
       if(channelList.length <= channelList_index){ return; }
       break;
    case KeyEvent.DOM_VK_7:
       channelList_index = 6;
       if(channelList.length <= channelList_index){ return; }
       break;
    case KeyEvent.DOM_VK_8:
       channelList_index = 7;
       if(channelList.length <= channelList_index){ return; }
       break;
    case KeyEvent.DOM_VK_9:
       channelList_index = 8;
       if(channelList.length <= channelList_index){ return; }
       break;
    case KeyEvent.DOM_VK_10:
       channelList_index = 9;
       if(channelList.length <= channelList_index){ return; }
       break;
    case KeyEvent.DOM_VK_11:
       channelList_index = 10;
       if(channelList.length <= channelList_index){ return; }
       break;
    case KeyEvent.DOM_VK_12:
       channelList_index = 11;
       if(channelList.length <= channelList_index){ return; }
       break;
    case KeyEvent.DOM_VK_UP:
       TvSetFrameSize(1); 
       return;
       break;
    case KeyEvent.DOM_VK_DOWN:
       TvSetFrameSize(0.5); 
       return;
       break;
    default:
       errlog('no key action');
       return;  // return
       break;
    }           
    
    var currentChannel = channelList[channelList_index];

    TvTuning(currentChannel);

    resetBanner ();    
    currentChannel.getCurrentProgram().then(function onsuccess(program) {
        createChannelProgramBanner(currentChannel, program);  
    }, function onerror(error) {
         errlog ('getCurrentProgram() error');
    });
}

