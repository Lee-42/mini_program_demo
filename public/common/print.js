import request from "../utils/request"
import utils from "../utils/utils"
const api = {}
const meta = `<head><meta charset="UTF-8"></head>`

api.print = (dom, data) => {
    const tranCd = localStorage.getItem("tranCd")
    let updatePrintList = []
    const printList = []
    const printList1 = []
    return new Promise((resolve, reject) => {
        let index = 0
        print()
        async function print() {
            const form_id = dom[index]?.dataset?.formid || ""
            const filename = dom[index]?.dataset?.fileName || ""
            const template = meta + dom[index]?.outerHTML
            if (index >= dom.length) {
                let res = await api.updatePrint(handlerPrintInfo(updatePrintList, data))
                await api.uploadPrint(res, printList)
                await deletePdf([...printList, ...printList1])
                return resolve()
            }
            updatePrintList.push({ form_id, print_html: encodeURIComponent(template) })
            nt.getPdfByHtml({
                // ...params,
                filename: filename,
                template: template,
                data: {},
                options: { pageSize: "A4", printBackground: false },
                success: (url) => {
                    printList1.push(url)
                    nt.getPdfByHtml({
                        // ...params,
                        filename: filename,
                        template: template,
                        data: {},
                        options: { pageSize: "A4", printBackground: true },
                        success: (url1) => {
                            printList.push(url1)
                            index++;
                            console.log("🚀 ~ file: index.js:13 ~ success ~ url:", url)
                            let html = `<iframe width="800px" height="500px" frameborder="0" marginwidth="0" src="${url1}#toolbar=0"></iframe>`
                            nt.messageBox({
                                "title": '打印',
                                "showConfirmButton": "true",
                                "showCancelButton": "true",
                                "dangerouslyUseHTMLString": true,
                                "customClass": "print",
                                "confirmButtonText": "打印",
                                "cancelButtonText": "取消",
                                "beforeClose": async (action, instance, done) => {
                                    if (action == "close" || action == "cancel") {
                                        done();
                                        print()
                                    }
                                    if (action == "confirm") {
                                        nt.print(url)
                                        if (index >= dom.length) {
                                            await nt.messageBox({
                                                title: "提示",
                                                showConfirmButton: true,
                                                message: "打印任务已全部添加到打印队列",
                                                beforeClose: (action, instance, done) => {
                                                    done()
                                                }
                                            })
                                        }
                                        done();
                                        print()
                                    }
                                },
                                "message": html
                            })

                        },
                        fail: (err) => {
                            nt.alert("生成带底图凭证PDF错误,请联系科技人员", "提示")
                            console.log("🚀 ~ file: index.js:17 ~ fail ~ err:", err)
                            reject()
                        }
                    })
                },
                fail: (err) => {
                    nt.alert("生成不带底图凭证PDF错误,请联系科技人员", "提示")
                    console.log("🚀 ~ file: index.js:17 ~ fail ~ err:", err)
                    reject()

                }
            })
        }
    })
}


/**
 * @param {Array} params 凭证更新信息数组
 * @returns 
 */
api.updatePrint = (params) => {
    return new Promise((resolve, reject) => {
        request.post("updatePrint", {
            updatePrintList: params
        }).then(res => {
            resolve(res.upDatePrintList.map(m => m.printRecordId))
        }).catch(err => {
            reject(err)
        }).finally(() => {

        })
    })
}

/**
 * @param {Array} idList 凭证id数组
 * @param {Array} urlList 本地凭证文件路径数组
 */
