import React, { useState, ChangeEvent } from 'react'
import { Button, Input, Checkbox, Layout, Tooltip } from 'antd'
import 'antd/dist/antd.css'
import generateZipRuleset from 'fiddler-ruleset-generator'
import { JsonLoader } from './components'
import { InfoCircleOutlined } from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout

const initDownload = (function () {
  let a = document.createElement("a")
  document.body.appendChild(a)
  // @ts-ignore
  a.style = "display: none"
  return function (data: string, fileName: string) {
    console.time('starts base64');
    a.href = "data:application/zip;base64," + data //Image Base64 Goes here
    a.download = fileName //File name Here
    console.timeEnd('starts base64');
    a.click() //Downloaded file
  }
}())

function App() {
  const [loadedJson, setLoadedJson] = useState(null as null | object)
  const [zipExport, setZipExport] = useState(null as null | any)
  const [mocksPath, setMocksPath] = useState('C:/mocks/' as undefined | string)
  const [useJsonOnSuccess, setUseJsonOnSuccess] = useState(true as boolean)
  const [loading, setLoading] = useState(false as boolean)

  const generateZipExport = () => {
    setZipExport(null)
    const process = async () => {
      setLoading(true)
      const exportOptions = {
        mocksPath,
        useJsonOnSuccess
      }
      try {
        const zip = await generateZipRuleset(loadedJson, { type: 'base64' }, exportOptions)
        setZipExport(zip)
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
    initDownload(zipExport, 'generated.zip')
  }

  const onChangeMocksPath = (event: ChangeEvent<HTMLInputElement>) => {
    setMocksPath(event.target.value)
  }

  const onChangeUseJson = () => {
    setUseJsonOnSuccess(useJsonOnSuccess => !useJsonOnSuccess)
  }

  return (
    <Layout>
      <Content className='content'>
        <Tooltip placement="right" title={'All process is executed at client-side, no information will be sent to any server.'}>
          <div>
            <span>Select a HAR file from your computer{'   '}<InfoCircleOutlined /></span>
          </div>
        </Tooltip>
        <div className={'row-center'}>
          <JsonLoader onChangeJson={onChangeJson} />
        </div>
        <div>
        <Tooltip placement="right" title={'The path where you should place the generated mocks. Fiddler will read from here the generated responses.'}>
          <span>Path of the mocks</span>
        </Tooltip>
        </div>
        <div>
          <Input onChange={onChangeMocksPath} value={mocksPath} />
        </div>
        <div>
          <Tooltip placement="right" title={'This option will create mocks in json format, that are easier to modify to test different cases (200 OK respones only).'}>
            <Checkbox onChange={onChangeUseJson} checked={useJsonOnSuccess}>Use json files for application/json responses</Checkbox>
          </Tooltip>
        </div>
        <div className={'row-center'}>
          <Button onClick={generateZipExport} disabled={!loadedJson} loading={loading}>Generate</Button>
          <Button onClick={onClickDownload} disabled={!zipExport} loading={!loadedJson && loading}>Download</Button>
        </div>
      </Content>
    </Layout>
  )
}

export default App
