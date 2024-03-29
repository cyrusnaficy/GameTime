const { createCursor } = require("ghost-cursor");
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-extra');
const credentials = JSON.parse(fs.readFileSync('./configs.json', 'utf-8'));
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook(credentials.discordWebhook);
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin())
const chromePaths = require('chrome-paths');
var colors = require('colors');
const readlineSync = require('readline-sync');
const select = require ('puppeteer-select');
const cron = require('node-cron');
const moment = require('moment');
let {
    getEdgeBetaPath,
    getEdgeCanaryPath,
    getEdgeDevPath,
    getEdgePath,
    getAnyEdgeStable,
    getAnyEdgeLatest,
  } = require("edge-paths")

console.clear();
console.log();
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }  
console.log('Welcome! Make sure your account info is set in configs.json. This includes your MemberID and password. Also make sure you have the latest version of microsoft edge installed. To run this software, simply type in npm i into the console. You only need to do npm i once. Then once you do that, you can type npm start. This will then greet you with the CLI. After this, you can keep using NPM start to launch.'.yellow);
sleep(5000);
console.clear();
console.log();
console.log('Welcome to GameTime'.red)
const options = ["SafeM".yellow,"FastM".yellow, "SafeN".yellow, "FastN".yellow]
let selected = readlineSync.keyInSelect(options, 'Select a Task')

if(selected >= 0) {
    if(selected == 0) {
        Safe()
    }
    else if(selected == 1) {
        Fast()
    }
    else if(selected == 2) {
        SafeN()
    }
    else if(selected == 3) {
        FastN()
    }
  }

