#!/usr/bin/env node
let fs = require('fs');
let path = require('path');
let inputArr = process.argv.slice(2);
// console.log(inputArr);

let types = {
    media : ["mp4","mkv"],
    archives: ["zip","7z","rar","tar","gz","ar","iso","xz"],
    documents: ["docx","doc","pdf","xlsx","xls","odt","ods","odp","odg","odf","txt","ps","tex"],
    app: ["exe","dmg","pkg","deb"]
}

// node index.js tree "directoryPath"
// node index.js organize "directoryPath"
// node index.js help

let command = inputArr[0];
switch(command){
    case "tree":
        treeFn(inputArr[1]);
        break;
    
    case "organize":
        organizeFn(inputArr[1]);
        break;

     case "help":
         helpFn();
         break;
         
     default:
         console.log("Please 🙏 input right command");
         break;
}

function treeFn(dirPath){
    // console.log("Tree command implemented for ",dirPath);
    //   let destPath;
  if(dirPath == undefined){
    //   console.log("Kindly enter the path");
    
     treeHelper(process.cwd(), "");
      return;
  }else{
       let doesExist = fs.existsSync(dirPath);
       if(doesExist){
           treeHelper(dirPath, "");
           
       }else{
           console.log("Kindly enter the correct path");
           return;
       }
  }
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

function helpFn(){
    console.log(`
    List of all the commands:
            node index.js tree "directoryPath"
            node index.js organize "directoryPath"
            node index.js help 
    `);
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

function sendFiles(srcFile,dest,category){
    let catergoryPath = path.join(dest,category);
    if(fs.existsSync(catergoryPath)== false){
        fs.mkdirSync(catergoryPath);
    }
    let fileName = path.basename(srcFile);
    let destFilePath = path.join(catergoryPath,fileName);
    fs.copyFileSync(srcFile,destFilePath);
    fs.unlinkSync(srcFile);
}

function treeHelper(dirPath,indent){
    // us file or folder
   let isFile =  fs.lstatSync(dirPath).isFile();
   if(isFile == true){
       let fileName = path.basename(dirPath);
       console.log(indent + "├──" + fileName);
   }else{
       let dirName = path.basename(dirPath);
      console.log(indent+"└──"+ dirName);
      let childrens = fs.readdirSync(dirPath);
      for(let i = 0 ; i <childrens.length;i++){
          let childPath =  path.join(dirPath,childrens[i]);
          treeHelper(childPath,indent+"\t");
      }
   }
}