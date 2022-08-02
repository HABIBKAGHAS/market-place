const { ethers, network } = require("hardhat");
const frontEndContractFile = "../market-place-nextjs/constants/networkMapping.json";
const frontEndAbiFile = "../market-place-nextjs/constants/";
const fs = require("fs");
module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...");
        await updateContractAddresses();
        await updateAbi();
    }
};

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketPlace");
    fs.writeFileSync(
        `${frontEndAbiFile}NftMarketPlace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    );
    const basicNft = await ethers.getContract("BasicNft");
    fs.writeFileSync(
        `${frontEndAbiFile}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    );
}

async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContract("NftMarketPlace");
    const chainId = network.config.chainId.toString();
    const contractAddress = JSON.parse(fs.readFileSync(frontEndContractFile, "utf8"));
    if (chainId in contractAddress) {
        if (!contractAddress[chainId].NftMarketPlace.includes(nftMarketplace.address)) {
            contractAddress[chainId].NftMarketPlace.push(nftMarketplace.address);
        }
    } else {
        contractAddress[chainId] = { NftMarketPlace: nftMarketplace.address };
    }

    fs.writeFileSync(frontEndContractFile, JSON.stringify(contractAddress));
}

module.exports.tags = ["all", "frontend"];
