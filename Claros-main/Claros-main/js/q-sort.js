//Table template lines
var empty_line = `<tr height="10"></tr>`;
var head_line = `<tr style="background-color: #CCFFFF;">
<td align="center" style="width: 10%; color: #2452b5; font-size: 120%; font-weight: bold;">category</td>
<td align="center" colspan="2" style="width: 40%; color: #c70808; font-style: italic;">Warning</td>
<td align="center" style="width: 10%;">-2</td>
<td align="center" style="width: 10%;">-1</td>
<td align="center" style="width: 10%;">0</td>
<td align="center" style="width: 10%;">+1</td>
<td align="center" style="width: 10%;">+2</td>
</tr>`
var item_line = `<tr>
<td style="width: 10%;"></td>
<td style="width: 10%;">statementID</td>
<td style="width: 30%;">statementDes</td>
<td align="center" style="width: 10%;"><input class="form-check-input" type="radio" name="statementname" value="option1"></td>
<td align="center" style="width: 10%;"><input class="form-check-input" type="radio" name="statementname" value="option2"></td>
<td align="center" style="width: 10%;"><input class="form-check-input" type="radio" name="statementname" value="option3"></td>
<td align="center" style="width: 10%;"><input class="form-check-input" type="radio" name="statementname" value="option4"></td>
<td align="center" style="width: 10%;"><input class="form-check-input" type="radio" name="statementname" value="option5"></td>
</tr>`

//Declare statements
var statements;

//Table validity status
var gloabl_status = false;

//Slot requirements
var slotReq_1 = 1
var slotReq_2 = 2
var slotReq_3 = 3
var slotReq_4 = 2
var slotReq_5 = 1

//Read statements data
function readData() {
    return new Promise((resolve, reject) => {
        if ($.csv) {
            $.get('data/data.csv', function (data) {
                statements = $.csv.toObjects(data);
                resolve(statements);
            });
        } else {
            reject('jQuery-csv is not loaded!');
        }
    });
}

