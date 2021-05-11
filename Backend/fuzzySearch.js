
const MINIMUM_PERCENT_MATCH = 33.33;
const low_value = ["to", "as", "at", "by", "for", "in", "of", "on", "with", "that", "this", "a", "an", "the"];
const med_value = ["i", "you", "your", "me", "my", "we", "us", "our", "she", "her", "he", "him", "it", "they", "them", "who", "is", "was", "their"]


function getKeywords(s){
  let ret = s.toString().toLowerCase().replace(/[\s-~\|\+]+/g, " ")
  .replace(/['’]s\b|s['’]\b|[:!\.,\?\*]+| season [0-9]+$| the final season$|^season [0-9]+ of |^a |^an |^the /g, "").split(" ");

  return ret;
}

function assignValues(keywords){
  let total = 0;
  return ({keywords:keywords.map(s => {
    let value = low_value.includes(s)?1:(med_value.includes(s)?2:4);
    total += value;
    return ({word:s, value:value})
  }), total:total})
}

function makeComparable(s){
  let keywords = getKeywords(s);
  let ret = assignValues(keywords);
  return {original:s, ...ret}
}

function compare(a, b){
  let big = a, small = b;
  if(a.keywords.length < b.keywords.length){
    big = b; small = a;
  }

  let ret = 0;

  for(let x = 0; x < big.keywords.length - small.keywords.length+1; x++){ //Shift To find the best positional match
    let hits = 0, wrong = 0, last_hit = -1;
    let start_overlap = -1, done = false;

    for (let i = 0; i < small.keywords.length && !done; i++){
      //console.log(`${small.keywords[i].word}:`)
      let value_between = 0;
      let hit = false;
      let distance = 0;
      for (let j = last_hit+1+x; j < big.keywords.length; j++){
        //console.log(`\t${big.keywords[j].word}`)
        hit = small.keywords[i].word == big.keywords[j].word 
        if(hit){
          //console.log(`\t${x}:Hit (${small.keywords[i].value}points)!`)
          last_hit = j;
          hits += small.keywords[i].value;
          if(start_overlap == -1) start_overlap = j;
          if(hits >= small.total)
            done = true;
          break;
        }
        if(start_overlap != -1 && !hit){
          value_between += big.keywords[j].value 
        }
        distance++
      }
      if(!hit){
        wrong += small.keywords[i].value;
        //console.log(`\t${x}:Miss (-${small.keywords[i].value}points)!`)
      }else if(distance > 0 && start_overlap){
        wrong += value_between;
        //console.log(`\t${x}:Shift (-${value_between}points)!`)
      } 
    }

    let run_value = Math.round(100*(
      1000*((hits-wrong)/((9*small.total)+big.total)) //It's 90% more important to match the smaller string
    ))/100
    if(run_value > ret)
      ret = run_value;
  }
  
  return ret >= 0?ret:0.00; //Make sure no negative matches
}

exports.bestMatch = (seeker, source) =>{
    seeker = seeker.map(s => (seeker != undefined && seeker != null)?makeComparable(s):"").filter(s => s != "");
    source = source.map(s => (source != undefined && source != null)?makeComparable(s):"").filter(s => s != "");
    
    return seeker.map(show => {
        best = -1;
        best_percent = 0;
        for(let i = 0; i < source.length; i++){
            let this_percent = compare(show, source[i]);
            if(this_percent > best_percent && this_percent > MINIMUM_PERCENT_MATCH){
                best = i;
                best_percent = this_percent;
            }
        }
        return ({original:show.original, match:best, match_percent:best_percent})
    })
}