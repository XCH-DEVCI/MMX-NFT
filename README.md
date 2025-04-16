# MMX NFT Smart Contract – Basic Mintable NFT with Metadata and Royalties

This project provides a complete setup for creating and minting NFTs on the MMX blockchain using a custom smart contract.

---

## Step-by-Step Guide

### Before we start

Please ensure you are using MMX CMD..... And remember to run node through run_node

### 1. Write the NFT Contract

Edit the file: `contract/nft.js`

This contract includes:

- Metadata URI
- Image URI
- Royalty address and percentage
- Minting restriction (only creator can mint once)

### 2. Compile the Contract
```bash
mmx_compile -f contract/nft.js -o compiled/nft_contract.dat
```

### 3. Deploy the Contract Binary
```bash
mmx wallet deploy compiled/nft_contract.dat
```
This will return a binary address (e.g. mmx1...code...).

### 4. Create Deployment JSON for the NFT
Edit deploy/deploy_nft.json:
```json
{
  "__type": "mmx.contract.Executable",
  "name": "MyNFT",
  "symbol": "MNFT",
  "decimals": 0,
  "binary": "mmx1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "init_method": "init",
  "init_args": [
    "mmx1yourcreatoraddresshere",
    "https://ipfs.io/ipfs/QmExampleMeta123/meta.json",
    "https://ipfs.io/ipfs/QmExampleImage456/image.png",
    "mmx1yourroyaltyaddresshere",                      
    "500"                                              
  ]
}

```
Replace binary with the address returned from step 3
Then:
```bash
mmx wallet deploy deploy/deploy_nft.json
```
This will return "Deployed mmx.contract.Executable as [mmx_address_for exec]"

### 5. Deploy the Executable NFT Instance
```bash
mmx wallet exec mint_to "mmx1...recipient_address..." -x mmx_address_for exec
```
This creates a live NFT contract with its own address (e.g. mmx1...nft...).
