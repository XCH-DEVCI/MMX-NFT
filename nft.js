var creator;
var metadata_uri;
var image_uri;
var royalty_address;
var royalty_bps; // e.g., 500 for 5%
var mint_height;

function init(creator_, metadata_uri_, image_uri_, royalty_address_, royalty_bps_) {
    assert(read("decimals") == 0, "Decimals must be zero for NFTs");
    creator = bech32(creator_);
    metadata_uri = metadata_uri_;
    image_uri = image_uri_;
    royalty_address = bech32(royalty_address_);
    royalty_bps = uint(royalty_bps_);
    assert(royalty_bps <= 10000, "Royalty percentage cannot exceed 100%");
}

function mint_to(address, memo) public {
    assert(this.user == creator, "Only creator can mint");
    assert(!is_minted(), "NFT already minted");
    mint_height = this.height;
    if(memo == null) {
        memo = "mmx_nft_mint";
    } else if(memo == false) {
        memo = null;
    }
    mint(bech32(address), 1, memo);
}

function burn() public {
    assert(this.user == owner(), "Only owner can burn");
    burn_token(1);
    // Additional cleanup if necessary
}

function royalty_info(sale_price) const public {
    var royalty_amount = (sale_price * royalty_bps) / 10000;
    return [royalty_address, royalty_amount];
}

function get_metadata_uri() const public {
    return metadata_uri;
}

function get_image_uri() const public {
    return image_uri;
}

function is_minted() const public {
    return mint_height != null;
}