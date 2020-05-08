
import React, { ChangeEvent } from 'react'
import { Button, Upload } from 'antd';
import 'antd/dist/antd.css'
import { UploadOutlined } from '@ant-design/icons';

interface InputFileJsonProps {
  onChangeJson?: (json: object) => void
  onStartProcessing?: (...args: any) => void
}

// Basic HTML uploader
export const InputFileJson = ({
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

// Fancy antd uploader
export const JsonLoader = ({
  onChangeJson = () => { },
  onStartProcessing = () => { }
}: InputFileJsonProps) => {

  function onChangeFile(file: File) {
    const reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(file)
  }

  const onReaderLoad: FileReader['onload'] = (file: any) => {
    const data = JSON.parse(file.target.result)
    onChangeJson(data as object)
  }

  const onChangeUpload = (info: any) => {
    onChangeFile(info.file)
  }

  return (
    <Upload name='file' onChange={onChangeUpload} showUploadList multiple={false} beforeUpload={() => false} accept={'application/har+json'} >
      <Button>
        <UploadOutlined /> Load Har
        </Button>
    </Upload>
  )
}