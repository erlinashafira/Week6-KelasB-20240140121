
const templates = {
    promo: (nama, harga, tag) => `Promo spesial payday sale!

Siapa yang sudah menunggu ${nama} hadir kembali? Sekarang ${nama} tersedia dengan harga lebih hemat!

Cuma ${harga} saja!

🛒 Kualitas terjamin
🛒 Stok terbatas
🛒 Pengiriman cepat ke seluruh Indonesia

Jangan sampai kehabisan!
Langsung checkout sekarang!

#Promo #${tag} #DiskonHariIni #BelanjaHemat`,

    santai: (nama, harga, tag) => `Hari gajian begini enaknya beli ${nama}!

Harganya cuma ${harga}. Produk menarik dengan kualitas yang layak dicoba!

Yuk, checkout sekarang sebelum kehabisan!

#${tag} #RekomendasiProduk #RacunBelanja #WorthIt`,

    formal: (nama, harga, tag) => `Dengan bangga kami persembahkan ${nama}.

Produk ini dipilih untuk memberikan pengalaman belanja yang memuaskan.

Harga: ${harga}

Keunggulan:
- Kualitas terjamin
- Pelayanan pelanggan responsif
- Pengiriman aman dan tepat waktu

Terima kasih atas kepercayaan Anda.

#${tag} #ProdukBerkualitas #BelanjaAman`
};

const form = document.getElementById("form");

const rules = {
    nama: (value) => {
        const nama = value.trim();

        if (!nama) return "Nama produk wajib diisi.";
        if (nama.length < 3) return "Nama produk minimal 3 karakter.";
        if (nama.length > 60) return "Nama produk maksimal 60 karakter.";
        if (!/\p{L}/u.test(nama)) {
            return "Nama produk harus mengandung huruf.";
        }

        return "";
    },

    harga: (value) => {
        if (!value.trim()) return "Harga wajib diisi.";

        const harga = Number(value);

        if (!Number.isInteger(harga)) {
            return "Harga harus berupa angka bulat.";
        }

        if (harga < 1000) return "Harga minimal Rp 1.000.";
        if (harga > 100000000) {
            return "Harga maksimal Rp 100.000.000.";
        }

        return "";
    }
};

function validate(id) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    const message = rules[id](input.value);

    error.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");

    return message === "";
}

Object.keys(rules).forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
        validate(id);
    });
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const valid = Object.keys(rules).map(validate).every(Boolean);

    if (!valid) {
        document.getElementById("caption").value = "";

        const firstInvalid = Object.keys(rules).find((id) => {
            return !validate(id);
        });

        if (firstInvalid) {
            document.getElementById(firstInvalid).focus();
        }

        return;
    }

    const nama = document.getElementById("nama").value.trim();

    const harga = Number(
        document.getElementById("harga").value
    ).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    });

    const template = document.getElementById("template").value;

    const tag = nama
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .split(/\s+/)
        .map((word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("");

    document.getElementById("caption").value =
        templates[template](nama, harga, tag);
});
