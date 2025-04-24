# MMX NFT – Basic Mintable NFT with Metadata

This project provides a complete setup for creating and minting NFTs on the MMX blockchain

---

## Step-by-Step Guide

### Before we start

### 0. Please read the definition of NFT on MMX network
```md
NFT Standard
NFTs on MMX are instances of the nft.js contract with binary mmx1hzz9tgs2dz9366t3p4ep8trmaejx7tk9al9ah3md2u37pkesa3qqfyepyw.
Every contract inherits from TokenBase, as such each NFT already has the following (read-only) fields:

name: String, max length 64
meta_data: Object
The standard for meta_data is as follows:

description: A human-readable description of the item. Markdown is supported.
image: Image URL. Use mmx://mmx1... for on-chain data.
external_url: Link to external site to view NFT.
attributes: Object of custom attributes (not standardized).
```

### 1. Prepare your node and wallet
```md
Install MMX Node:
https://docs.mmx.network/guides/installation/

Start Node:
https://docs.mmx.network/guides/getting-started/

Wallet CLI (On Windows search for MMX CMD):
https://docs.mmx.network/software/cli-commands/
```

### 2. Prepare and deploy template.js
template.js
```javascript
var creator;
var nfts = {};

function init(creator_)
{
	creator = bech32(creator_);
}

function add(serial, creator_key, signature) public 
{
	assert(this.user);
	assert(is_uint(serial));
	assert(serial > 0);
	
	assert(nfts[serial] == null, "already minted", 2);
	
	assert(sha256(creator_key) == creator, "invalid creator", 3);
	
	const msg = concat(string_bech32(this.address), "/", string(serial));
	
	assert(ecdsa_verify(sha256(msg), creator_key, signature), "invalid signature", 4);
	
	nfts[serial] = this.user;
}
```

(1) Open your terminal or MMX_CMD.
(2) Use following commands to compile and deploy

```md
mmx_compile -f template.js -o template.dat
mmx wallet deploy template.dat
```

This will return a binary_address_of_template.js (e.g. mmx1xxxxx...).

### 3. Prepare and deploy template.json
template.json
```json
{
  "__type": "mmx.contract.Executable",
  "name": "template",
  "symbol": "TPL",
  "decimals": 0,
  "binary": "=binary_address_of_template.js",
  "init_args": ["=your_wallet_address"]
}
```

(1) Open your terminal or MMX_CMD.
(2) Use following commands to deploy

```md
mmx wallet deploy template.json
```

This will return a your_template_contract_address (e.g. mmx1xxxxx...).

### 3. Prepare and deploy your nft.json
here is an example nft.json
```json
{
  "__type": "mmx.contract.Executable",
  "name": "MMX NFT",
  "symbol": "MFT",
  "decimals": 0,
  "binary": "mmx17jk7vd2jdscvvztvwpx2ap5xsdnsn8aennud8969y8r5ppg58ylsn8x9yw",
  "depends": {
    "template": "=your_template_contract_address"
  },
  "init_method": "init",
  "init_args": [
    "=your_wallet_address"
  ],
  "meta_data": {
    "name": "Your NFT Name",
    "description": "Your NFT Description",
    "image": "An url link of image",
    "external_url": "An url link of another link,
    "attributes": {
      "type": "-"
    }
  }
}
```

Then, deploy your nft.json with following command:

```md
mmx wallet deploy nft.json
```

This will return a your_nft_contract_address (e.g. mmx1xxxxx...).

### 4. Mint your NFT
Use following command to mint a NFT
```md
mmx wallet exec mint_to destination_address -x your_nft_contract_address
```