api.uploadPrint = async (idList, urlList) => {
    const fileTypeList = Array(idList.length).fill("1")
    let imgPlatList = idList.map((f, index) => {
        return { printRecordId: f, fileType: fileTypeList[index] }
    });
    return new Promise((resolve, reject) => {
        nt.uploadFile({
            url: "/counterSystem/upCtrl/uploadPrint",
            formData: {
                tranCd: localStorage.getItem("tranCd") || "public", // formdata请求参数
                fileType: fileTypeList.join(),
                printRecordId: idList.join()
            },
            filePath: urlList, // 指定文件路径 支持数组格式多个本地文件路径
            success: (res) => {
                const { uploadPrintList } = res.data
                const fileNameList = uploadPrintList.map(m => m.fileName)
                imgPlatList = imgPlatList.map((m, index) => {
                    return { ...m, fileName: fileNameList[index] }
                })
                request.post("uploadPrintForImage", {
                    uploadImageList: imgPlatList
                }).finally(() => {
                    resolve()
                })
            },
            fail: (error) => {
                resolve()
            },
            complete: () => {
                resolve()
            }
        })
    })
}

// 凭证补打
api.reprint = (fileList) => {
    let index = 0
    const print = (resolve, reject) => {
        if (index >= fileList.length) return resolve()
        nt.getPdfByHtml({
            fileName: fileList[index].fileName,
            template: decodeURIComponent(fileList[index].print_html),
            data: {},
            options: { pageSize: "A4", printBackground: false },
            success: (url) => {
                nt.getPdfByHtml({
                    fileName: fileList[index].fileName,
                    template: decodeURIComponent(fileList[index].print_html),
                    data: {},
                    options: { pageSize: "A4", printBackground: true },
                    success: (bg_url) => {

                        let html = `<iframe width="800px" height="500px" frameborder="0" marginwidth="0" src="${bg_url}#toolbar=0"></iframe>`
                        nt.messageBox({
                            title: '凭证补打',
                            showConfirmButton: true,
                            showCancelButton: true,
                            dangerouslyUseHTMLString: true,
                            customClass: "print",
                            confirmButtonText: "打印",
                            cancelButtonText: "取消",
                            beforeClose: async (action, instance, done) => {
                                if (action == "close" || action == "cancel") {
                                    done();
                                    print()
                                }
                                if (action == "confirm") {

                                    // 点击打印的时候执行更新的动作
                                    const param = {
                                        if_supplement: "0",
                                        printRecordId: fileList[index].print_record_id,
                                    }
                                    await api.updatePrint([param]).catch(err => {
                                        console.log(err);
                                    })
                                    nt.print(url)
                                    index++
                                    if (index >= fileList.length) {
                                        await nt.messageBox({
                                            title: "提示",
                                            showConfirmButton: true,
                                            message: "打印任务已全部添加到打印队列",
                                            beforeClose: (action, instance, done) => {
                                                done()
                                            }
                                        })
                                    }
                                    done();
                                    print()
                                }
                            },
                            "message": html
                        })
                    }
                })
            }
        })

    }
    return new Promise((resolve, reject) => {
        print(resolve, reject)
    })
}

// 下载pdf文件
api.downPdf = async (fileName) => {
    let res = await request.download("downLoadImages", {
        fileType: "0",
        fileName
    })
    let base = await utils.getBase64(res.data)
    // return api.toUrl(res.data)
    // return api.toUrl(`data:application/pdf;${base}`)
    return `data:application/pdf;${base}`
}

// 二进制转URL
api.toUrl = (data) => {
    const blob = new Blob([data], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    return url
}

// 分组并赋予序号
const handlerPrintInfo = (arr, data) => {

    const obj = arr.reduce((result, item) => {
        const index = item.form_id
        if (!result[index]) {
            result[index] = []
        }
        item.page = result[index].length + 1
        result[index].push(item)
        return result
    }, {})
    let res = []
    for (let i in obj) {
        res = [...res, ...obj[i]]
    }
    res = res.map((m, index) => {
        return { ...m, print_data: data, printRecordId: index == 0 ? data.printRecordId : "" }
    })
    return res
}

const deletePdf = async (list) => {
    console.log(list);
    for (let i in list) {
        await new Promise(resolve => {
            nt.unlink({
                filePath: list[i],
                success: () => {
                    resolve()
                },
                fail: () => {
                    resolve()
                },
                complete: () => {
                    resolve()
                }
            })
        })
    }
}


export default api