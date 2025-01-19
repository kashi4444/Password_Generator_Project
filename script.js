const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#UpperCase");
const lowercaseCheck = document.querySelector("#LowerCase");
const numbersCheck = document.querySelector("#Numbers");
const symbolsCheck = document.querySelector("#Symbols");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

setIndicator("#ccc");

function handleSlider() {                         //it reflects the change in length of the password in UI.
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%";
    
}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`;
} 
function getRdmInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);      //to get the random value between min and max value
    //OR
    // return Math.floor(Math.random()*(max-min))  +min;
}
function generateRdmNumber() {                                //generate random integer between 0 & 9
    return getRdmInteger(0, 9);
}
function generateUpperCase() {                               //generate random upperCase alphabet 
    return String.fromCharCode(getRdmInteger(65, 91));       
}
function generateLowerCase() {                                //generate random LowerCase alphabet 
    return String.fromCharCode(getRdmInteger(97, 123));
}
function generateSymbol() {                                  //generate random LowerCase alphabet                
    let idx = getRdmInteger(0, symbols.length);
    return symbols.charAt(idx);                              // return symbols[idx];
}
function calcStrength() {
    let hasupper = false;
    let haslower = false;
    let hasnumber = false;
    let hassymbols = false;
    if (uppercaseCheck.checked) {
        hasupper = true;
    }
    if (lowercaseCheck.checked) {
        haslower = true;
    }
    if (numbersCheck.checked) {
        hasnumber = true;
    }
    if (symbolsCheck.checked) {
        hassymbols = true;
    }
    if (hasupper && haslower && (hasnumber || hassymbols) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((haslower || hasupper) && (hasnumber || hassymbols) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}
async function copyContent() {                              //it copies the password when it get generated
    try {
        await navigator.clipboard.writeText(passwordDisplay.value); 
        copyMsg.innerText = "Copied";
    } catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make visible the copied mssg
    copyMsg.classList.add("active");

    //to hide the copied mssg after a particular time
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length-1; i>0; i--){
        //Random value of j
        const j=Math.floor(Math.random() * (i+1));
        //Swap i and j index
        const temp =array[i];
        array[i] = array[j];
        array[j]= temp;
    }
    let str ="";
    array.forEach((el)=> (str += el));
    return str;

}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordLength < checkCount){
        passwordLength= checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
    
});

inputSlider.addEventListener('input', (e) =>{        //it will update the value of pssword length when slider slides
    passwordLength=e.target.value;
    handleSlider(); 
})

copyBtn.addEventListener('click', ()=> {
    if(passwordDisplay.value){
        copyContent();
    }
})


generateBtn.addEventListener('click', ()=>{
    //none of the checkbox is selected
    if(checkCount ==0){
        return;
    }

    //length of the password is less than the total no. of checkboxes ticked
    if(passwordLength < checkCount){
        passwordLength= checkCount;
        handleSlider();
    }

    //now create a password
    
    //remove old password
    password="";

    let funcArr =[];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRdmNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //Compulsory Addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
        
    }
    
    //Remaining Addition
    for(let i=0;i<passwordLength-funcArr.length ; i++){
        let randIdx= getRdmInteger(0, funcArr.length);
        password += funcArr[randIdx]();
        
    }
    
    //shuffle the password

    password= shufflePassword(Array.from(password));
    //show in UI
    passwordDisplay.value= password;
    
    //calculate Strength

    calcStrength();
    
})
