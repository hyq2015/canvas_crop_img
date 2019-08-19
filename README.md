### js canvas crop img

+ initialize

```aidl
var cropper = new Cropper({
    okText: 'confirm', // ok text
    cancelText: 'cancel', // cancel text
    el: 'imgFile', // the parent element id of cropper
    layerWidth: 750, // popup layer width
    layerHeight: 800, // popup layer height
    maxFileNumber: 1, // max number of file
    cropperWidth: 150, // initial cropper width
    cropperHeight: 150, // initial cropper height
    imgFileDimension: 80, // dimension of show img,
    fileNumberExceed: 'you can upload 1 file at most', // the remind txt when exceed the maxFileNumber
});
```

+ get file data

```aidl
cropper.getFiles(); // {width: number, base64: string, height: number}[]
```