async function Fast(){


    const memberid = credentials.memberid
    const password = credentials.password
    
    for (let i = 0; i < memberid.length ; i++){
    
    console.log('Serverside Activated...Waiting'.magenta);
    
    cron.schedule('30 44 7 * * *', function() {
    
    
        const main_url = 'https://members.bellevueclub.com/group/pages/tennis-court-reservations';
        
        async function givePage(){
            const browser = await puppeteer.launch({headless: true, executablePath: getEdgePath(), args: [`--window-size=500,900`], defaultViewport: null})
            const page = await browser.newPage();
            return page;
        }
            
        async function gen(page){
            console.clear();
            await page.goto(main_url);
            console.log('Parsing Login...'.yellow);
            await page.waitForTimeout(500);
            await page.waitForSelector("input[class='field login-field']");
            await page.click("input[class='field login-field']", elem => elem.click());
            await page.type("input[class='field login-field']", memberid[i], {delay: 50});
            await page.waitForTimeout(25);
            await page.click("input[class='field password-field']", elem => elem.click());
            await page.type("input[class='field password-field']", password[i], {delay: 50});
            await page.waitForTimeout(25);
            await page.click("button[class='btn btn-sign-in btn-primary']", elem => elem.click());
            console.log('Successfully Logged In!'.cyan);
            await page.waitForTimeout(5200);
        }
        
        async function monitor(page){
            if(moment().format('LT') == '7:45 AM'){
                await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                await page.waitForSelector("span[class='ui-calendar form-control radius-none']");
                await page.click("span[class='ui-calendar form-control radius-none']", elem => elem.click());
                let selector = 'a';
                await page.$$eval(selector, anchors => {
                    anchors.map(anchor => {
                        const d1 = new Date().getDate();
                        const d2 = d1;
                        if(anchor.textContent == d1 + 7) {
                            anchor.click();
                            anchor.click();
                            return
                        }
                        else{
                            console.log('Invalid Date'.red)
                        }
                    })
                });
            }
            else{
                console.log('Sleeping...'.yellow);
                await page.waitForTimeout(500);
                return monitor(page);
            }
        }
    
    
        async function fill(page) {
            const cursor = createCursor(page);
            console.log('Reserving Court'.magenta);
            await page.waitForSelector("div[id='t1c0']");
            await page.waitForTimeout(1000);
            if (await page.$("div[id='t1c0']") !== null){
                const six = "div[id='t1c0']";
                await cursor.move(six)
                await cursor.click()
                console.clear();
                await page.waitForTimeout(2000);
                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                    console.log('In Stock'.green);
                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                    await page.waitForTimeout(2000);
                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                    }
                    console.log('Successfully Reserved'.bold .green)
                    log();
                    await page.waitForTimeout(2000);
                }
                else{
                    console.log('Out of Stock...Retrying'.red);
                    if (await page.$("div[id='t1c1']") !== null){
                        const six = "div[id='t1c1']";
                        await cursor.move(six)
                        await cursor.click()
                        console.clear();
                        await page.waitForTimeout(2000);
                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                            console.log('In Stock'.green);
                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                            await page.waitForTimeout(2000);
                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                            }
                            console.log('Successfully Reserved'.bold .green)
                            log();
                            await page.waitForTimeout(2000);
                        }
                        else{
                            console.log('Out of Stock...Retrying'.red);
                            if (await page.$("div[id='t1c2']") !== null){
                                const six = "div[id='t1c2']";
                                await cursor.move(six)
                                await cursor.click()
                                console.clear();
                                await page.waitForTimeout(2000);
                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                    console.log('In Stock'.green);
                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                    await page.waitForTimeout(2000);
                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                    }
                                    console.log('Successfully Reserved'.bold .green)
                                    log();
                                    await page.waitForTimeout(2000);
                                }
                                else{
                                    console.log('Out of Stock...Retrying'.red);
                                    if (await page.$("div[id='t1c3']") !== null){
                                        const six = "div[id='t1c3']";
                                        await cursor.move(six)
                                        await cursor.click()
                                        console.clear();
                                        await page.waitForTimeout(2000);
                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                            console.log('In Stock'.green);
                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                            await page.waitForTimeout(2000);
                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                            }
                                            console.log('Successfully Reserved'.bold .green)
                                            log();
                                            await page.waitForTimeout(2000);
                                        }
                                        else{
                                            console.log('Out of Stock...Retrying'.red);
                                            if (await page.$("div[id='t1c3']") !== null){
                                                const six = "div[id='t1c3']";
                                                await cursor.move(six)
                                                await cursor.click()
                                                console.clear();
                                                await page.waitForTimeout(2000);
                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                    console.log('In Stock'.green);
                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                    await page.waitForTimeout(2000);
                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                    }
                                                    console.log('Successfully Reserved'.bold .green)
                                                    log();
                                                    await page.waitForTimeout(2000);
                                                }
                                                else{
                                                    console.log('All 6:30 Courts Out of Stock'.red);
                                                    console.log('Trying for 8:00 Courts'.magenta);
                                                    if (await page.$("div[id='t2c0']") !== null){
                                                        const six = "div[id='t2c0']";
                                                        await cursor.move(six)
                                                        await cursor.click()
                                                        console.clear();
                                                        await page.waitForTimeout(2000);
                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                            console.log('In Stock'.green);
                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                            await page.waitForTimeout(2000);
                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                            }
                                                            console.log('Successfully Reserved'.bold .green)
                                                            log();
                                                            await page.waitForTimeout(2000);
                                                        }
                                                        else{
                                                            console.log('Out of Stock...Retrying'.red);
                                                            if (await page.$("div[id='t2c1']") !== null){
                                                                const six = "div[id='t2c1']";
                                                                await cursor.move(six)
                                                                await cursor.click()
                                                                console.clear();
                                                                await page.waitForTimeout(2000);
                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                    console.log('In Stock'.green);
                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                    await page.waitForTimeout(2000);
                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                    }
                                                                    console.log('Successfully Reserved'.bold .green)
                                                                    log();
                                                                    await page.waitForTimeout(2000);
                                                                }
                                                                else{
                                                                    console.log('Out of Stock...Retrying'.red);
                                                                    if (await page.$("div[id='t2c2']") !== null){
                                                                        const six = "div[id='t2c2']";
                                                                        await cursor.move(six)
                                                                        await cursor.click()
                                                                        console.clear();
                                                                        await page.waitForTimeout(2000);
                                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                            console.log('In Stock'.green);
                                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                            await page.waitForTimeout(2000);
                                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                            }
                                                                            console.log('Successfully Reserved'.bold .green)
                                                                            log();
                                                                            await page.waitForTimeout(2000);
                                                                        }
                                                                        else{
                                                                            console.log('Out of Stock...Retrying'.red);
                                                                            if (await page.$("div[id='t2c3']") !== null){
                                                                                const six = "div[id='t2c3']";
                                                                                await cursor.move(six)
                                                                                await cursor.click()
                                                                                console.clear();
                                                                                await page.waitForTimeout(2000);
                                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                    console.log('In Stock'.green);
                                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                    await page.waitForTimeout(2000);
                                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                    }
                                                                                    console.log('Successfully Reserved'.bold .green)
                                                                                    log();
                                                                                    await page.waitForTimeout(2000);
                                                                                }
                                                                                else{
                                                                                    console.log('All 8:00 Courts Out Of Stock'.red);
                                                                                    console.log('Trying for 9:15 Courts'.magenta);
                                                                                    if (await page.$("div[id='t3c0']") !== null){
                                                                                        const six = "div[id='t3c0']";
                                                                                        await cursor.move(six)
                                                                                        await cursor.click()
                                                                                        console.clear();
                                                                                        await page.waitForTimeout(2000);
                                                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                            console.log('In Stock'.green);
                                                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                            await page.waitForTimeout(2000);
                                                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                            }
                                                                                            console.log('Successfully Reserved'.bold .green)
                                                                                            log();
                                                                                            await page.waitForTimeout(2000);
                                                                                        }
                                                                                        else{
                                                                                            console.log('Out of Stock...Retrying'.red);
                                                                                            if (await page.$("div[id='t3c1']") !== null){
                                                                                                const six = "div[id='t3c1']";
                                                                                                await cursor.move(six)
                                                                                                await cursor.click()
                                                                                                console.clear();
                                                                                                await page.waitForTimeout(2000);
                                                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                    console.log('In Stock'.green);
                                                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                    await page.waitForTimeout(2000);
                                                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                    }
                                                                                                    console.log('Successfully Reserved'.bold .green)
                                                                                                    log();
                                                                                                    await page.waitForTimeout(2000);
                                                                                                }
                                                                                                else{
                                                                                                    console.log('Out of Stock...Retrying'.red);
                                                                                                    if (await page.$("div[id='t3c2']") !== null){
                                                                                                        const six = "div[id='t3c2']";
                                                                                                        await cursor.move(six)
                                                                                                        await cursor.click()
                                                                                                        console.clear();
                                                                                                        await page.waitForTimeout(2000);
                                                                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                            console.log('In Stock'.green);
                                                                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                            await page.waitForTimeout(2000);
                                                                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                            }
                                                                                                            console.log('Successfully Reserved'.bold .green)
                                                                                                            log();
                                                                                                            await page.waitForTimeout(2000);
                                                                                                        }
                                                                                                        else{
                                                                                                            console.log('Out of Stock...Retrying'.red);
                                                                                                            if (await page.$("div[id='t3c3']") !== null){
                                                                                                                const six = "div[id='t3c3']";
                                                                                                                await cursor.move(six)
                                                                                                                await cursor.click()
                                                                                                                console.clear();
                                                                                                                await page.waitForTimeout(5000);
                                                                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                                    console.log('In Stock'.green);
                                                                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                                    await page.waitForTimeout(2000);
                                                                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                                    }
                                                                                                                    console.log('Successfully Reserved'.bold .green)
                                                                                                                    log();
                                                                                                                    await page.waitForTimeout(2000);
                                                                                                                }
                                                                                                                else{
                                                                                                                    console.log('All Courts Out of Stock, Better Luck Next Time ):'.red);
                                                                                                           }
                                                                                                        
                                                                                                     }
                                                                                                   }
                                                                                                
                                                                                               }
                                                                                           }
                                                                                        
                                                                                    }
                                                                                 }
                                                                                
                                                                               }
                                                                          }
                                                                        
                                                                     }
                                                                  }
                                                                
                                                             }
                                                          }
                                                        
                                                    }
                                                  }
                                                
                                            }
                                                    
                                           }
                                 
                                      }
                                            
                                   }
                        
                             }
                                    
                         }
                        
                     }
                           
                   }
                
              }
                    
         }
        
     }
        
}

        
async function checkout(){
    var page = await givePage();
        await gen(page);
        await monitor(page);
        await fill(page);
    }
           
    checkout();
    
    }, null, true, 'America/Los_Angeles');
          
}

}




