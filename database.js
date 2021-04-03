module.exports = {
	
	numUsers: async function(conn){
		//const conn = await mysql.createConnection(config);
		let a = `SELECT id FROM heroku_00aeb0b4dc34359.users`;
		const [rows,fields] = await conn.execute(a);
		console.log(rows[rows.length-1]['id']);
		return rows[rows.length-1]['id'];
	},
	
	getInterfaces: async function(conn, id){
		let c = `SELECT * FROM heroku_00aeb0b4dc34359.users WHERE id=${id}`;
		let arr = [];
		const [rows1,fields1] =  await conn.execute(c);
		console.log(rows1);
		if(rows1[0].LTE == 1){
			arr.push("LTE");
		}
		if(rows1[0].LoRa==1){
			arr.push("LoRa");
		}
		if(rows1[0].WiFi==1)
		{
			arr.push("WiFi");
		}
		return arr;
	},
	
	Log: async function(conn, time, id, nameInt, CurMes){
		let d = `Insert into heroku_00aeb0b4dc34359.log(Moment, IdUser, Interface, Message) values ('${time}', ${id}, '${nameInt}', '${CurMes}')`;
		await conn.execute(d);
	},
	
	Add: async function(conn, id, Lora, Wifi, LTE, ip1, ip2){
		let d = `Insert into heroku_00aeb0b4dc34359.Users(Id, LTE, LoRa, WiFi) values (${id}, ${LTE}, ${Lora}, ${Wifi})`;
		console.log("id:"+id +" ip1:"+ ip1 +" ip2:"+ip2+" lora:"+Lora+" lte:"+LTE+" wifi:"+Wifi);
		await conn.execute(d);
		if(Lora ==1){
			let c = `Insert into heroku_00aeb0b4dc34359.lora(IdUser, Adress, vheshadress) values ('${id}', '${ip1}', '${ip2}')`;
			await conn.execute(c);
		}
		if(Wifi ==1){
			let c = `Insert into heroku_00aeb0b4dc34359.wifi(IdUser, Adress, vheshadress) values ('${id}', '${ip1}', '${ip2}')`;
			await conn.execute(c);
		}
		if(LTE ==1){
			let c = `Insert into heroku_00aeb0b4dc34359.lte(IdUser, Adress, vheshadress) values ('${id}', '${ip1}', '${ip2}')`;
			await conn.execute(c);
		}
	},
	
	Delete: async function(conn, id){
		let d = `Delete FROM heroku_00aeb0b4dc34359.lte where IdUser= ${id}`;
		await conn.execute(d);
		let c = `Delete FROM heroku_00aeb0b4dc34359.wifi where IdUser= ${id}`;
		await conn.execute(c);
		let e = `Delete FROM heroku_00aeb0b4dc34359.lora where IdUser= ${id}`;
		await conn.execute(e);
		let k = `Delete FROM heroku_00aeb0b4dc34359.users where Id= ${id}`;
		await conn.execute(k);
	}
};
