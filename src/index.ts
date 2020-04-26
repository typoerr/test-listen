import * as http from 'http'

interface TestScope {
  (this: http.Server, url: string): Promise<any>
}

function listen(server: http.Server, scope: TestScope): Promise<any>
function listen(listener: http.RequestListener, scope: TestScope): Promise<any>
function listen(src: http.Server | http.RequestListener, scope: TestScope): Promise<any> {
  const server = typeof src == 'function' ? http.createServer(src) : src

  return new Promise<any>((resolve, reject) => {
    server.on('error', (err) => {
      server.close(() => reject(err))
    })

    return server.listen(async () => {
      const addr = server.address() as any
      try {
        const end = await scope.call(server, `http://localhost:${addr.port}`)
        server.close(() => resolve(end))
      } catch (err) {
        server.close(() => reject(err))
      }
    })
  })
}

export default listen