async function Safe(){

const memberid = credentials.memberid
const password = credentials.password

for (let i = 0; i < memberid.length ; i++){

console.log('Serverside Activated...Waiting'.magenta);

cron.schedule('30 44 7 * * *', function() {


    const main_url = 'https://members.bellevueclub.com/group/pages/tennis-court-reservations';
    
    async function givePage(){
        const browser = await puppeteer.launch({headless: false, executablePath: getEdgePath(), args: [`--window-size=500,900`], defaultViewport: null})
        var [page] = await browser.pages();
        return {page, browser};
        }
        
    async function gen(page, browser){
        console.clear();
        await page.goto(main_url);
        console.log('Parsing Login...'.yellow);
        await page.waitForTimeout(500);
        await page.waitForSelector("input[class='field login-field']");
        await page.click("input[class='field login-field']", elem => elem.click());
        await page.type("input[class='field login-field']", memberid[i], {delay: 50});
        await page.waitForTimeout(25);
        await page.click("input[class='field password-field']", elem => elem.click());
        await page.type("input[class='field password-field']", password[i], {delay: 50});
        await page.waitForTimeout(25);
        await page.click("button[class='btn btn-sign-in btn-primary']", elem => elem.click());
        console.log('Successfully Logged In!'.cyan);
        await page.waitForTimeout(5200);
    }
    
    async function monitor(page, browser){
        if(moment().format('LT') == '7:45 AM'){
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
            await page.waitForSelector("span[class='ui-calendar form-control radius-none']");
            await page.click("span[class='ui-calendar form-control radius-none']", elem => elem.click());
            let selector = 'a';
            await page.$$eval(selector, anchors => {
                anchors.map(anchor => {
                    const d1 = new Date().getDate();
                    const d2 = d1;
                    if(anchor.textContent == d1 + 7) {
                        anchor.click();
                        anchor.click();
                        return
                    }
                    else{
                        console.log('Invalid Date'.red)
                    }
                })
            });
        }
        else{
            console.log('Sleeping...'.yellow);
            await page.waitForTimeout(500);
            return monitor(page,browser);
        }
    }


    async function fill(page, browser) {
        const cursor = createCursor(page, browser);
        console.log('Reserving Court'.magenta);
        await page.waitForSelector("div[id='t1c0']");
        await page.waitForTimeout(1000);
        if (await page.$("div[id='t1c0']") !== null){
            const six = "div[id='t1c0']";
            await cursor.move(six)
            await cursor.click()
            console.clear();
            await page.waitForTimeout(2000);
            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                console.log('In Stock'.green);
                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                await page.waitForTimeout(2000);
                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                }
                console.log('Successfully Reserved'.bold .green)
                log2();
                await page.waitForTimeout(2000);
            }
            else{
                console.log('Out of Stock...Retrying'.red);
                if (await page.$("div[id='t1c1']") !== null){
                    const six = "div[id='t1c1']";
                    await cursor.move(six)
                    await cursor.click()
                    console.clear();
                    await page.waitForTimeout(2000);
                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                        console.log('In Stock'.green);
                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                        await page.waitForTimeout(2000);
                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                        }
                        console.log('Successfully Reserved'.bold .green)
                        log2();
                        await page.waitForTimeout(2000);
                    }
                    else{
                        console.log('Out of Stock...Retrying'.red);
                        if (await page.$("div[id='t1c2']") !== null){
                            const six = "div[id='t1c2']";
                            await cursor.move(six)
                            await cursor.click()
                            console.clear();
                            await page.waitForTimeout(2000);
                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                console.log('In Stock'.green);
                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                await page.waitForTimeout(2000);
                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                }
                                console.log('Successfully Reserved'.bold .green)
                                log2();
                                await page.waitForTimeout(2000);
                            }
                            else{
                                console.log('Out of Stock...Retrying'.red);
                                if (await page.$("div[id='t1c3']") !== null){
                                    const six = "div[id='t1c3']";
                                    await cursor.move(six)
                                    await cursor.click()
                                    console.clear();
                                    await page.waitForTimeout(2000);
                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                        console.log('In Stock'.green);
                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                        await page.waitForTimeout(2000);
                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                        }
                                        console.log('Successfully Reserved'.bold .green)
                                        log2();
                                        await page.waitForTimeout(2000);
                                    }
                                    else{
                                        console.log('Out of Stock...Retrying'.red);
                                        if (await page.$("div[id='t1c3']") !== null){
                                            const six = "div[id='t1c3']";
                                            await cursor.move(six)
                                            await cursor.click()
                                            console.clear();
                                            await page.waitForTimeout(2000);
                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                console.log('In Stock'.green);
                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                await page.waitForTimeout(2000);
                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                }
                                                console.log('Successfully Reserved'.bold .green)
                                                log2();
                                                await page.waitForTimeout(2000);
                                            }
                                            else{
                                                console.log('All 6:30 Courts Out of Stock'.red);
                                                console.log('Trying for 8:00 Courts'.magenta);
                                                if (await page.$("div[id='t2c0']") !== null){
                                                    const six = "div[id='t2c0']";
                                                    await cursor.move(six)
                                                    await cursor.click()
                                                    console.clear();
                                                    await page.waitForTimeout(2000);
                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                        console.log('In Stock'.green);
                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                        await page.waitForTimeout(2000);
                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                        }
                                                        console.log('Successfully Reserved'.bold .green)
                                                        log2();
                                                        await page.waitForTimeout(2000);
                                                    }
                                                    else{
                                                        console.log('Out of Stock...Retrying'.red);
                                                        if (await page.$("div[id='t2c1']") !== null){
                                                            const six = "div[id='t2c1']";
                                                            await cursor.move(six)
                                                            await cursor.click()
                                                            console.clear();
                                                            await page.waitForTimeout(2000);
                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                console.log('In Stock'.green);
                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                await page.waitForTimeout(2000);
                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                }
                                                                console.log('Successfully Reserved'.bold .green)
                                                                log2();
                                                                await page.waitForTimeout(2000);
                                                            }
                                                            else{
                                                                console.log('Out of Stock...Retrying'.red);
                                                                if (await page.$("div[id='t2c2']") !== null){
                                                                    const six = "div[id='t2c2']";
                                                                    await cursor.move(six)
                                                                    await cursor.click()
                                                                    console.clear();
                                                                    await page.waitForTimeout(2000);
                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                        console.log('In Stock'.green);
                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                        await page.waitForTimeout(2000);
                                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                        }
                                                                        console.log('Successfully Reserved'.bold .green)
                                                                        log2();
                                                                        await page.waitForTimeout(2000);
                                                                    }
                                                                    else{
                                                                        console.log('Out of Stock...Retrying'.red);
                                                                        if (await page.$("div[id='t2c3']") !== null){
                                                                            const six = "div[id='t2c3']";
                                                                            await cursor.move(six)
                                                                            await cursor.click()
                                                                            console.clear();
                                                                            await page.waitForTimeout(2000);
                                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                console.log('In Stock'.green);
                                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                await page.waitForTimeout(2000);
                                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                }
                                                                                console.log('Successfully Reserved'.bold .green)
                                                                                log2();
                                                                                await page.waitForTimeout(2000);
                                                                            }
                                                                            else{
                                                                                console.log('All 8:00 Courts Out Of Stock'.red);
                                                                                console.log('Trying for 9:15 Courts'.magenta);
                                                                                if (await page.$("div[id='t3c0']") !== null){
                                                                                    const six = "div[id='t3c0']";
                                                                                    await cursor.move(six)
                                                                                    await cursor.click()
                                                                                    console.clear();
                                                                                    await page.waitForTimeout(2000);
                                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                        console.log('In Stock'.green);
                                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                        await page.waitForTimeout(2000);
                                                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                        }
                                                                                        console.log('Successfully Reserved'.bold .green)
                                                                                        log2();
                                                                                        await page.waitForTimeout(2000);
                                                                                    }
                                                                                    else{
                                                                                        console.log('Out of Stock...Retrying'.red);
                                                                                        if (await page.$("div[id='t3c1']") !== null){
                                                                                            const six = "div[id='t3c1']";
                                                                                            await cursor.move(six)
                                                                                            await cursor.click()
                                                                                            console.clear();
                                                                                            await page.waitForTimeout(2000);
                                                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                console.log('In Stock'.green);
                                                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                await page.waitForTimeout(2000);
                                                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                }
                                                                                                console.log('Successfully Reserved'.bold .green)
                                                                                                log2();
                                                                                                await page.waitForTimeout(2000);
                                                                                            }
                                                                                            else{
                                                                                                console.log('Out of Stock...Retrying'.red);
                                                                                                if (await page.$("div[id='t3c2']") !== null){
                                                                                                    const six = "div[id='t3c2']";
                                                                                                    await cursor.move(six)
                                                                                                    await cursor.click()
                                                                                                    console.clear();
                                                                                                    await page.waitForTimeout(2000);
                                                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                        console.log('In Stock'.green);
                                                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                        await page.waitForTimeout(2000);
                                                                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                        }
                                                                                                        console.log('Successfully Reserved'.bold .green)
                                                                                                        log2();
                                                                                                        await page.waitForTimeout(2000);
                                                                                                    }
                                                                                                    else{
                                                                                                        console.log('Out of Stock...Retrying'.red);
                                                                                                        if (await page.$("div[id='t3c3']") !== null){
                                                                                                            const six = "div[id='t3c3']";
                                                                                                            await cursor.move(six)
                                                                                                            await cursor.click()
                                                                                                            console.clear();
                                                                                                            await page.waitForTimeout(5000);
                                                                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                                console.log('In Stock'.green);
                                                                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                                await page.waitForTimeout(2000);
                                                                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                                }
                                                                                                                console.log('Successfully Reserved'.bold .green)
                                                                                                                log2();
                                                                                                                await page.waitForTimeout(2000);
                                                                                                            }
                                                                                                            else{
                                                                                                                console.log('All Courts Out of Stock, Better Luck Next Time ):'.red);
                                                                                                                await browser.close();
                                                                                                            }
                                                                                                    
                                                                                                        }
                                                                                                    }
                                                                                            
                                                                                                }
                                                                                            }
                                                                                    
                                                                                        }
                                                                                    }
                                                                            
                                                                                }
                                                                            }
                                                                    
                                                                        }
                                                                    }
                                                            
                                                                }
                                                            }
                                                    
                                                        }
                                                    }
                                            
                                                }
                                                
                                            }
                                    
                                        }
                                        
                                    }
                            
                                }
                                
                            }
                    
                        }
                        
                    }
            
                }
                
            }
    
        }
    
    }
    
    async function checkout(){
        var {page, browser} = await givePage();
        await gen(page, browser);
        await monitor(page, browser);
        await fill(page, browser);
      }
       
      checkout();

    }, null, true, 'America/Los_Angeles');
      
    }


}




