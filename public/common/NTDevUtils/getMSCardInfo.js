const NTDev = window.NTDev || parent.NTDev || {}
import utils from "../../utils/utils";
const { cardReader } = NTDev
const getICCardInfo = ({ params = {}, success, fail }) => {
    const jsonData = {
        ReadType: "2"
    }
    if (cardReader) {
        cardReader.readMsf(JSON.stringify({ ...jsonData, ...params }), (err, res) => {
            if (err) console.log(err);
            console.log(res);
            if (res && utils.isFunction(success)) success(res.split("=")[1]);
        })
    } else {
        if (utils.isFunction(fail)) fail("当前系统没有外设驱动");
    }
}

export default getICCardInfo