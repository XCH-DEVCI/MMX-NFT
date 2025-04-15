var creator;
var token_id = 0;
var tokens = {};  // token_id -> {owner, metadata, royalty_address, royalty_rate}

// Contract constructor
function init(creator_str) {
  creator = bech32(creator_str);
}

// Mint NFT with metadata URI, royalty address, and royalty rate
function mint(to_str, metadata_uri, royalty_str, rate) public {
  assert(this.user == creator, "not authorized");
  var to = bech32(to_str);
  var royalty_addr = bech32(royalty_str);
  var royalty_rate = uint(rate);

  var id = token_id;
  token_id += 1;

  set(tokens, id, {
    owner: to,
    metadata: metadata_uri,
    royalty_address: royalty_addr,
    royalty_rate: royalty_rate
  });

  event("mint", {
    id: id,
    to: string_bech32(to),
    metadata: metadata_uri,
    royalty: {
      to: string_bech32(royalty_addr),
      rate: royalty_rate
    }
  });
}

// View token details
function get_token(id) const public {
  var t = tokens[id];
  assert(t != null, "not found");
  return t;
}

// Destroy an owned token
function burn(id) public {
  var t = tokens[id];
  assert(t != null, "not found");
  assert(t.owner == this.user, "not owner");
  erase(tokens, id);
  event("burn", {id: id});
}

// Buy token: auto pays royalty + seller, transfers NFT
function buy(id) public payable {
  var t = tokens[id];
  assert(t != null, "not found");
  assert(t.owner != this.user, "cannot buy your own");

  var currency = this.deposit.currency;
  assert(currency == bech32(), "only MMX accepted");

  var total = this.deposit.amount;
  var royalty_amount = (total * t.royalty_rate) / 100;
  var seller_amount = total - royalty_amount;

  send(t.owner, seller_amount);
  send(t.royalty_address, royalty_amount);

  var prev_owner = t.owner;
  t.owner = this.user;

  event("buy", {
    id: id,
    from: string_bech32(prev_owner),
    to: string_bech32(this.user),
    paid: total,
    royalty: royalty_amount
  });
}
