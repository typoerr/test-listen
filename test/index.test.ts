import test from 'ava'
import listen from '@/index'
import http from 'http'
import fetch from 'node-fetch'

const listener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.end(req.url)
}

test('listen from listener function', (t) => {
  return listen(listener, async (url) => {
    const res = await fetch(url)
    t.is(res.status, 200)
    t.is(await res.text(), '/')
  })
})

test('listen http server', (t) => {
  const server = http.createServer(listener)
  return listen(server, async function () {
    t.assert(this === server)
  })
})
