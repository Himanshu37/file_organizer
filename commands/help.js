function helpFn(){
    console.log(`
    List of all the commands:
            node index.js tree "directoryPath"
            node index.js organize "directoryPath"
            node index.js help 
    `);
}

module.exports = {
    helpKey:helpFn
}