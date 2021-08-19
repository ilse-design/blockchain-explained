var SHA256 =  new Hashes.SHA256;

//define the blocks and what they contain
class Block{
    constructor(index,timestamp,data,previousHash = ''){
    this.index=index;
    this.data = data;
    this.previousHash = previousHash;
    this.hash= this.calculateHash();
    this.nonce = 0;
    }

    calculateHash(){

        return SHA256.hex(this.index + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
        
    }

    mineBlock(difficulty){
      while(this.hash.substring(0,difficulty) !=Array(difficulty + 1 ).join("0")){
        this.nonce++;
        this.hash = this.calculateHash();
      }
      console.log("blocks mined: " + this.hash);
    }
}

//script for the chain starting with a genesisblock and code to add a new block
class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
      this.difficulty = 4;

    }

    createGenesisBlock() {
      return new Block(0, "Genesis Block", '0');
    }
  
    
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash= this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);

    }

        // Check if the Genesis block hasn't been tampered with by comparing
      // the output of createGenesisBlock with the first block on our chain
    isChainValid() {

      const realGenesis = JSON.stringify(this.createGenesisBlock());
  
      if (realGenesis !== JSON.stringify(this.chain[0])) {
        console.log('genis');
        document.getElementById("status").innerHTML = "🔴";
        return false;
        
        
      }
  
      // Check the remaining blocks on the chain to see if there hashes and
      // signatures are correct
      for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];
  
        if (previousBlock.hash !== currentBlock.previousHash) {
          document.getElementById("status").innerHTML = "🔴";
          return false;
          
        }
  
       
  
        if (currentBlock.hash !== currentBlock.calculateHash()) {
          document.getElementById("status").innerHTML = "🔴";
          return false;
        }
      }
      document.getElementById("status").innerHTML = "🟢";
      return true;
    }
}

//varibles to create the backpack chain and make it visible
var amountBlock
let backpack = new Blockchain();
let counter = 1; // declared in global scope
var searchTerm; 

document.getElementById("add").addEventListener("click", function() {

//getting the input from the field and put it in a unsplash search 
  searchTerm = document.getElementById("searchWord").value;
  urlString = `https://source.unsplash.com/240x180/?${searchTerm}`;

  console.log(urlString);
  console.log(backpack.isChainValid());

  //displaying the images from unsplash
  document.getElementById(counter).setAttribute("style", "background-image: url(" + urlString + ");opacity: 100%;");
  document.getElementById("amount").innerHTML = counter;


    // adding a new block to the chain with the searchterm as url as the data to calculate the hash
	backpack.addBlock(new Block(counter, {object: urlString}));
  console.log(JSON.stringify(backpack, null, 4));
  console.log(backpack.isChainValid());
  backpack.isChainValid();

  counter++; // increment this instead of rand int so it's 0,1,2 etc
});


// code for the alter the chain part
document.getElementById("change").addEventListener("click", function() {
  console.log("item changed")

  var searchTerm = document.getElementById("changeWord").value;

  urlString = `https://source.unsplash.com/240x180/?${searchTerm}`;
  
  backpack.chain[3].data = {object: urlString};
  console.log(backpack.isChainValid());
  console.log(urlString);

  //change the image displayed
  document.getElementById("3").setAttribute("style", "background-image: url(" + urlString + ");opacity: 100%;");
  backpack.isChainValid();

});




    


