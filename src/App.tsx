import React, { useState, ChangeEvent } from 'react'
import './App.css'
import exportZip from 'fiddler-ruleset-generator'

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

interface InputFileJsonProps {
  onChangeJson?: (json: object) => void
  onStartProcessing?: (...args: any) => void
}

const InputFileJson = ({
  onChangeJson = () => { },
  onStartProcessing = () => { }
}: InputFileJsonProps) => {

  function onChangeFile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target?.files?.[0]) {
      const reader = new FileReader()
      reader.onload = onReaderLoad
      reader.readAsText(event.target.files[0])
    }
  }

  const onReaderLoad: FileReader['onload'] = (event) => {
    if (typeof event?.target?.result === 'string') {
      const data = JSON.parse(event.target.result)
      onChangeJson(data as object)
    }
  }

  return (
    <input onChange={onChangeFile} type="file"></input>
  )
}

function App() {
  const [exportedZip, setExportedZip] = useState(null as null | any)

  const onChangeJson = async (data: object) => {
    const process = async () => {
      const zip = await exportZip(data, undefined, {type: 'base64'})
      setExportedZip(zip)
    }
    process()
  }

  const onClickDownload = () => {
    initDownload(exportedZip, 'generated.zip')
  }

  return (
    <div className="App">
      <header className="App-header">
        <InputFileJson onChangeJson={onChangeJson} />
        {exportedZip && <button onClick={onClickDownload}>Download</button>}
      </header>
    </div>
  )
}

export default App
