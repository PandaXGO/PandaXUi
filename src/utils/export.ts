import {ElMessage} from "element-plus";

export function handleFileError (res:any, fileName:any) {
    if (typeof (res.data) !== 'undefined') {
        if (res.data.type === 'application/json') {
            const reader:any = new FileReader()
            reader.onload = function() {
                const message = JSON.parse(reader.result).msg
                ElMessage({
                    showClose: true,
                    message: message,
                    type: 'error'
                })
            }
            reader.readAsText(new Blob([res.data]))
        }
    } else {
        var downloadUrl = window.URL.createObjectURL(new Blob([res]))
        var a = document.createElement('a')
        a.style.display = 'none'
        a.href = downloadUrl
        a.download = fileName
        var event = new MouseEvent('click')
        a.dispatchEvent(event)
    }
}