const prompt = require('prompt-sync')()
var items = []; var battles = 0;
var selectRandom = false;
var itemModel = { name: '', id: -1, wins: 0, score: 0, battled: {} }

function addItem(name){
    var item = {...itemModel}
    item.name = name;
    item.id = items.length
    item.battled = {} //sets field to unique array rather than a reference to the same one in itemModel
    items.push(item)
}

function getValidChallengers(){//return challengers where battles is < 1 less than the number of items
    return items.filter(item => Object.keys(item.battled).length < items.length - 1) //keep if challenger hasn't battled everyone but themself.
}

function getItemsSortedByScore(){ //descending
    sortedItems = [...items]
    return sortedItems.sort((a, b) => {
        if(a.score > b.score) return -1
        else if(a.score < b.score) return 1
        else{ //if score is equal, return who won the battle between them
            return (a.battled[b.id].won ? -1 : 1) 
        }
    })
}

function getWins(id){
    // console.log(`wins for ${id}:${items[id].name}`)
    var wins = []; var battles = items[id].battled
    for(var rivalId in battles){
        // console.log(`Item ${id} ${items[id].name} v ${rivalId} ${items[rivalId].name}. ${battles[rivalId].won ? "Won." : "Lost."}`)
        if(battles[rivalId].won){
            wins.push(items[rivalId].name)
        }
    }
    return wins
}

function getTotalBattles(){
    return (items.length  * (items.length - 1)) / 2
}

function battle(challenger, rival){
    console.log(`\nBattle ${++battles}/${getTotalBattles()}: ${challenger.name} vs ${rival.name}`)

    var selection = ""; var challengerWon = false;
    while(selection != "1" && selection != "2"){
        console.log("\n1. " + challenger.name)
        console.log("2. " + rival.name)
        // selection = "2"
        selection = prompt('Pick your winner, 1, or 2: '); 
        
        switch (selection) {
            case "1":
                items[challenger.id].wins += 1; 
                items[challenger.id].score = items[challenger.id].wins + items[rival.id].score
                challengerWon = true;
                break;
            case "2":
                items[rival.id].wins += 1; 
                items[rival.id].score = items[rival.id].wins + items[challenger.id].score
                break;
            default:
                console.log("That's not a valid selection.")
        }
    }
    items[challenger.id].battled[rival.id] = {won:  challengerWon}; //add rival to challenger's battled list
    items[rival.id].battled[challenger.id] = {won: !challengerWon}; //add challenger to rival's battled list 
    console.log((challengerWon ? challenger.name : rival.name) + " wins!") 
}

addItem("Apple")
addItem("Orange")
addItem("Lime")
addItem("Banana")
addItem("Peach")
addItem("Strawberry")
addItem("Pear")
addItem("Lemon")


while(getValidChallengers().length > 0){
    //get challenger 
    var validChallengers = getValidChallengers(); 
    var challengerId = selectRandom ? Math.floor(Math.random()*validChallengers.length) : 0;
    var challenger = validChallengers[challengerId];

    //get rival
    var validRivals = validChallengers.filter(item => {
        return  !(item.id in challenger.battled) && //keep if challenger has not already battled them
                challenger.id != item.id //the challenger cannot challenge themself
    })
    var rivalId = selectRandom ? Math.floor(Math.random()*validRivals.length) : 0;
    var rival = validRivals[rivalId];
    
    battle(challenger, rival);
}

var rankedItems = getItemsSortedByScore()
console.log("\n")
for(var key in rankedItems){
    console.log(`${Number.parseInt(key) + 1}: ${rankedItems[key].name
    } with score: ${rankedItems[key].score
    } won against: ${getWins(rankedItems[key].id).join(', ')}`)
}