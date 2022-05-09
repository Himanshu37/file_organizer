let fs = require('fs');
let path = require('path');
let types = {
    media : ["mp4","mkv"],
    archives: ["zip","7z","rar","tar","gz","ar","iso","xz"],
    documents: ["docx","doc","pdf","xlsx","xls","odt","ods","odp","odg","odf","txt","ps","tex"],
    app: ["exe","dmg","pkg","deb"]
}

function organizeFn(dirPath){
    // console.log("Organize command implemented for ",dirPath);
    // 1. input -> directory path given
    // 2. create -> organized_files -> directory
    // 3. identify categories of all the files present in that input directory
    // 4. copy/cut files to that organized directory inside of any of catergory folder
    let destPath;
    if(dirPath == undefined){
        // console.log("Kindly enter the path");
        destPath = process.cwd();
        return;
    }else{
         let doesExist = fs.existsSync(dirPath);
         if(doesExist){
             destPath = path.join(dirPath,"Organized_Files");
             if(fs.existsSync(destPath) == false){
                   fs.mkdirSync(destPath);
             }
             
         }else{
             console.log("Kindly enter the correct path");
             return;
         }
    }
    organizeHelper(dirPath,destPath);
}

function organizeHelper(dirPath,destPath){
    let childNames = fs.readdirSync(dirPath);
    // console.log(childNames);
    for(let i = 0 ; i < childNames.length ; i++){
        let childAddress = path.join(dirPath,childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            // console.log(childNames[i]);
            let category = getCategory(childNames[i]);
            // console.log(category);
            sendFiles(childAddress,destPath,category);
        }
    }
}

function getCategory(name){
    let ext = path.extname(name);
    ext = ext.slice(1);
    // console.log(ext);
    for(let type in types){
       let cTypeArray = types[type];
       for(let i = 0 ; i<cTypeArray.length;i++){
            if(ext == cTypeArray[i]){
                return type;
            }
       }
    }
    return "others";
}

module.exports={
    organizeKey:organizeFn
}