import request from "../../utils/request"
/**
 * 
 * @param {Object} params K100接口入参集合
 * @param {String} acctNo
 * @param {String} smNoRplcCrdFlg
 * @param {String} crdDataFd
 * @param {String} crdSeqNo
 * @returns 
 */
const checkARQC = async (params) => {
    return new Promise((resolve, reject) => {
        request.post("k100", params).then(res => resolve(res)).catch(err => reject(err))
    })
}

export default checkARQC