async function FastN(){


    const memberid = credentials.memberid
    const password = credentials.password
    
    for (let i = 0; i < memberid.length ; i++){
    
    console.log('Serverside Activated...Waiting'.magenta);
    
    cron.schedule('30 44 7 * * *', function() {
    
    
        const main_url = 'https://members.bellevueclub.com/group/pages/tennis-court-reservations';
        
        async function givePage(){
            const browser = await puppeteer.launch({headless: true, executablePath: getEdgePath(), args: [`--window-size=500,900`], defaultViewport: null})
            const page = await browser.newPage();
            return page;
        }
            
        async function gen(page){
            console.clear();
            await page.goto(main_url);
            console.log('Parsing Login...'.yellow);
            await page.waitForTimeout(500);
            await page.waitForSelector("input[class='field login-field']");
            await page.click("input[class='field login-field']", elem => elem.click());
            await page.type("input[class='field login-field']", memberid[i], {delay: 50});
            await page.waitForTimeout(25);
            await page.click("input[class='field password-field']", elem => elem.click());
            await page.type("input[class='field password-field']", password[i], {delay: 50});
            await page.waitForTimeout(25);
            await page.click("button[class='btn btn-sign-in btn-primary']", elem => elem.click());
            console.log('Successfully Logged In!'.cyan);
            await page.waitForTimeout(5200);
        }
        
        async function monitor(page){
            if(moment().format('LT') == '7:45 AM'){
                await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                await page.waitForSelector("span[class='ui-calendar form-control radius-none']");
                await page.click("span[class='ui-calendar form-control radius-none']", elem => elem.click());
                let selector = 'a';
                await page.$$eval(selector, anchors => {
                    anchors.map(anchor => {
                        const d1 = new Date().getDate();
                        const d2 = d1;
                        if(anchor.textContent == d1) {
                            anchor.click();
                            anchor.click();
                            return
                        }
                        else{
                            console.log('Invalid Date'.red)
                        }
                    })
                });
            }
            else{
                console.log('Sleeping...'.yellow);
                await page.waitForTimeout(500);
                return monitor(page);
            }
        }
    
    
        async function fill(page) {
            const cursor = createCursor(page);
            console.log('Reserving Court'.magenta);
            await page.waitForSelector("div[id='t14c0']");
            await page.waitForTimeout(1000);
            if (await page.$("div[id='t14c0']") !== null){
                const six = "div[id='t14c0']";
                await cursor.move(six)
                await cursor.click()
                console.clear();
                await page.waitForTimeout(2000);
                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                    console.log('In Stock'.green);
                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                    await page.waitForTimeout(2000);
                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                    }
                    console.log('Successfully Reserved'.bold .green)
                    log();
                    await page.waitForTimeout(2000);
                }
                else{
                    console.log('Out of Stock...Retrying'.red);
                    if (await page.$("div[id='t14c1']") !== null){
                        const six = "div[id='t14c1']";
                        await cursor.move(six)
                        await cursor.click()
                        console.clear();
                        await page.waitForTimeout(2000);
                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                            console.log('In Stock'.green);
                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                            await page.waitForTimeout(2000);
                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                            }
                            console.log('Successfully Reserved'.bold .green)
                            log();
                            await page.waitForTimeout(2000);
                        }
                        else{
                            console.log('Out of Stock...Retrying'.red);
                            if (await page.$("div[id='t14c2']") !== null){
                                const six = "div[id='t14c2']";
                                await cursor.move(six)
                                await cursor.click()
                                console.clear();
                                await page.waitForTimeout(2000);
                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                    console.log('In Stock'.green);
                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                    await page.waitForTimeout(2000);
                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                    }
                                    console.log('Successfully Reserved'.bold .green)
                                    log();
                                    await page.waitForTimeout(2000);
                                }
                                else{
                                    console.log('Out of Stock...Retrying'.red);
                                    if (await page.$("div[id='t14c3']") !== null){
                                        const six = "div[id='t14c3']";
                                        await cursor.move(six)
                                        await cursor.click()
                                        console.clear();
                                        await page.waitForTimeout(2000);
                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                            console.log('In Stock'.green);
                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                            await page.waitForTimeout(2000);
                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                            }
                                            console.log('Successfully Reserved'.bold .green)
                                            log();
                                            await page.waitForTimeout(2000);
                                        }
                                        else{
                                            console.log('All 8:30 Courts Out Of Stock'.red);
                                            console.log('Trying for 7:15 Courts'.magenta);
                                            if (await page.$("div[id='t13c0']") !== null){
                                                const six = "div[id='t13c0']";
                                                await cursor.move(six)
                                                await cursor.click()
                                                console.clear();
                                                await page.waitForTimeout(2000);
                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                    console.log('In Stock'.green);
                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                    await page.waitForTimeout(2000);
                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                    }
                                                    console.log('Successfully Reserved'.bold .green)
                                                    log();
                                                    await page.waitForTimeout(2000);
                                                }
                                                else{
                                                    console.log('Out of Stock...Retrying'.red);
                                                    if (await page.$("div[id='t13c1']") !== null){
                                                        const six = "div[id='t13c1']";
                                                        await cursor.move(six)
                                                        await cursor.click()
                                                        console.clear();
                                                        await page.waitForTimeout(2000);
                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                            console.log('In Stock'.green);
                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                            await page.waitForTimeout(2000);
                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                            }
                                                            console.log('Successfully Reserved'.bold .green)
                                                            log();
                                                            await page.waitForTimeout(2000);
                                                        }
                                                        else{
                                                            console.log('Out of Stock...Retrying'.red);
                                                            if (await page.$("div[id='t13c2']") !== null){
                                                                const six = "div[id='t13c2']";
                                                                await cursor.move(six)
                                                                await cursor.click()
                                                                console.clear();
                                                                await page.waitForTimeout(2000);
                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                    console.log('In Stock'.green);
                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                    await page.waitForTimeout(2000);
                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                    }
                                                                    console.log('Successfully Reserved'.bold .green)
                                                                    log();
                                                                    await page.waitForTimeout(2000);
                                                                }
                                                                else{
                                                                    console.log('Out of Stock...Retrying'.red);
                                                                    if (await page.$("div[id='t13c3']") !== null){
                                                                        const six = "div[id='t13c3']";
                                                                        await cursor.move(six)
                                                                        await cursor.click()
                                                                        console.clear();
                                                                        await page.waitForTimeout(2000);
                                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                            console.log('In Stock'.green);
                                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                            await page.waitForTimeout(2000);
                                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                            }
                                                                            console.log('Successfully Reserved'.bold .green)
                                                                            log();
                                                                            await page.waitForTimeout(2000);
                                                                        }
                                                                        else{
                                                                            console.log('All 7:15 Courts Out Of Stock'.red);
                                                                            console.log('Trying for 6:00 Courts'.magenta);
                                                                            if (await page.$("div[id='t12c0']") !== null){
                                                                                const six = "div[id='t12c0']";
                                                                                await cursor.move(six)
                                                                                await cursor.click()
                                                                                console.clear();
                                                                                await page.waitForTimeout(2000);
                                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                    console.log('In Stock'.green);
                                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                    await page.waitForTimeout(2000);
                                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                    }
                                                                                    console.log('Successfully Reserved'.bold .green)
                                                                                    log();
                                                                                    await page.waitForTimeout(2000);
                                                                                }
                                                                                else{
                                                                                    console.log('Out of Stock...Retrying'.red);
                                                                                    if (await page.$("div[id='t12c1']") !== null){
                                                                                        const six = "div[id='t12c1']";
                                                                                        await cursor.move(six)
                                                                                        await cursor.click()
                                                                                        console.clear();
                                                                                        await page.waitForTimeout(2000);
                                                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                            console.log('In Stock'.green);
                                                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                            await page.waitForTimeout(2000);
                                                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                            }
                                                                                            console.log('Successfully Reserved'.bold .green)
                                                                                            log();
                                                                                            await page.waitForTimeout(2000);
                                                                                        }
                                                                                        else{
                                                                                            console.log('Out of Stock...Retrying'.red);
                                                                                            if (await page.$("div[id='t12c2']") !== null){
                                                                                                const six = "div[id='t12c2']";
                                                                                                await cursor.move(six)
                                                                                                await cursor.click()
                                                                                                console.clear();
                                                                                                await page.waitForTimeout(2000);
                                                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                    console.log('In Stock'.green);
                                                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                    await page.waitForTimeout(2000);
                                                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                    }
                                                                                                    console.log('Successfully Reserved'.bold .green)
                                                                                                    log();
                                                                                                    await page.waitForTimeout(2000);
                                                                                                }
                                                                                                else{
                                                                                                    console.log('Out of Stock...Retrying'.red);
                                                                                                    if (await page.$("div[id='t12c3']") !== null){
                                                                                                        const six = "div[id='t12c3']";
                                                                                                        await cursor.move(six)
                                                                                                        await cursor.click()
                                                                                                        console.clear();
                                                                                                        await page.waitForTimeout(2000);
                                                                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                            console.log('In Stock'.green);
                                                                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                            await page.waitForTimeout(2000);
                                                                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                            }
                                                                                                            console.log('Successfully Reserved'.bold .green)
                                                                                                            log();
                                                                                                            await page.waitForTimeout(2000);
                                                                                                        }
                                                                                                        else{
                                                                                                            console.log('All Courts Out of Stock, Better Luck Next Time ):'.red);
                                                                                                }
                                                                                            
                                                                                             }
                                                                                                    
                                                                                         }
                                                                                        
                                                                                     }
                                                                                            
                                                                                 }
                                                                                
                                                                             }
                                                                                    
                                                                         }
                                                                        
                                                                     }
                                                                            
                                                                 }
                                                                
                                                             }
                                                                    
                                                         }
                                                        
                                                     }
                                                            
                                                 }
                                                
                                             }
                                                    
                                         }
                                        
                                     }
                                            
                                  }
                                
                             }
                                    
                          }
                        
                     }
                            
                 }
                
             }
                    
         }
        
     }
        
}

        
async function checkout(){
    var page = await givePage();
        await gen(page);
        await monitor(page);
        await fill(page);
    }
           
    checkout();
    
    }, null, true, 'America/Los_Angeles');
          
}

}


