import React, { useState, ChangeEvent } from 'react'
import { Button, Input, Checkbox, Layout } from 'antd'
import 'antd/dist/antd.css'
import generateZipRuleset from 'fiddler-ruleset-generator'
import { JsonLoader } from './components'
const { Header, Footer, Sider, Content } = Layout

const initDownload = (function () {
  let a = document.createElement("a")
  document.body.appendChild(a)
  // @ts-ignore
  a.style = "display: none"
  return function (data: any, fileName: string) {
    a.href = "data:application/zip;base64," + data //Image Base64 Goes here
    a.download = fileName //File name Here
    a.click() //Downloaded file
  }
}())

function App() {
  const [loadedJson, setLoadedJson] = useState(null as null | object)
  const [exportedZip, setExportedZip] = useState(null as null | any)
  const [mocksPath, setMocksPath] = useState('C:/mocks/' as undefined | string)
  const [useJsonOnSuccess, setUseJsonOnSuccess] = useState(true as boolean)
  const [loading, setLoading] = useState(false as boolean)

  const generateExport = () => {
    setExportedZip(null)
    const process = async () => {
      setLoading(true)
      const exportOptions = {
        mocksPath,
        useJsonOnSuccess
      }
      try {
        const zip = await generateZipRuleset(loadedJson, { type: 'base64' }, exportOptions)
        setExportedZip(zip)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
    process()
  }

  const onChangeJson = (data: object) => {
    setLoadedJson(data)
  }

  const onClickDownload = () => {
    initDownload(exportedZip, 'generated.zip')
  }

  const onChangeMocksPath = (event: ChangeEvent<HTMLInputElement>) => {
    setMocksPath(event.target.value)
  }

  const onChangeUseJson = () => {
    setUseJsonOnSuccess(useJsonOnSuccess => !useJsonOnSuccess)
  }

  return (
    <Layout>
      <Content>
        <JsonLoader onChangeJson={onChangeJson} />
        <Input onChange={onChangeMocksPath} value={mocksPath} />
        <Checkbox onChange={onChangeUseJson} checked={useJsonOnSuccess}/>
        <Button onClick={generateExport} disabled={!loadedJson} loading={loading}>Generate</Button>
        <Button onClick={onClickDownload} disabled={!exportedZip} loading={!loadedJson && loading}>Download</Button>
      </Content>
    </Layout>
  )
}

export default App