//Shuffling items of an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//Default table
async function defaultTable(){
    await readData();
    var form_HTML = empty_line+head_line.replace(/category/g,"+2").replace(/Warning/g,"")+empty_line+head_line.replace(/category/g,"+1").replace(/Warning/g,"")+empty_line+head_line.replace(/category/g,"0").replace(/Warning/g,"");
    var mystatements = JSON.parse(JSON.stringify(statements));
    for (let statement of shuffleArray(mystatements)){
        form_HTML = form_HTML+item_line.replace(/statementID/g,statement.ID).replace(/statementDes/g,statement.Statement).replace(/statementname/g,statement.ID).replace(/option3"/g,'option3" checked');
    }
    form_HTML = form_HTML+empty_line+head_line.replace(/category/g,"-1").replace(/Warning/g,"")+empty_line+head_line.replace(/category/g,"-2").replace(/Warning/g,"");
    document.getElementById("tableBody").innerHTML = form_HTML;
}


document.addEventListener('DOMContentLoaded', function() {
    //Generate default table
    defaultTable();  
    //Define button actions                          
    document.getElementById('rankForm').addEventListener('submit', function(event) {
        event.preventDefault()
        const submittedButton = event.submitter;
        const form = new FormData(event.target);
        //Update button
        if (submittedButton.name=="update"){
            updateForm(form);
            if (gloabl_status == false){
                alert("The sort is incomplet. Some categories have too few or too many statements! Please select correct numbers of statements for each score and validate again.")
                document.getElementById("bottom-buttons").innerHTML = `<button class="custom-button" name="update">Validate</button>`;
            }
            else{
                alert("Data is valid. You can now submit your results")
                document.getElementById("bottom-buttons").innerHTML = `<button class="custom-button" name="update">Validate</button>
                <button class="custom-button" name="submit">Submit</button>`;
            }
        }
        //Submit button
        else if (submittedButton.name=="submit"){
            if (gloabl_status == false){
                alert("The sort is incomplet. Some categories have too few or too many statements! Please select correct numbers of statements before submitting.")
            }
            else{
                var userCode = prompt('Please provide a code word which will be used for processing your data anoymously (up to 8 characters):');
                while (userCode.length==0){
                    userCode = prompt('The entered user code is empty. Please enter your user code again');
                }
                sendData(form, userCode);
                document.getElementById("form section").innerHTML = "<h2>Thanks for submitting! You can close the window now!</h2>";
            }
        }
        //Reset button
        else{
            defaultTable();
        }
        });
});

//decide "statement" or "statements"
function plural(count){
    if (count == 1){
        return "statement"
    }
    else{
        return "statements"
    }
}

//Generate visual clues for remaining statements
function warningStatement(count,maximum){
    if (count < maximum){
        return `Please select ${maximum-count} more ${plural(maximum-count)} for this score.`
    }
    else if (count > maximum){
        return `Please drop ${count - maximum} ${plural(count - maximum)} for this score.`
    }
    else{
        return ``
    }
}

//Update ranking table based on current rankings
function updateForm(form){
    var statements1 = [];var statements2 = [];var statements3 = [];var statements4 = [];var statements5 = [];
    var count1 = 0; var count2 = 0; var count3 = 0; var count4 = 0; var count5 = 0; 
    var warning1 = ""; var warning2 = "";var warning3 = "";var warning4 = "";var warning5 = "";
    //Group statements based on current ranking
    for(let i=0; i<statements.length; i++){
        let option = form.get((i+1).toString());
        if (option=="option1"){
            count1+=1
            statements1.push(statements[i]);
        }
        else if (option=="option2"){
            count2+=1
            statements2.push(statements[i]);
        }
        else if (option=="option3"){
            count3+=1
            statements3.push(statements[i]);
        }
        else if (option=="option4"){
            count4+=1
            statements4.push(statements[i]);
        }
        else if (option=="option5"){
            count5+=1
            statements5.push(statements[i]);
        }
        else{
            console.log("Invalid option!");
        }
    }

    //Generate running visual cues
    warning1 = warningStatement(count1, slotReq_1)
    warning2 = warningStatement(count2, slotReq_2)
    warning3 = warningStatement(count3, slotReq_3)
    warning4 = warningStatement(count4, slotReq_4)
    warning5 = warningStatement(count5, slotReq_5)

    //Generate warning messages
    gloabl_status = true;
    if (count1!=1 || count2!=2 || count3!=3 || count4!=2 || count5!=1){
        gloabl_status = false;
    }

    //Generate new ranking table
    //+2
    var form_HTML = "";
    var warning_color = "#eeffcc"
    if (warning5.length == 0){
        form_HTML = form_HTML+empty_line+head_line.replace(/category/g,"+2").replace(/Warning/g,warning5);
    }
    else{
        form_HTML = form_HTML+empty_line+head_line.replace(/category/g,"+2").replace(/Warning/g,warning5).replace(/#CCFFFF/g,warning_color);
    }
    for (let statement of shuffleArray(statements5)){
        form_HTML = form_HTML+item_line.replace(/statementID/g,statement.ID).replace(/statementDes/g,statement.Statement).replace(/statementname/g,statement.ID).replace(/option5"/g,'option5" checked');
    }

    //+1
    if (warning4.length == 0){
        form_HTML = form_HTML+empty_line+head_line.replace(/category/g,"+1").replace(/Warning/g,warning4);
    }
    else{
        form_HTML = form_HTML+empty_line+head_line.replace(/category/g,"+1").replace(/Warning/g,warning4).replace(/#CCFFFF/g,warning_color);
    }
    for (let statement of shuffleArray(statements4)){
        form_HTML = form_HTML+item_line.replace(/statementID/g,statement.ID).replace(/statementDes/g,statement.Statement).replace(/statementname/g,statement.ID).replace(/option4"/g,'option4" checked');
    }

    //0
    if (warning3.length == 0){
        form_HTML = form_HTML+empty_line+head_line.replace(/category/g,"0").replace(/Warning/g,warning3);
    }
    else{
        form_HTML = form_HTML+empty_line+head_line.replace(/category/g,"0").replace(/Warning/g,warning3).replace(/#CCFFFF/g,warning_color);
    }
    for (let statement of shuffleArray(statements3)){
        form_HTML = form_HTML+item_line.replace(/statementID/g,statement.ID).replace(/statementDes/g,statement.Statement).replace(/statementname/g,statement.ID).replace(/option3"/g,'option3" checked');
    }

    //-1
    if (warning2.length == 0){
        form_HTML = form_HTML+empty_line+head_line.replace(/category/g,"-1").replace(/Warning/g,warning2);
    }
    else{
        form_HTML = form_HTML+empty_line+head_line.replace(/category/g,"-1").replace(/Warning/g,warning2).replace(/#CCFFFF/g,warning_color);
    }
    for (let statement of shuffleArray(statements2)){
        form_HTML = form_HTML+item_line.replace(/statementID/g,statement.ID).replace(/statementDes/g,statement.Statement).replace(/statementname/g,statement.ID).replace(/option2"/g,'option2" checked');
    }

    //-2
    if (warning1.length == 0){
        form_HTML = form_HTML+empty_line+head_line.replace(/category/g,"-2").replace(/Warning/g,warning1);
    }
    else{
        form_HTML = form_HTML+empty_line+head_line.replace(/category/g,"-2").replace(/Warning/g,warning1).replace(/#CCFFFF/g,warning_color);
    }
    for (let statement of shuffleArray(statements1)){
        form_HTML = form_HTML+item_line.replace(/statementID/g,statement.ID).replace(/statementDes/g,statement.Statement).replace(/statementname/g,statement.ID).replace(/option1"/g,'option1" checked');
    }    

    document.getElementById("tableBody").innerHTML = form_HTML;
}


//Send data to server to write to the result file
async function sendData(form, userCode) {
        // Prepare data to be sent
        var string = ""
        for(let i=0; i<statements.length; i++){
            let option = form.get((i+1).toString());
            if (option=="option1"){
                string+="-2,";
            }
            else if (option=="option2"){
                string+="-1,";
            }
            else if (option=="option3"){
                string+="0,";
            }
            else if (option=="option4"){
                string+="1,";
            }
            else if (option=="option5"){
                string+="2,";
            }
            else{
                console.log("Invalid option in writting to a file!");
            }
        }
        const dataToAppend = userCode+","+string+"\n";

        //Sent data
        fetch('/receiver.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' 
            },
            body: 'data=' + encodeURIComponent(dataToAppend) 
        })
        .then(response => response.text())
        .then(data => {
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('Error sending string data:', error);
        });
}
