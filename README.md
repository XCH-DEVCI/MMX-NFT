# MMX NFT Smart Contract – Basic Mintable NFT with Metadata and Royalties

This project provides a complete setup for creating and minting NFTs on the MMX blockchain using a custom smart contract.

---

## Step-by-Step Guide

### 1. Write the NFT Contract

Edit the file: `contract/my_nft_contract.js`

This contract includes:

- Metadata URI
- Image URI
- Royalty address and percentage
- Minting restriction (only creator can mint once)

### 2. Compile the Contract
```bash
mmx_compile -f contract/my_nft_contract.js -o compiled/my_nft_contract.dat
```

### 3. Deploy the Contract Binary
```bash
mmx wallet deploy compiled/my_nft_contract.dat
```

### 
```bash
mmx wallet exec mint_to "mmx1...recipient_address..." -x mmx1...nft_contract...
```