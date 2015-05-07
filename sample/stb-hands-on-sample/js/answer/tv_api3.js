/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
   /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var video;
var chBanner;

var channelList = [];
var currentSource = null;



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
                  createChannelBanner(currentChannel);  
                }  
            }, function onerror(error) {
                errlog ('getChannels() error');
            });
            // ### TV Channel API ###  
        }, function onerror(error) {
            errlog ('setCurrentSource() error');
        });
        // ### TV Source ###
    }, function onerror(error) {
        errlog ('getTuners() error.');
   });
};
