const prompt = require('prompt-sync')()
// var items = [
//     { name: 'item 0', id: 0, wins: 0, losses: 0, score: 0, battled: [1] },
//     { name: 'item 1', id: 1, wins: 0, losses: 0, score: 0, battled: [3, 2,0] },
//     { name: 'item 2', id: 2, wins: 0, losses: 0, score: 0, battled: [1] },
//     { name: 'item 3', id: 3, wins: 0, losses: 0, score: 0, battled: [1,4] },
//     { name: 'item 4', id: 4, wins: 0, losses: 0, score: 0, battled: [3] }
//   ]
var items = []
var itemModel = { name: '', id: -1, wins: 0, losses: 0, score: 0, battled: [] }
function addItem(name){
    var item = {...itemModel}
    item.name = name;
    item.id = items.length
    item.battled = [] //sets field to unique array rather than a reference to the same one in itemModel
    items.push(item)
}
function getValidChallengers(round, scoreFilter){//return challengers where battles is < 1 less than the number of items
    if(round == 1) return items.filter(item => item.battled.length < items.length - 1) //keep if challenger hasn't battled everyone but themself.
    else{
        if(scoreFilter === undefined){throw "scoreFilter must be specified on round > 1"}
        return items.filter(item => item.score == scoreFilter)
    }
}
function getItemsSortedByScore(){
    return items.sort((a, b) => {
        if(a.score > b.score){
            return -1
        } else if(a.score < b.score){
            return 1
        }else{
            return 0
        }
    })
}

function getScoreCounts(){
    var scores = {}
    for(var key in items){ //count scores
        var score = items[key].score;
        if(score in scores){scores[score].count++;}
        else{scores[score] = {count: 1};}
    }
}

function getDuplicateScoreItems(){
    var scores = getScoreCounts()
    return items.filter(item => scores[item.score].count > 1)
}

function battle(challenger, rival){
    console.log(`\n${challenger.name} vs ${rival.name}`)

    var selection = ""; 
    while(selection != "1" && selection != "2"){
        console.log("\n1. " + challenger.name)
        console.log("2. " + rival.name)
        selection = prompt('Pick your winner, 1, or 2: '); 
        switch (selection.toLowerCase()) {
            case "1":
                items[challenger.id].wins += 1; 
                items[rival.id].losses += 1; 
                break;
            case "2":
                items[rival.id].wins += 1; 
                items[challenger.id].losses += 1; 
                break;
            default:
                console.log("That's not a valid selection.")
        }
    }
    //calculate scores
    items[challenger.id].score = items[challenger.id].wins - items[challenger.id].losses
    items[rival.id].score = items[rival.id].wins - items[rival.id].losses

    items[challenger.id].battled.push(rival.id); //add rival to challenger's battled list
    items[rival.id].battled.push(challenger.id); //add challenger to rival's battled list
}

addItem("item 0")
addItem("item 1")
addItem("item 2")
addItem("bob")

var round = 1;
while(round < 3){
    var duplicateScores = getDuplicateScoreItems()
    if(round == 1){
        while(getValidChallengers(round).length > 0){
            //get challenger 
            var validChallengers = getValidChallengers(round); //console.log(validChallengers)
            var challenger = validChallengers[Math.floor(Math.random()*validChallengers.length)];

            //get rival
            var validRivals = validChallengers.filter(item => {
                return  challenger.battled.indexOf(item.id) == -1 && //keep if challenger has not already battled them
                        challenger.id != item.id //the challenger cannot challenge themself
            })
            var rival = validRivals[Math.floor(Math.random()*validRivals.length)];

            // console.log(challenger)
            // console.log(validRivals)
            battle(challenger, rival);

            console.log(items)
        }
    } else if(round > 1){
        if(!duplicateScores){ break; } //if past the first round, and there are no duplicate scores, then exit.
        var scores = getScoreCounts()
        for(var score in scores){ // loop through unique scores
            if(scores[score].count == 1){break}
            else{
                //battle each item with particular score
                var validChallengers = items.filter(item => item.score == scoreFilter) //TODO: and battled.len is 1 < total valid challengers
                for(var key in validChallengers){
                    items[validChallengers[key].id].battled = [] //clear out battles for valid challengers
                }
                var challenger = validChallengers[Math.floor(Math.random()*validChallengers.length)];
                var validRivals = validChallengers.filter(item => {
                    return  challenger.battled.indexOf(item.id) == -1 && //keep if challenger has not already battled them
                            challenger.id != item.id //the challenger cannot challenge themself
                })
                var rival = validRivals[Math.floor(Math.random()*validRivals.length)];
    
                // console.log(challenger)
                // console.log(validRivals)
                battle(challenger, rival);
            }
        }
    }
    round++
}

var rankedItems = getItemsSortedByScore()
console.log("\n")
for(var key in rankedItems){
    console.log(`${Number.parseInt(key) + 1}: ${rankedItems[key].name} with score: ${rankedItems[key].score} [+${rankedItems[key].wins}/-${rankedItems[key].losses}]`)
}