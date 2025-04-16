var creator;
var owner;
var metadata_url;
var image_url;
var royalty_address;
var royalty_bps;
var mint_height;

// Init with all required NFT info
function init(creator_, metadata_, image_, royalty_, royalty_bps_) {
  assert(read("decimals") == 0, "NFT must be indivisible");

  creator = bech32(creator_);
  owner = creator;

  metadata_url = metadata_;
  image_url = image_;
  royalty_address = bech32(royalty_);
  royalty_bps = uint(royalty_bps_);
  assert(royalty_bps <= 10000, "max royalty is 100%");
}

// Only creator can mint this NFT once
function mint_to(to_str, memo) public {
  assert(this.user == creator, "not authorized to mint");
  assert(!is_minted(), "already minted");

  mint_height = this.height;
  owner = bech32(to_str);

  if (memo == null) {
    memo = "mint";
  } else if (memo == false) {
    memo = null;
  }

  mint(owner, 1, memo);
}

// Return whether NFT was already minted
function is_minted() const public {
  return mint_height != null;
}

// Return full NFT metadata
function get_meta() const public {
  return {
    metadata: metadata_url,
    image: image_url,
    royalty_address: string_bech32(royalty_address),
    royalty_bps: royalty_bps,
    mint_height: mint_height,
    owner: string_bech32(owner)
  };
}

// Internal check for ownership
function check_owner() const {
  assert(this.user == owner, "user is not owner", 1);
}

// Transfer NFT ownership to another address
function transfer(new_owner_str) public {
  check_owner();
  owner = bech32(new_owner_str);
  event("transfer", {
    from: string_bech32(this.user),
    to: new_owner_str
  });
}
