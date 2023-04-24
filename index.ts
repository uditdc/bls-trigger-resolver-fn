import "wasi";
import { Date } from "as-wasi/assembly";
import { http, json } from "@blockless/sdk"

http.HttpComponent.serve((request: http.Request) => {
  const abiRequest = new json.JSON.Obj()
  abiRequest.set('abi', ['function updatePrice(string memory symbol, uint256 price, uint256 timestamp) external'])
  abiRequest.set('method', 'updatePrice')
  abiRequest.set('args', ['BTC', '2924212302300', (<i64>(Date.now() / 1000)).toString()])

  const clientHeaders = new Map<string, string>()
  clientHeaders.set('Content-Type', 'application/json')
  const clientOptions = new http.ClientOptions('', clientHeaders)
  const abiResponse = new http.Client(clientOptions).post('https://ethers-http-wrapper.deno.dev/abi/encode-function-data', abiRequest.stringify())

  const responseObject = new json.JSON.Obj()
  responseObject.set('callData', abiResponse.getString('data'))

  return new http.Response(abiResponse.getString('data')!.toString())
    .status(200)
})
