// SHA-256 ด้วย Web Crypto API (มีทั้งใน browser และ Node 18+)
// หมายเหตุ: hash ฝั่ง client กันแค่การมองเห็นรหัสตรงๆ ใน dashboard
// ระบบจริงต้อง hash ฝั่ง server (bcrypt/argon2) เสมอ
export async function sha256(text: string) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
