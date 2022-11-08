import React, {useEffect, useRef, useState} from 'react'
import './ImageUpload.css'

function ImageUpload(props) {
  const [file, setFile] = useState()
  const [previewUrl, setPreviewUrl] = useState()
  const [isValid, setIsValid] = useState(false)
  const filePicker = useRef()
  const {id, value, onInput, name, center, errorText} = props

  useEffect(() => {
    if (!file) {
      return
    }
    const fileReader = new FileReader()
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result)
    }
    fileReader.readAsDataURL(file)
  }, [file])

  const pickedHandler = event => {
    let pickedFile
    let fileIsValid = isValid
    if (event.target.files && event.target.files.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      pickedFile = event.target.files[0]
      setFile(pickedFile)
      setIsValid(true)
      fileIsValid = true
    } else {
      setIsValid(false)
      fileIsValid = false
    }
    onInput(id, pickedFile, fileIsValid)
    return file
  }

  const pickImageHandler = () => {
    filePicker.current.click()
  }

  return (
    <div className="">
      <input
        id={id}
        name={name}
        ref={filePicker}
        type="file"
        style={{display: 'none'}}
        accept=".jpg, .png, .jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-uploads ${center && 'center'}`}>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={pickImageHandler}
        >
          PICK IMAGE
        </button>
        {previewUrl && (
          <div className="image-upload__preview">
            <img alt="preview" src={previewUrl} />
          </div>
        )}
        {!previewUrl && value && (
          <div className="image-upload__preview">
            <img alt="preview" src={value} />
          </div>
        )}
      </div>
      {!isValid && <p>{errorText}</p>}
    </div>
  )
}

export default ImageUpload
