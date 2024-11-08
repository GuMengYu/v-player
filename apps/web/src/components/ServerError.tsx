function check() {
  // 检测和http:localhost:3000/hello 是否成功来确定与服务器的连接状态
  return fetch('http://localhost:12141')
    .then(res => res.text())
    .then(text => text === 'hello')
    .catch(() => false)
}
export function ServerError() {

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Server Error</h1>
      <p className="text-lg text-gray-600">
        The server is currently experiencing issues. Please try again later.
      </p>
    </div>
  )
}