var creator;
var metadata_url;
var image_url;
var royalty_address;
var royalty_bps;
var mint_height;

function init(creator_, metadata_, image_, royalty_, royalty_bps_) {
  assert(read("decimals") == 0, "NFT must be indivisible");

  creator = bech32(creator_);
  metadata_url = metadata_;
  image_url = image_;
  royalty_address = bech32(royalty_);
  royalty_bps = uint(royalty_bps_);
  assert(royalty_bps <= 10000, "max royalty 100%");
}

function mint_to(to_str, memo) public {
  assert(this.user == creator, "not authorized");
  assert(!is_minted(), "already minted");

  mint_height = this.height;
  if (memo == null) memo = "mint";

  mint(bech32(to_str), 1, memo);
}

function is_minted() const public {
  return mint_height != null;
}

function get_meta() const public {
  return {
    metadata: metadata_url,
    image: image_url,
    royalty_address: string_bech32(royalty_address),
    royalty_bps: royalty_bps,
    mint_height: mint_height
  };
}