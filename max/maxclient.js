
const maxApi = require('max-api');

const Websocket = require('ws');
let ws;
maxApi.addHandler('connect', (url) => {

    ws = new Websocket(url);
    //console.log('attempt');
    ws.onopen = () => {
        ws.send("Hello, world!");
        //console.log("heloo")
    };
    ws.onmessage = (event) => {
        console.log(`receive message: ${event.data}`)
        maxApi.outlet('talkback', event.data);
        let temp = JSON.parse(event.data);
        control(temp.score, temp.s)



        //console.log(temp.s)
        //maxApi.post(temp.s);
    };
});



function control(score, signal) {
    if (score <= 400) {

        // maxApi.post(signal);
        scoreBelowFour(signal)
    } else if (score <= 800) {
        scoreBelowEight(signal);
    } else if (score <= 1600) {
        scoreBelowSixteen(signal);
    } else if (score <= 6400) {
        scoreBelowSixtyFour(signal);
    } else if (score <= 9600) {
        scoreBelowNintySix(signal);
    } else {
        scoreAboveNintySix(signal);
    }
}



function scoreBelowFour(signalReceive) {
    if (signalReceive == 2 || signalReceive == 6 || signalReceive == 10){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 1){
                    maxApi.outlet('num', i)
                }    
            }  
        
    }
    if (signalReceive == 3 || signalReceive == 7 || signalReceive == 11){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 5){
                    maxApi.outlet('num', i)
                }    
            }  
        
    }
    if (signalReceive == 4 || signalReceive == 8){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 7){
                    maxApi.outlet('num', i)
                }    
            }  
       
    }
    if (signalReceive == 5 || signalReceive == 9 ){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 10){
                    maxApi.outlet('num', i)
                }    
            }  
    }
    

}

function scoreBelowEight(signalReceive){
    if (signalReceive == 2 || signalReceive == 6 || signalReceive == 10){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 7){
                    maxApi.outlet('num', i)
                }    
            }  
        
    }
    if (signalReceive == 3 || signalReceive == 7 || signalReceive == 11){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 11){
                    maxApi.outlet('num', i)
                }    
            }  
        
    }
    if (signalReceive == 4 || signalReceive == 8){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 3){
                    maxApi.outlet('num', i)
                }    
            }  
       
    }
    if (signalReceive == 5 || signalReceive == 9 ){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 12){
                    maxApi.outlet('num', i)
                }    
            }  
    }
    

}

function scoreBelowSixteen(signalReceive){
    if (signalReceive == 2 || signalReceive == 6 || signalReceive == 10){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 3){
                    maxApi.outlet('num', i)
                }    
            }  
        
    }
    if (signalReceive == 3 || signalReceive == 7 || signalReceive == 11){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 6){
                    maxApi.outlet('num', i)
                }    
            }  
        
    }
    if (signalReceive == 4 || signalReceive == 8){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 9){
                    maxApi.outlet('num', i)
                }    
            }  
       
    }
    if (signalReceive == 5 || signalReceive == 9 ){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 11){
                    maxApi.outlet('num', i)
                }    
            }  
    }
    

}

function scoreBelowSixtyFour(signalReceive){
    if (signalReceive == 2 || signalReceive == 6 || signalReceive == 10){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 9){
                    maxApi.outlet('num', i)
                }    
            }  
        
    }
    if (signalReceive == 3 || signalReceive == 7 || signalReceive == 11){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 2){
                    maxApi.outlet('num', i)
                }    
            }  
        
    }
    if (signalReceive == 4 || signalReceive == 8){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 5){
                    maxApi.outlet('num', i)
                }    
            }  
       
    }
    if (signalReceive == 5 || signalReceive == 9 ){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 7){
                    maxApi.outlet('num', i)
                }    
            }  
    }
    

}

function scoreBelowNintySix(signalReceive){
    if (signalReceive == 2 || signalReceive == 6 || signalReceive == 10){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 5){
                    maxApi.outlet('num', i)
                }    
            }  
        
    }
    if (signalReceive == 3 || signalReceive == 7 || signalReceive == 11){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 8){
                    maxApi.outlet('num', i)
                }    
            }  
        
    }
    if (signalReceive == 4 || signalReceive == 8){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 11){
                    maxApi.outlet('num', i)
                }    
            }  
       
    }
    if (signalReceive == 5 || signalReceive == 9 ){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 3){
                    maxApi.outlet('num', i)
                }    
            }  
    }
    

}
function scoreAboveNintySix(signalReceive){
    if (signalReceive == 2 || signalReceive == 6 || signalReceive == 10){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 11){
                    maxApi.outlet('num', i)
                }    
            }  
        
    }
    if (signalReceive == 3 || signalReceive == 7 || signalReceive == 11){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 4){
                    maxApi.outlet('num', i)
                }    
            }  
        
    }
    if (signalReceive == 4 || signalReceive == 8){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 6){
                    maxApi.outlet('num', i)
                }    
            }  
       
    }
    if (signalReceive == 5 || signalReceive == 9 ){
        maxApi.outlet('num', 0)
        
            for (let i = 1; i < 13; i++){
                if (i != 9){
                    maxApi.outlet('num', i)
                }    
            }  
    }
    

}