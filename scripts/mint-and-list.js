const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");
async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketPlace");
    const basicNft = await ethers.getContract("BasicNft");
    console.log("Minting NFTs...");
    const mintTx = await basicNft.mintNft();
    const mintTxRecipt = await mintTx.wait(1);
    const tokentId = mintTxRecipt.events[0].args.tokenId;
    console.log("approving Nft...");

    const approveTx = await basicNft.approve(nftMarketplace.address, tokentId);
    await approveTx.wait(1);
    console.log("Listing Nft...");
    const tx = await nftMarketplace.listItem(basicNft.address, tokentId, PRICE);
    await tx.wait(1);
    console.log("listed !");
    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(1, (sleepAmount = 1000));
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