async function SafeN(){

    const memberid = credentials.memberid
    const password = credentials.password
    
    for (let i = 0; i < memberid.length ; i++){
    
    console.log('Serverside Activated...Waiting'.magenta);
    
    cron.schedule('30 44 7 * * *', function() {
    
    
        const main_url = 'https://members.bellevueclub.com/group/pages/tennis-court-reservations';
        
        async function givePage(){
            const browser = await puppeteer.launch({headless: false, executablePath: getEdgePath(), args: [`--window-size=500,900`], defaultViewport: null})
            var [page] = await browser.pages();
            return {page, browser};
            }
            
        async function gen(page, browser){
            console.clear();
            await page.goto(main_url);
            console.log('Parsing Login...'.yellow);
            await page.waitForTimeout(500);
            await page.waitForSelector("input[class='field login-field']");
            await page.click("input[class='field login-field']", elem => elem.click());
            await page.type("input[class='field login-field']", memberid[i], {delay: 50});
            await page.waitForTimeout(25);
            await page.click("input[class='field password-field']", elem => elem.click());
            await page.type("input[class='field password-field']", password[i], {delay: 50});
            await page.waitForTimeout(25);
            await page.click("button[class='btn btn-sign-in btn-primary']", elem => elem.click());
            console.log('Successfully Logged In!'.cyan);
            await page.waitForTimeout(5200);
        }
        
        async function monitor(page, browser){
            if(moment().format('LT') == '7:45 AM'){
                await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                await page.waitForSelector("span[class='ui-calendar form-control radius-none']");
                await page.click("span[class='ui-calendar form-control radius-none']", elem => elem.click());
                let selector = 'a';
                await page.$$eval(selector, anchors => {
                    anchors.map(anchor => {
                        const d1 = new Date().getDate();
                        const d2 = d1;
                        if(anchor.textContent == d1 + 7) {
                            anchor.click();
                            anchor.click();
                            return
                        }
                        else{
                            console.log('Invalid Date'.red)
                        }
                    })
                });
            }
            else{
                console.log('Sleeping...'.yellow);
                await page.waitForTimeout(500);
                return monitor(page,browser);
            }
        }
    
    
        async function fill(page, browser) {
            const cursor = createCursor(page, browser);
            console.log('Reserving Court'.magenta);
            await page.waitForSelector("div[id='t14c0']");
            await page.waitForTimeout(1000);
            if (await page.$("div[id='t14c0']") !== null){
                const six = "div[id='t14c0']";
                await cursor.move(six)
                await cursor.click()
                console.clear();
                await page.waitForTimeout(2000);
                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                    console.log('In Stock'.green);
                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                    await page.waitForTimeout(2000);
                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                    }
                    console.log('Successfully Reserved'.bold .green)
                    log2();
                    await page.waitForTimeout(2000);
                }
                else{
                    console.log('Out of Stock...Retrying'.red);
                    if (await page.$("div[id='t14c1']") !== null){
                        const six = "div[id='t14c1']";
                        await cursor.move(six)
                        await cursor.click()
                        console.clear();
                        await page.waitForTimeout(2000);
                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                            console.log('In Stock'.green);
                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                            await page.waitForTimeout(2000);
                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                            }
                            console.log('Successfully Reserved'.bold .green)
                            log2();
                            await page.waitForTimeout(2000);
                        }
                        else{
                            console.log('Out of Stock...Retrying'.red);
                            if (await page.$("div[id='t14c2']") !== null){
                                const six = "div[id='t14c2']";
                                await cursor.move(six)
                                await cursor.click()
                                console.clear();
                                await page.waitForTimeout(2000);
                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                    console.log('In Stock'.green);
                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                    await page.waitForTimeout(2000);
                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                    }
                                    console.log('Successfully Reserved'.bold .green)
                                    log2();
                                    await page.waitForTimeout(2000);
                                }
                                else{
                                    console.log('Out of Stock...Retrying'.red);
                                    if (await page.$("div[id='t14c3']") !== null){
                                        const six = "div[id='t14c3']";
                                        await cursor.move(six)
                                        await cursor.click()
                                        console.clear();
                                        await page.waitForTimeout(2000);
                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                            console.log('In Stock'.green);
                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                            await page.waitForTimeout(2000);
                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                            }
                                            console.log('Successfully Reserved'.bold .green)
                                            log2();
                                            await page.waitForTimeout(2000);
                                        }
                                        else{
                                            console.log('All 8:30 Courts Out Of Stock'.red);
                                            console.log('Trying for 7:15 Courts'.magenta);
                                            if (await page.$("div[id='t13c0']") !== null){
                                                const six = "div[id='t13c0']";
                                                await cursor.move(six)
                                                await cursor.click()
                                                console.clear();
                                                await page.waitForTimeout(2000);
                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                    console.log('In Stock'.green);
                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                    await page.waitForTimeout(2000);
                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                    }
                                                    console.log('Successfully Reserved'.bold .green)
                                                    log2();
                                                    await page.waitForTimeout(2000);
                                                }
                                                else{
                                                    console.log('Out of Stock...Retrying'.red);
                                                    if (await page.$("div[id='t13c1']") !== null){
                                                        const six = "div[id='t13c1']";
                                                        await cursor.move(six)
                                                        await cursor.click()
                                                        console.clear();
                                                        await page.waitForTimeout(2000);
                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                            console.log('In Stock'.green);
                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                            await page.waitForTimeout(2000);
                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                            }
                                                            console.log('Successfully Reserved'.bold .green)
                                                            log2();
                                                            await page.waitForTimeout(2000);
                                                        }
                                                        else{
                                                            console.log('Out of Stock...Retrying'.red);
                                                            if (await page.$("div[id='t13c2']") !== null){
                                                                const six = "div[id='t13c2']";
                                                                await cursor.move(six)
                                                                await cursor.click()
                                                                console.clear();
                                                                await page.waitForTimeout(2000);
                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                    console.log('In Stock'.green);
                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                    await page.waitForTimeout(2000);
                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                    }
                                                                    console.log('Successfully Reserved'.bold .green)
                                                                    log2();
                                                                    await page.waitForTimeout(2000);
                                                                }
                                                                else{
                                                                    console.log('Out of Stock...Retrying'.red);
                                                                    if (await page.$("div[id='t13c3']") !== null){
                                                                        const six = "div[id='t13c3']";
                                                                        await cursor.move(six)
                                                                        await cursor.click()
                                                                        console.clear();
                                                                        await page.waitForTimeout(2000);
                                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                            console.log('In Stock'.green);
                                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                            await page.waitForTimeout(2000);
                                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                            }
                                                                            console.log('Successfully Reserved'.bold .green)
                                                                            log2();
                                                                            await page.waitForTimeout(2000);
                                                                        }
                                                                        else{
                                                                            console.log('All 7:15 Courts Out Of Stock'.red);
                                                                            console.log('Trying for 6:00 Courts'.magenta);
                                                                            if (await page.$("div[id='t12c0']") !== null){
                                                                                const six = "div[id='t12c0']";
                                                                                await cursor.move(six)
                                                                                await cursor.click()
                                                                                console.clear();
                                                                                await page.waitForTimeout(2000);
                                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                    console.log('In Stock'.green);
                                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                    await page.waitForTimeout(2000);
                                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                    }
                                                                                    console.log('Successfully Reserved'.bold .green)
                                                                                    log2();
                                                                                    await page.waitForTimeout(2000);
                                                                                }
                                                                                else{
                                                                                    console.log('Out of Stock...Retrying'.red);
                                                                                    if (await page.$("div[id='t12c1']") !== null){
                                                                                        const six = "div[id='t12c1']";
                                                                                        await cursor.move(six)
                                                                                        await cursor.click()
                                                                                        console.clear();
                                                                                        await page.waitForTimeout(2000);
                                                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                            console.log('In Stock'.green);
                                                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                            await page.waitForTimeout(2000);
                                                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                            }
                                                                                            console.log('Successfully Reserved'.bold .green)
                                                                                            log2();
                                                                                            await page.waitForTimeout(2000);
                                                                                        }
                                                                                        else{
                                                                                            console.log('Out of Stock...Retrying'.red);
                                                                                            if (await page.$("div[id='t12c2']") !== null){
                                                                                                const six = "div[id='t12c2']";
                                                                                                await cursor.move(six)
                                                                                                await cursor.click()
                                                                                                console.clear();
                                                                                                await page.waitForTimeout(2000);
                                                                                                if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                    console.log('In Stock'.green);
                                                                                                    await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                    await page.waitForTimeout(2000);
                                                                                                    if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                        await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                    }
                                                                                                    console.log('Successfully Reserved'.bold .green)
                                                                                                    log2();
                                                                                                    await page.waitForTimeout(2000);
                                                                                                }
                                                                                                else{
                                                                                                    console.log('Out of Stock...Retrying'.red);
                                                                                                    if (await page.$("div[id='t12c3']") !== null){
                                                                                                        const six = "div[id='t12c3']";
                                                                                                        await cursor.move(six)
                                                                                                        await cursor.click()
                                                                                                        console.clear();
                                                                                                        await page.waitForTimeout(2000);
                                                                                                        if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                            console.log('In Stock'.green);
                                                                                                            await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                            await page.waitForTimeout(2000);
                                                                                                            if (await page.$("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']") !== null){
                                                                                                                await page.click("button[class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-area-btn ui-area-btn-success radius-none margin-right-5px btn-save']", elem => elem.click(), { clickCount: 3 });
                                                                                                            }
                                                                                                            console.log('Successfully Reserved'.bold .green)
                                                                                                            log2();
                                                                                                            await page.waitForTimeout(2000);
                                                                                                        }
                                                                                                        else{
                                                                                                            console.log('All Courts Out of Stock, Better Luck Next Time ):'.red);
                                                                                                            await browser.close();                                                                                                            
                                                                                                 }
                                                                                            
                                                                                             }
                                                                                                    
                                                                                         }
                                                                                        
                                                                                     }
                                                                                            
                                                                                 }
                                                                                
                                                                             }
                                                                                    
                                                                         }
                                                                        
                                                                     }
                                                                            
                                                                 }
                                                                
                                                             }
                                                                    
                                                         }
                                                        
                                                     }
                                                            
                                                 }
                                                
                                             }
                                                    
                                         }
                                        
                                     }
                                            
                                  }
                                
                             }
                                    
                          }
                        
                     }
                            
                 }
                
             }
                    
         }
        
     }
        
}

        async function checkout(){
            var {page, browser} = await givePage();
            await gen(page, browser);
            await monitor(page, browser);
            await fill(page, browser);
          }
           
          checkout();
    
        }, null, true, 'America/Los_Angeles');
          
        }
    
    
    }
    



















