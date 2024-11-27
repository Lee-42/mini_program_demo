const NTDev = window.NTDev || parent.NTDev || {}
import utils from "../../utils/utils";
/**
 * 密码键盘
 * @param {String} PinLen 密码长度
 * @param {String} Html 显示信息，可以为空，独立密码键盘应忽略此参数
 * @param {String} Audio 播放的音频文件，可以为空，独立密码键盘应忽略此参数
 * @param {String} Speech 播放语音内容，使用TTS等方式播放，可以为空，独立密码键盘应忽略此参数
 * @param {String} Time 次数提示音：1-请输入密码；2-请再次输入密码，柜外清集成密码键盘忽略此参数
 * @returns password 密码
 */
const { ntgwq } = NTDev
const getPassword = ({ params = {}, success, fail }) => {
    const jsonData = {
        PinLen: "6",
        Html: "",
        Audio: "",
        Speech: "",
        AccNo: "",
        TpkIndex: "001", // 工作密钥的索引
    }
    if (ntgwq) {
        ntgwq.ReadCipher(JSON.stringify({ ...jsonData, ...params }), (err, res) => {
            console.log(res, 'getPassword');
            if (!err) {
                if (utils.isFunction(success)) success(res);
            } else {
                if (utils.isFunction(fail)) fail(err);
            }
        });
    } else {
        if (utils.isFunction(fail)) fail("当前系统没有外设驱动");
        // console.error("当前系统没有外设驱动");
    }
}
export default getPassword