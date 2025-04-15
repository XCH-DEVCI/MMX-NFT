var creator;
var token_id = 0;

// token_id => { owner, metadata_url, image_url, royalty_address, royalty_rate }
var tokens = {};

// Contract constructor: sets the creator address
function init(creator_str) {
  creator = bech32(creator_str);
}

// Mint a new NFT with full metadata, image, and royalty settings
function mint(to_str, metadata_url, image_url, royalty_str, rate) public {
  assert(this.user == creator, "not authorized");

  var to = bech32(to_str);
  var royalty_addr = bech32(royalty_str);
  var royalty_rate = uint(rate);

  var id = token_id;
  token_id += 1;

  set(tokens, id, {
    owner: to,
    metadata_url: metadata_url,
    image_url: image_url,
    royalty_address: royalty_addr,
    royalty_rate: royalty_rate
  });

  event("mint", {
    id: id,
    to: string_bech32(to),
    metadata_url: metadata_url,
    image_url: image_url,
    royalty: {
      to: string_bech32(royalty_addr),
      rate: royalty_rate
    }
  });
}

// Get token details (including image and metadata URLs)
function get_token(id) const public {
  var token = tokens[id];
  assert(token != null, "token not found");
  return token;
}

// Burn an NFT (only allowed by owner)
function burn(id) public {
  var token = tokens[id];
  assert(token != null, "token not found");
  assert(token.owner == this.user, "not owner");
  erase(tokens, id);
  event("burn", {id: id});
}

// Buy an NFT: pays seller and royalty address automatically
function buy(id) public payable {
  var token = tokens[id];
  assert(token != null, "token not found");
  assert(token.owner != this.user, "cannot buy your own token");

  assert(this.deposit.currency == bech32(), "only MMX accepted");
  var total = this.deposit.amount;

  var royalty_amount = (total * token.royalty_rate) / 100;
  var seller_amount = total - royalty_amount;

  send(token.owner, seller_amount);
  send(token.royalty_address, royalty_amount);

  var prev_owner = token.owner;
  token.owner = this.user;

  event("buy", {
    id: id,
    from: string_bech32(prev_owner),
    to: string_bech32(this.user),
    paid: total,
    royalty: royalty_amount
  });
}