async function log() {

    const memberid = credentials.memberid
    const password = credentials.password

for (let i = 0; i < memberid.length ; i++){
    
    const b_url = 'https://www.bellevueclub.com/wp-content/themes/bc/images/bellevue-club-mini-logo.png'

    hook.setUsername('GameTime');
    hook.setAvatar(b_url);
    const embed = new MessageBuilder()
    .setTitle('🎾Successful Reservation🎾')
    .addField('Site', 'Bellevue Club', true)
    .addField('Mode', 'Fast', true)
    .addField('Email', '||' + memberid[i] + '||')
    .addField('Password', '||' + password[i] + '||')
    .setColor('#73ac0e')
    .setThumbnail('https://i.pinimg.com/originals/f1/a8/d5/f1a8d55545610614316bdaba9a1642a7.jpg')
    .setDescription('')
    .setImage('')
    .setFooter('GameTime', b_url)
    .setTimestamp();
    hook.send(embed);
}
}

async function log2() {

    const memberid = credentials.memberid
    const password = credentials.password

for (let i = 0; i < memberid.length ; i++){
    
    const b_url = 'https://www.bellevueclub.com/wp-content/themes/bc/images/bellevue-club-mini-logo.png'

    hook.setUsername('GameTime');
    hook.setAvatar(b_url);
    const embed = new MessageBuilder()
    .setTitle('🎾Successful Reservation🎾')
    .addField('Site', 'Bellevue Club', true)
    .addField('Mode', 'Safe', true)
    .addField('MemberID', '||' + memberid[i] + '||')
    .addField('Password', '||' + password[i] + '||')
    .setColor('#73ac0e')
    .setThumbnail('https://i.pinimg.com/originals/f1/a8/d5/f1a8d55545610614316bdaba9a1642a7.jpg')
    .setDescription('')
    .setImage('')
    .setFooter('GameTime', b_url)
    .setTimestamp();
    hook.send(embed);
}
}