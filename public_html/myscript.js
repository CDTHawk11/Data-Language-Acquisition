function getText(){
    return document.body.innerText;
}

var str=getText();
var words=str.split(" ");
//console.log(words);

var counts = [];

for(var i = 0; i< words.length; i++) {
    var num = words[i];
    counts[num] = counts[num] ? counts[num]+1 : 1;
}

console.log(counts);

var unique_numbers=Object.keys(counts).length;

console.log(unique_numbers);

var counts_new=[];
for (var key in counts)
	counts_new.push([key,counts[key]]);
counts_new.sort(function(a, b) {return b[1] - a[1]});

console.log(counts_new);
var arrays_to=counts_new.splice(0,4);


words_to=[];
for (var key in arrays_to)
	words_to.push([arrays_to[key][0]]);
var to_Translate = [].concat.apply([], words_to);
console.log(to_Translate);

var json_to_Translate=JSON.stringify(to_Translate),
    json_parse=JSON.parse(json_to_Translate);

alert(json_parse);

//$.ajax({
//    type: "POST",
//    url: "ajax/count.php",
//    data: { words_for_translation: json_parse },
//    dataType: 'json',
//    success: function(data){
//    
//    }
//});

//$.getJSON( "/url", {params }, function( data, status, xhr ) {
//    $.each(data.response, function(resKey, resValue){
//        if(resKey == "success"){
//             var _result = JSON.parse(resValue);
//        }
//    }
//}

wordDict={"football":"stupid","Alabama":"wimps", "a":"ANIMALS"}

for (word in wordDict) {
    document.body.innerHTML = document.body.innerHTML.replace(new RegExp('\\b' + word + '\\b',"gi"), wordDict[word]);
};

