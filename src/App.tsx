import React, { useState, ChangeEvent } from 'react'
import { Button, Input, Spin } from 'antd';
import 'antd/dist/antd.css'
import generateZipRuleset from 'fiddler-ruleset-generator'
import { JsonLoader } from './components'

const initDownload = (function () {
  let a = document.createElement("a")
  document.body.appendChild(a)
  // @ts-ignore
  a.style = "display: none"
  return function (data: any, fileName: string) {
    a.href = "data:application/zip;base64," + data; //Image Base64 Goes here
    a.download = "generated.zip"; //File name Here
    a.click(); //Downloaded file
  }
}())

function App() {
  const [exportedZip, setExportedZip] = useState(null as null | any)
  const [mocksPath, setMocksPath] = useState('C:/mocks/' as undefined | string)
  const [loading, setLoading] = useState(false as boolean)

  const onChangeJson = async (data: object) => {
    setLoading(true)
    const process = async () => {
      try {
        const zip = await generateZipRuleset(data, mocksPath, { type: 'base64' })
        setExportedZip(zip)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
    process()
  }

  const onClickDownload = () => {
    initDownload(exportedZip, 'generated.zip')
  }

  const onChangeMocksPath = (event: ChangeEvent<HTMLInputElement>) => {
    setMocksPath(event.target.value)
  }

  return (
    <div className="App">
      <header className="App-header">
        <JsonLoader onChangeJson={onChangeJson} />
        <Input onChange={onChangeMocksPath} value={mocksPath} />
        {exportedZip && <Button onClick={onClickDownload}>Download</Button>}
        {loading && <Spin />}
      </header>
    </div>
  )
}

export default App
