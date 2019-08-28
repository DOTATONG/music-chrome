function music_down(){
	if (document.getElementById('g_iframe')==null) {
		return alert('无法解析页面')
	}
	//document.getElementById('g_iframe').contentWindow.document
	var page = document.getElementById('g_iframe').contentDocument
	var arr = page.getElementsByClassName('text')
	var list = []
	var name = []
	for(let i=0;i<arr.length;i++){
		if (arr[i].hasAttribute('title')) {
			name.push(arr[i].title)
		}
	}
	for(let i=0;i<page.getElementsByClassName('txt').length;i++){
		var item = []
		item.push(page.getElementsByClassName('txt')[i].children[0].getAttribute('href').replace(/[^0-9]*/,''))
		item.push(name[i]+'-'+page.getElementsByTagName('b')[i].title)
		list.push(item)
	}
	var msg = JSON.stringify(list)
	if (confirm('请确认格式是否正确？\n' + msg)){
		ws.send(msg)
		document.getElementById('dt-down').removeEventListener('click',music_down)
		document.getElementById('dt-down').innerHTML='下载中'
      	document.getElementById('dt-down').className='dt-ing'
	}
}

function music_msg(text){
	if (text=='ok') {
		document.getElementById('dt-msg').innerHTML="下载成功"
		document.getElementById('dt-msg').className='dt-done'
	}else{
		document.getElementById('dt-msg').innerHTML=text
		document.getElementById('dt-msg').className='dt-fail'
	}
	setTimeout(function(){
		document.getElementById('dt-msg').className=''
	},5000)
}

//状态按钮
dom = document.createElement("div")
dom.id = "dt-tcp"
document.body.appendChild(dom)

//下载按钮
dom = document.createElement("div")
dom.id = "dt-down"
dom.innerHTML = '下载'
document.body.appendChild(dom)
document.getElementById('dt-down').addEventListener('click',music_down)

//消息框
dom = document.createElement("div")
dom.id = "dt-msg"
document.body.appendChild(dom)

//页面脚本
var ws;
function music_connect(){
  ws = new WebSocket('ws://127.0.0.1:9966/')
  ws.onopen = function (e) {
	document.getElementById('dt-tcp').removeEventListener('click',music_connect)
	document.getElementById('dt-tcp').innerHTML='已连接'
	document.getElementById('dt-tcp').className='dt-live'
	document.getElementById('dt-down').className='dt-live'
	document.getElementById('dt-down').addEventListener('click',music_down)
	console.log('WebSocket已经打开: ')
	console.log(e)
  }
  ws.onmessage = function (e) {
	document.getElementById('dt-down').addEventListener('click',music_down)
	document.getElementById('dt-down').innerHTML='下载'
	document.getElementById('dt-down').className='dt-live'
	music_msg(e.data)

	console.log('WebSocket收到消息: ' + e.data)
  }
  ws.onclose = function (e) {
	document.getElementById('dt-tcp').addEventListener('click',music_connect)
	document.getElementById('dt-tcp').innerHTML='已断开'
	document.getElementById('dt-tcp').className='dt-dead'
	document.getElementById('dt-down').innerHTML='下载'
	document.getElementById('dt-down').className='dt-dead'
	music_msg('连接已断开')

	console.log('WebSocket关闭: ')
	console.log(e)
  }
  ws.onerror = function (e) {
	document.getElementById('dt-tcp').removeEventListener('click',music_connect)
	console.log('WebSocket发生错误: ')
	console.log(e)
  }
}
music_connect()
