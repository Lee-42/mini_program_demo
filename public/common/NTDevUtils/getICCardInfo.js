const NTDev = window.NTDev || parent.NTDev || {}
import utils from "../../utils/utils";
const { cardReader } = NTDev
const getICCardInfo = ({ params = {}, success, fail }) => {
    const jsonData = {
        TagList: "A|B|C|D|E|F|G|H|I|J|K|L|M|N|O",
        AIDList: "A000000333010101",
        isReadArqc: "true",
        aryInput: "S006330801U006150119"
    }
    if (cardReader) {
        cardReader.getICCardInfo(JSON.stringify({ ...jsonData, ...params }), (err, res) => {
            if (err) {
                console.log(err);
            }
            if (res) {
                let IcInfo = res.IcInfo;
                let TagSlt = jsonData.TagList.split("|")
                let outInfos = { arqcInfo: res.IcARQC }
                for (let tag of TagSlt) {
                    let tagIndex = IcInfo.indexOf(tag);
                    let tagLength = Number(IcInfo.slice(tagIndex + 1, tagIndex + 4));
                    let tagData = IcInfo.slice(tagIndex + 4, tagIndex + 4 + tagLength);
                    outInfos[tag] = tagData;
                }
                console.log(outInfos, 'outInfos');
                if (utils.isFunction(success)) success(outInfos);
            }
        })
    } else {
        if (utils.isFunction(fail)) fail("当前系统没有外设驱动");
    }
}

export default getICCardInfo