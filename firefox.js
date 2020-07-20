const { addExtra } = require('puppeteer-extra')
puppeteer = addExtra(require('puppeteer-firefox-dl'))
const running = require('is-running');
 
// add stealth plugin and use defaults (all evasion techniques)
const pluginStealth = require("puppeteer-extra-plugin-stealth");
puppeteer.use(pluginStealth());

var domain = [
"idiva.com"
];

var uas = [
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:71.0) Gecko/20100101 Firefox/71.0",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Safari/605.1.15",
];

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


const choice = function(arr){
	return arr[Math.floor(Math.random()*arr.length)];
};


var arguments = process.argv.splice(2);

if(arguments.length !== 1){
	return;
}

var arg = arguments[0];
if(arg==undefined){
	return;
}

function checkDuration(page){

}

var asyncFunc = async function(queue){
	var running_timeout;

	const restart0 = async function(pid){
		var is_running = running(pid);
		while(is_running){
			await delay(1000);
			is_running = running(pid);
			if(!is_running)
				break;
		}
		await asyncFunc();
	};

	const restart = async function(){
		await delay(3000);
		await asyncFunc();
	};

	if ("a" == "a"){
		var userAgent 	= choice(uas);
		var domainbot	= choice(domain);
		var timestamp   = (new Date()).valueOf();

		function sniffDetector() {
			const newProto = navigator.__proto__;
			delete newProto.webdriver;
			navigator.__proto__ = newProto;
		}

		const browser = await puppeteer.launch({
			headless: false,
			defaultViewport: null,
			ignoreHTTPSErrors: true,
			args: [
				'--disable-sync',
				'--safebrowsing-disable-auto-update',
				'--disable-gpu',
				'--no-first-run',
				'--no-zygote',
				'--no-sandbox', 
				'--disable-setuid-sandbox',
				'--disable-infobars',
				'--disable-breakpad',
			  	'--disable-notifications',
				'--disable-desktop-notifications',
				'--disable-component-update',
				'--disable-background-downloads',
				'--disable-add-to-shelf',
				'--disable-datasaver-prompt',
				'--ignore-urlfetcher-cert-requests',
				'--ignore-certificate-errors',
				'--disable-client-side-phishing-detection',
				'--autoplay-policy=no-user-gesture-required',
				'--disable-web-security',
				'--allow-running-insecure-content',
				'--allow-insecure-localhost',
				'--allow-running-insecure-content',
				'--disable-web-security',
				'--ignore-certificate-errors-spki-list',
				'--ignore-urlfetcher-cert-requests--ignore-urlfetcher-cert-requests',
			]
		});
		
		const browserProcess = browser.process();

		const stop = async function(){
			 await browser.close();
		};

		browserProcess.once('error', async(error) =>{
			await stop();
		});	

		browserProcess.once('close', function() {
			if(running_timeout!== undefined){
				clearTimeout(running_timeout);
			}
			restart0(browserProcess.pid);
		});

		try {
			const page = (await browser.pages())[0];
			await page.evaluateOnNewDocument(sniffDetector);
  			await page.exposeFunction('set_duration', async(duration) =>{
  				duration = parseInt(duration);
				setTimeout(async function(){
					await browser.close();
				}, duration * 1000);
  			});

			page.on('console', msg => {
				console.log('console--->' + msg.text());
			});
			
			await page.evaluateOnNewDocument(() => {
				Object.defineProperty(navigator, 'webdriver', {
					get: () => false,
				});
			});
			
			await page.setExtraHTTPHeaders({
			//'x-forwarded-for': "207.90."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0),
			//'Proxy-Authorization': "Basic " + Buffer.from(`${user}:${pass}`).toString('base64'),
				'upgrade-insecure-requests': '1',
				'Access-Control-Allow-Origin': '*',
				'Referer': "https://"+domainbot,
				'User-Agent': userAgent
			});

			await page.goto('http://'+domainbot).catch(function(err){
				console.log("page.goto Error:\n    " + err);
			});
			const session = await page.target().createCDPSession();
			const cookies = await session.send('Network.getAllCookies');
  			console.log(cookies.cookies);
			await session.send('Network.clearBrowserCookies');
			await session.send('Network.clearBrowserCache');
			
			running_browser = setTimeout(async function(){
				const duration = await page.evaluate(() => {
					return  document.getElementById("duration").value;
				}); 
				console.log("New Impression\nAwait: "+(duration)+" secs");
				await_tag = setTimeout(async function(){
					await browser.close();
				}, duration*1000);
			}, 10000);
			

		}catch(e){
			await stop();
		}
	}else{
		restart();
	}
};

asyncFunc();