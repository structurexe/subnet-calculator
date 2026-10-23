// Parses "a.b.c.d/p" and returns the subnet details, or null if the input is invalid.
function subnet(input) {
  const m = input.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!m) return null;
  const o = m.slice(1, 5).map(Number), p = +m[5];
  if (o.some(x => x > 255) || p > 32) return null;

  const ip = ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0;
  const mask = p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0;
  const net = (ip & mask) >>> 0;
  const bc = (net | ~mask) >>> 0;
  const s = n => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");

  const small = p >= 31;
  const hosts = p === 32 ? 1 : p === 31 ? 2 : 2 ** (32 - p) - 2;
  return {
    "Network": s(net),
    "Broadcast": s(bc),
    "Subnet mask": s(mask),
    "Wildcard": s(~mask >>> 0),
    "First host": small ? s(net) : s(net + 1),
    "Last host": small ? s(bc) : s(bc - 1),
    "Usable hosts": hosts.toLocaleString("en-US")
  };
}

const input = document.getElementById("cidr");
const out = document.getElementById("out");

function run() {
  const r = subnet(input.value);
  if (!r) {
    out.innerHTML = '<div class="err">Enter a valid address like 192.168.1.10/24</div>';
    return;
  }
  out.innerHTML = '<div class="rs">' +
    Object.entries(r).map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join("") +
    "</div>";
}

document.getElementById("calc").addEventListener("click", run);
input.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
run();
