import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = 'C:\\Users\\takwa\\Desktop\\DIVA'
const BASE = 'http://localhost:4180'
const DIR = path.join(ROOT, 'public', 'images', 'products')

const files = (await fs.readdir(DIR)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()
let bad = 0
for (const f of files) {
  const res = await fetch(`${BASE}/images/products/${encodeURIComponent(f)}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const type = res.headers.get('content-type')
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8
  const isPng = buf[0] === 0x89 && buf[1] === 0x50
  const ok = res.status === 200 && (isJpeg || isPng)
  if (!ok) bad++
  console.log(
    `${ok ? 'OK  ' : 'FAIL'} ${String(res.status)} ${String(type).padEnd(11)} ${String(buf.length).padStart(8)}B  ${isJpeg ? 'jpeg' : isPng ? 'png ' : '????'}  ${f}`,
  )
}
console.log('---')
console.log(`files served: ${files.length}   failures: ${bad}`)

// every slug referenced by the catalogue must be present in that directory
const src = await fs.readFile(path.join(ROOT, 'src', 'data', 'products.ts'), 'utf8')
const refs = [...src.matchAll(/photo: '\/images\/products\/([^']+)'/g)].map((m) => m[1])
const onDisk = new Set(files)
const missing = refs.filter((r) => !onDisk.has(r))
const orphan = files.filter((f) => !refs.includes(f))
console.log(`catalogue references: ${refs.length} (unique ${new Set(refs).size})`)
console.log(`referenced but not on disk: ${missing.length ? missing.join(', ') : 'none'}`)
console.log(`on disk but unreferenced: ${orphan.length ? orphan.join(', ') : 'none'}`)