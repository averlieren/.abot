var Config      = require('./config.js');
var Logger      = require('./logger.js');
var Permissions = require('./permissions3.js');
var Roles       = require('./roles.js');

var path        = require('path');
var Discord     = require('discord.js');
var fs          = require('fs');
var request     = require('request');
var ytdl        = require('ytdl-core');

var config      = new Config();
var logger      = new Logger();
var log         = function(pre, msg){pre = pre || "";logger.log(pre, msg);}
var prefix      = conf.get('prefix');



function Commands(bot, message){

}
