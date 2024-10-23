require('dotenv').config()

const contractAddr = process.env.CONTRACT_ADDRESS
const contractAbi = process.env.CONTRACT_ABI

export const config = {
    contracts: {
    
       contract: {
           address: contractAddr,
           ABI: contractAbi,
       },
   }
}