const express = require('express');
const bodyParesr = require('body-parser');
const mysql = require('mysql2/promise');
const config = require('./config'); 
const bd = require('./database'); 
const dgram = require('dgram');//npm i dgram
const client = dgram.createSocket('udp4');
const client1 = dgram.createSocket('udp4');

const app = express();
app.set('view engine','ejs');
app.use(bodyParesr.urlencoded({extended: true}));
const PORT = process.env.PORT || 8080;
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}


async function main(){
	const conn = await mysql.createConnection(config);
	
	let arr = [];
	let arr2 = [];
	let tmp;
	let numU = await bd.numUsers(conn);
	
	async function getNumUsers(){
		numU = await bd.numUsers(conn);
	}
	
	//console.log(numU);
	app.get('/', (req,res) => {
		getNumUsers();
		res.render('HomePage',{b:numU});
	});
	app.post('/',(req,res) => {
		tmp  = req.body.id;
		 per();
		res.redirect('/send');
	});	
	
	async function per()
	{
		arr2 =  await bd.getInterfaces(conn,tmp);
		console.log(arr2);
	}
	
	
	async function writeLog(nameInt,CurMes){
		bd.Log(conn,getDateTime(),tmp,nameInt,CurMes);
	}
	
	app.get('/send', (req,res) =>{
		res.render('HomePage1',{arr:arr2});
	});
	app.post('/send',(req,res) => {
		arr.push("id:"+tmp +" Interface:"+ req.body.inter +" message:"+req.body.message);
		
		writeLog(req.body.inter, req.body.message);
		arr2 = [];
		res.redirect('/');
	});
	app.get('/list',(req,res) => res.render('ViewList',{arr:arr}));	
	
	app.get('/admin', (req,res) =>{
		res.render('HomeAdmin');
	});
	
	async function ADD(lora, lte,wifi, ip1, ip2){
		getNumUsers();
		bd.Add(conn,(numU+1), lora, wifi, lte, ip1, ip2);
	}
	
	app.get('/admin/add', (req,res) =>{
		getNumUsers();
		console.log("id:"+numU);
		res.render('Add');
	});
	app.post('/admin/add', (req,res) =>{
		
		console.log("id:"+(numU+1) +" ip1:"+ req.body.ip1 +" ip2:"+req.body.ip2+"lora:"+req.body.lora+"lte:"+req.body.lte+"wifi:"+req.body.wifi);
		var l=0;
		var w=0;
		var lo=0;
		if(req.body.lte == 'yes'){
			l=1;
		}
		if(req.body.lora == 'yes'){
			w=1;
		}
		if(req.body.wifi == 'yes'){
			lo=1;
		}
		
		ADD(lo, l, w, req.body.ip1, req.body.ip2);
		/*const man ={
			ip1: req.body.ip1,
			ip2: req.body.ip2
		};
		client1.send(JSON.stringify(man), 41234, '192.168.0.101', (err) => {
			client1.close();
		});*/
		res.redirect('/admin');
	});
	
	
	
	async function Delete(id){
		bd.Delete(conn, id);
	}
	app.get('/admin/delete', (req,res) =>{
		getNumUsers();
		res.render('Delete',{b:numU});
	});
	
	app.post('/admin/delete',(req,res) => {
		tmp1  = req.body.id;
		Delete(tmp1);
		res.redirect('/admin');
	});
	
	
	
	
	app.listen(PORT);
	console.log('Сервер стартовал!'+PORT);
}

main();
