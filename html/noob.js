const responses = {
	典: [
		'赢',
		'孝',
		'不用',
		'觉',
		'认',
	],
	孝: [
		'典',
		'支',
		'不错',
		'同',
		'对',
		'你好',
		'妈',
		'谢',
	],
	急: [
		'孝',
		'??',
		'？？',
		'不是',
		'病',
		'疯',
		'sb',
		'傻',
		'逼',
		'蚌',
		'妈',
	],
	乐: [
		'孝',
		'典',
		'急',
		'赢',
		'蚌',
		'麻',
		'妈',
		'是吧',
		'没完',
	],
	蚌: [
		'急',
		'赢',
		'妈',
		'停',
		'别',
	],
	赢: [
		'蚌',
	],
	麻: [
		'典',
	],
	确实: [
		'图灵',
		'离谱',
	]
};

const uuid = window.localStorage ? localStorage.getItem('uuid') || (()=>{
	const v = Math.random().toString(36).slice(2);
	localStorage.setItem('uuid',v);
	return v;
})() : '0';

// 模拟延迟
function simulateNetworkRequest(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, Math.random() * 1000 + 500 + ms); //随机延迟500到1500ms
	});
}

let lastUserMessages = [];

function getBotResponse(userMessage) {
	let keywords = [];

	// 在用户消息中匹配关键词
	for(const key in responses) {
		const values = responses[key];
		for(const value of values) {
			if(userMessage.includes(value)) {
				keywords.push(key);
				break;
			}
		}
	}

	if(!keywords.length) {
		keywords = [
			'乐',
			'蚌',
			'典',
		]
	}


	// if(keywords.length > 1) {
	if(lastUserMessages.length){
		const lastUserMessage = lastUserMessages[lastUserMessages.length - 1];
		const lastUserMessageIndex = keywords.indexOf(lastUserMessage);
		if(lastUserMessageIndex !== -1) {
			keywords.splice(lastUserMessageIndex, 1);
		}
	}

	if(keywords.length > 1 && lastUserMessages.length > 1){
		const lastUserMessage = lastUserMessages[lastUserMessages.length - 2];
		const lastUserMessageIndex = keywords.indexOf(lastUserMessage);
		if(lastUserMessageIndex !== -1) {
			keywords.splice(lastUserMessageIndex, 1);
		}
	}



	if(!keywords.length) {
		keywords = [
			'乐',
			'蚌',
			'典',
		]
	}




	// 随机选择一个回应, 如果没有匹配到关键词,返回默认值
	let response = keywords[Math.floor(Math.random() * keywords.length)];
	return response;
}

const userInputEl = document.getElementById("user-input");
const messagesListEl = document.querySelector(".messages-list");
const htmlEl = document.documentElement;
const inputAreaEl = document.getElementById("input-area");

const messagesEl = document.getElementById("messages");
const scrollToBottom = () => {
	htmlEl.scrollTop = htmlEl.scrollHeight;
};


const watingEl = document.querySelector('.waiting');

inputAreaEl.addEventListener("submit", async (e) => {
	e.preventDefault();
	
	const userInput = userInputEl.value.trim();
	if (userInput === '') return;

	userInputEl.disabled = true;

	// 用户信息显示
	const userMessageElement = document.createElement("div");
	userMessageElement.className = "message user-message";
	userMessageElement.textContent = userInput;
	messagesEl.appendChild(userMessageElement);

	scrollToBottom();

	// 清空输入框
	userInputEl.value = '';

	onInput();

	watingEl.setAttribute('data-hide','false');

	// 模拟网络延迟
	await simulateNetworkRequest( userInput.length * 20 );
	const botMessage = getBotResponse(userInput);

	lastUserMessages.push(botMessage);

	// Bot信息显示
	const botMessageElement = document.createElement("div");
	botMessageElement.className = "message bot-message";
	botMessageElement.textContent = botMessage;
	messagesEl.appendChild(botMessageElement);

	// 滚动至底部
	scrollToBottom();

	userInputEl.disabled = false;
	userInputEl.focus();

	watingEl.setAttribute('data-hide','true');

	new Image().src = `https://lab.magiconch.com/api/noobgpt/log?uuid=${uuid}&t=${encodeURIComponent(userInput)}&r=${encodeURIComponent(botMessage)}`;
});


const onInput = ()=>{

	const v = userInputEl.value.trim();
	inputAreaEl.setAttribute('data-have-value', v ? 'true' : 'false');
}

userInputEl.addEventListener('input',onInput);




// 访问统计
const el = document.createElement('script');
el.setAttribute('data-cf-beacon','{"token": "203ba33cb58c43f0a0e06479f52e4c1b"}');
el.src = 'https://static.cloudflareinsights.com/beacon.min.js';
document.body.appendChild(el);